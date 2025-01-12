use std::collections::{BTreeMap, BTreeSet};
use std::path::{Path, PathBuf};

use anyhow::Result;
use clap::*;
use colored::*;
use genco::fmt;
use genco::prelude::*;
use move_core_types::account_address::AccountAddress;
use move_model::model::ModuleEnv;
use move_package::source_package::parsed_manifest::PackageName;
use move_symbol_pool::Symbol;
use std::io::Write;
use sui_client_gen::framework_sources;
use sui_client_gen::gen::{
    gen_init_loader_ts, gen_package_init_ts, module_import_name, package_import_name,
};
use sui_client_gen::gen::{FrameworkImportCtx, FunctionsGen, StructClassImportCtx, StructsGen};
use sui_client_gen::manifest::{parse_gen_manifest_from_file, GenManifest, Package};
use sui_client_gen::model_builder::{build_models, ModelResult, TypeOriginTable, VersionTable};
use sui_client_gen::package_cache::PackageCache;
use sui_move_build::SuiPackageHooks;
use sui_sdk::SuiClientBuilder;

const DEFAULT_RPC: &str = "https://fullnode.mainnet.sui.io:443";

#[derive(Parser)]
#[clap(
    name = "sui-client-gen",
    version,
    about = "Generate TS SDKs for Sui Move smart contracts."
)]
struct Args {
    #[arg(
        short,
        long,
        help = "Path to the `gen.toml` file.",
        default_value = "./gen.toml"
    )]
    manifest: String,

    #[arg(
        short,
        long,
        help = "Path to the output directory. If omitted, the current directory will be used.",
        default_value = "."
    )]
    out: String,

    #[arg(
        long,
        help = "Remove all contents of the output directory before generating, except for gen.toml. Use with caution."
    )]
    clean: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    move_package::package_hooks::register_package_hooks(Box::new(SuiPackageHooks));

    let manifest = parse_gen_manifest_from_file(Path::new(&args.manifest))?;
    let rpc_url = match &manifest.config {
        Some(config) => config
            .rpc
            .clone()
            .unwrap_or_else(|| DEFAULT_RPC.to_string()),
        None => DEFAULT_RPC.to_string(),
    };
    let rpc_client = SuiClientBuilder::default().build(rpc_url).await?;

    let mut progress_output = std::io::stderr();

    // build models
    let mut cache = PackageCache::new(rpc_client.read_api());
    let (source_model, on_chain_model) = build_models(
        &mut cache,
        &manifest.packages,
        &PathBuf::from(&args.manifest),
        &mut progress_output,
    )
    .await?;

    if source_model.is_none() && on_chain_model.is_none() {
        writeln!(std::io::stderr(), "No packages to generate.")?;
        return Ok(());
    }

    // clean output
    if args.clean {
        clean_output(&PathBuf::from(&args.out))?;
    }

    // separate modules by package
    let mut source_pkgs: BTreeMap<AccountAddress, Vec<ModuleEnv>> = BTreeMap::new();
    match &source_model {
        Some(m) => {
            for module in m.env.get_modules() {
                let pkg_id = *module.self_address();
                match source_pkgs.get_mut(&pkg_id) {
                    Some(modules) => modules.push(module),
                    None => {
                        let modules = vec![module];
                        source_pkgs.insert(pkg_id, modules);
                    }
                }
            }
        }
        None => (),
    };

    let mut on_chain_pkgs: BTreeMap<AccountAddress, Vec<ModuleEnv>> = BTreeMap::new();
    match &on_chain_model {
        Some(m) => {
            for module in m.env.get_modules() {
                let pkg_id = *module.self_address();
                match on_chain_pkgs.get_mut(&pkg_id) {
                    Some(modules) => modules.push(module),
                    None => {
                        let modules = vec![module];
                        on_chain_pkgs.insert(pkg_id, modules);
                    }
                }
            }
        }
        None => (),
    };

    // gen top-level packages and dependencies
    let (source_top_level_addr_map, on_chain_top_level_addr_map) =
        resolve_top_level_pkg_addr_map(&source_model, &on_chain_model, &manifest);

    // gen _framework
    writeln!(progress_output, "{}", "GENERATING FRAMEWORK".green().bold())?;

    let out_root = PathBuf::from(args.out);
    std::fs::create_dir_all(&out_root)?;

    std::fs::create_dir_all(out_root.join("_framework"))?;
    write_str_to_file(
        framework_sources::LOADER,
        out_root.join("_framework").join("loader.ts").as_ref(),
    )?;
    write_str_to_file(
        framework_sources::UTIL,
        out_root.join("_framework").join("util.ts").as_ref(),
    )?;
    write_str_to_file(
        framework_sources::REIFIED,
        out_root.join("_framework").join("reified.ts").as_ref(),
    )?;
    write_str_to_file(
        framework_sources::VECTOR,
        out_root.join("_framework").join("vector.ts").as_ref(),
    )?;
    write_tokens_to_file(
        &gen_init_loader_ts(
            match source_pkgs.is_empty() {
                false => Some((
                    source_pkgs.keys().copied().collect::<Vec<_>>(),
                    &source_top_level_addr_map,
                )),
                true => None,
            },
            match on_chain_pkgs.is_empty() {
                false => Some((
                    on_chain_pkgs.keys().copied().collect::<Vec<_>>(),
                    &on_chain_top_level_addr_map,
                )),
                true => None,
            },
        ),
        out_root.join("_framework").join("init-loader.ts").as_ref(),
    )?;

    if let Some(m) = &source_model {
        writeln!(
            progress_output,
            "{}",
            "GENERATING SOURCE PACKAGES".green().bold()
        )?;
        gen_packages_for_model(
            source_pkgs,
            &source_top_level_addr_map,
            &m.published_at,
            &m.type_origin_table,
            &m.version_table,
            true,
            &out_root,
        )?;
    }

    if let Some(m) = &on_chain_model {
        writeln!(
            progress_output,
            "{}",
            "GENERATING ON-CHAIN PACKAGES".green().bold()
        )?;
        gen_packages_for_model(
            on_chain_pkgs,
            &on_chain_top_level_addr_map,
            &m.published_at,
            &m.type_origin_table,
            &m.version_table,
            false,
            &out_root,
        )?;
    }

    // gen .eslintrc.json
    write_str_to_file(
        framework_sources::ESLINTRC,
        &out_root.join(".eslintrc.json"),
    )?;

    Ok(())
}

fn clean_output(out_root: &Path) -> Result<()> {
    let mut paths_to_remove = vec![];
    for entry in std::fs::read_dir(out_root)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() && path.file_name().unwrap() == "gen.toml" {
            continue;
        }
        paths_to_remove.push(path);
    }

    for path in paths_to_remove {
        if path.is_dir() {
            std::fs::remove_dir_all(path)?;
        } else {
            std::fs::remove_file(path)?;
        }
    }

    Ok(())
}

fn write_tokens_to_file(tokens: &Tokens<JavaScript>, path: &Path) -> Result<()> {
    if tokens.is_empty() {
        return Ok(());
    }

    let file = std::fs::File::create(path)?;
    let mut w = fmt::IoWriter::new(file);
    let fmt = fmt::Config::from_lang::<JavaScript>();
    let config = js::Config::default();
    tokens.format_file(&mut w.as_formatter(&fmt), &config)?;
    Ok(())
}

fn write_str_to_file(s: &str, path: &Path) -> Result<()> {
    if s.is_empty() {
        return Ok(());
    }

    let file = std::fs::File::create(path)?;
    let mut w = fmt::IoWriter::new(file);
    std::fmt::Write::write_str(&mut w, s)?;
    Ok(())
}

/// Creates a mapping between address and package name for top-level packages.
fn resolve_top_level_pkg_addr_map(
    source_model: &Option<ModelResult>,
    on_chain_model: &Option<ModelResult>,
    manifest: &GenManifest,
) -> (
    BTreeMap<AccountAddress, Symbol>,
    BTreeMap<AccountAddress, Symbol>,
) {
    let mut source_top_level_package_names: BTreeSet<PackageName> = BTreeSet::new();
    let mut on_chain_top_level_package_names: BTreeSet<PackageName> = BTreeSet::new();
    for (name, pkg) in manifest.packages.iter() {
        match pkg {
            Package::Dependency(_) => {
                source_top_level_package_names.insert(*name);
            }
            Package::OnChain(_) => {
                on_chain_top_level_package_names.insert(*name);
            }
        }
    }

    let source_top_level_id_map: BTreeMap<AccountAddress, Symbol> = if let Some(m) = source_model {
        m.id_map
            .iter()
            .filter_map(|(id, name)| {
                if source_top_level_package_names.contains(name) {
                    Some((*id, *name))
                } else {
                    None
                }
            })
            .collect()
    } else {
        BTreeMap::new()
    };

    let on_chain_top_level_id_map: BTreeMap<AccountAddress, Symbol> =
        if let Some(m) = on_chain_model {
            m.id_map
                .iter()
                .filter_map(|(id, name)| {
                    if on_chain_top_level_package_names.contains(name) {
                        Some((*id, *name))
                    } else {
                        None
                    }
                })
                .collect()
        } else {
            BTreeMap::new()
        };

    (source_top_level_id_map, on_chain_top_level_id_map)
}

fn gen_packages_for_model(
    pkgs: BTreeMap<AccountAddress, Vec<ModuleEnv>>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    published_at_map: &BTreeMap<AccountAddress, AccountAddress>,
    type_origin_table: &TypeOriginTable,
    version_table: &VersionTable,
    is_source: bool,
    out_root: &Path,
) -> Result<()> {
    if pkgs.is_empty() {
        return Ok(());
    }

    for (pkg_id, modules) in pkgs.iter() {
        let is_top_level = top_level_pkg_names.contains_key(pkg_id);
        let levels_from_root = if is_top_level { 0 } else { 2 };

        let package_path = out_root.join(match top_level_pkg_names.get(pkg_id) {
            Some(pkg_name) => PathBuf::from(package_import_name(*pkg_name)),
            None => PathBuf::from("_dependencies")
                .join(match is_source {
                    true => "source",
                    false => "onchain",
                })
                .join(pkg_id.to_hex_literal()),
        });

        std::fs::create_dir_all(&package_path)?;

        // generate index.ts
        let published_at = published_at_map.get(pkg_id).unwrap_or(pkg_id);
        let versions = version_table.get(pkg_id).unwrap();
        let tokens: js::Tokens = quote!(
            export const PACKAGE_ID = $[str]($[const](pkg_id.to_hex_literal()));
            export const PUBLISHED_AT = $[str]($[const](published_at.to_hex_literal()));
            $(for (published_at, version) in versions {
                export const PKG_V$(version.value()) = $[str]($[const](published_at.to_hex_literal()));
            })
        );
        write_tokens_to_file(&tokens, &package_path.join("index.ts"))?;

        // generate init.ts
        let tokens = gen_package_init_ts(modules, &FrameworkImportCtx::new(levels_from_root + 1));
        write_tokens_to_file(&tokens, &package_path.join("init.ts"))?;

        // generate modules
        for module in modules {
            let module_path = package_path.join(module_import_name(module));
            std::fs::create_dir_all(&module_path)?;

            // generate <module>/functions.ts
            if is_top_level {
                let mut tokens = js::Tokens::new();
                let mut func_gen = FunctionsGen::new(
                    module.env,
                    FrameworkImportCtx::new(levels_from_root + 2),
                    StructClassImportCtx::for_func_gen(module, is_source, top_level_pkg_names),
                );
                for func in module.get_functions() {
                    func_gen.gen_fun_args_if(&func, &mut tokens)?;
                    func_gen.gen_fun_binding(&func, &mut tokens)?;
                }
                write_tokens_to_file(&tokens, &module_path.join("functions.ts"))?;
            }

            // generate <module>/structs.ts
            let mut tokens = js::Tokens::new();
            let mut structs_gen = StructsGen::new(
                module.env,
                StructClassImportCtx::for_struct_gen(module, is_source, top_level_pkg_names),
                FrameworkImportCtx::new(levels_from_root + 2),
                type_origin_table,
                version_table,
            );

            for strct in module.get_structs() {
                //println!("{}", strct.get_full_name_str());
                structs_gen.gen_datatype_sep_comment(&mut tokens, &strct);

                // type check function
                structs_gen.gen_is_type_func(&mut tokens, &strct);

                // fields interface
                structs_gen.gen_fields_if(&mut tokens, &strct);

                // struct class
                structs_gen.gen_struct_class(&mut tokens, &strct);
            }

            // TODO do the same for enums here
            // iterate over all enums
            // and add gen_enum_class to StructsGen
            for enm in module.get_enums() {
                structs_gen.gen_datatype_sep_comment(&mut tokens, &enm);

                // // type check function
                structs_gen.gen_is_type_func_enum(&mut tokens, &enm);

                // // fields interface
                structs_gen.gen_variant_type_enum(&mut tokens, &enm);

                // enum class
                structs_gen.gen_enum_class(&mut tokens, &enm);
            }

            write_tokens_to_file(&tokens, &module_path.join("structs.ts"))?;
        }
    }

    Ok(())
}
