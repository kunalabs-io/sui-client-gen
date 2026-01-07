//! Compatibility checking between environments.
//!
//! This module checks if structs, enums, and functions are compatible between
//! different environments. Items are compatible if they have the same structure
//! (fields, types, type parameters) but may have different package addresses.

// Allow large error types - CompatError is used during code generation, not in hot paths.
// Boxing would add complexity without meaningful benefit.
#![allow(clippy::result_large_err)]

use std::fmt;

use super::enums::{EnumIR, EnumVariantIR};
use super::functions::{FunctionIR, FunctionParamIR, ParamTypeIR};
use super::structs::{FieldIR, FieldTypeIR, StructIR, TypeParamIR};

// ============================================================================
// Error Types
// ============================================================================

/// A compatibility error between two environments.
#[derive(Debug, Clone)]
pub enum CompatError {
    /// Struct is incompatible between environments.
    StructIncompat {
        /// Full path to the struct (e.g., "dep::lib::DepStruct")
        struct_path: String,
        /// Name of the first environment
        env1: String,
        /// Name of the second environment
        env2: String,
        /// Reason for incompatibility
        reason: StructIncompatReason,
    },
    /// Enum is incompatible between environments.
    EnumIncompat {
        /// Full path to the enum
        enum_path: String,
        /// Name of the first environment
        env1: String,
        /// Name of the second environment
        env2: String,
        /// Reason for incompatibility
        reason: EnumIncompatReason,
    },
    /// Function is incompatible between environments.
    FunctionIncompat {
        /// Full path to the function (e.g., "dep::lib::new_dep")
        func_path: String,
        /// Name of the first environment
        env1: String,
        /// Name of the second environment
        env2: String,
        /// Reason for incompatibility
        reason: FunctionIncompatReason,
    },
}

/// Reason why two structs are incompatible.
#[derive(Debug, Clone)]
pub enum StructIncompatReason {
    /// Different number of fields.
    FieldCountMismatch {
        env1_count: usize,
        env2_count: usize,
    },
    /// Field at the same index has a different name.
    FieldNameMismatch {
        index: usize,
        env1_name: String,
        env2_name: String,
    },
    /// Field has a different type.
    FieldTypeMismatch {
        field_name: String,
        env1_type: String,
        env2_type: String,
    },
    /// Different number of type parameters.
    TypeParamCountMismatch {
        env1_count: usize,
        env2_count: usize,
    },
    /// Type parameter has different phantom status.
    TypeParamPhantomMismatch {
        index: usize,
        env1_phantom: bool,
        env2_phantom: bool,
    },
}

/// Reason why two enums are incompatible.
#[derive(Debug, Clone)]
pub enum EnumIncompatReason {
    /// Different number of variants.
    VariantCountMismatch {
        env1_count: usize,
        env2_count: usize,
    },
    /// Variant at the same index has a different name.
    VariantNameMismatch {
        index: usize,
        env1_name: String,
        env2_name: String,
    },
    /// Variant has incompatible fields (delegates to StructIncompatReason).
    VariantFieldsIncompat {
        variant_name: String,
        reason: StructIncompatReason,
    },
    /// Different number of type parameters.
    TypeParamCountMismatch {
        env1_count: usize,
        env2_count: usize,
    },
    /// Type parameter has different phantom status.
    TypeParamPhantomMismatch {
        index: usize,
        env1_phantom: bool,
        env2_phantom: bool,
    },
}

/// Reason why two functions are incompatible.
#[derive(Debug, Clone)]
pub enum FunctionIncompatReason {
    /// Different number of parameters.
    ParamCountMismatch {
        env1_count: usize,
        env2_count: usize,
    },
    /// Parameter at the same index has a different name.
    ParamNameMismatch {
        index: usize,
        env1_name: String,
        env2_name: String,
    },
    /// Parameter has a different type.
    ParamTypeMismatch {
        param_name: String,
        env1_type: String,
        env2_type: String,
    },
    /// Different number of type parameters.
    TypeParamCountMismatch {
        env1_count: usize,
        env2_count: usize,
    },
}

// ============================================================================
// Display implementations for error formatting
// ============================================================================

impl fmt::Display for CompatError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            CompatError::StructIncompat {
                struct_path,
                env1,
                env2,
                reason,
            } => {
                write!(
                    f,
                    "Struct '{}' is incompatible between '{}' and '{}':\n    {}",
                    struct_path, env1, env2, reason
                )
            }
            CompatError::EnumIncompat {
                enum_path,
                env1,
                env2,
                reason,
            } => {
                write!(
                    f,
                    "Enum '{}' is incompatible between '{}' and '{}':\n    {}",
                    enum_path, env1, env2, reason
                )
            }
            CompatError::FunctionIncompat {
                func_path,
                env1,
                env2,
                reason,
            } => {
                write!(
                    f,
                    "Function '{}' is incompatible between '{}' and '{}':\n    {}",
                    func_path, env1, env2, reason
                )
            }
        }
    }
}

impl fmt::Display for StructIncompatReason {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            StructIncompatReason::FieldCountMismatch {
                env1_count,
                env2_count,
            } => {
                write!(
                    f,
                    "different field count ({} vs {})",
                    env1_count, env2_count
                )
            }
            StructIncompatReason::FieldNameMismatch {
                index,
                env1_name,
                env2_name,
            } => {
                write!(
                    f,
                    "field {} has different name ('{}' vs '{}')",
                    index, env1_name, env2_name
                )
            }
            StructIncompatReason::FieldTypeMismatch {
                field_name,
                env1_type,
                env2_type,
            } => {
                write!(
                    f,
                    "field '{}' has different type ('{}' vs '{}')",
                    field_name, env1_type, env2_type
                )
            }
            StructIncompatReason::TypeParamCountMismatch {
                env1_count,
                env2_count,
            } => {
                write!(
                    f,
                    "different type parameter count ({} vs {})",
                    env1_count, env2_count
                )
            }
            StructIncompatReason::TypeParamPhantomMismatch {
                index,
                env1_phantom,
                env2_phantom,
            } => {
                write!(
                    f,
                    "type parameter {} has different phantom status ({} vs {})",
                    index, env1_phantom, env2_phantom
                )
            }
        }
    }
}

impl fmt::Display for EnumIncompatReason {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            EnumIncompatReason::VariantCountMismatch {
                env1_count,
                env2_count,
            } => {
                write!(
                    f,
                    "different variant count ({} vs {})",
                    env1_count, env2_count
                )
            }
            EnumIncompatReason::VariantNameMismatch {
                index,
                env1_name,
                env2_name,
            } => {
                write!(
                    f,
                    "variant {} has different name ('{}' vs '{}')",
                    index, env1_name, env2_name
                )
            }
            EnumIncompatReason::VariantFieldsIncompat {
                variant_name,
                reason,
            } => {
                write!(f, "variant '{}' has incompatible fields: {}", variant_name, reason)
            }
            EnumIncompatReason::TypeParamCountMismatch {
                env1_count,
                env2_count,
            } => {
                write!(
                    f,
                    "different type parameter count ({} vs {})",
                    env1_count, env2_count
                )
            }
            EnumIncompatReason::TypeParamPhantomMismatch {
                index,
                env1_phantom,
                env2_phantom,
            } => {
                write!(
                    f,
                    "type parameter {} has different phantom status ({} vs {})",
                    index, env1_phantom, env2_phantom
                )
            }
        }
    }
}

impl fmt::Display for FunctionIncompatReason {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            FunctionIncompatReason::ParamCountMismatch {
                env1_count,
                env2_count,
            } => {
                write!(
                    f,
                    "different parameter count ({} vs {})",
                    env1_count, env2_count
                )
            }
            FunctionIncompatReason::ParamNameMismatch {
                index,
                env1_name,
                env2_name,
            } => {
                write!(
                    f,
                    "parameter {} has different name ('{}' vs '{}')",
                    index, env1_name, env2_name
                )
            }
            FunctionIncompatReason::ParamTypeMismatch {
                param_name,
                env1_type,
                env2_type,
            } => {
                write!(
                    f,
                    "parameter '{}' has different type ('{}' vs '{}')",
                    param_name, env1_type, env2_type
                )
            }
            FunctionIncompatReason::TypeParamCountMismatch {
                env1_count,
                env2_count,
            } => {
                write!(
                    f,
                    "different type parameter count ({} vs {})",
                    env1_count, env2_count
                )
            }
        }
    }
}

// ============================================================================
// Compatibility checking functions
// ============================================================================

/// Check if two structs are compatible.
pub fn check_struct_compat(
    struct1: &StructIR,
    struct2: &StructIR,
    env1: &str,
    env2: &str,
    struct_path: &str,
) -> Result<(), CompatError> {
    // Check type parameters
    if let Err(reason) = check_type_params_compat(&struct1.type_params, &struct2.type_params) {
        return Err(CompatError::StructIncompat {
            struct_path: struct_path.to_string(),
            env1: env1.to_string(),
            env2: env2.to_string(),
            reason,
        });
    }

    // Check fields
    if let Err(reason) = check_fields_compat(&struct1.fields, &struct2.fields) {
        return Err(CompatError::StructIncompat {
            struct_path: struct_path.to_string(),
            env1: env1.to_string(),
            env2: env2.to_string(),
            reason,
        });
    }

    Ok(())
}

/// Check if two enums are compatible.
pub fn check_enum_compat(
    enum1: &EnumIR,
    enum2: &EnumIR,
    env1: &str,
    env2: &str,
    enum_path: &str,
) -> Result<(), CompatError> {
    // Check type parameters
    if let Err(reason) = check_type_params_compat(&enum1.type_params, &enum2.type_params) {
        return Err(CompatError::EnumIncompat {
            enum_path: enum_path.to_string(),
            env1: env1.to_string(),
            env2: env2.to_string(),
            reason: match reason {
                StructIncompatReason::TypeParamCountMismatch {
                    env1_count,
                    env2_count,
                } => EnumIncompatReason::TypeParamCountMismatch {
                    env1_count,
                    env2_count,
                },
                StructIncompatReason::TypeParamPhantomMismatch {
                    index,
                    env1_phantom,
                    env2_phantom,
                } => EnumIncompatReason::TypeParamPhantomMismatch {
                    index,
                    env1_phantom,
                    env2_phantom,
                },
                _ => unreachable!("check_type_params_compat only returns type param errors"),
            },
        });
    }

    // Check variant count
    if enum1.variants.len() != enum2.variants.len() {
        return Err(CompatError::EnumIncompat {
            enum_path: enum_path.to_string(),
            env1: env1.to_string(),
            env2: env2.to_string(),
            reason: EnumIncompatReason::VariantCountMismatch {
                env1_count: enum1.variants.len(),
                env2_count: enum2.variants.len(),
            },
        });
    }

    // Check each variant
    for (i, (v1, v2)) in enum1.variants.iter().zip(enum2.variants.iter()).enumerate() {
        if let Err(reason) = check_variant_compat(v1, v2, i) {
            return Err(CompatError::EnumIncompat {
                enum_path: enum_path.to_string(),
                env1: env1.to_string(),
                env2: env2.to_string(),
                reason,
            });
        }
    }

    Ok(())
}

/// Check if two functions are compatible.
pub fn check_function_compat(
    func1: &FunctionIR,
    func2: &FunctionIR,
    env1: &str,
    env2: &str,
    func_path: &str,
) -> Result<(), CompatError> {
    // Check type parameter count
    if func1.type_params.len() != func2.type_params.len() {
        return Err(CompatError::FunctionIncompat {
            func_path: func_path.to_string(),
            env1: env1.to_string(),
            env2: env2.to_string(),
            reason: FunctionIncompatReason::TypeParamCountMismatch {
                env1_count: func1.type_params.len(),
                env2_count: func2.type_params.len(),
            },
        });
    }

    // Check parameter count
    if func1.params.len() != func2.params.len() {
        return Err(CompatError::FunctionIncompat {
            func_path: func_path.to_string(),
            env1: env1.to_string(),
            env2: env2.to_string(),
            reason: FunctionIncompatReason::ParamCountMismatch {
                env1_count: func1.params.len(),
                env2_count: func2.params.len(),
            },
        });
    }

    // Check each parameter
    for (i, (p1, p2)) in func1.params.iter().zip(func2.params.iter()).enumerate() {
        if let Err(reason) = check_param_compat(p1, p2, i) {
            return Err(CompatError::FunctionIncompat {
                func_path: func_path.to_string(),
                env1: env1.to_string(),
                env2: env2.to_string(),
                reason,
            });
        }
    }

    Ok(())
}

// ============================================================================
// Internal helper functions
// ============================================================================

/// Check if two type parameter lists are compatible.
fn check_type_params_compat(
    params1: &[TypeParamIR],
    params2: &[TypeParamIR],
) -> Result<(), StructIncompatReason> {
    if params1.len() != params2.len() {
        return Err(StructIncompatReason::TypeParamCountMismatch {
            env1_count: params1.len(),
            env2_count: params2.len(),
        });
    }

    for (i, (p1, p2)) in params1.iter().zip(params2.iter()).enumerate() {
        if p1.is_phantom != p2.is_phantom {
            return Err(StructIncompatReason::TypeParamPhantomMismatch {
                index: i,
                env1_phantom: p1.is_phantom,
                env2_phantom: p2.is_phantom,
            });
        }
    }

    Ok(())
}

/// Check if two field lists are compatible.
fn check_fields_compat(fields1: &[FieldIR], fields2: &[FieldIR]) -> Result<(), StructIncompatReason> {
    if fields1.len() != fields2.len() {
        return Err(StructIncompatReason::FieldCountMismatch {
            env1_count: fields1.len(),
            env2_count: fields2.len(),
        });
    }

    for (i, (f1, f2)) in fields1.iter().zip(fields2.iter()).enumerate() {
        // Check field name (use move_name for consistent comparison)
        if f1.move_name != f2.move_name {
            return Err(StructIncompatReason::FieldNameMismatch {
                index: i,
                env1_name: f1.move_name.clone(),
                env2_name: f2.move_name.clone(),
            });
        }

        // Check field type
        if let Err(type_desc) = check_field_type_compat(&f1.field_type, &f2.field_type) {
            return Err(StructIncompatReason::FieldTypeMismatch {
                field_name: f1.move_name.clone(),
                env1_type: format_field_type(&f1.field_type),
                env2_type: type_desc,
            });
        }
    }

    Ok(())
}

/// Check if two enum variants are compatible.
fn check_variant_compat(
    v1: &EnumVariantIR,
    v2: &EnumVariantIR,
    index: usize,
) -> Result<(), EnumIncompatReason> {
    // Check variant name
    if v1.name != v2.name {
        return Err(EnumIncompatReason::VariantNameMismatch {
            index,
            env1_name: v1.name.clone(),
            env2_name: v2.name.clone(),
        });
    }

    // Check variant fields
    if let Err(reason) = check_fields_compat(&v1.fields, &v2.fields) {
        return Err(EnumIncompatReason::VariantFieldsIncompat {
            variant_name: v1.name.clone(),
            reason,
        });
    }

    Ok(())
}

/// Check if two function parameters are compatible.
fn check_param_compat(
    p1: &FunctionParamIR,
    p2: &FunctionParamIR,
    index: usize,
) -> Result<(), FunctionIncompatReason> {
    // Check parameter name
    if p1.ts_name != p2.ts_name {
        return Err(FunctionIncompatReason::ParamNameMismatch {
            index,
            env1_name: p1.ts_name.clone(),
            env2_name: p2.ts_name.clone(),
        });
    }

    // Check parameter type
    if let Err(type_desc) = check_param_type_compat(&p1.param_type, &p2.param_type) {
        return Err(FunctionIncompatReason::ParamTypeMismatch {
            param_name: p1.ts_name.clone(),
            env1_type: format_param_type(&p1.param_type),
            env2_type: type_desc,
        });
    }

    Ok(())
}

/// Check if two field types are compatible.
/// Returns Ok(()) if compatible, Err(description) if not.
fn check_field_type_compat(type1: &FieldTypeIR, type2: &FieldTypeIR) -> Result<(), String> {
    match (type1, type2) {
        (FieldTypeIR::Primitive(p1), FieldTypeIR::Primitive(p2)) => {
            if p1 == p2 {
                Ok(())
            } else {
                Err(format_field_type(type2))
            }
        }
        (FieldTypeIR::Vector(inner1), FieldTypeIR::Vector(inner2)) => {
            check_field_type_compat(inner1, inner2)
        }
        (
            FieldTypeIR::Datatype {
                full_type_name: name1,
                type_args: args1,
                ..
            },
            FieldTypeIR::Datatype {
                full_type_name: name2,
                type_args: args2,
                ..
            },
        ) => {
            // Compare by full_type_name (ignores package address differences, compares module::type)
            // For cross-environment comparison, we only care about the module::type part
            let name1_suffix = extract_type_suffix(name1);
            let name2_suffix = extract_type_suffix(name2);

            if name1_suffix != name2_suffix {
                return Err(format_field_type(type2));
            }

            if args1.len() != args2.len() {
                return Err(format_field_type(type2));
            }

            for (a1, a2) in args1.iter().zip(args2.iter()) {
                check_field_type_compat(a1, a2)?;
            }

            Ok(())
        }
        (
            FieldTypeIR::TypeParam {
                index: idx1,
                is_phantom: ph1,
                ..
            },
            FieldTypeIR::TypeParam {
                index: idx2,
                is_phantom: ph2,
                ..
            },
        ) => {
            if idx1 == idx2 && ph1 == ph2 {
                Ok(())
            } else {
                Err(format_field_type(type2))
            }
        }
        _ => {
            // Different type variants are incompatible
            Err(format_field_type(type2))
        }
    }
}

/// Check if two param types are compatible.
fn check_param_type_compat(type1: &ParamTypeIR, type2: &ParamTypeIR) -> Result<(), String> {
    match (type1, type2) {
        (ParamTypeIR::Primitive(p1), ParamTypeIR::Primitive(p2)) => {
            if p1 == p2 {
                Ok(())
            } else {
                Err(format_param_type(type2))
            }
        }
        (ParamTypeIR::Vector(inner1), ParamTypeIR::Vector(inner2)) => {
            check_param_type_compat(inner1, inner2)
        }
        (ParamTypeIR::Option(inner1), ParamTypeIR::Option(inner2)) => {
            check_param_type_compat(inner1, inner2)
        }
        (
            ParamTypeIR::Struct {
                class_name: name1,
                type_args: args1,
            },
            ParamTypeIR::Struct {
                class_name: name2,
                type_args: args2,
            },
        ) => {
            // For structs in params, compare class names and type args
            if name1 != name2 {
                return Err(format_param_type(type2));
            }

            if args1.len() != args2.len() {
                return Err(format_param_type(type2));
            }

            for (a1, a2) in args1.iter().zip(args2.iter()) {
                check_param_type_compat(a1, a2)?;
            }

            Ok(())
        }
        (
            ParamTypeIR::TypeParam { index: idx1, .. },
            ParamTypeIR::TypeParam { index: idx2, .. },
        ) => {
            if idx1 == idx2 {
                Ok(())
            } else {
                Err(format_param_type(type2))
            }
        }
        (
            ParamTypeIR::StringType { module: m1 },
            ParamTypeIR::StringType { module: m2 },
        ) => {
            if m1 == m2 {
                Ok(())
            } else {
                Err(format_param_type(type2))
            }
        }
        (ParamTypeIR::ID, ParamTypeIR::ID) => Ok(()),
        _ => {
            // Different type variants are incompatible
            Err(format_param_type(type2))
        }
    }
}

/// Extract the module::type suffix from a full type name (e.g., "0x1::string::String" -> "string::String")
fn extract_type_suffix(full_type_name: &str) -> &str {
    // Find the first "::" and return everything after the address
    if let Some(pos) = full_type_name.find("::") {
        &full_type_name[pos + 2..]
    } else {
        full_type_name
    }
}

/// Format a field type for error messages.
fn format_field_type(field_type: &FieldTypeIR) -> String {
    match field_type {
        FieldTypeIR::Primitive(p) => p.clone(),
        FieldTypeIR::Vector(inner) => format!("vector<{}>", format_field_type(inner)),
        FieldTypeIR::Datatype {
            full_type_name,
            type_args,
            ..
        } => {
            if type_args.is_empty() {
                full_type_name.clone()
            } else {
                let args: Vec<_> = type_args.iter().map(format_field_type).collect();
                format!("{}<{}>", full_type_name, args.join(", "))
            }
        }
        FieldTypeIR::TypeParam { name, is_phantom, .. } => {
            if *is_phantom {
                format!("phantom {}", name)
            } else {
                name.clone()
            }
        }
    }
}

/// Format a param type for error messages.
fn format_param_type(param_type: &ParamTypeIR) -> String {
    match param_type {
        ParamTypeIR::Primitive(p) => p.clone(),
        ParamTypeIR::Vector(inner) => format!("vector<{}>", format_param_type(inner)),
        ParamTypeIR::Struct {
            class_name,
            type_args,
        } => {
            if type_args.is_empty() {
                class_name.clone()
            } else {
                let args: Vec<_> = type_args.iter().map(format_param_type).collect();
                format!("{}<{}>", class_name, args.join(", "))
            }
        }
        ParamTypeIR::Option(inner) => format!("Option<{}>", format_param_type(inner)),
        ParamTypeIR::TypeParam { name, .. } => name.clone(),
        ParamTypeIR::StringType { module } => {
            if module == "ascii" {
                "ascii::String".to_string()
            } else {
                "string::String".to_string()
            }
        }
        ParamTypeIR::ID => "object::ID".to_string(),
    }
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::ts_gen::structs::PackageInfo;

    fn make_primitive_field(name: &str, prim_type: &str) -> FieldIR {
        FieldIR {
            ts_name: name.to_string(),
            move_name: name.to_string(),
            field_type: FieldTypeIR::Primitive(prim_type.to_string()),
        }
    }

    fn make_simple_struct(name: &str, fields: Vec<FieldIR>) -> StructIR {
        StructIR {
            name: name.to_string(),
            module_struct_path: format!("test::{}", name),
            package_info: PackageInfo::System {
                address: "0x1".to_string(),
            },
            type_params: vec![],
            fields,
            struct_imports: vec![],
            uses_vector: false,
            uses_address: false,
            uses_phantom_struct_args: false,
            has_non_phantom_type_params: false,
            uses_field_to_json: false,
        }
    }

    #[test]
    fn test_identical_structs_are_compatible() {
        let struct1 = make_simple_struct("Foo", vec![make_primitive_field("value", "u64")]);
        let struct2 = make_simple_struct("Foo", vec![make_primitive_field("value", "u64")]);

        assert!(check_struct_compat(&struct1, &struct2, "env1", "env2", "test::Foo").is_ok());
    }

    #[test]
    fn test_different_field_count_is_incompatible() {
        let struct1 = make_simple_struct("Foo", vec![make_primitive_field("value", "u64")]);
        let struct2 = make_simple_struct(
            "Foo",
            vec![
                make_primitive_field("value", "u64"),
                make_primitive_field("another", "u64"),
            ],
        );

        let result = check_struct_compat(&struct1, &struct2, "env1", "env2", "test::Foo");
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(matches!(
            err,
            CompatError::StructIncompat {
                reason: StructIncompatReason::FieldCountMismatch { .. },
                ..
            }
        ));
    }

    #[test]
    fn test_different_field_name_is_incompatible() {
        let struct1 = make_simple_struct("Foo", vec![make_primitive_field("value", "u64")]);
        let struct2 = make_simple_struct("Foo", vec![make_primitive_field("other", "u64")]);

        let result = check_struct_compat(&struct1, &struct2, "env1", "env2", "test::Foo");
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(matches!(
            err,
            CompatError::StructIncompat {
                reason: StructIncompatReason::FieldNameMismatch { .. },
                ..
            }
        ));
    }

    #[test]
    fn test_different_field_type_is_incompatible() {
        let struct1 = make_simple_struct("Foo", vec![make_primitive_field("value", "u64")]);
        let struct2 = make_simple_struct("Foo", vec![make_primitive_field("value", "u128")]);

        let result = check_struct_compat(&struct1, &struct2, "env1", "env2", "test::Foo");
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(matches!(
            err,
            CompatError::StructIncompat {
                reason: StructIncompatReason::FieldTypeMismatch { .. },
                ..
            }
        ));
    }

    #[test]
    fn test_different_type_param_count_is_incompatible() {
        let mut struct1 = make_simple_struct("Foo", vec![]);
        struct1.type_params = vec![TypeParamIR {
            name: "T".to_string(),
            is_phantom: false,
        }];

        let struct2 = make_simple_struct("Foo", vec![]);

        let result = check_struct_compat(&struct1, &struct2, "env1", "env2", "test::Foo");
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(matches!(
            err,
            CompatError::StructIncompat {
                reason: StructIncompatReason::TypeParamCountMismatch { .. },
                ..
            }
        ));
    }

    #[test]
    fn test_different_phantom_status_is_incompatible() {
        let mut struct1 = make_simple_struct("Foo", vec![]);
        struct1.type_params = vec![TypeParamIR {
            name: "T".to_string(),
            is_phantom: true,
        }];

        let mut struct2 = make_simple_struct("Foo", vec![]);
        struct2.type_params = vec![TypeParamIR {
            name: "T".to_string(),
            is_phantom: false,
        }];

        let result = check_struct_compat(&struct1, &struct2, "env1", "env2", "test::Foo");
        assert!(result.is_err());
        let err = result.unwrap_err();
        assert!(matches!(
            err,
            CompatError::StructIncompat {
                reason: StructIncompatReason::TypeParamPhantomMismatch { .. },
                ..
            }
        ));
    }

    #[test]
    fn test_error_message_format() {
        let struct1 = make_simple_struct("Foo", vec![make_primitive_field("value", "u64")]);
        let struct2 = make_simple_struct(
            "Foo",
            vec![
                make_primitive_field("value", "u64"),
                make_primitive_field("another", "u64"),
            ],
        );

        let result = check_struct_compat(&struct1, &struct2, "env_1", "env_2", "dep::lib::Foo");
        assert!(result.is_err());
        let err_msg = result.unwrap_err().to_string();
        assert!(err_msg.contains("dep::lib::Foo"));
        assert!(err_msg.contains("env_1"));
        assert!(err_msg.contains("env_2"));
        assert!(err_msg.contains("different field count"));
    }

    #[test]
    fn test_extract_type_suffix() {
        assert_eq!(extract_type_suffix("0x1::string::String"), "string::String");
        assert_eq!(extract_type_suffix("0x2::object::UID"), "object::UID");
        assert_eq!(
            extract_type_suffix("0xabcd::my_module::MyStruct"),
            "my_module::MyStruct"
        );
    }
}
