//! Function IR and emission for TypeScript function bindings.
//!
//! Functions generate TypeScript wrappers for Move function calls.

use convert_case::{Case, Casing};
use indoc::formatdoc;

use super::utils::is_reserved_word;

/// Represents a function parameter's type for transaction arguments.
#[derive(Debug, Clone)]
pub enum ParamTypeIR {
    /// Primitives: u8, u16, u32, u64, u128, u256, bool, address
    Primitive(String),
    /// Vector<T>
    Vector(Box<ParamTypeIR>),
    /// A struct/enum type (objects)
    Struct {
        class_name: String,
        type_args: Vec<ParamTypeIR>,
    },
    /// Option<T> - special handling for pure vs object options
    Option(Box<ParamTypeIR>),
    /// A type parameter (T0, T1, etc.)
    TypeParam { name: String, index: usize },
    /// String types (0x1::string::String, 0x1::ascii::String)
    StringType { module: String },
    /// ID type (0x2::object::ID)
    ID,
}

impl ParamTypeIR {
    /// Check if this type is "pure" (can be serialized directly).
    pub fn is_pure(&self) -> bool {
        match self {
            ParamTypeIR::Primitive(_) => true,
            ParamTypeIR::Vector(inner) => inner.is_pure(),
            ParamTypeIR::Option(inner) => inner.is_pure(),
            ParamTypeIR::StringType { .. } | ParamTypeIR::ID => true,
            ParamTypeIR::Struct { .. } | ParamTypeIR::TypeParam { .. } => false,
        }
    }

    /// Check if this is an Option type.
    pub fn is_option(&self) -> bool {
        matches!(self, ParamTypeIR::Option(_))
    }

    /// Get the TypeScript type for a function parameter.
    /// Uses a two-phase approach: build base type, then add TransactionArgument once.
    pub fn to_ts_param_type(&self) -> String {
        // Build the base type
        let base = self.to_ts_base_type();

        match self {
            // These types don't get | TransactionArgument suffix
            ParamTypeIR::Struct { .. } => "TransactionObjectInput".to_string(),
            ParamTypeIR::TypeParam { .. } => "GenericArg".to_string(),
            // Option: base already includes | TransactionArgument from inner, just add | null
            ParamTypeIR::Option(_) => format!("{} | null", base),
            // Everything else: add | TransactionArgument
            _ => format!("{} | TransactionArgument", base),
        }
    }

    /// Get the base TypeScript type for building compound types.
    /// For most types, this is the value type without | TransactionArgument.
    /// For Option, this returns the inner's full param type (so | null is only added once).
    fn to_ts_base_type(&self) -> String {
        match self {
            ParamTypeIR::Primitive(p) => match p.as_str() {
                "u8" | "u16" | "u32" => "number".to_string(),
                "u64" | "u128" | "u256" => "bigint".to_string(),
                "bool" => "boolean".to_string(),
                "address" => "string".to_string(),
                _ => "unknown".to_string(),
            },
            // Vector elements can each be a value OR a TransactionArgument
            ParamTypeIR::Vector(inner) => {
                format!("Array<{}>", inner.to_ts_param_type())
            }
            ParamTypeIR::Struct { .. } => "TransactionObjectInput".to_string(),
            // Option: return inner's full param type (includes | TransactionArgument)
            // The | null is added by to_ts_param_type, not here
            ParamTypeIR::Option(inner) => inner.to_ts_param_type(),
            ParamTypeIR::TypeParam { .. } => "GenericArg".to_string(),
            ParamTypeIR::StringType { .. } | ParamTypeIR::ID => "string".to_string(),
        }
    }

    /// Generate the BCS type string for this type.
    pub fn to_bcs_type(&self, type_arg_count: usize) -> String {
        match self {
            ParamTypeIR::Primitive(p) => p.clone(),
            ParamTypeIR::Vector(inner) => {
                format!("vector<{}>", inner.to_bcs_type(type_arg_count))
            }
            ParamTypeIR::Struct {
                class_name,
                type_args,
            } => {
                if type_args.is_empty() {
                    format!("${{{}.$typeName}}", class_name)
                } else {
                    let args: Vec<_> = type_args
                        .iter()
                        .map(|ta| ta.to_bcs_type(type_arg_count))
                        .collect();
                    format!("${{{}.$typeName}}<{}>", class_name, args.join(", "))
                }
            }
            ParamTypeIR::Option(inner) => {
                format!(
                    "${{Option.$typeName}}<{}>",
                    inner.to_bcs_type(type_arg_count)
                )
            }
            ParamTypeIR::TypeParam { index, .. } => {
                if type_arg_count == 1 {
                    "${typeArg}".to_string()
                } else {
                    format!("${{typeArgs[{}]}}", index)
                }
            }
            ParamTypeIR::StringType { module } => {
                // String from string module or String1 from ascii module
                if module == "ascii" {
                    "${String1.$typeName}".to_string()
                } else {
                    "${String.$typeName}".to_string()
                }
            }
            ParamTypeIR::ID => "${ID.$typeName}".to_string(),
        }
    }

    /// Get the inner type for Option.
    pub fn option_inner(&self) -> Option<&ParamTypeIR> {
        match self {
            ParamTypeIR::Option(inner) => Some(inner),
            _ => None,
        }
    }

    /// Get the inner type for Vector.
    pub fn vector_inner(&self) -> Option<&ParamTypeIR> {
        match self {
            ParamTypeIR::Vector(inner) => Some(inner),
            _ => None,
        }
    }
}

/// A function parameter.
#[derive(Debug, Clone)]
pub struct FunctionParamIR {
    /// The TypeScript field name (camelCase).
    pub ts_name: String,
    /// The parameter type.
    pub param_type: ParamTypeIR,
}

/// Struct import needed by a function.
#[derive(Debug, Clone)]
pub struct FunctionStructImport {
    /// The class name to import.
    pub class_name: String,
    /// The import path (relative to functions.ts).
    pub path: String,
    /// Alias (if needed to avoid conflicts).
    pub alias: Option<String>,
}

/// Represents a Move function binding.
#[derive(Debug, Clone)]
pub struct FunctionIR {
    /// The Move function name.
    pub move_name: String,
    /// The TypeScript function name (camelCase).
    pub ts_name: String,
    /// The full target: `${PUBLISHED_AT}::module::function_name`
    pub module_name: String,
    /// Type parameter names (T, U, etc.).
    pub type_params: Vec<String>,
    /// Function parameters.
    pub params: Vec<FunctionParamIR>,
    /// Struct imports needed.
    pub struct_imports: Vec<FunctionStructImport>,
    /// Whether this function uses GenericArg.
    pub uses_generic: bool,
    /// Whether this function uses Option.
    pub uses_option: bool,
    /// Whether this function uses vector (non-pure).
    /// Utility imports that need aliasing (e.g., "generic" when param is "generic").
    pub aliased_util_imports: Vec<String>,
    pub uses_vector: bool,
    /// Whether this function uses pure.
    pub uses_pure: bool,
    /// Whether this function uses obj.
    pub uses_obj: bool,
}

impl FunctionIR {
    /// Generate the args interface name.
    fn args_interface_name(&self) -> String {
        // Convert directly from Move name to preserve digit-letter sequences
        let pascal_name = self.move_name.from_case(Case::Snake).to_case(Case::Pascal);
        if self.move_name.ends_with('_') {
            format!("{}_Args", pascal_name)
        } else {
            format!("{}Args", pascal_name)
        }
    }

    /// Generate the args interface (if needed).
    fn emit_args_interface(&self) -> String {
        if self.params.len() < 2 {
            return String::new();
        }

        let fields: Vec<_> = self
            .params
            .iter()
            .map(|p| format!("  {}: {}", p.ts_name, p.param_type.to_ts_param_type()))
            .collect();

        formatdoc! {r#"
            export interface {} {{
            {}
            }}"#,
            self.args_interface_name(),
            fields.join("\n"),
        }
    }

    /// Generate the function signature.
    fn emit_function_signature(&self) -> String {
        let has_type_params = !self.type_params.is_empty();
        let has_params = !self.params.is_empty();

        let type_arg_param = match self.type_params.len() {
            0 => String::new(),
            1 => "typeArg: string".to_string(),
            n => format!("typeArgs: [{}]", vec!["string"; n].join(", ")),
        };

        let params_part = match self.params.len() {
            0 => String::new(),
            1 => {
                let p = &self.params[0];
                let name = if is_reserved_word(&p.ts_name) {
                    format!("{}_", p.ts_name)
                } else {
                    p.ts_name.clone()
                };
                format!("{}: {}", name, p.param_type.to_ts_param_type())
            }
            _ => format!("args: {}", self.args_interface_name()),
        };

        // Build the parameters list with proper comma handling
        let all_params = match (has_type_params, has_params) {
            (true, true) => format!("{}, {}", type_arg_param, params_part),
            (true, false) => type_arg_param,
            (false, true) => params_part,
            (false, false) => String::new(),
        };

        format!(
            "export function {}(tx: Transaction, {})",
            self.ts_name, all_params
        )
    }

    /// Generate a single argument transformation.
    /// `module_aliased` contains util names that are aliased at module level.
    fn emit_arg(
        &self,
        param: &FunctionParamIR,
        accessor: &str,
        module_aliased: &std::collections::HashSet<String>,
    ) -> String {
        let type_arg_count = self.type_params.len();
        let bcs_type = param.param_type.to_bcs_type(type_arg_count);

        // Use aliased version if any function in the module needs it
        let alias_for = |util_name: &str| -> &str {
            if module_aliased.contains(util_name) {
                "_"
            } else {
                ""
            }
        };

        if param.param_type.is_pure() {
            format!(
                "pure{}(tx, {}, `{}`)",
                alias_for("pure"),
                accessor,
                bcs_type
            )
        } else if let Some(inner) = param.param_type.option_inner() {
            let inner_bcs = inner.to_bcs_type(type_arg_count);
            format!(
                "option{}(tx, `{}`, {})",
                alias_for("option"),
                inner_bcs,
                accessor
            )
        } else {
            match &param.param_type {
                ParamTypeIR::TypeParam { .. } => {
                    format!(
                        "generic{}(tx, `{}`, {})",
                        alias_for("generic"),
                        bcs_type,
                        accessor
                    )
                }
                ParamTypeIR::Vector(inner) => {
                    let inner_bcs = inner.to_bcs_type(type_arg_count);
                    format!(
                        "vector{}(tx, `{}`, {})",
                        alias_for("vector"),
                        inner_bcs,
                        accessor
                    )
                }
                _ => format!("obj{}(tx, {})", alias_for("obj"), accessor),
            }
        }
    }

    /// Generate the arguments array.
    fn emit_arguments(&self, module_aliased: &std::collections::HashSet<String>) -> String {
        if self.params.is_empty() {
            return "[]".to_string();
        }

        let args: Vec<_> = if self.params.len() == 1 {
            let p = &self.params[0];
            let name = if is_reserved_word(&p.ts_name) {
                format!("{}_", p.ts_name)
            } else {
                p.ts_name.clone()
            };
            vec![self.emit_arg(p, &name, module_aliased)]
        } else {
            self.params
                .iter()
                .map(|p| {
                    let accessor = format!("args.{}", p.ts_name);
                    self.emit_arg(p, &accessor, module_aliased)
                })
                .collect()
        };

        if args.len() == 1 {
            format!("[{}]", args[0])
        } else {
            format!("[\n      {},\n    ]", args.join(",\n      "))
        }
    }

    /// Generate the function body.
    pub fn emit_body(&self, module_aliased: &std::collections::HashSet<String>) -> String {
        let sig = self.emit_function_signature();
        let target = format!(
            "`${{PUBLISHED_AT}}::{}::{}`",
            self.module_name, self.move_name
        );

        let type_arguments_line = match self.type_params.len() {
            0 => String::new(),
            1 => "\n    typeArguments: [typeArg],".to_string(),
            _ => "\n    typeArguments: typeArgs,".to_string(),
        };

        let args = self.emit_arguments(module_aliased);

        formatdoc! {r#"
            {sig} {{
              return tx.moveCall({{
                target: {target},{type_arguments_line}
                arguments: {args},
              }})
            }}"#
        }
    }

    /// Generate the full function (interface + function).
    pub fn emit(&self, module_aliased: &std::collections::HashSet<String>) -> String {
        let interface = self.emit_args_interface();
        let body = self.emit_body(module_aliased);

        if interface.is_empty() {
            body
        } else {
            format!("{}\n\n{}", interface, body)
        }
    }
}

/// Generate imports for a module's functions.
///
/// Uses `TsImportsBuilder` for consistent, grouped imports.
pub fn emit_function_imports(functions: &[FunctionIR], framework_path: &str) -> String {
    use super::imports::TsImportsBuilder;

    let mut imports = TsImportsBuilder::new();

    // Always import PUBLISHED_AT
    imports.add_named("..", "PUBLISHED_AT");

    // Collect what util imports we need
    let uses_generic = functions.iter().any(|f| f.uses_generic);
    let uses_option = functions.iter().any(|f| f.uses_option);
    let uses_vector = functions.iter().any(|f| f.uses_vector);
    let uses_pure = functions.iter().any(|f| f.uses_pure);
    let uses_obj = functions.iter().any(|f| f.uses_obj);

    // Collect all aliased imports from all functions
    let aliased: std::collections::HashSet<String> = functions
        .iter()
        .flat_map(|f| f.aliased_util_imports.iter().cloned())
        .collect();

    let util_path = format!("{}/util", framework_path);

    if uses_generic {
        imports.add_named(&util_path, "GenericArg");
        if aliased.contains("generic") {
            imports.add_named_as(&util_path, "generic", "generic_");
        } else {
            imports.add_named(&util_path, "generic");
        }
    }
    if uses_obj {
        if aliased.contains("obj") {
            imports.add_named_as(&util_path, "obj", "obj_");
        } else {
            imports.add_named(&util_path, "obj");
        }
    }
    if uses_option {
        if aliased.contains("option") {
            imports.add_named_as(&util_path, "option", "option_");
        } else {
            imports.add_named(&util_path, "option");
        }
    }
    if uses_pure {
        if aliased.contains("pure") {
            imports.add_named_as(&util_path, "pure", "pure_");
        } else {
            imports.add_named(&util_path, "pure");
        }
    }
    if uses_vector {
        if aliased.contains("vector") {
            imports.add_named_as(&util_path, "vector", "vector_");
        } else {
            imports.add_named(&util_path, "vector");
        }
    }

    // Struct imports (from other modules)
    for f in functions {
        for si in &f.struct_imports {
            if let Some(alias) = &si.alias {
                imports.add_named_as(&si.path, &si.class_name, alias);
            } else {
                imports.add_named(&si.path, &si.class_name);
            }
        }
    }

    // Transaction types
    imports.add_named_many(
        "@mysten/sui/transactions",
        &["Transaction", "TransactionArgument"],
    );

    let needs_object_input = functions.iter().any(|f| {
        f.params.iter().any(|p| {
            matches!(
                p.param_type,
                ParamTypeIR::Struct { .. } | ParamTypeIR::Vector(_) | ParamTypeIR::Option(_)
            )
        })
    });
    if needs_object_input {
        imports.add_named("@mysten/sui/transactions", "TransactionObjectInput");
    }

    imports.emit()
}

/// Generate the full functions.ts file content.
pub fn emit_functions_file(functions: &[FunctionIR], framework_path: &str) -> String {
    if functions.is_empty() {
        return String::new();
    }

    // Collect all aliased imports from all functions in this module
    let module_aliased: std::collections::HashSet<String> = functions
        .iter()
        .flat_map(|f| f.aliased_util_imports.iter().cloned())
        .collect();

    let imports = emit_function_imports(functions, framework_path);
    let bodies: Vec<_> = functions.iter().map(|f| f.emit(&module_aliased)).collect();

    format!("{}\n\n{}\n", imports, bodies.join("\n\n"))
}
