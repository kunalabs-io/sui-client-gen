//! Code generation driver using move_package_alt.
//!
//! This driver uses the `move_package_alt` package system which supports
//! environments and the Sui package toolchain.

use std::collections::BTreeMap;
use std::io::Write;
use std::path::PathBuf;

use anyhow::Result;
use colored::*;
use move_core_types::account_address::AccountAddress;
use move_model_2::source_model;
use move_symbol_pool::Symbol;
use sui_sdk::types::SYSTEM_PACKAGE_ADDRESSES;

use crate::graphql::GraphQLClient;
use crate::io::{clean_output, write_str_to_file};
use crate::layout::{build_package_folder_names, OutputLayout};
use crate::manifest::{is_default_environment, parse_gen_manifest_from_file};
use crate::model_builder::{self, TypeOriginTable, VersionTable};
use crate::ts_gen::{self, gen_module_structs, gen_package_index};
use crate::{framework_sources, resolve_chain_id, resolve_graphql};

/// Options for running the new generator.
pub struct RunOptions {
    /// Path to the gen.toml manifest
    pub manifest_path: PathBuf,
    /// Output directory (overrides manifest config if set)
    pub out_dir: Option<PathBuf>,
    /// Environment override (overrides manifest config if set)
    pub environment: Option<String>,
    /// GraphQL endpoint override (overrides manifest/environment config if set)
    pub graphql: Option<String>,
    /// Whether to clean the output directory first
    pub clean: bool,
}

/// Run the code generator with the new package system.
pub async fn run(opts: RunOptions) -> Result<()> {
    let mut progress_output = std::io::stderr();

    // Parse manifest
    writeln!(progress_output, "{}", "PARSING MANIFEST".green().bold())?;
    let manifest = parse_gen_manifest_from_file(&opts.manifest_path)?;

    // Determine output directory
    let out_dir = opts
        .out_dir
        .or_else(|| manifest.config.output.as_ref().map(PathBuf::from))
        .unwrap_or_else(|| opts.manifest_path.parent().unwrap().to_path_buf());

    // Apply CLI environment override, or use manifest config
    let environment = opts
        .environment
        .as_deref()
        .unwrap_or(&manifest.config.environment);

    // Validate environment exists (CLI override may not have been validated by manifest parsing)
    if !is_default_environment(environment) && !manifest.environments.contains_key(environment) {
        return Err(anyhow::anyhow!(
            "Environment '{}' not found. It must be defined in [environments] \
             or be a default environment (mainnet, testnet).",
            environment
        ));
    }

    // Resolve chain ID for the environment
    // This should always succeed since we validated the environment exists above
    let expected_chain_id = resolve_chain_id(environment, &manifest.environments).ok_or_else(|| {
        anyhow::anyhow!(
            "Environment '{}' has no associated chain ID. \
             This is unexpected as environment validation should have caught this.",
            environment
        )
    })?;

    // Apply CLI graphql override, or resolve from environment
    let graphql_url = opts.graphql.clone().unwrap_or_else(|| {
        resolve_graphql(
            manifest.config.graphql.as_deref(),
            environment,
            &manifest.environments,
        )
    });
    let graphql_client = GraphQLClient::new(&graphql_url);

    // Validate chain ID matches endpoint
    writeln!(progress_output, "{}", "VALIDATING CHAIN ID".green().bold())?;
    let actual_chain_id = graphql_client
        .query_chain_identifier()
        .await
        .map_err(|e| {
            anyhow::anyhow!(
                "Failed to query chain identifier from {}: {}",
                graphql_url,
                e
            )
        })?;

    if actual_chain_id != expected_chain_id {
        return Err(anyhow::anyhow!(
            "Chain ID mismatch: GraphQL endpoint '{}' returned chain ID '{}', \
             but environment '{}' expects chain ID '{}'. \
             Please ensure your GraphQL endpoint matches your environment.",
            graphql_url,
            actual_chain_id,
            environment,
            expected_chain_id
        ));
    }

    // Build model using new package system
    writeln!(
        progress_output,
        "{}",
        format!("BUILDING MODEL (environment: {})", environment)
            .green()
            .bold()
    )?;
    let model_result = model_builder::build_model(
        &manifest.packages,
        &opts.manifest_path,
        environment,
        &expected_chain_id,
        &manifest.environments,
        &manifest.dep_replacements,
        &graphql_client,
    )
    .await?;

    writeln!(
        progress_output,
        "  Packages: {}, Modules: {}",
        model_result.model.packages().count(),
        model_result.model.modules().count()
    )?;

    // Clean output if requested
    if opts.clean {
        clean_output(&out_dir)?;
    }

    // Collect packages by address
    let pkgs: BTreeMap<AccountAddress, source_model::Package> = model_result
        .model
        .packages()
        .map(|pkg| (pkg.address(), pkg))
        .collect();

    // Build top-level address map (address -> Symbol)
    // Convert PackageName (Identifier) to Symbol for compatibility with ts_gen
    let top_level_addr_map: BTreeMap<AccountAddress, Symbol> = model_result
        .id_map
        .iter()
        .filter_map(|(addr, name)| {
            if model_result.top_level_packages.contains(name) {
                Some((*addr, Symbol::from(name.as_str())))
            } else {
                None
            }
        })
        .collect();

    // Setup output layout
    let output = OutputLayout::new(out_dir);
    std::fs::create_dir_all(&output.root)?;

    // Build folder names map for all packages
    let folder_names = build_package_folder_names(&model_result.id_map, &top_level_addr_map);

    // Generate _framework
    writeln!(progress_output, "{}", "GENERATING FRAMEWORK".green().bold())?;
    generate_framework(&output, &pkgs, &folder_names, &top_level_addr_map)?;

    // Generate packages
    writeln!(progress_output, "{}", "GENERATING PACKAGES".green().bold())?;
    gen_packages(
        pkgs,
        &folder_names,
        &top_level_addr_map,
        &model_result.published_at,
        &model_result.type_origin_table,
        &model_result.version_table,
        &output,
    )?;

    // Generate .eslintrc.json
    write_str_to_file(
        framework_sources::ESLINTRC,
        &output.root.join(".eslintrc.json"),
    )?;

    writeln!(progress_output, "{}", "DONE".green().bold())?;
    Ok(())
}

/// Generate the _framework directory contents.
fn generate_framework(
    output: &OutputLayout,
    pkgs: &BTreeMap<AccountAddress, source_model::Package>,
    folder_names: &BTreeMap<AccountAddress, String>,
    top_level_addr_map: &BTreeMap<AccountAddress, Symbol>,
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

    // Generate init-loader.ts
    write_str_to_file(
        &ts_gen::gen_init_loader(
            &pkgs.keys().copied().collect::<Vec<_>>(),
            folder_names,
            top_level_addr_map,
        ),
        &output.framework_dir.join("init-loader.ts"),
    )?;

    Ok(())
}

/// Generate TypeScript code for all packages.
fn gen_packages(
    pkgs: BTreeMap<AccountAddress, source_model::Package>,
    folder_names: &BTreeMap<AccountAddress, String>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    published_at_map: &BTreeMap<AccountAddress, AccountAddress>,
    type_origin_table: &TypeOriginTable,
    version_table: &VersionTable,
    output: &OutputLayout,
) -> Result<()> {
    if pkgs.is_empty() {
        return Ok(());
    }

    for (pkg_id, pkg) in pkgs.iter() {
        let pkg_layout = output.package_path(pkg_id, folder_names, top_level_pkg_names);
        std::fs::create_dir_all(&pkg_layout.path)?;

        // Generate index.ts
        let published_at = published_at_map.get(pkg_id).unwrap_or(pkg_id);
        let empty_versions = BTreeMap::new();
        let versions = version_table.get(pkg_id).unwrap_or(&empty_versions);
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
                    folder_names,
                    top_level_pkg_names,
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
                folder_names,
                top_level_pkg_names,
                pkg_layout.levels_from_root,
            );
            write_str_to_file(&content, &module_path.join("structs.ts"))?;
        }
    }

    Ok(())
}
