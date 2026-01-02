//! Shared types for TypeScript code generation.

use std::collections::BTreeMap;

// ============================================================================
// Move Type IR
// ============================================================================

/// Represents a Move type for TypeScript generation.
#[derive(Debug, Clone)]
pub enum MoveTypeIR {
    /// Primitive types (u8, u16, u32, u64, u128, u256, bool, address)
    Primitive(String),
    /// Vector<T>
    Vector(Box<MoveTypeIR>),
    /// Reference to another struct/enum
    Struct {
        /// Full type name (e.g., "0x2::coin::Coin")
        full_name: String,
        /// Type arguments
        type_args: Vec<MoveTypeIR>,
        /// Import alias for this struct class
        import_alias: String,
    },
    /// A type parameter reference (e.g., T, T0)
    TypeParameter {
        name: String,
        index: usize,
        is_phantom: bool,
    },
}

impl MoveTypeIR {
    /// Convert to a TypeScript field type string (for use with ToField<>).
    pub fn to_ts_field_type(&self) -> String {
        match self {
            MoveTypeIR::Primitive(p) => format!("'{}'", p),
            MoveTypeIR::Vector(inner) => format!("Vector<{}>", inner.to_ts_field_type()),
            MoveTypeIR::Struct {
                import_alias,
                type_args,
                ..
            } => {
                if type_args.is_empty() {
                    import_alias.clone()
                } else {
                    let args: Vec<String> =
                        type_args.iter().map(|a| a.to_ts_field_type()).collect();
                    format!("{}<{}>", import_alias, args.join(", "))
                }
            }
            MoveTypeIR::TypeParameter { name, .. } => name.clone(),
        }
    }

    /// Convert to a BCS definition string.
    pub fn to_bcs_def(&self) -> String {
        match self {
            MoveTypeIR::Primitive(p) => match p.as_str() {
                "u8" => "bcs.u8()".to_string(),
                "u16" => "bcs.u16()".to_string(),
                "u32" => "bcs.u32()".to_string(),
                "u64" => "bcs.u64()".to_string(),
                "u128" => "bcs.u128()".to_string(),
                "u256" => "bcs.u256()".to_string(),
                "bool" => "bcs.bool()".to_string(),
                "address" => "bcs.bytes(32).transform({ input: (val: string) => fromHEX(val), output: (val: Uint8Array) => toHEX(val) })".to_string(),
                _ => format!("bcs.{}()", p),
            },
            MoveTypeIR::Vector(inner) => format!("bcs.vector({})", inner.to_bcs_def()),
            MoveTypeIR::Struct { import_alias, type_args, .. } => {
                if type_args.is_empty() {
                    format!("{}.bcs", import_alias)
                } else {
                    let args: Vec<String> = type_args.iter().map(|a| a.to_bcs_def()).collect();
                    format!("{}.bcs({})", import_alias, args.join(", "))
                }
            }
            MoveTypeIR::TypeParameter { name, .. } => name.clone(),
        }
    }
}

// ============================================================================
// Import Tracking
// ============================================================================

/// Tracks imports needed for the generated file.
#[derive(Debug, Default)]
pub struct ImportTracker {
    /// Named imports: (module_path, export_name, optional_alias)
    pub named: Vec<(String, String, Option<String>)>,
    /// Wildcard imports: (module_path, alias)
    pub wildcard: Vec<(String, String)>,
}

impl ImportTracker {
    pub fn new() -> Self {
        Self::default()
    }

    /// Add a named import, returns the name to use in code.
    pub fn add_named(&mut self, module: &str, name: &str, alias: Option<&str>) -> String {
        let use_name = alias.unwrap_or(name).to_string();
        self.named.push((
            module.to_string(),
            name.to_string(),
            alias.map(|s| s.to_string()),
        ));
        use_name
    }

    /// Add a wildcard import, returns the alias.
    pub fn add_wildcard(&mut self, module: &str, alias: &str) -> String {
        self.wildcard.push((module.to_string(), alias.to_string()));
        alias.to_string()
    }

    /// Emit import statements.
    pub fn emit(&self) -> String {
        let mut lines = Vec::new();

        // Group named imports by module
        let mut by_module: BTreeMap<&str, Vec<(&str, Option<&str>)>> = BTreeMap::new();
        for (module, name, alias) in &self.named {
            by_module
                .entry(module.as_str())
                .or_default()
                .push((name.as_str(), alias.as_deref()));
        }

        // Emit wildcard imports first (sorted by path)
        let mut wildcards: Vec<_> = self.wildcard.iter().collect();
        wildcards.sort_by_key(|(path, _)| path.as_str());
        for (module, alias) in wildcards {
            lines.push(format!("import * as {} from '{}'", alias, module));
        }

        // Emit named imports (sorted by path)
        for (module, names) in by_module {
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
                module
            ));
        }

        lines.join("\n")
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_import_tracker() {
        let mut tracker = ImportTracker::new();
        tracker.add_named("./reified", "ToField", None);
        tracker.add_named("./reified", "Reified", None);
        tracker.add_wildcard("./coin/structs", "coin");

        let output = tracker.emit();
        assert!(output.contains("import * as coin from './coin/structs'"));
        assert!(output.contains("import { ToField, Reified } from './reified'"));
    }

    #[test]
    fn test_move_type_to_ts() {
        let ty = MoveTypeIR::Primitive("u64".to_string());
        assert_eq!(ty.to_ts_field_type(), "'u64'");

        let vec_ty = MoveTypeIR::Vector(Box::new(MoveTypeIR::Primitive("u8".to_string())));
        assert_eq!(vec_ty.to_ts_field_type(), "Vector<'u8'>");
    }
}

