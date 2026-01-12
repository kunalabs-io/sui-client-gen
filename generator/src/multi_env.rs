//! Multi-environment model building and compatibility checking.
//!
//! This module orchestrates building Move models for multiple environments
//! and checking that structs, enums, and functions are compatible between them.

use std::collections::{BTreeMap, BTreeSet};
use std::path::Path;

use anyhow::{Context, Result};
use move_core_types::account_address::AccountAddress;
use move_symbol_pool::Symbol;

use crate::graphql::GraphQLCache;
use crate::manifest::{is_default_environment, GenManifest};
use crate::model_builder::{self, ModelResult, TypeOriginTable, VersionTable};
use crate::ts_gen::compat::{
    check_enum_compat, check_function_compat, check_struct_compat, CompatError,
};
use crate::ts_gen::{
    EnumIR, EnumIRBuilder, FunctionIR, FunctionIRBuilder, StructIR, StructIRBuilder,
};
use crate::{resolve_chain_id, resolve_graphql};

/// Result of building models for all environments.
pub struct MultiEnvResult {
    /// The default environment's full model result (used for code generation)
    pub default_model: ModelResult,
    /// List of all environments processed (default + additional)
    pub all_envs: Vec<String>,
    /// The default environment name
    pub default_env: String,
    /// Folder names map (package address -> kebab-case name)
    pub folder_names: BTreeMap<AccountAddress, String>,
    /// Top-level package addresses map
    pub top_level_addr_map: BTreeMap<AccountAddress, Symbol>,
    /// Per-environment type origin tables (for generating env configs)
    pub env_type_origins: BTreeMap<String, TypeOriginTable>,
    /// Per-environment published_at maps
    pub env_published_at: BTreeMap<String, BTreeMap<AccountAddress, AccountAddress>>,
    /// Per-environment version tables
    pub env_version_tables: BTreeMap<String, VersionTable>,
    /// Per-environment id_maps (address -> package name)
    pub env_id_maps: BTreeMap<String, BTreeMap<AccountAddress, move_package_alt::schema::PackageName>>,
}

/// IR snapshot of an environment for compatibility checking.
/// Contains all structs, enums, and functions keyed by their full path.
struct EnvIRSnapshot {
    env_name: String,
    /// "pkg::module::StructName" -> StructIR
    structs: BTreeMap<String, StructIR>,
    /// "pkg::module::EnumName" -> EnumIR
    enums: BTreeMap<String, EnumIR>,
    /// "pkg::module::func_name" -> FunctionIR
    functions: BTreeMap<String, FunctionIR>,
}

/// Collect all environments that need to be processed.
///
/// Returns a list of environment names including:
/// - The default environment from config
/// - All environments defined in [environments]
/// - Any environments that have dep-replacements
pub fn collect_all_environments(manifest: &GenManifest) -> Vec<String> {
    let mut envs = BTreeSet::new();

    // Always include the default environment
    envs.insert(manifest.config.environment.clone());

    // Include all defined environments
    for env_name in manifest.environments.keys() {
        envs.insert(env_name.clone());
    }

    // Include environments with dep-replacements
    for env_name in manifest.dep_replacements.keys() {
        // Only add if it's a valid environment (default or custom-defined)
        if is_default_environment(env_name) || manifest.environments.contains_key(env_name) {
            envs.insert(env_name.clone());
        }
    }

    envs.into_iter().collect()
}

/// Build a map of top-level package addresses to their names.
///
/// Filters the id_map to only include packages that are in the top_level_packages set.
fn build_top_level_addr_map(
    id_map: &BTreeMap<AccountAddress, move_package_alt::schema::PackageName>,
    top_level_packages: &BTreeSet<move_package_alt::schema::PackageName>,
) -> BTreeMap<AccountAddress, Symbol> {
    id_map
        .iter()
        .filter_map(|(addr, name)| {
            if top_level_packages.contains(name) {
                Some((*addr, Symbol::from(name.as_str())))
            } else {
                None
            }
        })
        .collect()
}

/// Build models for all environments and check compatibility.
///
/// # Arguments
/// * `manifest` - The parsed gen.toml manifest
/// * `manifest_path` - Path to the gen.toml file
/// * `graphql_cache` - Cache for GraphQL queries (avoids duplicate fetches per chain)
///
/// # Returns
/// * `Ok(MultiEnvResult)` - All environments are compatible
/// * `Err` - Environments are incompatible or build failed
pub async fn build_multi_env_models(
    manifest: &GenManifest,
    manifest_path: &Path,
    graphql_cache: &mut GraphQLCache,
) -> Result<MultiEnvResult> {
    let all_envs = collect_all_environments(manifest);
    let default_env = &manifest.config.environment;

    // Build model for default environment first
    let default_chain_id = resolve_chain_id(default_env, &manifest.environments)
        .ok_or_else(|| anyhow::anyhow!("Could not resolve chain ID for environment '{}'", default_env))?;
    let default_graphql = resolve_graphql(
        manifest.config.graphql.as_deref(),
        default_env,
        &manifest.environments,
    );

    // Validate chain ID
    let actual_chain_id = graphql_cache.query_chain_identifier(&default_graphql).await?;
    if actual_chain_id != default_chain_id {
        return Err(anyhow::anyhow!(
            "Chain ID mismatch for '{}': expected '{}', got '{}' from {}",
            default_env, default_chain_id, actual_chain_id, default_graphql
        ));
    }

    let default_model = model_builder::build_model(
        &manifest.packages,
        manifest_path,
        default_env,
        &default_chain_id,
        &manifest.environments,
        &manifest.dep_replacements,
        graphql_cache.get_client(&default_chain_id, &default_graphql),
    )
    .await
    .context(format!("Failed to build model for default environment '{}'", default_env))?;

    // Build top-level address map and folder names from default model
    let top_level_addr_map =
        build_top_level_addr_map(&default_model.id_map, &default_model.top_level_packages);
    let folder_names =
        crate::layout::build_package_folder_names(&default_model.id_map, &top_level_addr_map);

    // Extract IR snapshot from default environment
    let default_snapshot = extract_ir_snapshot(
        default_env,
        &default_model,
        &folder_names,
        &top_level_addr_map,
    )?;

    // Store per-environment data
    let mut env_type_origins = BTreeMap::new();
    let mut env_published_at = BTreeMap::new();
    let mut env_version_tables = BTreeMap::new();
    let mut env_id_maps = BTreeMap::new();

    env_type_origins.insert(default_env.clone(), default_model.type_origin_table.clone());
    env_published_at.insert(default_env.clone(), default_model.published_at.clone());
    env_version_tables.insert(default_env.clone(), default_model.version_table.clone());
    env_id_maps.insert(default_env.clone(), default_model.id_map.clone());

    // Process other environments
    let mut compat_errors = Vec::new();

    for env_name in &all_envs {
        if env_name == default_env {
            continue; // Already processed
        }

        // Resolve chain ID and GraphQL for this environment
        let chain_id = match resolve_chain_id(env_name, &manifest.environments) {
            Some(id) => id,
            None => {
                // Environment not valid (not defined and not a default)
                continue;
            }
        };
        let graphql_url = resolve_graphql(
            manifest.config.graphql.as_deref(),
            env_name,
            &manifest.environments,
        );

        // Validate chain ID (if different from what we've already validated)
        let actual_chain_id = graphql_cache.query_chain_identifier(&graphql_url).await?;
        if actual_chain_id != chain_id {
            return Err(anyhow::anyhow!(
                "Chain ID mismatch for '{}': expected '{}', got '{}' from {}",
                env_name, chain_id, actual_chain_id, graphql_url
            ));
        }

        // Build model for this environment
        let env_model = model_builder::build_model(
            &manifest.packages,
            manifest_path,
            env_name,
            &chain_id,
            &manifest.environments,
            &manifest.dep_replacements,
            graphql_cache.get_client(&chain_id, &graphql_url),
        )
        .await
        .context(format!("Failed to build model for environment '{}'", env_name))?;

        // Store this environment's data
        env_type_origins.insert(env_name.clone(), env_model.type_origin_table.clone());
        env_published_at.insert(env_name.clone(), env_model.published_at.clone());
        env_version_tables.insert(env_name.clone(), env_model.version_table.clone());
        env_id_maps.insert(env_name.clone(), env_model.id_map.clone());

        // Build environment-specific folder_names and top_level_addr_map for IR extraction
        let env_top_level_addr_map =
            build_top_level_addr_map(&env_model.id_map, &env_model.top_level_packages);
        let env_folder_names = crate::layout::build_package_folder_names(
            &env_model.id_map,
            &env_top_level_addr_map,
        );

        // Extract IR and check compatibility
        let env_snapshot = extract_ir_snapshot(
            env_name,
            &env_model,
            &env_folder_names,
            &env_top_level_addr_map,
        )?;

        // Check compatibility for items that exist in BOTH environments
        let errors = check_snapshots_compat(&default_snapshot, &env_snapshot);
        compat_errors.extend(errors);
    }

    // If there were compatibility errors, report them all
    if !compat_errors.is_empty() {
        let error_messages: Vec<String> = compat_errors.iter().map(|e| format!("  - {}", e)).collect();
        return Err(anyhow::anyhow!(
            "Environment compatibility errors:\n{}",
            error_messages.join("\n")
        ));
    }

    Ok(MultiEnvResult {
        default_model,
        all_envs,
        default_env: default_env.clone(),
        folder_names,
        top_level_addr_map,
        env_type_origins,
        env_published_at,
        env_version_tables,
        env_id_maps,
    })
}

/// Extract IR snapshot from a built model for compatibility checking.
fn extract_ir_snapshot(
    env_name: &str,
    model_result: &ModelResult,
    folder_names: &BTreeMap<AccountAddress, String>,
    top_level_addr_map: &BTreeMap<AccountAddress, Symbol>,
) -> Result<EnvIRSnapshot> {
    let mut snapshot = EnvIRSnapshot {
        env_name: env_name.to_string(),
        structs: BTreeMap::new(),
        enums: BTreeMap::new(),
        functions: BTreeMap::new(),
    };

    for module in model_result.model.modules() {
        let pkg_addr = module.package().address();
        let pkg_name = folder_names
            .get(&pkg_addr)
            .cloned()
            .unwrap_or_else(|| pkg_addr.to_hex_literal());
        let mod_name = module.name().to_string();
        let is_top_level = top_level_addr_map.contains_key(&pkg_addr);

        // Determine levels_from_root (for framework path)
        let levels_from_root: u8 = if is_top_level { 2 } else { 3 };

        // Extract structs
        for strct in module.structs() {
            let builder = StructIRBuilder::new(
                strct,
                &model_result.type_origin_table,
                &model_result.version_table,
                folder_names,
                top_level_addr_map,
                levels_from_root,
            );
            let (ir, _imports) = builder.build();
            let key = format!("{}::{}::{}", pkg_name, mod_name, ir.name);
            snapshot.structs.insert(key, ir);
        }

        // Extract enums
        for enum_ in module.enums() {
            let mut builder = EnumIRBuilder::new(
                enum_,
                &model_result.type_origin_table,
                &model_result.version_table,
                folder_names,
                top_level_addr_map,
                levels_from_root,
            );
            let ir = builder.build();
            let key = format!("{}::{}::{}", pkg_name, mod_name, ir.name);
            snapshot.enums.insert(key, ir);
        }

        // Extract functions (only for top-level packages)
        if is_top_level {
            for func in module.functions() {
                if let Some(builder) = FunctionIRBuilder::new(
                    func,
                    folder_names,
                    top_level_addr_map,
                    levels_from_root,
                ) {
                    let ir = builder.build();
                    let key = format!("{}::{}::{}", pkg_name, mod_name, ir.move_name);
                    snapshot.functions.insert(key, ir);
                }
            }
        }
    }

    Ok(snapshot)
}

/// Check compatibility between two environment snapshots.
/// Only checks items that exist in BOTH snapshots (asymmetry is allowed).
fn check_snapshots_compat(default: &EnvIRSnapshot, other: &EnvIRSnapshot) -> Vec<CompatError> {
    let mut errors = Vec::new();

    // Check structs that exist in both (asymmetry is allowed - items in one but not other are OK)
    for (key, default_struct) in &default.structs {
        if let Some(other_struct) = other.structs.get(key) {
            if let Err(e) = check_struct_compat(
                default_struct,
                other_struct,
                &default.env_name,
                &other.env_name,
                key,
            ) {
                errors.push(e);
            }
        }
    }

    // Check enums that exist in both
    for (key, default_enum) in &default.enums {
        if let Some(other_enum) = other.enums.get(key) {
            if let Err(e) = check_enum_compat(
                default_enum,
                other_enum,
                &default.env_name,
                &other.env_name,
                key,
            ) {
                errors.push(e);
            }
        }
    }

    // Check functions that exist in both
    for (key, default_func) in &default.functions {
        if let Some(other_func) = other.functions.get(key) {
            if let Err(e) = check_function_compat(
                default_func,
                other_func,
                &default.env_name,
                &other.env_name,
                key,
            ) {
                errors.push(e);
            }
        }
    }

    errors
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::manifest::Environment;

    fn make_test_manifest(envs: Vec<(&str, Option<&str>)>) -> GenManifest {
        let mut environments = BTreeMap::new();
        for (name, chain_id) in envs {
            environments.insert(
                name.to_string(),
                Environment {
                    chain_id: chain_id.map(String::from),
                    graphql: None,
                },
            );
        }

        GenManifest {
            config: crate::manifest::Config {
                environment: "env_1".to_string(),
                graphql: None,
                output: None,
            },
            packages: BTreeMap::new(),
            environments,
            dep_replacements: BTreeMap::new(),
        }
    }

    #[test]
    fn test_collect_environments_basic() {
        let manifest = make_test_manifest(vec![
            ("env_1", Some("chain1")),
            ("env_2", Some("chain2")),
        ]);

        let envs = collect_all_environments(&manifest);
        assert!(envs.contains(&"env_1".to_string()));
        assert!(envs.contains(&"env_2".to_string()));
    }

    #[test]
    fn test_collect_environments_includes_defaults() {
        let mut manifest = make_test_manifest(vec![]);
        manifest.config.environment = "mainnet".to_string();

        let envs = collect_all_environments(&manifest);
        assert!(envs.contains(&"mainnet".to_string()));
    }

    #[test]
    fn test_collect_environments_includes_dep_replacement_envs() {
        let mut manifest = make_test_manifest(vec![
            ("staging", Some("chain1")),
        ]);
        manifest.dep_replacements.insert(
            "staging".to_string(),
            BTreeMap::new(),
        );

        let envs = collect_all_environments(&manifest);
        assert!(envs.contains(&"staging".to_string()));
    }
}
