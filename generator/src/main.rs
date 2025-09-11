use std::collections::{BTreeMap, BTreeSet};
use std::path::{Path, PathBuf};

use anyhow::Result;
use clap::*;
use colored::*;
use convert_case::{Case, Casing};
use genco::fmt;
use genco::prelude::*;
use move_core_types::account_address::AccountAddress;
use move_model_2::{compiled_model, model, source_model};
use move_package::source_package::parsed_manifest::PackageName;
use move_symbol_pool::Symbol;
use std::io::Write;
use codegen_kt::gen::{self, gen_module_files, StructClassImportCtx, StructsGen};
use codegen_kt::manifest::{parse_gen_manifest_from_file, GenManifest, Package};
use codegen_kt::model_builder::{
    build_models, OnChainModelResult, SourceModelResult, TypeOriginTable, VersionTable,
};
use codegen_kt::package_cache::PackageCache;
use sui_move_build::SuiPackageHooks;
use sui_sdk::SuiClientBuilder;

const DEFAULT_RPC: &str = "https://fullnode.mainnet.sui.io:443";

#[derive(Parser)]
#[clap(
    name = "sui-client-gen",
    version,
    about = "Generate Kotlin SDKs for Sui Move smart contracts."
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

    #[arg(
        long,
        help = "The base package name for the generated SDK.",
        default_value = "sui.client.gen"
    )]
    package: String,
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

    if args.clean {
        clean_output(&PathBuf::from(&args.out))?;
    }

    // separate modules by package
    let source_pkgs: BTreeMap<AccountAddress, source_model::Package> = source_model
        .as_ref()
        .map(|m| m.env.packages().map(|pkg| (pkg.address(), pkg)).collect())
        .unwrap_or_default();

    let on_chain_pkgs: BTreeMap<AccountAddress, compiled_model::Package> = on_chain_model
        .as_ref()
        .map(|m| m.env.packages().map(|pkg| (pkg.address(), pkg)).collect())
        .unwrap_or_default();

    // gen top-level packages and dependencies
    let (source_top_level_addr_map, on_chain_top_level_addr_map) =
        resolve_top_level_pkg_addr_map(&source_model, &on_chain_model, &manifest);

    let out_root = PathBuf::from(&args.out);
    std::fs::create_dir_all(&out_root)?;

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
            &args.package,
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
            &args.package,
            &out_root,
        )?;
    }

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

fn write_tokens_to_file(tokens: &Tokens<kotlin::Kotlin>, path: &Path, package: &str) -> Result<()> {
    if tokens.is_empty() {
        return Ok(());
    }

    let file = std::fs::File::create(path)?;
    let mut w = fmt::IoWriter::new(file);
    let fmt = fmt::Config::from_lang::<kotlin::Kotlin>()
        .with_indentation(fmt::Indentation::Space(2));
    let config = kotlin::Config::default().with_package(package);
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
    source_model: &Option<SourceModelResult>,
    on_chain_model: &Option<OnChainModelResult>,
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

fn gen_packages_for_model<const HAS_SOURCE: usize>(
    pkgs: BTreeMap<AccountAddress, model::Package<HAS_SOURCE>>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    published_at_map: &BTreeMap<AccountAddress, AccountAddress>,
    type_origin_table: &TypeOriginTable,
    version_table: &VersionTable,
    is_source: bool,
    base_package_name: &str,
    out_root: &Path,
) -> Result<()> {
    if pkgs.is_empty() {
        return Ok(());
    }

    let base_path = PathBuf::from(base_package_name.replace('.', std::path::MAIN_SEPARATOR_STR));


    for (pkg_id, pkg) in pkgs.iter() {
        let is_top_level = top_level_pkg_names.contains_key(pkg_id);

        let sanitized_pkg_id_str = format!("pkg_{}", pkg_id.to_hex_literal().trim_start_matches("0x"));

        let package_path = out_root.join(&base_path).join(match top_level_pkg_names.get(pkg_id) {
            Some(pkg_name) => PathBuf::from(gen::package_import_name(*pkg_name)),
            None => PathBuf::from("_dependencies")
                .join(if is_source { "source" } else { "onchain" })
                .join(&sanitized_pkg_id_str),
        });

        std::fs::create_dir_all(&package_path)?;

        let published_at = published_at_map.get(pkg_id).unwrap_or(pkg_id);
        let versions = version_table.get(pkg_id).unwrap();
        let index_tokens: kotlin::Tokens = quote! {
           const val PACKAGE_ID = $[str]($[const](pkg_id.to_hex_literal()))

           const val PUBLISHED_AT = $[str]($[const](published_at.to_hex_literal()))

           $(for (published_at, version) in versions {
                const val PKG_V$(version.value()) = $[str]($[const](published_at.to_hex_literal()))
           })
        };

        let package_index_name = if let Some(pkg_name) = top_level_pkg_names.get(pkg_id) {
            format!("{}.{}", base_package_name, gen::package_import_name(*pkg_name))
        } else {
            format!("{}.{}.{}.{}",
                    base_package_name,
                    "_dependencies",
                    if is_source { "source" } else { "onchain" },
                    &sanitized_pkg_id_str
            )
        };
        write_tokens_to_file(&index_tokens, &package_path.join("Package.kt"), &package_index_name)?;

        for module in pkg.modules() {
            let module_path = package_path.join(gen::module_import_name(module.name()));
            std::fs::create_dir_all(&module_path)?;

            let functions_package = format!("{}.{}", &package_index_name, gen::module_import_name(module.name()));
            let data_package = format!("{}.data", &functions_package);

            if is_top_level {
                let (functions_toks, data_toks) = gen_module_files(
                    &module,
                    top_level_pkg_names,
                    &functions_package,
                )?;

                let object_name = module.name().to_string().from_case(Case::Snake).to_case(Case::Pascal);
                let functions_file_name = format!("{}.kt", object_name);

                write_tokens_to_file(&functions_toks, &module_path.join(functions_file_name), &functions_package)?;

                if !data_toks.is_empty() {
                    let data_path = module_path.join("data");
                    std::fs::create_dir_all(&data_path)?;
                    write_tokens_to_file(&data_toks, &data_path.join("Args.kt"), &data_package)?;
                }
            }

            let mut tokens = kotlin::Tokens::new();
            let mut import_ctx =
                &mut StructClassImportCtx::for_struct_gen(&module, top_level_pkg_names, true, &data_package);

            for strct in module.structs() {
                let mut structs_gen = StructsGen::new(
                    import_ctx,
                    type_origin_table,
                    version_table,
                    strct,
                );
                structs_gen.gen_struct_sep_comment(&mut tokens);
                structs_gen.gen_struct_class(&mut tokens);
                import_ctx = structs_gen.import_ctx;
            }

            let data_path = module_path.join("data");
            std::fs::create_dir_all(&data_path)?;
            write_tokens_to_file(&tokens, &data_path.join("Structs.kt"), &data_package)?;
        }
    }

    Ok(())
}