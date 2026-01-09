//! Generator manifest (gen.toml) parsing.
//!
//! Uses `move_package_alt` types for dependency representation.

use anyhow::{bail, Context, Result};
use std::collections::BTreeMap;
use std::path::Path;

use move_package_alt::schema::{ManifestDependencyInfo, PackageName};

const PACKAGES_NAME: &str = "packages";
const CONFIG_NAME: &str = "config";
const ENVIRONMENTS_NAME: &str = "environments";
const DEP_REPLACEMENTS_PREFIX: &str = "dep-replacements";

const MIGRATION_URL: &str = "https://github.com/kunalabs-io/sui-client-gen";

/// Default environments that have known chain IDs.
pub const DEFAULT_ENVIRONMENTS: &[&str] = &["mainnet", "testnet"];

/// Check if an environment name is a default environment.
pub fn is_default_environment(name: &str) -> bool {
    DEFAULT_ENVIRONMENTS.contains(&name)
}

/// Environment configuration.
#[derive(Debug, Clone, Eq, PartialEq)]
pub struct Environment {
    /// Chain identifier. Required for custom environments, None for defaults.
    pub chain_id: Option<String>,
    /// GraphQL endpoint override. Optional.
    pub graphql: Option<String>,
}

/// Environments map - environment name to configuration.
pub type Environments = BTreeMap<String, Environment>;

/// Dependency replacements - maps environment name to (package name -> replacement).
pub type DepReplacements = BTreeMap<String, BTreeMap<PackageName, DepReplacement>>;

/// A dependency replacement configuration.
/// Can override the dependency source, publish addresses, or environment.
#[derive(Debug, Clone)]
pub struct DepReplacement {
    /// Override the dependency source (local/git/etc).
    pub dependency: Option<ManifestDependencyInfo>,
    /// Override the published-at address.
    pub published_at: Option<String>,
    /// Override the original-id address.
    pub original_id: Option<String>,
    /// Use a different environment in the dependency's namespace.
    pub use_environment: Option<String>,
    /// Rename the package from this name.
    pub rename_from: Option<String>,
    /// Mark as override dependency.
    pub is_override: bool,
}

/// Package dependencies - maps package name to its dependency specification.
/// Only source dependencies (local/git) are supported.
pub type Packages = BTreeMap<PackageName, ManifestDependencyInfo>;

/// Configuration for the code generator.
#[derive(Debug, Clone, Eq, PartialEq)]
pub struct Config {
    /// GraphQL endpoint URL override. Optional, takes precedence over environment's graphql.
    pub graphql: Option<String>,
    /// Environment name to use. Must exist in [environments] or be a default (mainnet/testnet).
    pub environment: String,
    /// Output directory for generated code. Optional, can be specified via CLI.
    pub output: Option<String>,
}

/// The parsed generator manifest (gen.toml).
#[derive(Debug, Clone)]
pub struct GenManifest {
    /// Configuration section. Required.
    pub config: Config,
    /// Package dependencies to generate code for.
    pub packages: Packages,
    /// Environment definitions. Optional (default envs don't need to be listed).
    pub environments: Environments,
    /// Environment-scoped dependency replacements. Optional.
    pub dep_replacements: DepReplacements,
}

/// Detects if the manifest uses the old format and returns an error with migration instructions.
/// Old format indicators:
/// - `rpc` field in [config] (now use `environment` + optional `graphql`)
/// - `id = "0x..."` in package specs (now use `on-chain = true`)
fn detect_old_manifest_format(table: &toml::map::Map<String, toml::Value>) -> Result<()> {
    let mut indicators = Vec::new();

    // Check for `rpc` in [config]
    if let Some(toml::Value::Table(config)) = table.get(CONFIG_NAME) {
        if config.contains_key("rpc") {
            indicators.push("'rpc' field in [config] (replaced by 'environment' + optional 'graphql')");
        }
    }

    // Check for `id = "..."` in any package under [packages]
    if let Some(toml::Value::Table(packages)) = table.get(PACKAGES_NAME) {
        for (pkg_name, pkg_value) in packages {
            if let toml::Value::Table(pkg_table) = pkg_value {
                if pkg_table.contains_key("id") {
                    indicators.push("'id' field in package spec (replaced by 'on-chain = true')");
                    // Log which package for clarity
                    let _ = pkg_name; // Used for detection, specific package name not needed in message
                    break; // One indicator is enough
                }
            }
        }
    }

    if !indicators.is_empty() {
        bail!(
            "This manifest appears to use an outdated format.\n\n\
             Detected:\n  - {}\n\n\
             The gen.toml format has changed significantly. Please see the README for the new format:\n\
             {}",
            indicators.join("\n  - "),
            MIGRATION_URL
        );
    }

    Ok(())
}

pub fn parse_gen_manifest_from_file(path: &Path) -> Result<GenManifest> {
    let file_contents = if path.is_file() {
        std::fs::read_to_string(path)
    } else {
        std::fs::read_to_string(path.join(Path::new("gen.toml")))
    }
    .with_context(|| format!("Unable to find generator manifest at {:?}", path))?;
    parse_gen_manifest(&file_contents)
}

pub fn parse_gen_manifest(manifest_string: &str) -> Result<GenManifest> {
    let tval: toml::Value =
        toml::from_str(manifest_string).context("Unable to parse generator manifest")?;

    match tval {
        toml::Value::Table(mut table) => {
            // Check for old manifest format before proceeding
            detect_old_manifest_format(&table)?;

            if !table.contains_key(PACKAGES_NAME) {
                bail!("Missing [packages] section in manifest")
            };

            if !table.contains_key(CONFIG_NAME) {
                bail!("Missing [config] section in manifest")
            };

            let config = parse_config(table.remove(CONFIG_NAME).unwrap())?;

            let packages = table
                .remove(PACKAGES_NAME)
                .map(parse_packages)
                .transpose()
                .context("Error parsing '[packages]' section of manifest")?
                .unwrap();

            // Parse [environments] section
            let environments = table
                .remove(ENVIRONMENTS_NAME)
                .map(parse_environments)
                .transpose()
                .context("Error parsing '[environments]' section of manifest")?
                .unwrap_or_default();

            // Parse [dep-replacements.<env>] sections
            // TOML parses [dep-replacements.env_name] as a nested table under "dep-replacements"
            // So we need to look for a "dep-replacements" key that contains env sub-tables
            let dep_replacements = table
                .remove(DEP_REPLACEMENTS_PREFIX)
                .map(parse_all_dep_replacements)
                .transpose()
                .context("Error parsing '[dep-replacements]' sections of manifest")?
                .unwrap_or_default();

            // Validate: config.environment must exist in environments or be a default
            let env_name = &config.environment;
            if !is_default_environment(env_name) && !environments.contains_key(env_name) {
                bail!(
                    "Environment '{}' specified in [config] not found. \
                     It must be defined in [environments] or be a default environment (mainnet, testnet).",
                    env_name
                );
            }

            Ok(GenManifest {
                config,
                packages,
                environments,
                dep_replacements,
            })
        }
        x => {
            bail!(
                "Malformed generator manifest {}. Expected a table at top level, but encountered a {}",
                x,
                x.type_str()
            )
        }
    }
}

fn parse_config(tval: toml::Value) -> Result<Config> {
    match tval {
        toml::Value::Table(table) => {
            let graphql = table
                .get("graphql")
                .and_then(|tval| tval.as_str())
                .map(|s| s.to_string());

            let environment = table
                .get("environment")
                .and_then(|tval| tval.as_str())
                .map(|s| s.to_string())
                .ok_or_else(|| anyhow::anyhow!("Missing required 'environment' field in [config]"))?;

            let output = table
                .get("output")
                .and_then(|tval| tval.as_str())
                .map(|s| s.to_string());

            Ok(Config {
                graphql,
                environment,
                output,
            })
        }
        x => {
            bail!(
                "Malformed section in manifest {}. Expected a table, but encountered a {}",
                x,
                x.type_str()
            )
        }
    }
}

fn parse_packages(tval: toml::Value) -> Result<Packages> {
    match tval {
        toml::Value::Table(table) => {
            let mut pkgs = BTreeMap::new();
            for (pkg_name, dep_value) in table.into_iter() {
                let pkg_name_ident = PackageName::new(pkg_name.as_str())
                    .map_err(|e| anyhow::anyhow!("Invalid package name '{}': {}", pkg_name, e))?;

                // Deserialize using move_package_alt's built-in deserializer
                let dep: ManifestDependencyInfo = dep_value
                    .clone()
                    .try_into()
                    .with_context(|| format!("Error parsing dependency '{}'", pkg_name))?;

                pkgs.insert(pkg_name_ident, dep);
            }
            Ok(pkgs)
        }
        x => {
            bail!(
                "Malformed section in manifest {}. Expected a table, but encountered a {}",
                x,
                x.type_str()
            )
        }
    }
}

/// Parse [environments] section.
/// Supports both string shorthand (env = "chain_id") and table form (env = { chain-id = "...", graphql = "..." }).
fn parse_environments(tval: toml::Value) -> Result<Environments> {
    match tval {
        toml::Value::Table(table) => {
            let mut envs = BTreeMap::new();
            for (env_name, env_value) in table.into_iter() {
                let is_default = is_default_environment(&env_name);

                let environment = match env_value {
                    // String shorthand: env = "chain_id"
                    toml::Value::String(chain_id) => {
                        if is_default {
                            bail!(
                                "Default environment '{}' cannot specify a chain-id. \
                                 Use table form to override graphql only: {} = {{ graphql = \"...\" }}",
                                env_name,
                                env_name
                            );
                        }
                        Environment {
                            chain_id: Some(chain_id),
                            graphql: None,
                        }
                    }
                    // Table form: env = { chain-id = "...", graphql = "..." }
                    toml::Value::Table(t) => {
                        let chain_id = t
                            .get("chain-id")
                            .and_then(|v| v.as_str())
                            .map(String::from);

                        let graphql = t
                            .get("graphql")
                            .and_then(|v| v.as_str())
                            .map(String::from);

                        // Validation: default envs can't set chain-id
                        if is_default && chain_id.is_some() {
                            bail!(
                                "Default environment '{}' cannot specify a chain-id. \
                                 Only 'graphql' override is allowed.",
                                env_name
                            );
                        }

                        // Validation: custom envs require chain-id
                        if !is_default && chain_id.is_none() {
                            bail!(
                                "Custom environment '{}' must specify a chain-id.",
                                env_name
                            );
                        }

                        Environment { chain_id, graphql }
                    }
                    x => {
                        bail!(
                            "Invalid environment '{}': expected string (chain-id) or table, got {}",
                            env_name,
                            x.type_str()
                        );
                    }
                };

                envs.insert(env_name, environment);
            }
            Ok(envs)
        }
        x => {
            bail!(
                "Malformed [environments] section {}. Expected a table, but encountered a {}",
                x,
                x.type_str()
            )
        }
    }
}

/// Parse all [dep-replacements.<env>] sections.
/// The TOML parser represents [dep-replacements.env_name] as a nested table.
fn parse_all_dep_replacements(tval: toml::Value) -> Result<DepReplacements> {
    match tval {
        toml::Value::Table(table) => {
            let mut all_replacements: DepReplacements = BTreeMap::new();
            for (env_name, env_replacements_value) in table.into_iter() {
                let env_replacements = parse_env_dep_replacements(env_replacements_value)
                    .with_context(|| {
                        format!("Error parsing '[dep-replacements.{}]' section", env_name)
                    })?;
                all_replacements.insert(env_name, env_replacements);
            }
            Ok(all_replacements)
        }
        x => {
            bail!(
                "Malformed [dep-replacements] section {}. Expected a table with environment sub-tables, but encountered a {}",
                x,
                x.type_str()
            )
        }
    }
}

/// Parse a single [dep-replacements.<env>] section.
fn parse_env_dep_replacements(tval: toml::Value) -> Result<BTreeMap<PackageName, DepReplacement>> {
    match tval {
        toml::Value::Table(table) => {
            let mut replacements = BTreeMap::new();
            for (pkg_name, replacement_value) in table.into_iter() {
                let pkg_name_ident = PackageName::new(pkg_name.as_str())
                    .map_err(|e| anyhow::anyhow!("Invalid package name '{}': {}", pkg_name, e))?;

                let replacement = parse_single_dep_replacement(replacement_value)
                    .with_context(|| format!("Error parsing dep-replacement for '{}'", pkg_name))?;

                replacements.insert(pkg_name_ident, replacement);
            }
            Ok(replacements)
        }
        x => {
            bail!(
                "Malformed dep-replacements section {}. Expected a table, but encountered a {}",
                x,
                x.type_str()
            )
        }
    }
}

fn parse_single_dep_replacement(tval: toml::Value) -> Result<DepReplacement> {
    match tval {
        toml::Value::Table(mut table) => {
            // Extract the special fields first
            let published_at = table
                .remove("published-at")
                .and_then(|v| v.as_str().map(String::from));

            let original_id = table
                .remove("original-id")
                .and_then(|v| v.as_str().map(String::from));

            let use_environment = table
                .remove("use-environment")
                .and_then(|v| v.as_str().map(String::from));

            let rename_from = table
                .remove("rename-from")
                .and_then(|v| v.as_str().map(String::from));

            let is_override = table
                .remove("override")
                .and_then(|v| v.as_bool())
                .unwrap_or(false);

            // If there are remaining fields, try to parse them as a dependency source
            let dependency = if !table.is_empty() {
                let dep_value = toml::Value::Table(table);
                let dep: ManifestDependencyInfo = dep_value
                    .try_into()
                    .context("Error parsing dependency source in dep-replacement")?;
                Some(dep)
            } else {
                None
            };

            Ok(DepReplacement {
                dependency,
                published_at,
                original_id,
                use_environment,
                rename_from,
                is_override,
            })
        }
        x => {
            bail!(
                "Malformed dep-replacement {}. Expected a table, but encountered a {}",
                x,
                x.type_str()
            )
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use move_package_alt::schema::{LocalDepInfo, ManifestGitDependency};
    use std::path::PathBuf;

    #[test]
    fn test_parse_gen_manifest() {
        let manifest_str = r#"
        [config]
        graphql = "https://graphql.mainnet.sui.io/graphql"
        environment = "testnet"
        output = "./gen"

        [packages]
        amm = { local = "../move/amm" }
        fixture = { local = "../move/fixture" }
        framework = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "releases/sui-v1.0.0-release" }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        // Check config
        assert_eq!(act.config.graphql, Some("https://graphql.mainnet.sui.io/graphql".to_string()));
        assert_eq!(act.config.environment, "testnet");
        assert_eq!(act.config.output, Some("./gen".to_string()));

        // Check amm package
        let amm = act.packages.get(&PackageName::new("amm").unwrap()).unwrap();
        assert!(matches!(amm, ManifestDependencyInfo::Local(LocalDepInfo { local }) if local == &PathBuf::from("../move/amm")));

        // Check fixture package
        let fixture = act.packages.get(&PackageName::new("fixture").unwrap()).unwrap();
        assert!(matches!(fixture, ManifestDependencyInfo::Local(LocalDepInfo { local }) if local == &PathBuf::from("../move/fixture")));

        // Check framework package
        let framework = act.packages.get(&PackageName::new("framework").unwrap()).unwrap();
        match framework {
            ManifestDependencyInfo::Git(ManifestGitDependency { repo, rev, subdir }) => {
                assert_eq!(repo, "https://github.com/MystenLabs/sui.git");
                assert_eq!(rev, &Some("releases/sui-v1.0.0-release".to_string()));
                assert_eq!(subdir, &PathBuf::from("crates/sui-framework/packages/sui-framework"));
            }
            _ => panic!("Expected Git dependency"),
        }
    }

    #[test]
    fn test_parse_gen_manifest_minimal() {
        let manifest_str = r#"
        [config]
        environment = "mainnet"

        [packages]
        mypackage = { local = "./my-package" }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        assert_eq!(act.config.environment, "mainnet");
        assert_eq!(act.config.graphql, None);
        assert_eq!(act.config.output, None);
        assert_eq!(act.packages.len(), 1);
    }

    #[test]
    fn test_missing_environment_fails() {
        let manifest_str = r#"
        [config]
        graphql = "https://graphql.mainnet.sui.io/graphql"

        [packages]
        mypackage = { local = "./my-package" }
        "#;

        let result = parse_gen_manifest(manifest_str);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("environment"));
    }

    #[test]
    fn test_missing_config_fails() {
        let manifest_str = r#"
        [packages]
        mypackage = { local = "./my-package" }
        "#;

        let result = parse_gen_manifest(manifest_str);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("[config]"));
    }

    #[test]
    fn test_parse_mvr_dependency() {
        let manifest_str = r#"
        [config]
        environment = "mainnet"

        [packages]
        ascii = { r.mvr = "@potatoes/ascii" }
        codec = { r.mvr = "@potatoes/codec" }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        assert_eq!(act.packages.len(), 2);

        // Check ascii package
        let ascii = act.packages.get(&PackageName::new("ascii").unwrap()).unwrap();
        match ascii {
            ManifestDependencyInfo::External(ext) => {
                assert_eq!(ext.resolver, "mvr");
                assert_eq!(ext.data, toml::Value::String("@potatoes/ascii".to_string()));
            }
            _ => panic!("Expected External dependency"),
        }

        // Check codec package
        let codec = act.packages.get(&PackageName::new("codec").unwrap()).unwrap();
        match codec {
            ManifestDependencyInfo::External(ext) => {
                assert_eq!(ext.resolver, "mvr");
                assert_eq!(ext.data, toml::Value::String("@potatoes/codec".to_string()));
            }
            _ => panic!("Expected External dependency"),
        }
    }

    #[test]
    fn test_parse_onchain_dependency() {
        let manifest_str = r#"
        [config]
        environment = "mainnet"

        [packages]
        SomePackage = { on-chain = true }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        assert_eq!(act.packages.len(), 1);

        // Check the on-chain package
        let pkg = act.packages.get(&PackageName::new("SomePackage").unwrap()).unwrap();
        assert!(matches!(pkg, ManifestDependencyInfo::OnChain(_)));
    }

    #[test]
    fn test_parse_mixed_dependencies() {
        let manifest_str = r#"
        [config]
        environment = "testnet"

        [packages]
        local_pkg = { local = "./my-package" }
        git_pkg = { git = "https://github.com/example/repo.git", rev = "main" }
        mvr_pkg = { r.mvr = "@namespace/package" }
        onchain_pkg = { on-chain = true }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        assert_eq!(act.packages.len(), 4);

        assert!(matches!(
            act.packages.get(&PackageName::new("local_pkg").unwrap()),
            Some(ManifestDependencyInfo::Local(_))
        ));
        assert!(matches!(
            act.packages.get(&PackageName::new("git_pkg").unwrap()),
            Some(ManifestDependencyInfo::Git(_))
        ));
        assert!(matches!(
            act.packages.get(&PackageName::new("mvr_pkg").unwrap()),
            Some(ManifestDependencyInfo::External(_))
        ));
        assert!(matches!(
            act.packages.get(&PackageName::new("onchain_pkg").unwrap()),
            Some(ManifestDependencyInfo::OnChain(_))
        ));
    }

    #[test]
    fn test_parse_environments_string_shorthand() {
        let manifest_str = r#"
        [config]
        environment = "my_custom_env"

        [packages]
        mypackage = { local = "./my-package" }

        [environments]
        my_custom_env = "abcd1234"
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        assert_eq!(act.environments.len(), 1);
        let env = act.environments.get("my_custom_env").unwrap();
        assert_eq!(env.chain_id, Some("abcd1234".to_string()));
        assert_eq!(env.graphql, None);
    }

    #[test]
    fn test_parse_environments_table_form() {
        let manifest_str = r#"
        [config]
        environment = "staging"

        [packages]
        mypackage = { local = "./my-package" }

        [environments]
        staging = { chain-id = "12345678", graphql = "https://staging.example.com/graphql" }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        assert_eq!(act.environments.len(), 1);
        let env = act.environments.get("staging").unwrap();
        assert_eq!(env.chain_id, Some("12345678".to_string()));
        assert_eq!(env.graphql, Some("https://staging.example.com/graphql".to_string()));
    }

    #[test]
    fn test_parse_environments_default_graphql_override() {
        let manifest_str = r#"
        [config]
        environment = "testnet"

        [packages]
        mypackage = { local = "./my-package" }

        [environments]
        testnet = { graphql = "https://my-testnet.example.com/graphql" }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        assert_eq!(act.environments.len(), 1);
        let env = act.environments.get("testnet").unwrap();
        assert_eq!(env.chain_id, None); // Default envs don't set chain-id
        assert_eq!(env.graphql, Some("https://my-testnet.example.com/graphql".to_string()));
    }

    #[test]
    fn test_default_env_with_chain_id_fails() {
        // String shorthand for default env should fail
        let manifest_str = r#"
        [config]
        environment = "mainnet"

        [packages]
        mypackage = { local = "./my-package" }

        [environments]
        mainnet = "35834a8a"
        "#;

        let result = parse_gen_manifest(manifest_str);
        assert!(result.is_err());
        // Use format!("{:?}") to get full error chain including cause
        let err_str = format!("{:?}", result.unwrap_err());
        assert!(err_str.contains("cannot specify a chain-id"), "Expected error about chain-id, got: {}", err_str);
    }

    #[test]
    fn test_default_env_with_chain_id_table_fails() {
        // Table form with chain-id for default env should fail
        let manifest_str = r#"
        [config]
        environment = "testnet"

        [packages]
        mypackage = { local = "./my-package" }

        [environments]
        testnet = { chain-id = "4c78adac", graphql = "https://example.com/graphql" }
        "#;

        let result = parse_gen_manifest(manifest_str);
        assert!(result.is_err());
        let err_str = format!("{:?}", result.unwrap_err());
        assert!(err_str.contains("cannot specify a chain-id"), "Expected error about chain-id, got: {}", err_str);
    }

    #[test]
    fn test_custom_env_without_chain_id_fails() {
        let manifest_str = r#"
        [config]
        environment = "my_custom_env"

        [packages]
        mypackage = { local = "./my-package" }

        [environments]
        my_custom_env = { graphql = "https://example.com/graphql" }
        "#;

        let result = parse_gen_manifest(manifest_str);
        assert!(result.is_err());
        let err_str = format!("{:?}", result.unwrap_err());
        assert!(err_str.contains("must specify a chain-id"), "Expected error about chain-id, got: {}", err_str);
    }

    #[test]
    fn test_config_environment_must_exist() {
        let manifest_str = r#"
        [config]
        environment = "nonexistent"

        [packages]
        mypackage = { local = "./my-package" }
        "#;

        let result = parse_gen_manifest(manifest_str);
        assert!(result.is_err());
        assert!(result.unwrap_err().to_string().contains("not found"));
    }

    #[test]
    fn test_parse_env_scoped_dep_replacements() {
        let manifest_str = r#"
        [config]
        environment = "testnet_alt"

        [packages]
        pkg_toplevel = { local = "./pkg_toplevel" }

        [environments]
        testnet_alt = "4c78adac"

        [dep-replacements.testnet_alt]
        pkg_transitive = { local = "../other", use-environment = "testnet" }
        pkg_addresses = { published-at = "0x123", original-id = "0x456" }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        assert_eq!(act.dep_replacements.len(), 1);
        let env_replacements = act.dep_replacements.get("testnet_alt").unwrap();
        assert_eq!(env_replacements.len(), 2);

        // Check pkg_transitive replacement
        let pkg_transitive = env_replacements.get(&PackageName::new("pkg_transitive").unwrap()).unwrap();
        assert!(pkg_transitive.dependency.is_some());
        assert_eq!(pkg_transitive.use_environment, Some("testnet".to_string()));

        // Check pkg_addresses replacement
        let pkg_addresses = env_replacements.get(&PackageName::new("pkg_addresses").unwrap()).unwrap();
        assert!(pkg_addresses.dependency.is_none());
        assert_eq!(pkg_addresses.published_at, Some("0x123".to_string()));
        assert_eq!(pkg_addresses.original_id, Some("0x456".to_string()));
    }

    #[test]
    fn test_parse_dep_replacement_with_rename_from() {
        let manifest_str = r#"
        [config]
        environment = "custom"

        [packages]
        mypackage = { local = "./my-package" }

        [environments]
        custom = "deadbeef"

        [dep-replacements.custom]
        NewName = { local = "../other", rename-from = "OldName" }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        let env_replacements = act.dep_replacements.get("custom").unwrap();
        let replacement = env_replacements.get(&PackageName::new("NewName").unwrap()).unwrap();
        assert_eq!(replacement.rename_from, Some("OldName".to_string()));
    }

    #[test]
    fn test_parse_dep_replacement_with_override() {
        let manifest_str = r#"
        [config]
        environment = "custom"

        [packages]
        mypackage = { local = "./my-package" }

        [environments]
        custom = "deadbeef"

        [dep-replacements.custom]
        some_pkg = { git = "https://example.com/repo.git", rev = "main", override = true }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        let env_replacements = act.dep_replacements.get("custom").unwrap();
        let replacement = env_replacements.get(&PackageName::new("some_pkg").unwrap()).unwrap();
        assert!(replacement.is_override);
        assert!(replacement.dependency.is_some());
    }

    #[test]
    fn test_dep_replacements_requires_table() {
        // When using [dep-replacements.env], TOML naturally creates nested structure
        // But if someone writes just [dep-replacements] with packages directly,
        // it will try to parse them as environment sub-tables and fail
        let manifest_str = r#"
        [config]
        environment = "mainnet"

        [packages]
        mypackage = { local = "./my-package" }

        [dep-replacements]
        some_pkg = { published-at = "0x123" }
        "#;

        let result = parse_gen_manifest(manifest_str);
        // This fails because "some_pkg" is parsed as an environment name,
        // and its value { published-at = "0x123" } is then parsed as package replacements.
        // Since "published-at" is a string, not a table, it fails to parse as a DepReplacement.
        assert!(result.is_err());
    }

    #[test]
    fn test_multiple_env_dep_replacements() {
        let manifest_str = r#"
        [config]
        environment = "staging"

        [packages]
        mypackage = { local = "./my-package" }

        [environments]
        staging = "11111111"
        production = "22222222"

        [dep-replacements.staging]
        dep_a = { published-at = "0xaaa" }

        [dep-replacements.production]
        dep_b = { published-at = "0xbbb" }
        "#;

        let act = parse_gen_manifest(manifest_str).unwrap();

        assert_eq!(act.dep_replacements.len(), 2);
        assert!(act.dep_replacements.contains_key("staging"));
        assert!(act.dep_replacements.contains_key("production"));

        let staging = act.dep_replacements.get("staging").unwrap();
        assert_eq!(staging.len(), 1);
        assert!(staging.contains_key(&PackageName::new("dep_a").unwrap()));

        let production = act.dep_replacements.get("production").unwrap();
        assert_eq!(production.len(), 1);
        assert!(production.contains_key(&PackageName::new("dep_b").unwrap()));
    }

    #[test]
    fn test_old_manifest_format_with_rpc() {
        let manifest_str = r#"
        [config]
        rpc = "https://fullnode.devnet.sui.io:443"

        [packages]
        AMM = { local = "../move/amm" }
        "#;

        let result = parse_gen_manifest(manifest_str);
        assert!(result.is_err());
        let err = result.unwrap_err().to_string();
        assert!(err.contains("outdated format"), "Expected outdated format error, got: {}", err);
        assert!(err.contains("'rpc' field"), "Expected mention of rpc field, got: {}", err);
        assert!(err.contains("github.com/kunalabs-io/sui-client-gen"), "Expected migration URL, got: {}", err);
    }

    #[test]
    fn test_old_manifest_format_with_id() {
        let manifest_str = r#"
        [config]
        environment = "mainnet"

        [packages]
        FooPackage = { id = "0x12345" }
        "#;

        let result = parse_gen_manifest(manifest_str);
        assert!(result.is_err());
        let err = result.unwrap_err().to_string();
        assert!(err.contains("outdated format"), "Expected outdated format error, got: {}", err);
        assert!(err.contains("'id' field"), "Expected mention of id field, got: {}", err);
        assert!(err.contains("github.com/kunalabs-io/sui-client-gen"), "Expected migration URL, got: {}", err);
    }

    #[test]
    fn test_old_manifest_format_with_both_indicators() {
        let manifest_str = r#"
        [config]
        rpc = "https://fullnode.devnet.sui.io:443"

        [packages]
        DeepBook = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/deepbook", rev = "releases/sui-v1.4.0-release" }
        AMM = { local = "../move/amm" }
        FooPackage = { id = "0x12345" }
        "#;

        let result = parse_gen_manifest(manifest_str);
        assert!(result.is_err());
        let err = result.unwrap_err().to_string();
        assert!(err.contains("outdated format"), "Expected outdated format error, got: {}", err);
        assert!(err.contains("'rpc' field"), "Expected mention of rpc field, got: {}", err);
        assert!(err.contains("'id' field"), "Expected mention of id field, got: {}", err);
    }
}
