//! Output directory layout structures.
//!
//! This module provides structured representations for the output directory hierarchy,
//! centralizing path calculation logic.

use std::path::PathBuf;

use move_core_types::account_address::AccountAddress;
use move_symbol_pool::Symbol;
use std::collections::BTreeMap;

use crate::ts_gen::{module_import_name, package_import_name};

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
    pub fn package_path(
        &self,
        pkg_id: &AccountAddress,
        top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    ) -> PackageLayout {
        let is_top_level = top_level_pkg_names.contains_key(pkg_id);

        let path = match top_level_pkg_names.get(pkg_id) {
            Some(pkg_name) => self.root.join(package_import_name(*pkg_name)),
            None => self
                .root
                .join("_dependencies")
                .join(pkg_id.to_hex_literal()),
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
