use futures::future;

use anyhow::{anyhow, Result};
use move_binary_format::access::ModuleAccess;
use move_model::ast::ModuleName;
use std::collections::HashSet;
use std::str::FromStr;

use move_binary_format::file_format::CompiledModule;
use move_bytecode_utils::Modules;
use move_model;
use sui_json_rpc_types::SuiObjectDataOptions;
use sui_sdk::apis::ReadApi;
use sui_sdk::types::base_types::ObjectID;
use sui_sdk::SuiClientBuilder;

use move_core_types::account_address::AccountAddress;
use sui_sdk::rpc_types::{SuiRawData, SuiRawMovePackage};

#[tokio::main]
/**
 * A POC for loading all modules and dependencies from chain starting from a root package (in this case amm).
 * It loads modules from chain recursively, builds model (`GlobalEnv`), and prints all structs in pool module of amm package.
 */
async fn main() {
    let sui = SuiClientBuilder::default()
        .build("https://fullnode.devnet.sui.io:443")
        .await
        .unwrap();

    let addr = AccountAddress::from_str(
        "0xa3d8c0d30f542582074038899650fa0837820e8c11430aeb730183563058a306",
    )
    .unwrap();

    // fetch all modules
    let modules = fetch_modules_from_chain(sui.read_api(), vec![addr])
        .await
        .unwrap();

    // topo sort
    let module_map = Modules::new(modules.iter());
    let dep_graph = module_map.compute_dependency_graph();
    let topo_order = dep_graph.compute_topological_order().unwrap();

    // build model
    let model = move_model::run_bytecode_model_builder(topo_order).unwrap();

    // print all structs in pool module of amm package
    let pool_module_name = ModuleName::from_str(&addr.to_hex(), model.symbol_pool().make("pool"));
    let pool_module_env = model.find_module(&pool_module_name).unwrap();

    let symbol_pool = pool_module_env.symbol_pool();
    for strct in pool_module_env.get_structs() {
        println!(
            "{}<{}>",
            strct.get_name().display(symbol_pool),
            strct
                .get_type_parameters()
                .iter()
                .map(|tp| tp.0.display(symbol_pool).to_string())
                .collect::<Vec<_>>()
                .join(", ")
        );
        for field in strct.get_fields() {
            println!(
                "{}: {:?}",
                field.get_name().display(symbol_pool),
                field.get_type()
            );
        }
        println!("");
    }
}

async fn fetch_modules_from_chain(
    rpc_client: &ReadApi,
    addresses: Vec<AccountAddress>,
) -> Result<Vec<CompiledModule>> {
    let mut fetched_pkgs = HashSet::new();
    let mut fetch_queue = HashSet::new();
    let mut modules = vec![];

    for addr in addresses {
        fetch_queue.insert(addr);
    }

    while !fetch_queue.is_empty() {
        let addresses = fetch_queue.drain().collect::<Vec<_>>();
        println!("fetching modules from chain: {:?}", addresses);
        let resp = future::join_all(
            addresses
                .clone()
                .into_iter()
                .map(|addr| pkg_for_address(rpc_client, addr)),
        )
        .await;
        fetched_pkgs.extend(addresses);

        for res in resp {
            let pkg = res?;
            let SuiRawMovePackage { module_map, id, .. } = pkg;
            let address: AccountAddress = id.into();

            for (name, bytes) in module_map {
                let module = CompiledModule::deserialize(&bytes).map_err(|e| {
                    anyhow!(
                        "failed to deserialize on-chain module {}::{}: {}",
                        address,
                        name,
                        e
                    )
                })?;

                let deps = module.immediate_dependencies();
                for dep in deps {
                    if !fetched_pkgs.contains(dep.address()) {
                        fetch_queue.insert(*dep.address());
                    }
                }

                modules.push(module);
            }
        }
    }

    return Ok(modules);
}

async fn pkg_for_address(rpc_client: &ReadApi, addr: AccountAddress) -> Result<SuiRawMovePackage> {
    // Move packages are specified with an AccountAddress, but are
    // fetched from a sui network via sui_getObject, which takes an object ID
    let obj_id = ObjectID::from(addr);

    // fetch the Sui object at the address specified for the package in the local resolution table
    // if future packages with a large set of dependency packages prove too slow to verify,
    // batched object fetching should be added to the ReadApi & used here
    let obj_read = rpc_client
        .get_object_with_options(obj_id, SuiObjectDataOptions::new().with_bcs())
        .await
        .map_err(|e| anyhow!("error fetching package object from the chain: {}", e))?;

    let obj = obj_read
        .into_object()
        .map_err(|e| anyhow!("package object does not exist or was deleted: {}", e))?
        .bcs
        .ok_or_else(|| anyhow!("bcs field not found"))?;

    match obj {
        SuiRawData::Package(pkg) => Ok(pkg),
        SuiRawData::MoveObject(_) => Err(anyhow!(
            "dependency ID contains a Sui object, not a Move package: {}",
            obj_id
        )),
    }
}
