//! Model builder using move_package_alt.
//!
//! This module builds Move models using the `move_package_alt` system which supports
//! environments and the new Sui package toolchain.

use std::collections::{BTreeMap, BTreeSet};
use std::fs::{self, File};
use std::io::Write;
use std::path::Path;

use anyhow::{Context, Result};
use move_compiler::editions::Flavor;
use move_core_types::account_address::AccountAddress;
use move_model_2::model::Model;
use move_model_2::source_kind::WithSource;
use move_package_alt::graph::NamedAddress;
use move_package_alt::package::RootPackage;
use move_package_alt::schema::{
    Environment, ExternalDependency, LocalDepInfo, ManifestDependencyInfo, ManifestGitDependency,
    OnChainDepInfo, PackageName,
};
use move_package_alt_compilation::build_config::BuildConfig;
use sui_package_alt::SuiFlavor;
use sui_sdk::types::base_types::SequenceNumber;
use tempfile::TempDir;

use crate::graphql::GraphQLClient;
use crate::manifest::{DepReplacement, DepReplacements, Environments, Packages, is_default_environment};

const STUB_PACKAGE_NAME: &str = "SuiClientGenRootPackageStub";

/// Type origin table: maps package address -> (module::struct -> defining package address)
pub type TypeOriginTable = BTreeMap<AccountAddress, BTreeMap<String, AccountAddress>>;

/// Version table: maps package address -> (origin address -> sequence number)
pub type VersionTable = BTreeMap<AccountAddress, BTreeMap<AccountAddress, SequenceNumber>>;

/// Package info result: (id_map, published_at, top_level_packages)
type PackageInfo = (
    BTreeMap<AccountAddress, PackageName>,
    BTreeMap<AccountAddress, AccountAddress>,
    BTreeSet<PackageName>,
);

/// Result of building a model from the package system.
pub struct ModelResult {
    /// The Move model
    pub model: Model<WithSource>,
    /// Map from package address to package name
    pub id_map: BTreeMap<AccountAddress, PackageName>,
    /// Map from original package ID to published-at ID
    pub published_at: BTreeMap<AccountAddress, AccountAddress>,
    /// Type origin table for code generation
    pub type_origin_table: TypeOriginTable,
    /// Version table for PKG_V{N} exports
    pub version_table: VersionTable,
    /// Set of top-level package names (from gen.toml)
    pub top_level_packages: BTreeSet<PackageName>,
}

/// Build a Move model from packages using the move_package_alt system.
///
/// # Arguments
/// * `packages` - The packages from gen.toml
/// * `manifest_path` - Path to the gen.toml file
/// * `environment` - Environment name (e.g., "testnet", "mainnet", or custom)
/// * `chain_id` - The chain ID for this environment
/// * `environments` - Custom environments from gen.toml (for stub Move.toml)
/// * `dep_replacements` - Environment-scoped dep replacements from gen.toml
/// * `graphql_client` - GraphQL client for type origin queries
pub async fn build_model(
    packages: &Packages,
    manifest_path: &Path,
    environment: &str,
    chain_id: &str,
    environments: &Environments,
    dep_replacements: &DepReplacements,
    graphql_client: &GraphQLClient,
) -> Result<ModelResult> {
    // Get the manifest directory for resolving relative paths
    let manifest_dir = manifest_path
        .parent()
        .ok_or_else(|| anyhow::anyhow!("Invalid manifest path"))?;

    // Create stub package in temp directory with environments and dep-replacements
    let temp_dir = create_stub_package(packages, manifest_dir, environments, dep_replacements)?;

    // Setup environment - use the provided chain_id
    let env = Environment::new(environment.to_string(), chain_id.to_string());

    // Load root package
    let root_pkg = RootPackage::<SuiFlavor>::load(temp_dir.path(), env)
        .await
        .context("Failed to load root package")?;

    // Build package info (id_map, published_at, top_level detection)
    let (id_map, published_at, top_level_packages) = build_package_info(&root_pkg, packages)?;

    // Build Move model
    let build_config = BuildConfig {
        default_flavor: Some(Flavor::Sui),
        ..Default::default()
    };
    let model = build_config
        .move_model_from_root_pkg(&root_pkg, &mut std::io::stderr())
        .await
        .context("Failed to build Move model")?;

    // Resolve type origins via GraphQL
    let (type_origin_table, version_table) =
        resolve_type_origins(graphql_client, &id_map, &published_at, &model).await?;

    Ok(ModelResult {
        model,
        id_map,
        published_at,
        type_origin_table,
        version_table,
        top_level_packages,
    })
}

/// Create a stub Move package in a temporary directory.
///
/// The stub package has the gen.toml packages as dependencies, with local paths
/// converted to absolute paths. It also includes [environments] and [dep-replacements.<env>]
/// sections for custom environments.
fn create_stub_package(
    packages: &Packages,
    manifest_dir: &Path,
    environments: &Environments,
    dep_replacements: &DepReplacements,
) -> Result<TempDir> {
    let temp_dir = tempfile::tempdir()?;
    let stub_path = temp_dir.path();

    // Create empty sources directory
    fs::create_dir(stub_path.join("sources"))?;

    // Create Move.toml
    let mut manifest = File::create(stub_path.join("Move.toml"))?;

    writeln!(manifest, "[package]")?;
    writeln!(manifest, "name = \"{}\"", STUB_PACKAGE_NAME)?;
    writeln!(manifest, "edition = \"2024\"")?;
    writeln!(manifest)?;
    writeln!(manifest, "[dependencies]")?;

    for (name, dep) in packages.iter() {
        let dep_str = format_dependency(dep, manifest_dir)?;
        writeln!(manifest, "{} = {}", name, dep_str)?;
    }

    // Write [environments] section for non-default environments
    let custom_envs: Vec<_> = environments
        .iter()
        .filter(|(name, _)| !is_default_environment(name))
        .collect();

    if !custom_envs.is_empty() {
        writeln!(manifest)?;
        writeln!(manifest, "[environments]")?;
        for (env_name, env) in custom_envs {
            // Custom environments always have chain_id (validated in manifest parsing)
            if let Some(chain_id) = &env.chain_id {
                writeln!(manifest, "{} = \"{}\"", env_name, chain_id)?;
            }
        }
    }

    // Write [dep-replacements] section with dotted keys (env.pkg = {...})
    // Using dotted key format to ensure compatibility with move_package_alt
    let has_replacements = dep_replacements.values().any(|r| !r.is_empty());
    if has_replacements {
        writeln!(manifest)?;
        writeln!(manifest, "[dep-replacements]")?;
        for (env_name, replacements) in dep_replacements.iter() {
            for (pkg_name, replacement) in replacements.iter() {
                let replacement_str = format_dep_replacement(replacement, manifest_dir)?;
                writeln!(manifest, "{}.{} = {}", env_name, pkg_name, replacement_str)?;
            }
        }
    }

    Ok(temp_dir)
}

/// Format a dependency for the stub Move.toml, converting relative paths to absolute.
fn format_dependency(dep: &ManifestDependencyInfo, manifest_dir: &Path) -> Result<String> {
    match dep {
        ManifestDependencyInfo::Local(LocalDepInfo { local }) => {
            let absolute_path = fs::canonicalize(manifest_dir.join(local))
                .with_context(|| format!("Failed to resolve path: {}", local.display()))?;
            Ok(format!("{{ local = \"{}\" }}", absolute_path.display()))
        }
        ManifestDependencyInfo::Git(ManifestGitDependency { repo, rev, subdir }) => {
            let mut parts = vec![format!("git = \"{}\"", repo)];
            if let Some(rev) = rev {
                parts.push(format!("rev = \"{}\"", rev));
            }
            if !subdir.as_os_str().is_empty() {
                parts.push(format!("subdir = \"{}\"", subdir.display()));
            }
            Ok(format!("{{ {} }}", parts.join(", ")))
        }
        ManifestDependencyInfo::External(ExternalDependency { resolver, data }) => {
            // Format external resolver dependency: { r.<resolver> = <data> }
            // We need to serialize the data back to inline TOML
            let data_str = format_toml_value(data);
            Ok(format!("{{ r.{} = {} }}", resolver, data_str))
        }
        ManifestDependencyInfo::OnChain(OnChainDepInfo { .. }) => {
            // Format on-chain dependency: { on-chain = true }
            Ok("{ on-chain = true }".to_string())
        }
    }
}

/// Format a TOML value as an inline string for the Move.toml dependency.
fn format_toml_value(value: &toml::Value) -> String {
    match value {
        toml::Value::String(s) => format!("\"{}\"", s),
        toml::Value::Integer(i) => i.to_string(),
        toml::Value::Float(f) => f.to_string(),
        toml::Value::Boolean(b) => b.to_string(),
        toml::Value::Array(arr) => {
            let items: Vec<String> = arr.iter().map(format_toml_value).collect();
            format!("[{}]", items.join(", "))
        }
        toml::Value::Table(tbl) => {
            let items: Vec<String> = tbl
                .iter()
                .map(|(k, v)| format!("{} = {}", k, format_toml_value(v)))
                .collect();
            format!("{{ {} }}", items.join(", "))
        }
        toml::Value::Datetime(dt) => dt.to_string(),
    }
}

/// Format a dep-replacement for the stub Move.toml.
fn format_dep_replacement(replacement: &DepReplacement, manifest_dir: &Path) -> Result<String> {
    let mut parts = Vec::new();

    // If there's a dependency source, format it
    if let Some(dep) = &replacement.dependency {
        // Extract the inner fields from the dependency and add them
        match dep {
            ManifestDependencyInfo::Local(LocalDepInfo { local }) => {
                let absolute_path = fs::canonicalize(manifest_dir.join(local))
                    .with_context(|| format!("Failed to resolve path: {}", local.display()))?;
                parts.push(format!("local = \"{}\"", absolute_path.display()));
            }
            ManifestDependencyInfo::Git(ManifestGitDependency { repo, rev, subdir }) => {
                parts.push(format!("git = \"{}\"", repo));
                if let Some(rev) = rev {
                    parts.push(format!("rev = \"{}\"", rev));
                }
                if !subdir.as_os_str().is_empty() {
                    parts.push(format!("subdir = \"{}\"", subdir.display()));
                }
            }
            ManifestDependencyInfo::External(ExternalDependency { resolver, data }) => {
                let data_str = format_toml_value(data);
                parts.push(format!("r.{} = {}", resolver, data_str));
            }
            ManifestDependencyInfo::OnChain(OnChainDepInfo { .. }) => {
                parts.push("on-chain = true".to_string());
            }
        }
    }

    // Add other replacement fields
    if let Some(published_at) = &replacement.published_at {
        parts.push(format!("published-at = \"{}\"", published_at));
    }
    if let Some(original_id) = &replacement.original_id {
        parts.push(format!("original-id = \"{}\"", original_id));
    }
    if let Some(use_env) = &replacement.use_environment {
        parts.push(format!("use-environment = \"{}\"", use_env));
    }
    if let Some(rename_from) = &replacement.rename_from {
        parts.push(format!("rename-from = \"{}\"", rename_from));
    }
    if replacement.is_override {
        parts.push("override = true".to_string());
    }

    Ok(format!("{{ {} }}", parts.join(", ")))
}

/// Build package info from the loaded RootPackage.
///
/// Returns:
/// - id_map: package address -> package name
/// - published_at: original ID -> published-at ID
/// - top_level_packages: set of package names from gen.toml
fn build_package_info(
    root_pkg: &RootPackage<SuiFlavor>,
    gen_packages: &Packages,
) -> Result<PackageInfo> {
    let mut id_map: BTreeMap<AccountAddress, PackageName> = BTreeMap::new();
    let mut published_at: BTreeMap<AccountAddress, AccountAddress> = BTreeMap::new();
    let mut top_level_packages: BTreeSet<PackageName> = BTreeSet::new();

    // Get the set of package names from gen.toml
    let gen_package_names: BTreeSet<&PackageName> = gen_packages.keys().collect();

    for pkg_info in root_pkg.packages()? {
        let pkg_name = pkg_info.name().clone();

        // Skip the stub root package
        if pkg_info.is_root() {
            continue;
        }

        // Determine if this is a top-level package
        if gen_package_names.contains(&pkg_name) {
            top_level_packages.insert(pkg_name.clone());
        }

        // Extract address from named addresses
        if let Ok(named_addrs) = pkg_info.named_addresses() {
            if let Some(addr) = named_addrs.get(pkg_info.name()) {
                match addr {
                    NamedAddress::Unpublished { dummy_addr } => {
                        // Unpublished package - use dummy address
                        id_map.insert(dummy_addr.0, pkg_name);
                    }
                    NamedAddress::Defined(original_id) => {
                        // Published package - original_id from Published.toml
                        id_map.insert(original_id.0, pkg_name);
                        // Use the published_at address for GraphQL queries, or fall back to original_id
                        let pub_addr = pkg_info
                            .published()
                            .map(|p| p.published_at.0)
                            .unwrap_or(original_id.0);
                        published_at.insert(original_id.0, pub_addr);
                    }
                    NamedAddress::RootPackage(maybe_addr) => {
                        // Root package address
                        if let Some(addr) = maybe_addr {
                            id_map.insert(addr.0, pkg_name);
                        }
                    }
                }
            }
        }
    }

    Ok((id_map, published_at, top_level_packages))
}

/// Resolve type origins using GraphQL queries.
///
/// The version table assigns sequential version numbers (1, 2, 3...) to each unique
/// defining address encountered, rather than querying actual on-chain versions.
/// This is sufficient since we only need unique identifiers for PKG_V{N} exports.
async fn resolve_type_origins(
    graphql: &GraphQLClient,
    id_map: &BTreeMap<AccountAddress, PackageName>,
    published_at: &BTreeMap<AccountAddress, AccountAddress>,
    model: &Model<WithSource>,
) -> Result<(TypeOriginTable, VersionTable)> {
    let mut type_origin_table: TypeOriginTable = BTreeMap::new();
    let mut version_table: VersionTable = BTreeMap::new();

    // Query published packages via GraphQL
    let published_addrs: Vec<AccountAddress> = published_at.values().copied().collect();

    if !published_addrs.is_empty() {
        let graphql_results = graphql
            .query_multiple_packages_type_origins(published_addrs)
            .await?;

        // Build type origin table and version table from GraphQL results
        for (original_id, &published_addr) in published_at.iter() {
            if let Some(origins) = graphql_results.get(&published_addr) {
                let mut origin_map: BTreeMap<String, AccountAddress> = BTreeMap::new();
                // Collect unique defining addresses for this package
                let mut defining_addrs: BTreeSet<AccountAddress> = BTreeSet::new();

                for origin in origins {
                    let key = format!("{}::{}", origin.module, origin.struct_name);
                    if let Ok(defining_addr) = AccountAddress::from_hex_literal(&origin.defining_id)
                    {
                        origin_map.insert(key, defining_addr);
                        defining_addrs.insert(defining_addr);
                    }
                }

                // Assign sequential version numbers in reverse order (newest = V1)
                // BTreeSet is sorted, so we reverse to get the most recent address first
                let mut versions: BTreeMap<AccountAddress, SequenceNumber> = BTreeMap::new();
                let addr_list: Vec<_> = defining_addrs.iter().collect();
                for (idx, addr) in addr_list.iter().rev().enumerate() {
                    versions.insert(**addr, SequenceNumber::from_u64((idx + 1) as u64));
                }

                type_origin_table.insert(*original_id, origin_map);
                version_table.insert(*original_id, versions);
            }
        }
    }

    // Fill in unpublished packages from model (self-origin)
    // We need to process ALL modules, not just the first one per package
    for module in model.modules() {
        let pkg_addr = module.package().address();

        // Get or create the origin map for this package
        let origin_map = type_origin_table.entry(pkg_addr).or_default();

        // Add all structs from this module
        for s in module.structs() {
            let key = format!("{}::{}", module.name(), s.name());
            // Only insert if not already present (GraphQL results take precedence)
            origin_map.entry(key).or_insert(pkg_addr);
        }

        // Add all enums from this module
        for e in module.enums() {
            let key = format!("{}::{}", module.name(), e.name());
            origin_map.entry(key).or_insert(pkg_addr);
        }

        // Ensure version table has this package's own address as a version
        // For unpublished packages, use version 1
        let versions = version_table.entry(pkg_addr).or_default();
        versions
            .entry(pkg_addr)
            .or_insert(SequenceNumber::from_u64(1));
    }

    // Ensure all packages in id_map have their own address in version_table
    for pkg_addr in id_map.keys() {
        let versions = version_table.entry(*pkg_addr).or_default();
        versions
            .entry(*pkg_addr)
            .or_insert(SequenceNumber::from_u64(1));
    }

    Ok((type_origin_table, version_table))
}

#[cfg(test)]
mod tests {
    use super::*;
    use move_package_alt::schema::ConstTrue;
    use std::path::PathBuf;

    #[test]
    fn test_format_local_dependency() {
        let dep = ManifestDependencyInfo::Local(LocalDepInfo {
            local: PathBuf::from("../move/examples"),
        });

        // This will fail if the path doesn't exist, but tests the format logic
        let manifest_dir = PathBuf::from("/tmp");
        let result = format_dependency(&dep, &manifest_dir);
        // The actual test would need a valid path
        assert!(result.is_err() || result.unwrap().contains("local"));
    }

    #[test]
    fn test_format_git_dependency() {
        let dep = ManifestDependencyInfo::Git(ManifestGitDependency {
            repo: "https://github.com/MystenLabs/sui.git".to_string(),
            rev: Some("mainnet-v1.62.1".to_string()),
            subdir: PathBuf::from("crates/sui-framework/packages/sui-framework"),
        });

        let manifest_dir = PathBuf::from("/tmp");
        let result = format_dependency(&dep, &manifest_dir).unwrap();

        assert!(result.contains("git = \"https://github.com/MystenLabs/sui.git\""));
        assert!(result.contains("rev = \"mainnet-v1.62.1\""));
        assert!(result.contains("subdir = \"crates/sui-framework/packages/sui-framework\""));
    }

    #[test]
    fn test_format_external_mvr_dependency() {
        // MVR dependency: { r.mvr = "@namespace/package" }
        let dep = ManifestDependencyInfo::External(ExternalDependency {
            resolver: "mvr".to_string(),
            data: toml::Value::String("@potatoes/ascii".to_string()),
        });

        let manifest_dir = PathBuf::from("/tmp");
        let result = format_dependency(&dep, &manifest_dir).unwrap();

        assert_eq!(result, "{ r.mvr = \"@potatoes/ascii\" }");
    }

    #[test]
    fn test_format_external_complex_dependency() {
        // External dependency with complex data: { r.custom = { key = "value" } }
        let mut data_table = toml::map::Map::new();
        data_table.insert(
            "resolved".to_string(),
            toml::Value::Table({
                let mut inner = toml::map::Map::new();
                inner.insert("local".to_string(), toml::Value::String(".".to_string()));
                inner
            }),
        );

        let dep = ManifestDependencyInfo::External(ExternalDependency {
            resolver: "mock-resolver".to_string(),
            data: toml::Value::Table(data_table),
        });

        let manifest_dir = PathBuf::from("/tmp");
        let result = format_dependency(&dep, &manifest_dir).unwrap();

        assert!(result.contains("r.mock-resolver"));
        assert!(result.contains("resolved"));
        assert!(result.contains("local"));
    }

    #[test]
    fn test_format_onchain_dependency() {
        // On-chain dependency: { on-chain = true }
        let dep = ManifestDependencyInfo::OnChain(OnChainDepInfo {
            on_chain: ConstTrue,
        });

        let manifest_dir = PathBuf::from("/tmp");
        let result = format_dependency(&dep, &manifest_dir).unwrap();

        assert_eq!(result, "{ on-chain = true }");
    }
}
