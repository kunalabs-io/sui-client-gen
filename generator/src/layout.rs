//! Output directory layout structures.
//!
//! This module provides structured representations for the output directory hierarchy,
//! centralizing path calculation logic.

use std::collections::{BTreeMap, BTreeSet};
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
/// - Top-level packages: kebab-case of their name (no suffix; gen.toml keys are unique)
/// - Dependencies with unique names: kebab-case (no suffix)
/// - Dependencies whose kebab-case name collides with another dependency OR a top-level
///   package: kebab-case with `-1`, `-2`, ... suffixes
///
/// Names are unique across the top-level and dependency buckets combined: the runtime
/// resolves packages by name in a single namespace (`env.packages[name] ||
/// env.dependencies[name]`), so a dependency must never share a name with a top-level
/// package.
///
/// The suffix order is determined by BTreeMap ordering (by address) for determinism.
pub fn build_package_folder_names(
    id_map: &BTreeMap<AccountAddress, PackageName>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
) -> BTreeMap<AccountAddress, String> {
    let mut result: BTreeMap<AccountAddress, String> = BTreeMap::new();
    let mut used_names: BTreeSet<String> = BTreeSet::new();

    // Step 1: Add top-level packages (no suffix; gen.toml keys are unique)
    for (addr, name) in top_level_pkg_names {
        let kebab_name = package_import_name(*name);
        used_names.insert(kebab_name.clone());
        result.insert(*addr, kebab_name);
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
        if addrs.len() == 1 && !used_names.contains(&kebab_name) {
            // Unique name - no suffix needed
            used_names.insert(kebab_name.clone());
            result.insert(addrs[0], kebab_name);
        } else {
            // Collision (with other deps or a top-level package) - add suffixes
            // starting from 1, skipping any name that is already taken.
            // addrs is already sorted by address (from BTreeMap iteration)
            let mut suffix = 1;
            for addr in addrs {
                let name = loop {
                    let candidate = format!("{}-{}", kebab_name, suffix);
                    suffix += 1;
                    if !used_names.contains(&candidate) {
                        break candidate;
                    }
                };
                used_names.insert(name.clone());
                result.insert(addr, name);
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
    fn test_dep_colliding_with_top_level_gets_suffix() {
        // A dependency whose name collides with a top-level package must get a suffix:
        // the runtime resolves packages by name in a single namespace, so an unsuffixed
        // dependency would be shadowed by the top-level package.
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
        // Dependency collides with the top-level name, so it gets a suffix
        assert_eq!(result.get(&addr2), Some(&"my-package-1".to_string()));
    }

    #[test]
    fn test_all_folder_names_unique() {
        // Two deps sharing a name plus a top-level package with the same name:
        // every assigned folder name must be unique across both buckets.
        let addr1 = addr("0x1");
        let addr2 = addr("0x2");
        let addr3 = addr("0x3");

        let mut id_map: BTreeMap<AccountAddress, PackageName> = BTreeMap::new();
        id_map.insert(addr1, pkg_name("pkg_b"));
        id_map.insert(addr2, pkg_name("pkg_b"));
        id_map.insert(addr3, pkg_name("pkg_b"));

        let mut top_level: BTreeMap<AccountAddress, Symbol> = BTreeMap::new();
        top_level.insert(addr1, Symbol::from("pkg_b"));

        let result = build_package_folder_names(&id_map, &top_level);

        assert_eq!(result.get(&addr1), Some(&"pkg-b".to_string()));
        assert_eq!(result.get(&addr2), Some(&"pkg-b-1".to_string()));
        assert_eq!(result.get(&addr3), Some(&"pkg-b-2".to_string()));

        let names: BTreeSet<&String> = result.values().collect();
        assert_eq!(names.len(), result.len(), "folder names must be unique");
    }

    #[test]
    fn test_suffix_skips_taken_names() {
        // A top-level package already named "pkg-b-1" must not be clobbered by
        // suffix assignment for colliding deps named "pkg_b".
        let addr1 = addr("0x1");
        let addr2 = addr("0x2");
        let addr3 = addr("0x3");

        let mut id_map: BTreeMap<AccountAddress, PackageName> = BTreeMap::new();
        id_map.insert(addr1, pkg_name("pkg_b_1"));
        id_map.insert(addr2, pkg_name("pkg_b"));
        id_map.insert(addr3, pkg_name("pkg_b"));

        let mut top_level: BTreeMap<AccountAddress, Symbol> = BTreeMap::new();
        top_level.insert(addr1, Symbol::from("pkg_b_1"));

        let result = build_package_folder_names(&id_map, &top_level);

        assert_eq!(result.get(&addr1), Some(&"pkg-b-1".to_string()));
        // "pkg-b-1" is taken by the top-level package, so deps get -2 and -3
        assert_eq!(result.get(&addr2), Some(&"pkg-b-2".to_string()));
        assert_eq!(result.get(&addr3), Some(&"pkg-b-3".to_string()));
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
