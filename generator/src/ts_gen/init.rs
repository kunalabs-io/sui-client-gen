//! Init file generation (init.ts, init-loader.ts).

use std::collections::BTreeMap;

use convert_case::{Case, Casing};
use indoc::formatdoc;
use move_core_types::account_address::AccountAddress;
use move_model_2::model;
use move_model_2::source_kind::SourceKind;
use move_symbol_pool::Symbol;

use super::utils::{module_import_name, package_import_name, JS_RESERVED_WORDS};

// ============================================================================
// Package Init IR (for init.ts files)
// ============================================================================

/// A single struct registration for init.ts.
#[derive(Debug, Clone)]
struct StructRegistration {
    /// Import path for the module (e.g., "./balance/structs")
    import_path: String,
    /// Alias used for the module import (e.g., "balance")
    module_alias: String,
    /// Name of the struct to register (e.g., "Balance")
    struct_name: String,
}

/// Domain-focused IR for a package's init.ts file.
/// Captures *what* to register, not *how* to write it.
pub struct PackageInitIR {
    /// Path to the framework loader (e.g., "../_framework")
    framework_path: String,
    /// List of structs to register
    registrations: Vec<StructRegistration>,
}

impl PackageInitIR {
    /// Build the IR from a Move package.
    pub fn from_package<HasSource: SourceKind>(
        pkg: &model::Package<HasSource>,
        framework_path: &str,
    ) -> Self {
        let mut registrations = Vec::new();

        for mod_ in pkg.modules() {
            let structs: Vec<_> = mod_.structs().collect();
            if structs.is_empty() {
                continue;
            }

            // Use the proper module import name (snake -> kebab)
            let import_path = format!("./{}/structs", module_import_name(mod_.name()));

            // Generate import alias for this module (snake -> camel)
            let module_name = mod_.name().to_string();
            let mut alias = module_name.from_case(Case::Snake).to_case(Case::Camel);
            if JS_RESERVED_WORDS.contains(&alias.as_str()) {
                alias.push('_');
            }

            for strct in structs {
                registrations.push(StructRegistration {
                    import_path: import_path.clone(),
                    module_alias: alias.clone(),
                    struct_name: strct.name().to_string(),
                });
            }
        }

        PackageInitIR {
            framework_path: framework_path.to_string(),
            registrations,
        }
    }

    /// Emit as TypeScript code.
    pub fn emit(&self) -> String {
        // Collect unique module imports (path -> alias)
        let mut module_imports: Vec<(String, String)> = Vec::new();
        let mut seen_paths = std::collections::HashSet::new();

        for reg in &self.registrations {
            if seen_paths.insert(reg.import_path.clone()) {
                module_imports.push((reg.module_alias.clone(), reg.import_path.clone()));
            }
        }

        // Sort imports alphabetically by path (to match genco's behavior)
        module_imports.sort_by(|a, b| a.1.cmp(&b.1));

        // Build import lines
        let import_lines: Vec<String> = module_imports
            .iter()
            .map(|(alias, path)| format!("import * as {} from '{}'", alias, path))
            .collect();

        // Build registration lines
        let registration_lines: Vec<String> = self
            .registrations
            .iter()
            .map(|reg| {
                format!(
                    "  loader.register({}.{})",
                    reg.module_alias, reg.struct_name
                )
            })
            .collect();

        formatdoc! {"
            {imports}
            import {{ StructClassLoader }} from '{framework}/loader'

            export function registerClasses(loader: StructClassLoader) {{
            {registrations}
            }}
        ",
            imports = import_lines.join("\n"),
            framework = self.framework_path,
            registrations = registration_lines.join("\n"),
        }
    }
}

// ============================================================================
// Init Loader IR (for _framework/init-loader.ts)
// ============================================================================

/// Domain-focused IR for the init-loader.ts file.
pub struct InitLoaderIR {
    /// Packages to register from source builds
    source_packages: Vec<PackageRef>,
    /// Packages to register from on-chain builds
    onchain_packages: Vec<PackageRef>,
}

/// Reference to a package for registration.
struct PackageRef {
    /// Import path to the package's init.ts
    import_path: String,
    /// Import alias (e.g., "package_source_1")
    alias: String,
}

impl InitLoaderIR {
    /// Build the IR from package information.
    pub fn new(
        source_pkgs_info: Option<(Vec<AccountAddress>, &BTreeMap<AccountAddress, Symbol>)>,
        onchain_pkgs_info: Option<(Vec<AccountAddress>, &BTreeMap<AccountAddress, Symbol>)>,
    ) -> Self {
        let build_refs = |pkg_ids: &[AccountAddress],
                          top_level: &BTreeMap<AccountAddress, Symbol>,
                          is_source: bool|
         -> Vec<PackageRef> {
            pkg_ids
                .iter()
                .map(|pkg_id| {
                    let import_path = match top_level.get(pkg_id) {
                        Some(pkg_name) => format!("../{}/init", package_import_name(*pkg_name)),
                        None => {
                            let dep_dir = if is_source { "source" } else { "onchain" };
                            format!(
                                "../_dependencies/{}/{}/init",
                                dep_dir,
                                pkg_id.to_hex_literal()
                            )
                        }
                    };

                    let prefix = if is_source {
                        "package_source"
                    } else {
                        "package_onchain"
                    };
                    let alias = format!("{}_{}", prefix, pkg_id.short_str_lossless());

                    PackageRef { import_path, alias }
                })
                .collect()
        };

        InitLoaderIR {
            source_packages: source_pkgs_info
                .map(|(ids, top_level)| build_refs(&ids, top_level, true))
                .unwrap_or_default(),
            onchain_packages: onchain_pkgs_info
                .map(|(ids, top_level)| build_refs(&ids, top_level, false))
                .unwrap_or_default(),
        }
    }

    /// Emit as TypeScript code.
    pub fn emit(&self) -> String {
        let mut sections = Vec::new();

        // Build imports - sorted alphabetically by import path
        let mut all_refs: Vec<&PackageRef> = self
            .source_packages
            .iter()
            .chain(self.onchain_packages.iter())
            .collect();
        all_refs.sort_by(|a, b| a.import_path.cmp(&b.import_path));

        let mut import_lines: Vec<String> = all_refs
            .iter()
            .map(|r| format!("import * as {} from '{}'", r.alias, r.import_path))
            .collect();

        // Add the framework import on the same block (no blank line)
        import_lines.push("import { StructClassLoader } from './loader'".to_string());

        sections.push(import_lines.join("\n"));

        // Generate registerClassesSource if we have source packages
        if !self.source_packages.is_empty() {
            let calls: Vec<String> = self
                .source_packages
                .iter()
                .map(|r| format!("  {}.registerClasses(loader)", r.alias))
                .collect();

            sections.push(formatdoc! {"
                function registerClassesSource(loader: StructClassLoader) {{
                {calls}
                }}",
                calls = calls.join("\n"),
            });
        }

        // Generate registerClassesOnchain if we have onchain packages
        if !self.onchain_packages.is_empty() {
            let calls: Vec<String> = self
                .onchain_packages
                .iter()
                .map(|r| format!("  {}.registerClasses(loader)", r.alias))
                .collect();

            sections.push(formatdoc! {"
                function registerClassesOnchain(loader: StructClassLoader) {{
                {calls}
                }}",
                calls = calls.join("\n"),
            });
        }

        // Generate main registerClasses function
        let main_body = self.emit_main_body();
        let param_name = if self.source_packages.is_empty() && self.onchain_packages.is_empty() {
            "_"
        } else {
            "loader"
        };

        sections.push(formatdoc! {"
            export function registerClasses({param}: StructClassLoader) {{
            {body}
            }}",
            param = param_name,
            body = main_body,
        });

        sections.join("\n\n") + "\n"
    }

    fn emit_main_body(&self) -> String {
        let mut lines = Vec::new();

        // Onchain first, then source (matches original behavior)
        if !self.onchain_packages.is_empty() {
            lines.push("  registerClassesOnchain(loader)");
        }
        if !self.source_packages.is_empty() {
            lines.push("  registerClassesSource(loader)");
        }

        lines.join("\n")
    }
}

// ============================================================================
// Public API
// ============================================================================

/// Generate init.ts for a package.
pub fn gen_package_init<HasSource: SourceKind>(
    pkg: &model::Package<HasSource>,
    framework_rel_path: &str,
) -> String {
    PackageInitIR::from_package(pkg, framework_rel_path).emit()
}

/// Generate _framework/init-loader.ts.
pub fn gen_init_loader(
    source_pkgs_info: Option<(Vec<AccountAddress>, &BTreeMap<AccountAddress, Symbol>)>,
    onchain_pkgs_info: Option<(Vec<AccountAddress>, &BTreeMap<AccountAddress, Symbol>)>,
) -> String {
    InitLoaderIR::new(source_pkgs_info, onchain_pkgs_info).emit()
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_init_loader_empty() {
        let output = gen_init_loader(None, None);
        assert!(output.contains("export function registerClasses"));
        assert!(output.contains("_: StructClassLoader"));
    }

    #[test]
    fn test_package_init_ir_emit() {
        let ir = PackageInitIR {
            framework_path: "../_framework".to_string(),
            registrations: vec![
                StructRegistration {
                    import_path: "./balance/structs".to_string(),
                    module_alias: "balance".to_string(),
                    struct_name: "Balance".to_string(),
                },
                StructRegistration {
                    import_path: "./balance/structs".to_string(),
                    module_alias: "balance".to_string(),
                    struct_name: "Supply".to_string(),
                },
                StructRegistration {
                    import_path: "./coin/structs".to_string(),
                    module_alias: "coin".to_string(),
                    struct_name: "Coin".to_string(),
                },
            ],
        };

        let output = ir.emit();
        assert!(output.contains("import * as balance from './balance/structs'"));
        assert!(output.contains("import * as coin from './coin/structs'"));
        assert!(output.contains("loader.register(balance.Balance)"));
        assert!(output.contains("loader.register(balance.Supply)"));
        assert!(output.contains("loader.register(coin.Coin)"));
    }
}
