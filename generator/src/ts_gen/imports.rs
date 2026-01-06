//! Unified import management and path resolution for TypeScript code generation.
//!
//! This module consolidates all import-related logic:
//! - `TsImportsBuilder`: Build and emit TypeScript import statements
//! - `ImportPathResolver`: Compute import paths between modules

use std::collections::{BTreeMap, BTreeSet};

use move_core_types::account_address::AccountAddress;
use move_symbol_pool::Symbol;

use super::utils::module_import_name;

// ============================================================================
// TsImportsBuilder - Unified import statement builder
// ============================================================================

/// A single named import entry.
#[derive(Debug, Clone, PartialEq, Eq, PartialOrd, Ord)]
pub struct NamedImport {
    /// The exported name from the module
    pub name: String,
    /// Optional alias (for `import { X as Y }`)
    pub alias: Option<String>,
}

impl NamedImport {
    pub fn new(name: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            alias: None,
        }
    }

    pub fn with_alias(name: impl Into<String>, alias: impl Into<String>) -> Self {
        Self {
            name: name.into(),
            alias: Some(alias.into()),
        }
    }

    /// Get the name to use in code (alias if present, otherwise name).
    #[allow(dead_code)]
    pub fn use_name(&self) -> &str {
        self.alias.as_deref().unwrap_or(&self.name)
    }

    fn emit(&self) -> String {
        match &self.alias {
            Some(a) => format!("{} as {}", self.name, a),
            None => self.name.clone(),
        }
    }
}

/// Builder for TypeScript import statements.
///
/// Features:
/// - Groups named imports by path (single `import { ... } from 'path'` per path)
/// - Supports wildcard imports (`import * as X from 'path'`)
/// - Stable ordering: paths sorted alphabetically, names sorted within each path
/// - Automatic deduplication
///
/// # Example
/// ```ignore
/// let mut imports = TsImportsBuilder::new();
/// imports.add_named("./reified", "ToField");
/// imports.add_named("./reified", "Reified");
/// imports.add_wildcard("./coin/structs", "coin");
/// println!("{}", imports.emit());
/// // Output:
/// // import * as coin from './coin/structs'
/// // import { Reified, ToField } from './reified'
/// ```
#[derive(Debug, Default)]
pub struct TsImportsBuilder {
    /// Named imports grouped by module path
    named: BTreeMap<String, BTreeSet<NamedImport>>,
    /// Wildcard imports: path -> alias
    wildcard: BTreeMap<String, String>,
}

impl TsImportsBuilder {
    pub fn new() -> Self {
        Self::default()
    }

    /// Add a named import. Returns the name to use in code.
    pub fn add_named(&mut self, path: impl Into<String>, name: impl Into<String>) -> String {
        let name = name.into();
        let import = NamedImport::new(name.clone());
        self.named.entry(path.into()).or_default().insert(import);
        name
    }

    /// Add a named import with an alias. Returns the alias to use in code.
    pub fn add_named_as(
        &mut self,
        path: impl Into<String>,
        name: impl Into<String>,
        alias: impl Into<String>,
    ) -> String {
        let alias = alias.into();
        let import = NamedImport::with_alias(name, alias.clone());
        self.named.entry(path.into()).or_default().insert(import);
        alias
    }

    /// Add multiple named imports from the same path.
    pub fn add_named_many(&mut self, path: impl Into<String>, names: &[&str]) {
        let entry = self.named.entry(path.into()).or_default();
        for name in names {
            entry.insert(NamedImport::new(*name));
        }
    }

    /// Add a wildcard import (`import * as alias from 'path'`). Returns the alias.
    pub fn add_wildcard(&mut self, path: impl Into<String>, alias: impl Into<String>) -> String {
        let alias = alias.into();
        self.wildcard.insert(path.into(), alias.clone());
        alias
    }

    /// Check if any imports have been added.
    pub fn is_empty(&self) -> bool {
        self.named.is_empty() && self.wildcard.is_empty()
    }

    /// Emit all import statements as a formatted string.
    ///
    /// Order:
    /// 1. Wildcard imports (sorted by path)
    /// 2. Named imports (sorted by path, names sorted within each)
    pub fn emit(&self) -> String {
        let mut lines = Vec::new();

        // Emit wildcard imports first (sorted by path)
        for (path, alias) in &self.wildcard {
            lines.push(format!("import * as {} from '{}'", alias, path));
        }

        // Emit named imports (sorted by path)
        for (path, imports) in &self.named {
            if imports.is_empty() {
                continue;
            }
            let names: Vec<String> = imports.iter().map(|i| i.emit()).collect();

            // Use multi-line format for many imports
            if names.len() > 3 {
                lines.push(format!(
                    "import {{\n  {}\n}} from '{}'",
                    names.join(",\n  "),
                    path
                ));
            } else {
                lines.push(format!("import {{ {} }} from '{}'", names.join(", "), path));
            }
        }

        lines.join("\n")
    }

    /// Emit with a trailing newline if non-empty.
    pub fn emit_with_newline(&self) -> String {
        if self.is_empty() {
            String::new()
        } else {
            self.emit() + "\n"
        }
    }
}

// ============================================================================
// ImportPathResolver - Compute import paths between modules
// ============================================================================

/// Resolves import paths between modules.
///
/// Consolidates the path resolution logic that was duplicated across
/// `StructIRBuilder`, `EnumIRBuilder`, and `FunctionIRBuilder`.
#[derive(Debug, Clone)]
pub struct ImportPathResolver {
    /// Current package address
    package_address: AccountAddress,
    /// Current module name
    module_name: Symbol,
    /// Map of all package addresses to their folder names
    folder_names: BTreeMap<AccountAddress, String>,
    /// Map of top-level package addresses to their names
    top_level_pkg_names: BTreeMap<AccountAddress, Symbol>,
    /// Whether current package is top-level
    is_top_level: bool,
}

impl ImportPathResolver {
    pub fn new(
        package_address: AccountAddress,
        module_name: Symbol,
        folder_names: BTreeMap<AccountAddress, String>,
        top_level_pkg_names: BTreeMap<AccountAddress, Symbol>,
        is_top_level: bool,
    ) -> Self {
        Self {
            package_address,
            module_name,
            folder_names,
            top_level_pkg_names,
            is_top_level,
        }
    }

    /// Get the import path to a module's structs.ts file.
    ///
    /// Returns `None` if the target is the same module (no import needed).
    pub fn path_to_structs(
        &self,
        target_pkg_addr: AccountAddress,
        target_mod_name: Symbol,
    ) -> Option<String> {
        self.path_to_module(target_pkg_addr, target_mod_name, "structs")
    }

    /// Get the import path to a module's functions.ts file.
    pub fn path_to_functions(
        &self,
        target_pkg_addr: AccountAddress,
        target_mod_name: Symbol,
    ) -> Option<String> {
        self.path_to_module(target_pkg_addr, target_mod_name, "functions")
    }

    /// Get the folder name for a package address.
    fn get_folder_name(&self, pkg_addr: &AccountAddress) -> &str {
        self.folder_names
            .get(pkg_addr)
            .map(|s| s.as_str())
            .unwrap_or_else(|| {
                panic!(
                    "Missing folder name for package {}",
                    pkg_addr.to_hex_literal()
                )
            })
    }

    /// Get the import path to a module file (structs.ts, functions.ts, etc).
    fn path_to_module(
        &self,
        target_pkg_addr: AccountAddress,
        target_mod_name: Symbol,
        file_name: &str,
    ) -> Option<String> {
        let mod_import_name = module_import_name(target_mod_name);

        // Same module - no import needed
        if target_pkg_addr == self.package_address && target_mod_name == self.module_name {
            return None;
        }

        // Same package, different module
        if target_pkg_addr == self.package_address {
            return Some(format!("../{}/{}", mod_import_name, file_name));
        }

        // Different package - check if it's top-level
        let target_is_top_level = self.top_level_pkg_names.contains_key(&target_pkg_addr);
        let target_folder_name = self.get_folder_name(&target_pkg_addr);

        if self.is_top_level && target_is_top_level {
            // Both are top-level packages
            Some(format!(
                "../../{}/{}/{}",
                target_folder_name, mod_import_name, file_name
            ))
        } else if self.is_top_level {
            // Current is top-level, target is a dependency
            Some(format!(
                "../../_dependencies/{}/{}/{}",
                target_folder_name, mod_import_name, file_name
            ))
        } else if target_is_top_level {
            // Current is a dependency, target is top-level
            Some(format!(
                "../../../{}/{}/{}",
                target_folder_name, mod_import_name, file_name
            ))
        } else {
            // Both are dependencies - siblings in _dependencies/
            Some(format!(
                "../../{}/{}/{}",
                target_folder_name, mod_import_name, file_name
            ))
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_ts_imports_builder_basic() {
        let mut imports = TsImportsBuilder::new();
        imports.add_named("./reified", "ToField");
        imports.add_named("./reified", "Reified");
        imports.add_wildcard("./coin/structs", "coin");

        let output = imports.emit();
        assert!(output.contains("import * as coin from './coin/structs'"));
        assert!(output.contains("import { Reified, ToField } from './reified'"));
    }

    #[test]
    fn test_ts_imports_builder_dedup() {
        let mut imports = TsImportsBuilder::new();
        imports.add_named("./mod", "Foo");
        imports.add_named("./mod", "Foo"); // Duplicate
        imports.add_named("./mod", "Bar");

        let output = imports.emit();
        assert_eq!(output, "import { Bar, Foo } from './mod'");
    }

    #[test]
    fn test_ts_imports_builder_aliases() {
        let mut imports = TsImportsBuilder::new();
        imports.add_named_as("./strings", "String", "AsciiString");
        imports.add_named("./strings", "Bytes");

        let output = imports.emit();
        assert!(output.contains("Bytes"));
        assert!(output.contains("String as AsciiString"));
    }
}
