//! Unified import management and path resolution for TypeScript code generation.
//!
//! This module consolidates all import-related logic:
//! - `TsImportsBuilder`: Build and emit TypeScript import statements
//! - `GenContext`: Generation context with pre-computed paths
//! - `ImportPathResolver`: Compute import paths between modules

use std::collections::{BTreeMap, BTreeSet, HashMap};

use convert_case::{Case, Casing};
use move_core_types::account_address::AccountAddress;
use move_symbol_pool::Symbol;

use super::utils::{module_import_name, package_import_name};

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
// GenContext - Generation context with pre-computed paths
// ============================================================================

/// Context for generating TypeScript files.
///
/// Replaces scattered `levels_from_root` arithmetic with pre-computed paths.
/// Each file type gets its own context with the correct paths.
#[derive(Debug, Clone)]
pub struct GenContext {
    /// Import path to the _framework directory (e.g., "../../_framework")
    pub framework_path: String,
    /// Import path to the package index (e.g., "..")
    pub package_index_path: String,
    /// Whether this is a source package (vs onchain)
    pub is_source: bool,
    /// Whether this is a top-level package (vs dependency)
    pub is_top_level: bool,
    /// Path resolver for cross-module imports
    pub resolver: ImportPathResolver,
}

impl GenContext {
    /// Create a context for a structs.ts/enums.ts file.
    ///
    /// These files are at `<package>/<module>/structs.ts`, so:
    /// - framework is at `../../_framework`
    /// - package index is at `..`
    pub fn for_structs_file(
        package_address: AccountAddress,
        module_name: Symbol,
        top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
        is_source: bool,
    ) -> Self {
        let is_top_level = top_level_pkg_names.contains_key(&package_address);
        // structs.ts is at <pkg>/<module>/structs.ts = 2 levels from root
        let levels = if is_top_level { 2 } else { 4 }; // deps are at _dependencies/<source|onchain>/<addr>/<module>

        Self {
            framework_path: Self::make_framework_path(levels),
            package_index_path: "..".to_string(),
            is_source,
            is_top_level,
            resolver: ImportPathResolver::new(
                package_address,
                module_name,
                top_level_pkg_names.clone(),
                is_source,
                is_top_level,
            ),
        }
    }

    /// Create a context for a functions.ts file.
    ///
    /// These files are at `<package>/<module>/functions.ts`, so same as structs.
    pub fn for_functions_file(
        package_address: AccountAddress,
        module_name: Symbol,
        top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
        is_source: bool,
    ) -> Self {
        // Same as structs file
        Self::for_structs_file(package_address, module_name, top_level_pkg_names, is_source)
    }

    /// Create a context for an init.ts file.
    ///
    /// These files are at `<package>/init.ts`, so:
    /// - framework is at `../_framework` for top-level, `../../../_framework` for deps
    /// - package index is at `.`
    pub fn for_init_file(
        package_address: AccountAddress,
        top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
        is_source: bool,
    ) -> Self {
        let is_top_level = top_level_pkg_names.contains_key(&package_address);
        let levels = if is_top_level { 1 } else { 3 };

        Self {
            framework_path: Self::make_framework_path(levels),
            package_index_path: ".".to_string(),
            is_source,
            is_top_level,
            resolver: ImportPathResolver::new(
                package_address,
                Symbol::from(""), // Not used for init files
                top_level_pkg_names.clone(),
                is_source,
                is_top_level,
            ),
        }
    }

    fn make_framework_path(levels: usize) -> String {
        if levels == 0 {
            "./_framework".to_string()
        } else {
            (0..levels).map(|_| "..").collect::<Vec<_>>().join("/") + "/_framework"
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
    /// Map of top-level package addresses to their names
    top_level_pkg_names: BTreeMap<AccountAddress, Symbol>,
    /// Whether generating source deps (vs onchain)
    is_source: bool,
    /// Whether current package is top-level
    is_top_level: bool,
}

impl ImportPathResolver {
    pub fn new(
        package_address: AccountAddress,
        module_name: Symbol,
        top_level_pkg_names: BTreeMap<AccountAddress, Symbol>,
        is_source: bool,
        is_top_level: bool,
    ) -> Self {
        Self {
            package_address,
            module_name,
            top_level_pkg_names,
            is_source,
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

        if self.is_top_level && target_is_top_level {
            // Both are top-level packages
            let target_pkg_name =
                package_import_name(*self.top_level_pkg_names.get(&target_pkg_addr).unwrap());
            Some(format!(
                "../../{}/{}/{}",
                target_pkg_name, mod_import_name, file_name
            ))
        } else if self.is_top_level {
            // Current is top-level, target is a dependency
            let dep_dir = if self.is_source { "source" } else { "onchain" };
            Some(format!(
                "../../_dependencies/{}/{}/{}/{}",
                dep_dir,
                target_pkg_addr.to_hex_literal(),
                mod_import_name,
                file_name
            ))
        } else if target_is_top_level {
            // Current is a dependency, target is top-level
            let target_pkg_name =
                package_import_name(*self.top_level_pkg_names.get(&target_pkg_addr).unwrap());
            Some(format!(
                "../../../../{}/{}/{}",
                target_pkg_name, mod_import_name, file_name
            ))
        } else {
            // Both are dependencies - sibling in same _dependencies/<source|onchain>/ dir
            Some(format!(
                "../../{}/{}/{}",
                target_pkg_addr.to_hex_literal(),
                mod_import_name,
                file_name
            ))
        }
    }
}

// ============================================================================
// DatatypeImportTracker - Track imports for structs/enums with alias handling
// ============================================================================

/// Tracks datatype (struct/enum) imports with automatic alias generation for conflicts.
///
/// This consolidates the import tracking logic from the IR builders.
/// TODO: Consider using this to replace the per-builder import tracking in StructIRBuilder etc.
#[derive(Debug, Default)]
#[allow(dead_code)]
pub struct DatatypeImportTracker {
    /// Map from use-name (alias or class name) to import info
    imports: HashMap<String, DatatypeImportEntry>,
}

/// An entry in the datatype import tracker.
#[derive(Debug, Clone)]
#[allow(dead_code)]
pub struct DatatypeImportEntry {
    /// The actual class name being imported
    pub class_name: String,
    /// The import path
    pub path: String,
    /// Optional alias if there's a name conflict
    pub alias: Option<String>,
}

#[allow(dead_code)]
impl DatatypeImportTracker {
    pub fn new() -> Self {
        Self::default()
    }

    /// Add an import, generating an alias if there's a name conflict.
    ///
    /// Returns the name to use in code (alias if generated, otherwise class_name).
    pub fn add(&mut self, class_name: String, path: String) -> String {
        // Check if we already have this exact import
        if let Some(existing) = self.imports.get(&class_name) {
            if existing.path == path {
                // Same import, reuse
                return class_name;
            }
            // Name conflict - generate an alias
            let module_suffix = path
                .rsplit('/')
                .nth(1)
                .unwrap_or("unknown")
                .replace('-', "_")
                .to_case(Case::Pascal);
            let alias = format!("{}{}", class_name, module_suffix);

            self.imports.insert(
                alias.clone(),
                DatatypeImportEntry {
                    class_name: class_name.clone(),
                    path,
                    alias: Some(alias.clone()),
                },
            );
            return alias;
        }

        // No conflict, add normally
        self.imports.insert(
            class_name.clone(),
            DatatypeImportEntry {
                class_name: class_name.clone(),
                path,
                alias: None,
            },
        );
        class_name
    }

    /// Get all imports.
    pub fn imports(&self) -> impl Iterator<Item = &DatatypeImportEntry> {
        self.imports.values()
    }

    /// Emit import statements grouped by path.
    pub fn emit(&self) -> String {
        // Group by path
        let mut by_path: BTreeMap<&str, Vec<(&str, Option<&str>)>> = BTreeMap::new();
        for entry in self.imports.values() {
            by_path
                .entry(&entry.path)
                .or_default()
                .push((&entry.class_name, entry.alias.as_deref()));
        }

        // Emit
        let mut lines = Vec::new();
        for (path, mut names) in by_path {
            // Sort by class name for stable output
            names.sort_by_key(|(name, _)| *name);

            let imports: Vec<String> = names
                .iter()
                .map(|(name, alias)| match alias {
                    Some(a) => format!("{} as {}", name, a),
                    None => name.to_string(),
                })
                .collect();

            lines.push(format!(
                "import {{ {} }} from '{}'",
                imports.join(", "),
                path
            ));
        }

        lines.join("\n")
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

    #[test]
    fn test_datatype_import_tracker_conflict() {
        let mut tracker = DatatypeImportTracker::new();

        let name1 = tracker.add("String".to_string(), "../string/structs".to_string());
        let name2 = tracker.add("String".to_string(), "../ascii/structs".to_string());

        assert_eq!(name1, "String");
        assert_eq!(name2, "StringAscii");
    }
}
