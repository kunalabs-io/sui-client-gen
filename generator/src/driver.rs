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

use crate::graphql::GraphQLCache;
use crate::io::{clean_output, write_str_to_file};
use crate::layout::OutputLayout;
use crate::manifest::{is_default_environment, parse_gen_manifest_from_file};
use crate::model_builder::{TypeOriginTable, VersionTable};
use crate::multi_env::{build_multi_env_models, MultiEnvResult};
use crate::ts_gen::{self, gen_envs_index, gen_module_structs, EnvConfigIR, EnvPackageConfigIR};
use crate::framework_sources;

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

    // Create a manifest copy with CLI overrides applied
    let mut manifest = manifest;
    if let Some(ref env_override) = opts.environment {
        manifest.config.environment = env_override.clone();
    }
    if let Some(ref graphql_override) = opts.graphql {
        manifest.config.graphql = Some(graphql_override.clone());
    }

    // Build models for all environments with compatibility checking
    writeln!(
        progress_output,
        "{}",
        "BUILDING MODELS FOR ALL ENVIRONMENTS".green().bold()
    )?;
    let mut graphql_cache = GraphQLCache::new();
    let multi_env_result = build_multi_env_models(&manifest, &opts.manifest_path, &mut graphql_cache).await?;

    writeln!(
        progress_output,
        "  Default env: {}, All envs: {:?}",
        multi_env_result.default_env,
        multi_env_result.all_envs
    )?;
    writeln!(
        progress_output,
        "  Packages: {}, Modules: {}",
        multi_env_result.default_model.model.packages().count(),
        multi_env_result.default_model.model.modules().count()
    )?;

    // Clean output if requested
    if opts.clean {
        clean_output(&out_dir)?;
    }

    // Collect packages by address
    let pkgs: BTreeMap<AccountAddress, source_model::Package> = multi_env_result
        .default_model
        .model
        .packages()
        .map(|pkg| (pkg.address(), pkg))
        .collect();

    // Setup output layout
    let output = OutputLayout::new(out_dir);
    std::fs::create_dir_all(&output.root)?;

    // Generate _framework
    writeln!(progress_output, "{}", "GENERATING FRAMEWORK".green().bold())?;
    generate_framework(&output, &pkgs, &multi_env_result)?;

    // Generate packages
    writeln!(progress_output, "{}", "GENERATING PACKAGES".green().bold())?;
    gen_packages(
        pkgs,
        &multi_env_result.folder_names,
        &multi_env_result.top_level_addr_map,
        &multi_env_result.default_model.published_at,
        &multi_env_result.default_model.type_origin_table,
        &multi_env_result.default_model.version_table,
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
    multi_env: &MultiEnvResult,
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
        framework_sources::ENV,
        &output.framework_dir.join("env.ts"),
    )?;

    // Generate init-loader.ts
    write_str_to_file(
        &ts_gen::gen_init_loader(
            &pkgs.keys().copied().collect::<Vec<_>>(),
            &multi_env.folder_names,
            &multi_env.top_level_addr_map,
        ),
        &output.framework_dir.join("init-loader.ts"),
    )?;

    // Generate _envs/ directory (at top level, sibling to _framework/)
    let envs_dir = output.root.join("_envs");
    std::fs::create_dir_all(&envs_dir)?;

    // Generate _envs/<env>.ts for each environment
    for env_name in &multi_env.all_envs {
        // Get per-environment data
        let type_origin_table = multi_env
            .env_type_origins
            .get(env_name)
            .expect("type_origin_table missing for env");
        let published_at_map = multi_env
            .env_published_at
            .get(env_name)
            .expect("published_at missing for env");
        let id_map = multi_env
            .env_id_maps
            .get(env_name)
            .expect("id_map missing for env");

        // Build environment config IR
        let env_config = build_env_config(
            env_name,
            id_map,
            &multi_env.folder_names,
            &multi_env.top_level_addr_map,
            published_at_map,
            type_origin_table,
        );

        // Generate _envs/<env_name>.ts
        write_str_to_file(&env_config.emit(), &envs_dir.join(format!("{}.ts", env_name)))?;
    }

    // Generate _envs/index.ts
    write_str_to_file(
        &gen_envs_index(&multi_env.all_envs, &multi_env.default_env),
        &envs_dir.join("index.ts"),
    )?;

    Ok(())
}

/// Build the environment configuration IR from model data.
///
/// Uses id_map to iterate packages (works for any environment, not just default).
/// The type_origin_table must have entries for all packages.
fn build_env_config(
    env_name: &str,
    id_map: &BTreeMap<AccountAddress, move_package_alt::schema::PackageName>,
    folder_names: &BTreeMap<AccountAddress, String>,
    top_level_addr_map: &BTreeMap<AccountAddress, Symbol>,
    published_at_map: &BTreeMap<AccountAddress, AccountAddress>,
    type_origin_table: &TypeOriginTable,
) -> EnvConfigIR {
    let mut packages = Vec::new();
    let mut dependencies = Vec::new();

    for pkg_addr in id_map.keys() {
        // Get the kebab-case package name
        let pkg_name = folder_names
            .get(pkg_addr)
            .cloned()
            .unwrap_or_else(|| pkg_addr.to_hex_literal());

        // Get original ID and published-at
        let original_id = pkg_addr.to_hex_literal();
        let published_at = published_at_map
            .get(pkg_addr)
            .map(|a| a.to_hex_literal())
            .unwrap_or_else(|| original_id.clone());

        // Build type origins from the type_origin_table
        let mut type_origins = BTreeMap::new();
        if let Some(origin_map) = type_origin_table.get(pkg_addr) {
            for (type_path, origin_addr) in origin_map.iter() {
                type_origins.insert(type_path.clone(), origin_addr.to_hex_literal());
            }
        }
        // Note: if type_origin_table doesn't have entries for this package,
        // we skip it. This can happen for system packages which don't need
        // type origins as they are handled specially.

        let config = EnvPackageConfigIR {
            name: pkg_name,
            original_id,
            published_at,
            type_origins,
        };

        // Categorize as top-level package or dependency
        if top_level_addr_map.contains_key(pkg_addr) {
            packages.push(config);
        } else {
            dependencies.push(config);
        }
    }

    EnvConfigIR {
        env_name: env_name.to_string(),
        packages,
        dependencies,
    }
}

/// Generate TypeScript code for all packages.
fn gen_packages(
    pkgs: BTreeMap<AccountAddress, source_model::Package>,
    folder_names: &BTreeMap<AccountAddress, String>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    #[allow(unused_variables)] published_at_map: &BTreeMap<AccountAddress, AccountAddress>,
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

        // Note: index.ts is no longer generated per-package
        // Package addresses are now in _envs/<env>.ts

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
