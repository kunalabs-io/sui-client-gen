//! Output directory layout structures.
//!
//! This module provides structured representations for the output directory hierarchy,
//! centralizing path calculation logic.

use std::collections::BTreeMap;
use std::path::PathBuf;

use move_core_types::account_address::AccountAddress;
use move_package_alt::schema::PackageName;
use move_symbol_pool::Symbol;

use crate::ts_gen::{module_import_name, package_import_name};

// ============================================================================
// Package Folder Name Resolution
// ============================================================================

/// Build a map from package address to output folder name.
///
/// - Top-level packages: kebab-case of their name (no suffix)
/// - Dependencies with unique names: kebab-case (no suffix)
/// - Dependencies with colliding names: kebab-case with `-1`, `-2`, ... suffixes
///
/// The suffix order is determined by BTreeMap ordering (by address) for determinism.
pub fn build_package_folder_names(
    id_map: &BTreeMap<AccountAddress, PackageName>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
) -> BTreeMap<AccountAddress, String> {
    let mut result: BTreeMap<AccountAddress, String> = BTreeMap::new();

    // Step 1: Add top-level packages (no suffix needed, unique by definition)
    for (addr, name) in top_level_pkg_names {
        result.insert(*addr, package_import_name(*name));
    }

    // Step 2: Collect dependency packages grouped by kebab-case name
    // BTreeMap ensures addresses are processed in deterministic order
    let mut deps_by_name: BTreeMap<String, Vec<AccountAddress>> = BTreeMap::new();

    for (addr, pkg_name) in id_map {
        // Skip top-level packages (already handled)
        if top_level_pkg_names.contains_key(addr) {
            continue;
        }

        let kebab_name = package_import_name(Symbol::from(pkg_name.as_str()));
        deps_by_name.entry(kebab_name).or_default().push(*addr);
    }

    // Step 3: Assign folder names to dependencies
    for (kebab_name, addrs) in deps_by_name {
        if addrs.len() == 1 {
            // Unique name - no suffix needed
            result.insert(addrs[0], kebab_name);
        } else {
            // Collision - add suffixes starting from 1
            // addrs is already sorted by address (from BTreeMap iteration)
            for (i, addr) in addrs.iter().enumerate() {
                result.insert(*addr, format!("{}-{}", kebab_name, i + 1));
            }
        }
    }

    result
}

// ============================================================================
// OutputLayout - Top-level output directory structure
// ============================================================================

/// Represents the overall output directory structure.
/// This makes path calculations explicit and centralized.
pub struct OutputLayout {
    /// Root output directory (e.g., "./generated")
    pub root: PathBuf,
    /// Path to _framework directory
    pub framework_dir: PathBuf,
}

impl OutputLayout {
    pub fn new(out_root: PathBuf) -> Self {
        let framework_dir = out_root.join("_framework");
        Self {
            root: out_root,
            framework_dir,
        }
    }

    /// Get the path for a package within the output.
    ///
    /// Uses the pre-computed folder names map for consistent naming.
    pub fn package_path(
        &self,
        pkg_id: &AccountAddress,
        folder_names: &BTreeMap<AccountAddress, String>,
        top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    ) -> PackageLayout {
        let is_top_level = top_level_pkg_names.contains_key(pkg_id);

        let folder_name = folder_names
            .get(pkg_id)
            .expect("All packages should have folder names");

        let path = if is_top_level {
            self.root.join(folder_name)
        } else {
            self.root.join("_dependencies").join(folder_name)
        };

        PackageLayout::new(path, is_top_level)
    }
}

// ============================================================================
// PackageLayout - Per-package directory structure
// ============================================================================

/// Represents the layout of a single package directory.
/// Encapsulates the "levels from root" logic for relative paths.
pub struct PackageLayout {
    /// Path to this package's directory
    pub path: PathBuf,
    /// Whether this is a top-level package (affects path depths)
    pub is_top_level: bool,
    /// Levels from root: 0 for top-level, 1 for dependencies
    pub levels_from_root: u8,
}

impl PackageLayout {
    fn new(path: PathBuf, is_top_level: bool) -> Self {
        let levels_from_root = if is_top_level { 0 } else { 1 };
        Self {
            path,
            is_top_level,
            levels_from_root,
        }
    }

    /// Get the framework import path relative to init.ts (at package root)
    pub fn framework_rel_path_for_init(&self) -> String {
        let init_levels = self.levels_from_root + 1;
        (0..init_levels).map(|_| "..").collect::<Vec<_>>().join("/") + "/_framework"
    }

    /// Get the path for a module directory within this package.
    pub fn module_path(&self, module_name: Symbol) -> PathBuf {
        self.path.join(module_import_name(module_name))
    }
}

// ============================================================================
// Tests
// ============================================================================

#[cfg(test)]
mod tests {
    use super::*;

    fn addr(s: &str) -> AccountAddress {
        AccountAddress::from_hex_literal(s).unwrap()
    }

    fn pkg_name(s: &str) -> PackageName {
        PackageName::new(s.to_string()).unwrap()
    }

    #[test]
    fn test_build_package_folder_names_no_collisions() {
        // Setup: top-level pkg1, dependencies pkg2 and pkg3 with unique names
        let addr1 = addr("0x1");
        let addr2 = addr("0x2");
        let addr3 = addr("0x3");

        let mut id_map: BTreeMap<AccountAddress, PackageName> = BTreeMap::new();
        id_map.insert(addr1, pkg_name("my_top_level"));
        id_map.insert(addr2, pkg_name("move_stdlib"));
        id_map.insert(addr3, pkg_name("sui_framework"));

        let mut top_level: BTreeMap<AccountAddress, Symbol> = BTreeMap::new();
        top_level.insert(addr1, Symbol::from("my_top_level"));

        let result = build_package_folder_names(&id_map, &top_level);

        assert_eq!(result.get(&addr1), Some(&"my-top-level".to_string()));
        assert_eq!(result.get(&addr2), Some(&"move-stdlib".to_string()));
        assert_eq!(result.get(&addr3), Some(&"sui-framework".to_string()));
    }

    #[test]
    fn test_build_package_folder_names_with_collisions() {
        // Setup: top-level pkg1, dependencies pkg2 and pkg3 with SAME name
        let addr1 = addr("0x1");
        let addr2 = addr("0x2");
        let addr3 = addr("0x3");

        let mut id_map: BTreeMap<AccountAddress, PackageName> = BTreeMap::new();
        id_map.insert(addr1, pkg_name("my_package"));
        id_map.insert(addr2, pkg_name("shared_dep")); // Same name
        id_map.insert(addr3, pkg_name("shared_dep")); // Same name

        let mut top_level: BTreeMap<AccountAddress, Symbol> = BTreeMap::new();
        top_level.insert(addr1, Symbol::from("my_package"));

        let result = build_package_folder_names(&id_map, &top_level);

        assert_eq!(result.get(&addr1), Some(&"my-package".to_string()));
        // addr2 < addr3 in BTreeMap order, so addr2 gets -1, addr3 gets -2
        assert_eq!(result.get(&addr2), Some(&"shared-dep-1".to_string()));
        assert_eq!(result.get(&addr3), Some(&"shared-dep-2".to_string()));
    }

    #[test]
    fn test_top_level_packages_no_suffix() {
        // Even if a top-level package would collide with a dep, it shouldn't get a suffix
        let addr1 = addr("0x1");
        let addr2 = addr("0x2");

        let mut id_map: BTreeMap<AccountAddress, PackageName> = BTreeMap::new();
        id_map.insert(addr1, pkg_name("my_package"));
        id_map.insert(addr2, pkg_name("my_package")); // Same name as top-level

        let mut top_level: BTreeMap<AccountAddress, Symbol> = BTreeMap::new();
        top_level.insert(addr1, Symbol::from("my_package"));

        let result = build_package_folder_names(&id_map, &top_level);

        // Top-level never gets a suffix
        assert_eq!(result.get(&addr1), Some(&"my-package".to_string()));
        // Dependency is the only one with its (kebab) name among deps, so no suffix
        assert_eq!(result.get(&addr2), Some(&"my-package".to_string()));
    }

    #[test]
    fn test_deterministic_ordering_by_address() {
        // Ensure address ordering is deterministic
        let addr_a = addr("0xaaa");
        let addr_b = addr("0xbbb");
        let addr_c = addr("0xccc");

        let mut id_map: BTreeMap<AccountAddress, PackageName> = BTreeMap::new();
        // Insert in non-address order
        id_map.insert(addr_c, pkg_name("same_name"));
        id_map.insert(addr_a, pkg_name("same_name"));
        id_map.insert(addr_b, pkg_name("same_name"));

        let top_level: BTreeMap<AccountAddress, Symbol> = BTreeMap::new();

        let result = build_package_folder_names(&id_map, &top_level);

        // BTreeMap sorts by address: addr_a < addr_b < addr_c
        assert_eq!(result.get(&addr_a), Some(&"same-name-1".to_string()));
        assert_eq!(result.get(&addr_b), Some(&"same-name-2".to_string()));
        assert_eq!(result.get(&addr_c), Some(&"same-name-3".to_string()));
    }
}
