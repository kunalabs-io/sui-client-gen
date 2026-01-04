//! Generator manifest (gen.toml) parsing.
//!
//! Uses `move_package_alt` types for dependency representation.

use anyhow::{bail, Context, Result};
use std::collections::BTreeMap;
use std::path::Path;

use move_package_alt::schema::{ManifestDependencyInfo, PackageName};

const PACKAGES_NAME: &str = "packages";
const CONFIG_NAME: &str = "config";

/// Package dependencies - maps package name to its dependency specification.
/// Only source dependencies (local/git) are supported.
pub type Packages = BTreeMap<PackageName, ManifestDependencyInfo>;

/// Configuration for the code generator.
#[derive(Debug, Clone, Eq, PartialEq)]
pub struct Config {
    /// GraphQL endpoint URL for querying type origins. Optional, uses default if not specified.
    pub graphql: Option<String>,
    /// Environment name to use (e.g., "testnet", "mainnet"). Required.
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

            Ok(GenManifest { config, packages })
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
}
