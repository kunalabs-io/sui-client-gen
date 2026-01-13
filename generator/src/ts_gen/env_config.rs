//! Environment configuration generation.
//!
//! Generates TypeScript environment configuration files that contain package addresses
//! and type origins for runtime environment switching.

use indoc::formatdoc;
use std::collections::BTreeMap;

// ============================================================================
// Environment Config IR
// ============================================================================

/// IR for a single package's environment configuration.
#[derive(Debug, Clone)]
pub struct EnvPackageConfigIR {
    /// Kebab-case package name (matches folder structure)
    pub name: String,
    /// Original package ID
    pub original_id: String,
    /// Published-at address for function calls
    pub published_at: String,
    /// Type origins: "module::TypeName" -> defining address
    pub type_origins: BTreeMap<String, String>,
}

/// IR for a complete environment configuration.
#[derive(Debug, Clone)]
pub struct EnvConfigIR {
    /// Environment name (e.g., "mainnet", "testnet")
    pub env_name: String,
    /// Top-level package configs
    pub packages: Vec<EnvPackageConfigIR>,
    /// Dependency package configs
    pub dependencies: Vec<EnvPackageConfigIR>,
}

// ============================================================================
// Emission
// ============================================================================

impl EnvPackageConfigIR {
    /// Emit the TypeScript object literal for this package config.
    fn emit(&self) -> String {
        let type_origins = self.emit_type_origins();
        formatdoc! {r#"
            "{name}": {{
              originalId: '{original_id}',
              publishedAt: '{published_at}',
              typeOrigins: {type_origins},
            }}"#,
            name = self.name,
            original_id = self.original_id,
            published_at = self.published_at,
            type_origins = type_origins,
        }
    }

    fn emit_type_origins(&self) -> String {
        if self.type_origins.is_empty() {
            return "{}".to_string();
        }

        let entries: Vec<String> = self
            .type_origins
            .iter()
            .map(|(key, addr)| format!("      '{}': '{}'", key, addr))
            .collect();

        format!("{{\n{},\n    }}", entries.join(",\n"))
    }
}

impl EnvConfigIR {
    /// Emit the complete environment configuration TypeScript file.
    pub fn emit(&self) -> String {
        let packages = self.emit_section(&self.packages);
        let dependencies = self.emit_section(&self.dependencies);
        let var_name = to_camel_case(&self.env_name);

        formatdoc! {r#"
            import type {{ EnvConfig }} from '../_framework/env'

            export const {var_name}Env: EnvConfig = {{
              packages: {{
            {packages}
              }},
              dependencies: {{
            {dependencies}
              }},
            }}
        "#,
            var_name = var_name,
            packages = packages,
            dependencies = dependencies,
        }
    }

    fn emit_section(&self, configs: &[EnvPackageConfigIR]) -> String {
        if configs.is_empty() {
            return String::new();
        }

        configs
            .iter()
            .map(|c| indent(&c.emit(), 4))
            .collect::<Vec<_>>()
            .join(",\n")
            + ","
    }
}

/// Generate the _envs/index.ts file content.
/// This file registers environments, sets the default, and re-exports the env API.
pub fn gen_envs_index(env_names: &[String], default_env: &str) -> String {
    let env_imports: Vec<String> = env_names
        .iter()
        .map(|name| {
            let var_name = to_camel_case(name);
            format!("import {{ {}Env }} from './{}'", var_name, name)
        })
        .collect();

    let registrations: Vec<String> = env_names
        .iter()
        .map(|name| {
            let var_name = to_camel_case(name);
            format!("  registerEnv('{}', {}Env)", name, var_name)
        })
        .collect();

    let env_exports: Vec<String> = env_names
        .iter()
        .map(|name| format!("export * from './{}'", name))
        .collect();

    formatdoc! {r#"
        // Re-export environment configs
        {env_exports}

        // Import internal functions and env configs
        import {{ registerEnv, setActiveEnv }} from '../_framework/env'
        {env_imports}

        // Initialize environments (runs once on first import)
        let initialized = false
        if (!initialized) {{
        {registrations}
          setActiveEnv('{default_env}')
          initialized = true
        }}

        // Re-export public API from _framework/env
        export {{
          setActiveEnv,
          setActiveEnvWithConfig,
          getActiveEnv,
          getActiveEnvName,
          getRegisteredEnvs,
          getPackageConfig,
          getDependencyConfig,
          getPublishedAt,
          getTypeOrigin,
          getTypeOriginAddresses,
          getTypeOriginAddressesFor,
          getOriginalId,
        }} from '../_framework/env'
        export type {{ EnvConfig, PackageConfig }} from '../_framework/env'
    "#,
        env_exports = env_exports.join("\n"),
        env_imports = env_imports.join("\n"),
        registrations = registrations.join("\n"),
        default_env = default_env,
    }
}

// ============================================================================
// Helpers
// ============================================================================

/// Convert a kebab-case or snake_case string to camelCase.
fn to_camel_case(s: &str) -> String {
    let mut result = String::new();
    let mut capitalize_next = false;

    for c in s.chars() {
        if c == '-' || c == '_' {
            capitalize_next = true;
        } else if capitalize_next {
            result.push(c.to_ascii_uppercase());
            capitalize_next = false;
        } else {
            result.push(c);
        }
    }

    result
}

/// Indent each line of a string by the given number of spaces.
fn indent(s: &str, spaces: usize) -> String {
    let prefix = " ".repeat(spaces);
    s.lines()
        .map(|line| {
            if line.is_empty() {
                line.to_string()
            } else {
                format!("{}{}", prefix, line)
            }
        })
        .collect::<Vec<_>>()
        .join("\n")
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_to_camel_case() {
        assert_eq!(to_camel_case("mainnet"), "mainnet");
        assert_eq!(to_camel_case("testnet"), "testnet");
        assert_eq!(to_camel_case("my-custom-env"), "myCustomEnv");
        assert_eq!(to_camel_case("my_custom_env"), "myCustomEnv");
    }

    #[test]
    fn test_env_package_config_emit() {
        let config = EnvPackageConfigIR {
            name: "my-package".to_string(),
            original_id: "0xabc".to_string(),
            published_at: "0xdef".to_string(),
            type_origins: BTreeMap::from([
                ("main::Foo".to_string(), "0xabc".to_string()),
                ("main::Bar".to_string(), "0xdef".to_string()),
            ]),
        };

        let output = config.emit();
        assert!(output.contains("\"my-package\""));
        assert!(output.contains("originalId: '0xabc'"));
        assert!(output.contains("publishedAt: '0xdef'"));
        assert!(output.contains("'main::Bar': '0xdef'"));
        assert!(output.contains("'main::Foo': '0xabc'"));
    }

    #[test]
    fn test_env_config_emit() {
        let config = EnvConfigIR {
            env_name: "testnet".to_string(),
            packages: vec![EnvPackageConfigIR {
                name: "examples".to_string(),
                original_id: "0x123".to_string(),
                published_at: "0x456".to_string(),
                type_origins: BTreeMap::from([("main::Struct".to_string(), "0x123".to_string())]),
            }],
            dependencies: vec![EnvPackageConfigIR {
                name: "sui".to_string(),
                original_id: "0x2".to_string(),
                published_at: "0x2".to_string(),
                type_origins: BTreeMap::from([("object::UID".to_string(), "0x2".to_string())]),
            }],
        };

        let output = config.emit();
        assert!(output.contains("export const testnetEnv: EnvConfig"));
        assert!(output.contains("packages:"));
        assert!(output.contains("dependencies:"));
        assert!(output.contains("\"examples\""));
        assert!(output.contains("\"sui\""));
    }

    #[test]
    fn test_gen_envs_index() {
        let output = gen_envs_index(&["mainnet".to_string(), "testnet".to_string()], "mainnet");

        // Check env config imports
        assert!(output.contains("import { mainnetEnv } from './mainnet'"));
        assert!(output.contains("import { testnetEnv } from './testnet'"));
        // Check internal function imports from _framework/env
        assert!(output.contains("import { registerEnv, setActiveEnv } from '../_framework/env'"));
        // Check registrations
        assert!(output.contains("registerEnv('mainnet', mainnetEnv)"));
        assert!(output.contains("registerEnv('testnet', testnetEnv)"));
        assert!(output.contains("setActiveEnv('mainnet')"));
        // Check re-exports
        assert!(output.contains("export * from './mainnet'"));
        assert!(output.contains("export * from './testnet'"));
        // Check public API re-exports
        assert!(output.contains("getPublishedAt"));
        assert!(output.contains("getTypeOrigin"));
        assert!(output.contains("setActiveEnvWithConfig"));
        // Check init guard
        assert!(output.contains("let initialized = false"));
    }
}
