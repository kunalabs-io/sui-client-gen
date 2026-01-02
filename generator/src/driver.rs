//! Code generation driver.
//!
//! Orchestrates the full generation pipeline: model building, layout setup,
//! and file emission. This is the main entry point for the generator logic.

use std::collections::{BTreeMap, BTreeSet};
use std::io::Write;
use std::path::PathBuf;

use anyhow::Result;
use colored::*;
use move_core_types::account_address::AccountAddress;
use move_model_2::source_kind::SourceKind;
use move_model_2::{compiled_model, model, source_model};
use move_package::source_package::parsed_manifest::PackageName;
use move_symbol_pool::Symbol;
use sui_sdk::types::SYSTEM_PACKAGE_ADDRESSES;
use sui_sdk::SuiClientBuilder;

use crate::io::{clean_output, write_str_to_file};
use crate::layout::OutputLayout;
use crate::manifest::{parse_gen_manifest_from_file, GenManifest, Package};
use crate::model_builder::{
    build_models, OnChainModelResult, SourceModelResult, TypeOriginTable, VersionTable,
};
use crate::package_cache::PackageCache;
use crate::ts_gen::{self, gen_module_structs, gen_package_index};
use crate::{framework_sources, DEFAULT_RPC};

/// Options for running the generator.
pub struct RunOptions {
    /// Path to the gen.toml manifest
    pub manifest_path: PathBuf,
    /// Output directory
    pub out_dir: PathBuf,
    /// Whether to clean the output directory first
    pub clean: bool,
}

/// Run the code generator with the given options.
pub async fn run(opts: RunOptions) -> Result<()> {
    let manifest = parse_gen_manifest_from_file(&opts.manifest_path)?;
    let rpc_url = match &manifest.config {
        Some(config) => config
            .rpc
            .clone()
            .unwrap_or_else(|| DEFAULT_RPC.to_string()),
        None => DEFAULT_RPC.to_string(),
    };
    let rpc_client = SuiClientBuilder::default().build(rpc_url).await?;

    let chain_id = {
        if let Err(e) = rpc_client.check_api_version() {
            eprintln!("{}", format!("[warning] {e}").yellow().bold());
        }

        rpc_client.read_api().get_chain_identifier().await.ok()
    };

    let mut progress_output = std::io::stderr();

    // Build models
    let mut cache = PackageCache::new(rpc_client.read_api());
    let (source_model, on_chain_model) = build_models(
        &mut cache,
        &manifest.packages,
        &opts.manifest_path,
        chain_id,
        &mut progress_output,
    )
    .await?;

    if source_model.is_none() && on_chain_model.is_none() {
        writeln!(std::io::stderr(), "No packages to generate.")?;
        return Ok(());
    }

    // Clean output if requested
    if opts.clean {
        clean_output(&opts.out_dir)?;
    }

    // Separate modules by package
    let source_pkgs: BTreeMap<AccountAddress, source_model::Package> = source_model
        .as_ref()
        .map(|m| m.env.packages().map(|pkg| (pkg.address(), pkg)).collect())
        .unwrap_or_default();

    let on_chain_pkgs: BTreeMap<AccountAddress, compiled_model::Package> = on_chain_model
        .as_ref()
        .map(|m| m.env.packages().map(|pkg| (pkg.address(), pkg)).collect())
        .unwrap_or_default();

    // Resolve top-level package address mappings
    let (source_top_level_addr_map, on_chain_top_level_addr_map) =
        resolve_top_level_pkg_addr_map(&source_model, &on_chain_model, &manifest);

    // Setup output layout
    let output = OutputLayout::new(opts.out_dir);
    std::fs::create_dir_all(&output.root)?;

    // Generate _framework
    writeln!(progress_output, "{}", "GENERATING FRAMEWORK".green().bold())?;
    generate_framework(
        &output,
        &source_pkgs,
        &on_chain_pkgs,
        &source_top_level_addr_map,
        &on_chain_top_level_addr_map,
    )?;

    // Generate source packages
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
            &output,
        )?;
    }

    // Generate on-chain packages
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
            &output,
        )?;
    }

    // Generate .eslintrc.json
    write_str_to_file(
        framework_sources::ESLINTRC,
        &output.root.join(".eslintrc.json"),
    )?;

    Ok(())
}

/// Generate the _framework directory contents.
fn generate_framework(
    output: &OutputLayout,
    source_pkgs: &BTreeMap<AccountAddress, source_model::Package>,
    on_chain_pkgs: &BTreeMap<AccountAddress, compiled_model::Package>,
    source_top_level_addr_map: &BTreeMap<AccountAddress, Symbol>,
    on_chain_top_level_addr_map: &BTreeMap<AccountAddress, Symbol>,
) -> Result<()> {
    std::fs::create_dir_all(&output.framework_dir)?;

    write_str_to_file(
        framework_sources::LOADER,
        &output.framework_dir.join("loader.ts"),
    )?;
    write_str_to_file(
        framework_sources::UTIL,
        &output.framework_dir.join("util.ts"),
    )?;
    write_str_to_file(
        framework_sources::REIFIED,
        &output.framework_dir.join("reified.ts"),
    )?;
    write_str_to_file(
        framework_sources::VECTOR,
        &output.framework_dir.join("vector.ts"),
    )?;
    write_str_to_file(
        &ts_gen::gen_init_loader(
            if source_pkgs.is_empty() {
                None
            } else {
                Some((
                    source_pkgs.keys().copied().collect::<Vec<_>>(),
                    source_top_level_addr_map,
                ))
            },
            if on_chain_pkgs.is_empty() {
                None
            } else {
                Some((
                    on_chain_pkgs.keys().copied().collect::<Vec<_>>(),
                    on_chain_top_level_addr_map,
                ))
            },
        ),
        &output.framework_dir.join("init-loader.ts"),
    )?;

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

/// Generate TypeScript code for all packages in a model.
fn gen_packages_for_model<HasSource: SourceKind>(
    pkgs: BTreeMap<AccountAddress, model::Package<HasSource>>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    published_at_map: &BTreeMap<AccountAddress, AccountAddress>,
    type_origin_table: &TypeOriginTable,
    version_table: &VersionTable,
    is_source: bool,
    output: &OutputLayout,
) -> Result<()> {
    if pkgs.is_empty() {
        return Ok(());
    }

    for (pkg_id, pkg) in pkgs.iter() {
        let pkg_layout = output.package_path(pkg_id, top_level_pkg_names, is_source);
        std::fs::create_dir_all(&pkg_layout.path)?;

        // Generate index.ts
        let published_at = published_at_map.get(pkg_id).unwrap_or(pkg_id);
        let versions = version_table.get(pkg_id).unwrap();
        let version_list: Vec<(String, u64)> = versions
            .iter()
            .map(|(addr, seq)| (addr.to_hex_literal(), seq.value()))
            .collect();
        let index_content = gen_package_index(
            &pkg_id.to_hex_literal(),
            &published_at.to_hex_literal(),
            &version_list,
            SYSTEM_PACKAGE_ADDRESSES.contains(pkg_id),
        );
        write_str_to_file(&index_content, &pkg_layout.path.join("index.ts"))?;

        // Generate init.ts
        write_str_to_file(
            &ts_gen::gen_package_init(pkg, &pkg_layout.framework_rel_path_for_init()),
            &pkg_layout.path.join("init.ts"),
        )?;

        // Generate modules
        for module in pkg.modules() {
            let module_path = pkg_layout.module_path(module.name());
            std::fs::create_dir_all(&module_path)?;

            // Generate <module>/functions.ts (only for top-level packages)
            if pkg_layout.is_top_level {
                let content = ts_gen::gen_module_functions(
                    &module,
                    top_level_pkg_names,
                    is_source,
                    pkg_layout.levels_from_root,
                );
                if !content.is_empty() {
                    write_str_to_file(&content, &module_path.join("functions.ts"))?;
                }
            }

            // Generate <module>/structs.ts
            let content = gen_module_structs(
                &module,
                type_origin_table,
                version_table,
                top_level_pkg_names,
                is_source,
                pkg_layout.levels_from_root,
            );
            write_str_to_file(&content, &module_path.join("structs.ts"))?;
        }
    }

    Ok(())
}
