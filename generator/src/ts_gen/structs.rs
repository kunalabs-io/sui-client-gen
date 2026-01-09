//! Struct class generation using coarse-grained IR.
//!
//! The IR captures domain concepts (struct name, fields, type params),
//! and emit() methods render them as TypeScript using formatdoc! templates.

use indoc::formatdoc;

use super::jsdoc::format_jsdoc;

// ============================================================================
// Struct IR - Domain-focused representation
// ============================================================================

/// Represents a Move struct for TypeScript code generation.
#[derive(Debug, Clone)]
pub struct StructIR {
    /// Struct name (e.g., "Clock", "Balance")
    pub name: String,
    /// Module and struct path (e.g., "clock::Clock")
    pub module_struct_path: String,
    /// Package address info for generating the full type name
    pub package_info: PackageInfo,
    /// Type parameters with phantom status
    pub type_params: Vec<TypeParamIR>,
    /// Fields with their types
    pub fields: Vec<FieldIR>,
    /// Imports needed for this struct (struct references in fields)
    pub struct_imports: Vec<StructImport>,
    /// Whether any field uses Vector type (requires reified namespace import)
    pub uses_vector: bool,
    /// Whether any field uses address type (requires fromHex/toHex imports)
    pub uses_address: bool,
    /// Whether any field has phantom struct type args (requires ToPhantom alias)
    pub uses_phantom_struct_args: bool,
    /// Whether there are non-phantom type params (requires TypeArgument, ToTypeArgument, toBcs, BcsType)
    pub has_non_phantom_type_params: bool,
    /// Whether fieldToJSON is needed (for Option, Vector, or certain struct types)
    pub uses_field_to_json: bool,
    /// Struct-level documentation from Move source
    pub doc_comment: Option<String>,
}

/// Package address information for generating full type names.
#[derive(Debug, Clone)]
pub enum PackageInfo {
    /// System package (0x1, 0x2, 0x3, etc.) - use literal address
    System { address: String },
    /// User package - use getTypeOrigin() call for dynamic environment lookup
    Dynamic {
        /// Kebab-case package name for env lookup
        pkg_name: String,
        /// "module::TypeName" path for type origin lookup
        module_type_path: String,
    },
}

/// A type parameter on a struct.
#[derive(Debug, Clone)]
pub struct TypeParamIR {
    /// Parameter name (e.g., "T", "T0", "T1")
    pub name: String,
    /// Whether this type parameter is phantom
    pub is_phantom: bool,
}

/// A field in a struct.
#[derive(Debug, Clone)]
pub struct FieldIR {
    /// TypeScript field name (camelCase, e.g., "timestampMs")
    pub ts_name: String,
    /// Move field name (snake_case, e.g., "timestamp_ms")
    pub move_name: String,
    /// The field type
    pub field_type: FieldTypeIR,
    /// Field-level documentation from Move source
    pub doc_comment: Option<String>,
}

/// Distinguishes between struct and enum datatypes.
/// Mirrors Move's Datatype concept to improve IR clarity.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum DatatypeKind {
    Struct,
    Enum,
}

/// Field type representation - simpler than full MoveTypeIR, focused on emission.
#[derive(Debug, Clone)]
pub enum FieldTypeIR {
    /// Primitive types: 'u8', 'u16', etc.
    Primitive(String),
    /// Vector<inner>
    Vector(Box<FieldTypeIR>),
    /// Reference to a datatype (struct or enum) e.g., UID, Coin<T>, Action
    Datatype {
        /// Class name to use in code (e.g., "UID", "Coin", "Action")
        /// This may be aliased (e.g., "StringString" for 0x1::string::String)
        class_name: String,
        /// Full Move type name for reliable matching (e.g., "0x1::string::String")
        full_type_name: String,
        /// Type arguments
        type_args: Vec<FieldTypeIR>,
        /// Whether each type arg position is phantom (based on parent datatype's declaration)
        type_arg_is_phantom: Vec<bool>,
        /// Whether this is a struct or enum
        kind: DatatypeKind,
    },
    /// Type parameter reference
    TypeParam {
        name: String,
        is_phantom: bool,
        /// Index of the type parameter (0-based)
        index: usize,
    },
}

/// Check if a type (by full type path) is "primitive-like" and should be
/// serialized directly to JSON without calling .toJSONField().
///
/// These are types from the Move stdlib that wrap simple values and serialize
/// as their inner value (string, etc.) rather than as structured objects.
pub fn is_primitive_like_type(full_type_name: &str) -> bool {
    matches!(
        full_type_name,
        // Object identifiers
        "0x2::object::UID" | "0x2::object::ID" |
        // String types
        "0x1::string::String" | "0x1::ascii::String" | "0x1::ascii::Char" |
        // URL type
        "0x2::url::Url" |
        // Type name
        "0x1::type_name::TypeName"
    )
}

/// Check if a type is the Option type from move-stdlib.
pub fn is_option_type(full_type_name: &str) -> bool {
    full_type_name == "0x1::option::Option"
}

/// Check if a type is the Balance type from sui-framework.
pub fn is_balance_type(full_type_name: &str) -> bool {
    full_type_name == "0x2::balance::Balance"
}

/// An import for a datatype (struct or enum) class from another module.
#[derive(Debug, Clone)]
pub struct DatatypeImport {
    /// Import path (e.g., "../object/structs")
    pub path: String,
    /// Class name (e.g., "UID", "Action")
    pub class_name: String,
    /// Optional alias if there's a name conflict
    pub alias: Option<String>,
}

/// Type alias for backwards compatibility during refactoring.
/// TODO: Remove this alias once all callers are updated.
pub type StructImport = DatatypeImport;

// ============================================================================
// Emission - Template-based code generation
// ============================================================================

impl StructIR {
    /// Emit the complete TypeScript code for this struct (without imports).
    /// Use `emit_with_imports` if you want a complete file.
    pub fn emit_body(&self) -> String {
        let mut sections = Vec::new();

        // Separator
        sections.push(format!(
            "/* ============================== {} =============================== */",
            self.name
        ));

        // Type guard function
        sections.push(self.emit_type_guard());

        // Fields interface
        sections.push(self.emit_fields_interface());

        // Reified type alias
        sections.push(self.emit_reified_type());

        // JSON type aliases
        sections.push(self.emit_json_types());

        // The main class
        sections.push(self.emit_class());

        sections.join("\n\n")
    }

    /// Emit a complete TypeScript file for this struct (with imports).
    ///
    /// NOTE: This is for testing only. In production, use module-level combined
    /// imports via `emit_combined_imports_with_enums()` from `builder.rs`.
    #[cfg(test)]
    fn emit(&self, framework_path: &str) -> String {
        let imports = self.emit_imports(framework_path);
        let body = self.emit_body();
        format!("{}\n\n{}", imports, body)
    }

    /// Emit import statements for this struct.
    ///
    /// NOTE: This is for testing only. In production, use module-level combined
    /// imports via `emit_combined_imports_with_enums()` from `builder.rs`.
    #[cfg(test)]
    fn emit_imports(&self, framework_path: &str) -> String {
        let mut lines = Vec::new();

        // Reified namespace import if vectors or phantom struct args are used
        if self.uses_vector || self.uses_phantom_struct_args {
            lines.push(format!(
                "import * as reified from '{}/reified'",
                framework_path
            ));
        }

        // Framework imports - these are always needed
        let mut framework_reified_imports = if self.type_params.is_empty() {
            vec![
                "PhantomReified",
                "Reified",
                "StructClass",
                "ToField",
                "ToJSON",
                "ToTypeStr",
                "decodeFromFields",
                "decodeFromFieldsWithTypes",
                "decodeFromJSONField",
                "phantom",
            ]
        } else {
            let mut imports = vec![
                "PhantomReified",
                "Reified",
                "StructClass",
                "ToField",
                "ToJSON",
                "ToTypeStr",
                "assertFieldsWithTypesArgsMatch",
                "assertReifiedTypeArgsMatch",
                "decodeFromFields",
                "decodeFromFieldsWithTypes",
                "decodeFromJSONField",
                "extractType",
                "phantom",
            ];
            // Add phantom-specific imports if any type params are phantom
            let has_phantom = self.type_params.iter().any(|p| p.is_phantom);
            if has_phantom {
                imports.push("PhantomToTypeStr");
                imports.push("PhantomTypeArgument");
                imports.push("ToPhantomTypeArgument");
            }
            // Add non-phantom-specific imports if any type params are non-phantom
            if self.has_non_phantom_type_params {
                imports.push("ToTypeArgument");
                imports.push("TypeArgument");
                imports.push("toBcs");
            }
            imports.sort();
            imports
        };

        // Add fieldToJSON if we have vectors (for JSON conversion)
        if self.uses_vector {
            framework_reified_imports.push("fieldToJSON");
        }

        // Add ToPhantom alias if phantom struct args are used
        let imports_str = if self.uses_phantom_struct_args {
            format!(
                "import {{\n  {},\n  ToTypeStr as ToPhantom,\n}} from '{}/reified'",
                framework_reified_imports.join(",\n  "),
                framework_path
            )
        } else {
            format!(
                "import {{\n  {},\n}} from '{}/reified'",
                framework_reified_imports.join(",\n  "),
                framework_path
            )
        };
        lines.push(imports_str);

        // Util imports
        let util_imports = if self.type_params.is_empty() {
            "FieldsWithTypes, composeSuiType, compressSuiType, SupportedSuiClient, fetchObjectBcs"
        } else {
            "FieldsWithTypes, composeSuiType, compressSuiType, parseTypeName, SupportedSuiClient, fetchObjectBcs"
        };
        lines.push(format!(
            "import {{ {} }} from '{}/util'",
            util_imports, framework_path
        ));

        // Vector import if needed
        if self.uses_vector {
            lines.push(format!(
                "import {{ Vector }} from '{}/vector'",
                framework_path
            ));
        }

        // Struct imports from other modules
        for imp in &self.struct_imports {
            let name = match &imp.alias {
                Some(alias) => format!("{} as {}", imp.class_name, alias),
                None => imp.class_name.clone(),
            };
            lines.push(format!("import {{ {} }} from '{}'", name, imp.path));
        }

        // BCS imports - add BcsType if non-phantom type params
        if self.has_non_phantom_type_params {
            lines.push("import { BcsType, bcs } from '@mysten/sui/bcs'".to_string());
        } else {
            lines.push("import { bcs } from '@mysten/sui/bcs'".to_string());
        }
        lines.push(
            "import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'".to_string(),
        );

        // Utils imports - add fromHex/toHex if addresses are used
        if self.uses_address {
            lines
                .push("import { fromBase64, fromHex, toHex } from '@mysten/sui/utils'".to_string());
        } else {
            lines.push("import { fromBase64 } from '@mysten/sui/utils'".to_string());
        }

        lines.join("\n")
    }

    fn emit_type_guard(&self) -> String {
        let full_type_template = self.full_type_name_template();

        if self.type_params.is_empty() {
            formatdoc! {r#"
                export function is{name}(type: string): boolean {{
                  type = compressSuiType(type)
                  return type === `{full_name}`
                }}"#,
                name = self.name,
                full_name = full_type_template,
            }
        } else {
            formatdoc! {r#"
                export function is{name}(type: string): boolean {{
                  type = compressSuiType(type)
                  return type.startsWith(`{full_name}` + '<')
                }}"#,
                name = self.name,
                full_name = full_type_template,
            }
        }
    }

    /// Generate the full type name template string (used in template literals)
    fn full_type_name_template(&self) -> String {
        match &self.package_info {
            PackageInfo::System { address } => {
                format!("{}::{}", address, self.module_struct_path)
            }
            PackageInfo::Dynamic {
                pkg_name,
                module_type_path,
            } => {
                format!(
                    "${{getTypeOrigin('{}', '{}')}}::{}",
                    pkg_name, module_type_path, self.module_struct_path
                )
            }
        }
    }

    /// Generate the full type name as a TypeScript type (for $fullTypeName type annotation)
    fn full_type_name_as_type(&self) -> String {
        match &self.package_info {
            PackageInfo::System { address } => {
                format!("`{}::{}`", address, self.module_struct_path)
            }
            PackageInfo::Dynamic { .. } => {
                // For dynamic packages, use template literal type with ${string} for the address part
                // This preserves type safety while allowing runtime address resolution
                format!("`${{string}}::{}`", self.module_struct_path)
            }
        }
    }

    /// Returns true if this struct uses dynamic environment lookups (non-system package)
    pub fn uses_env(&self) -> bool {
        matches!(&self.package_info, PackageInfo::Dynamic { .. })
    }

    fn emit_fields_interface(&self) -> String {
        let type_params_decl = self.emit_type_params_decl();

        let fields: Vec<String> = self
            .fields
            .iter()
            .map(|f| {
                let mut parts = Vec::new();
                if let Some(jsdoc) = format_jsdoc(&f.doc_comment, "  ") {
                    parts.push(jsdoc);
                }
                parts.push(format!("  {}: ToField<{}>", f.ts_name, f.field_type.to_ts_type()));
                parts.join("\n")
            })
            .collect();

        formatdoc! {r#"
            export interface {name}Fields{type_params} {{
            {fields}
            }}"#,
            name = self.name,
            type_params = type_params_decl,
            fields = fields.join("\n"),
        }
    }

    fn emit_reified_type(&self) -> String {
        let type_params_decl = self.emit_type_params_decl();
        let type_params_use = self.emit_type_params_use();

        formatdoc! {r#"
            export type {name}Reified{type_params_decl} = Reified<{name}{type_params_use}, {name}Fields{type_params_use}>"#,
            name = self.name,
            type_params_decl = type_params_decl,
            type_params_use = type_params_use,
        }
    }

    fn emit_json_types(&self) -> String {
        let type_params_decl = self.emit_type_params_decl();
        let type_params_use = self.emit_type_params_use();

        // Generate field types for JSONField
        let field_types: Vec<String> = self
            .fields
            .iter()
            .map(|f| format!("  {}: {}", f.ts_name, f.field_type.to_json_field_type()))
            .collect();

        let json_field_body = if field_types.is_empty() {
            "{}".to_string()
        } else {
            format!("{{\n{}\n}}", field_types.join("\n"))
        };

        // Generate $typeArgs array
        let type_args_array = if self.type_params.is_empty() {
            "[]".to_string()
        } else {
            self.emit_to_type_str_args()
        };

        formatdoc! {r#"
            export type {name}JSONField{type_params_decl} = {json_field_body}

            export type {name}JSON{type_params_decl} = {{
              $typeName: typeof {name}.$typeName
              $typeArgs: {type_args_array}
            }} & {name}JSONField{type_params_use}"#,
            name = self.name,
            type_params_decl = type_params_decl,
            type_params_use = type_params_use,
            json_field_body = json_field_body,
            type_args_array = type_args_array,
        }
    }

    fn emit_class(&self) -> String {
        // For now, handle the no-type-params case
        if self.type_params.is_empty() {
            self.emit_class_no_type_params()
        } else {
            self.emit_class_with_type_params()
        }
    }

    fn emit_class_no_type_params(&self) -> String {
        let full_type_template = self.full_type_name_template();
        let full_type_as_type = self.full_type_name_as_type();

        let field_decls: Vec<String> = self
            .fields
            .iter()
            .map(|f| {
                let mut parts = Vec::new();
                // Add field JSDoc if available
                if let Some(jsdoc) = format_jsdoc(&f.doc_comment, "  ") {
                    parts.push(jsdoc);
                }
                parts.push(format!(
                    "  readonly {}: ToField<{}>",
                    f.ts_name,
                    f.field_type.to_ts_type()
                ));
                parts.join("\n")
            })
            .collect();

        let field_assignments: Vec<String> = self
            .fields
            .iter()
            .map(|f| format!("    this.{} = fields.{}", f.ts_name, f.ts_name))
            .collect();

        let bcs_fields: Vec<String> = self
            .fields
            .iter()
            .map(|f| format!("      {}: {},", f.move_name, f.field_type.to_bcs()))
            .collect();

        let from_fields_decodes: Vec<String> = self
            .fields
            .iter()
            .map(|f| {
                format!(
                    "      {}: decodeFromFields({}, fields.{}),",
                    f.ts_name,
                    f.field_type.to_reified(),
                    f.move_name
                )
            })
            .collect();

        let from_fields_with_types_decodes: Vec<String> = self
            .fields
            .iter()
            .map(|f| {
                format!(
                    "      {}: decodeFromFieldsWithTypes({}, item.fields.{}),",
                    f.ts_name,
                    f.field_type.to_reified(),
                    f.move_name
                )
            })
            .collect();

        let to_json_fields: Vec<String> = self
            .fields
            .iter()
            .map(|f| f.field_type.to_json_field(&f.ts_name))
            .collect();

        let from_json_decodes: Vec<String> = self
            .fields
            .iter()
            .map(|f| {
                format!(
                    "      {}: decodeFromJSONField({}, field.{}),",
                    f.ts_name,
                    f.field_type.to_reified(),
                    f.ts_name
                )
            })
            .collect();

        let class_body = formatdoc! {r#"
            export class {name} implements StructClass {{
              __StructClass = true as const

              static readonly $typeName: {full_type_as_type} = `{full_type_template}` as const
              static readonly $numTypeParams = 0
              static readonly $isPhantom = [] as const

              readonly $typeName: typeof {name}.$typeName = {name}.$typeName
              readonly $fullTypeName: {full_type_as_type}
              readonly $typeArgs: []
              readonly $isPhantom: typeof {name}.$isPhantom = {name}.$isPhantom

            {field_decls}

              private constructor(typeArgs: [], fields: {name}Fields) {{
                this.$fullTypeName = composeSuiType(
                  {name}.$typeName,
                  ...typeArgs
                ) as {full_type_as_type}
                this.$typeArgs = typeArgs

            {field_assignments}
              }}

              static reified(): {name}Reified {{
                const reifiedBcs = {name}.bcs
                return {{
                  typeName: {name}.$typeName,
                  fullTypeName: composeSuiType(
                    {name}.$typeName,
                    ...[]
                  ) as {full_type_as_type},
                  typeArgs: [] as [],
                  isPhantom: {name}.$isPhantom,
                  reifiedTypeArgs: [],
                  fromFields: (fields: Record<string, any>) => {name}.fromFields(fields),
                  fromFieldsWithTypes: (item: FieldsWithTypes) => {name}.fromFieldsWithTypes(item),
                  fromBcs: (data: Uint8Array) => {name}.fromFields(reifiedBcs.parse(data)),
                  bcs: reifiedBcs,
                  fromJSONField: (field: any) => {name}.fromJSONField(field),
                  fromJSON: (json: Record<string, any>) => {name}.fromJSON(json),
                  fromSuiParsedData: (content: SuiParsedData) => {name}.fromSuiParsedData(content),
                  fromSuiObjectData: (content: SuiObjectData) => {name}.fromSuiObjectData(content),
                  fetch: async (client: SupportedSuiClient, id: string) => {name}.fetch(client, id),
                  new: (fields: {name}Fields) => {{
                    return new {name}([], fields)
                  }},
                  kind: 'StructClassReified',
                }}
              }}

              static get r(): {name}Reified {{
                return {name}.reified()
              }}

              static phantom(): PhantomReified<ToTypeStr<{name}>> {{
                return phantom({name}.reified())
              }}

              static get p(): PhantomReified<ToTypeStr<{name}>> {{
                return {name}.phantom()
              }}

              private static instantiateBcs() {{
                return bcs.struct('{name}', {{
            {bcs_fields}
                }})
              }}

              private static cachedBcs: ReturnType<typeof {name}.instantiateBcs> | null = null

              static get bcs(): ReturnType<typeof {name}.instantiateBcs> {{
                if (!{name}.cachedBcs) {{
                  {name}.cachedBcs = {name}.instantiateBcs()
                }}
                return {name}.cachedBcs
              }}

              static fromFields(fields: Record<string, any>): {name} {{
                return {name}.reified().new({{
            {from_fields_decodes}
                }})
              }}

              static fromFieldsWithTypes(item: FieldsWithTypes): {name} {{
                if (!is{name}(item.type)) {{
                  throw new Error('not a {name} type')
                }}

                return {name}.reified().new({{
            {from_fields_with_types_decodes}
                }})
              }}

              static fromBcs(data: Uint8Array): {name} {{
                return {name}.fromFields({name}.bcs.parse(data))
              }}

              toJSONField(): {name}JSONField {{
                return {{
            {to_json_fields}
                }}
              }}

              toJSON(): {name}JSON {{
                return {{ $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }}
              }}

              static fromJSONField(field: any): {name} {{
                return {name}.reified().new({{
            {from_json_decodes}
                }})
              }}

              static fromJSON(json: Record<string, any>): {name} {{
                if (json.$typeName !== {name}.$typeName) {{
                  throw new Error(`not a {name} json object: expected '${{{name}.$typeName}}' but got '${{json.$typeName}}'`)
                }}

                return {name}.fromJSONField(json)
              }}

              static fromSuiParsedData(content: SuiParsedData): {name} {{
                if (content.dataType !== 'moveObject') {{
                  throw new Error('not an object')
                }}
                if (!is{name}(content.type)) {{
                  throw new Error(`object at ${{(content.fields as any).id}} is not a {name} object`)
                }}
                return {name}.fromFieldsWithTypes(content)
              }}

              static fromSuiObjectData(data: SuiObjectData): {name} {{
                if (data.bcs) {{
                  if (data.bcs.dataType !== 'moveObject' || !is{name}(data.bcs.type)) {{
                    throw new Error(`object at is not a {name} object`)
                  }}

                  return {name}.fromBcs(fromBase64(data.bcs.bcsBytes))
                }}
                if (data.content) {{
                  return {name}.fromSuiParsedData(data.content)
                }}
                throw new Error(
                  'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
                )
              }}

              static async fetch(client: SupportedSuiClient, id: string): Promise<{name}> {{
                const res = await fetchObjectBcs(client, id)
                if (!is{name}(res.type)) {{
                  throw new Error(`object at id ${{id}} is not a {name} object`)
                }}

                return {name}.fromBcs(res.bcsBytes)
              }}
            }}"#,
            name = self.name,
            full_type_template = full_type_template,
            full_type_as_type = full_type_as_type,
            field_decls = field_decls.join("\n"),
            field_assignments = field_assignments.join("\n"),
            bcs_fields = bcs_fields.join("\n"),
            from_fields_decodes = from_fields_decodes.join("\n"),
            from_fields_with_types_decodes = from_fields_with_types_decodes.join("\n"),
            to_json_fields = to_json_fields.join("\n"),
            from_json_decodes = from_json_decodes.join("\n"),
        };

        // Add struct-level JSDoc if available
        if let Some(jsdoc) = format_jsdoc(&self.doc_comment, "") {
            format!("{}\n{}", jsdoc, class_body)
        } else {
            class_body
        }
    }

    fn emit_class_with_type_params(&self) -> String {
        let full_type_template = self.full_type_name_template();
        let full_type_as_type_no_generics = self.full_type_name_as_type();

        // Build various type-param-related strings
        let type_param_extends = self.emit_type_param_extends();
        let type_params_use = self.emit_type_params_use();
        let is_phantom_array = self.emit_is_phantom_array();
        let full_type_name_with_generics = self.emit_full_type_with_generics();
        let full_type_as_type_with_generics = self.emit_full_type_as_type_with_generics();
        let type_args_field_type = self.emit_type_args_field_type();
        let reified_type_params = self.emit_reified_type_params();
        let to_phantom_type_args = self.emit_to_phantom_type_args();
        let extract_types = self.emit_extract_types();
        let reified_args_list = self.emit_reified_args_list();

        let field_decls: Vec<String> = self
            .fields
            .iter()
            .map(|f| {
                let mut parts = Vec::new();
                // Add field JSDoc if available
                if let Some(jsdoc) = format_jsdoc(&f.doc_comment, "  ") {
                    parts.push(jsdoc);
                }
                parts.push(format!(
                    "  readonly {}: ToField<{}>",
                    f.ts_name,
                    f.field_type.to_ts_type()
                ));
                parts.join("\n")
            })
            .collect();

        let field_assignments: Vec<String> = self
            .fields
            .iter()
            .map(|f| format!("    this.{} = fields.{}", f.ts_name, f.ts_name))
            .collect();

        let bcs_fields: Vec<String> = self
            .fields
            .iter()
            .map(|f| format!("      {}: {},", f.move_name, f.field_type.to_bcs()))
            .collect();

        let num_type_params = self.type_params.len();

        let from_fields_decodes: Vec<String> = self
            .fields
            .iter()
            .map(|f| {
                format!(
                    "      {}: decodeFromFields({}, fields.{}),",
                    f.ts_name,
                    f.field_type.to_reified_runtime(num_type_params),
                    f.move_name
                )
            })
            .collect();

        let from_fields_with_types_decodes: Vec<String> = self
            .fields
            .iter()
            .map(|f| {
                format!(
                    "      {}: decodeFromFieldsWithTypes({}, item.fields.{}),",
                    f.ts_name,
                    f.field_type.to_reified_runtime(num_type_params),
                    f.move_name
                )
            })
            .collect();

        let to_json_fields: Vec<String> = self
            .fields
            .iter()
            .map(|f| f.field_type.to_json_field(&f.ts_name))
            .collect();

        let from_json_decodes: Vec<String> = self
            .fields
            .iter()
            .map(|f| {
                format!(
                    "      {}: decodeFromJSONField({}, field.{}),",
                    f.ts_name,
                    f.field_type.to_reified_runtime(num_type_params),
                    f.ts_name
                )
            })
            .collect();

        // __inner fields for non-phantom type params
        let inner_fields = self.emit_inner_fields();
        let inner_fields_section = if inner_fields.is_empty() {
            String::new()
        } else {
            format!("\n{}\n", inner_fields)
        };

        // BCS section - different for phantom-only vs non-phantom type params
        let bcs_section = if self.has_non_phantom_type_params {
            // Non-phantom: BCS is a function that takes BCS types
            let bcs_type_params = self.emit_bcs_type_params();
            let bcs_params = self.emit_bcs_params();
            // Build the struct name template: `Option<${Element.name}>` or `Pair<${A.name}, ${B.name}>`
            let bcs_struct_name_parts: Vec<String> = self
                .type_params
                .iter()
                .filter(|p| !p.is_phantom)
                .map(|p| format!("${{{}.name}}", p.name))
                .collect();
            let bcs_struct_name = format!("`{}<{}>`", self.name, bcs_struct_name_parts.join(", "));
            formatdoc! {r#"
              private static instantiateBcs() {{
                return {bcs_type_params}{bcs_params} =>
                  bcs.struct({bcs_struct_name}, {{
            {bcs_fields}
                  }})
              }}

              private static cachedBcs: ReturnType<typeof {name}.instantiateBcs> | null = null

              static get bcs(): ReturnType<typeof {name}.instantiateBcs> {{
                if (!{name}.cachedBcs) {{
                  {name}.cachedBcs = {name}.instantiateBcs()
                }}
                return {name}.cachedBcs
              }}"#,
                name = self.name,
                bcs_type_params = bcs_type_params,
                bcs_params = bcs_params,
                bcs_struct_name = bcs_struct_name,
                bcs_fields = bcs_fields.join("\n"),
            }
        } else {
            // Phantom-only: BCS is a static value
            formatdoc! {r#"
              private static instantiateBcs() {{
                return bcs.struct('{name}', {{
            {bcs_fields}
                }})
              }}

              private static cachedBcs: ReturnType<typeof {name}.instantiateBcs> | null = null

              static get bcs(): ReturnType<typeof {name}.instantiateBcs> {{
                if (!{name}.cachedBcs) {{
                  {name}.cachedBcs = {name}.instantiateBcs()
                }}
                return {name}.cachedBcs
              }}"#,
                name = self.name,
                bcs_fields = bcs_fields.join("\n"),
            }
        };

        // reifiedBcs initialization - different for phantom-only vs non-phantom
        let reified_bcs_init = if self.has_non_phantom_type_params {
            // For non-phantom: call bcs with toBcs() wrapped args (only for non-phantom params!)
            let to_bcs_args: Vec<String> = self
                .type_params
                .iter()
                .filter(|p| !p.is_phantom)
                .map(|p| format!("toBcs({})", p.name))
                .collect();
            format!("{}.bcs({})", self.name, to_bcs_args.join(", "))
        } else {
            format!("{}.bcs", self.name)
        };

        // fromBcs body - different for phantom-only vs non-phantom
        let from_bcs_body = if self.has_non_phantom_type_params {
            // For non-phantom: need to call bcs(toBcs(...)) pattern
            // Only include non-phantom type params in toBcs calls
            let type_args_for_call = self.emit_type_args_for_call();
            let to_bcs_calls: Vec<String> = if self.type_params.len() == 1 {
                vec!["toBcs(typeArg)".to_string()]
            } else {
                self.type_params
                    .iter()
                    .enumerate()
                    .filter(|(_, p)| !p.is_phantom)
                    .map(|(i, _)| format!("toBcs(typeArgs[{}])", i))
                    .collect()
            };
            if self.type_params.len() == 1 {
                // Single param: need to create typeArgs array
                format!(
                    "const typeArgs = [typeArg]\n                return {}.fromFields({}, {}.bcs({}).parse(data))",
                    self.name,
                    type_args_for_call,
                    self.name,
                    to_bcs_calls.join(", ")
                )
            } else {
                // Multi params: typeArgs is already the parameter
                format!(
                    "return {}.fromFields({}, {}.bcs({}).parse(data))",
                    self.name,
                    type_args_for_call,
                    self.name,
                    to_bcs_calls.join(", ")
                )
            }
        } else {
            format!(
                "return {}.fromFields({}, {}.bcs.parse(data))",
                self.name,
                self.emit_type_args_for_call(),
                self.name
            )
        };

        let class_body = formatdoc! {r#"
            export class {name}{type_param_extends} implements StructClass {{
              __StructClass = true as const

              static readonly $typeName: {full_type_as_type_no_generics} = `{full_type_template}` as const
              static readonly $numTypeParams = {num_type_params}
              static readonly $isPhantom = {is_phantom_array} as const
            {inner_fields_section}
              readonly $typeName: typeof {name}.$typeName = {name}.$typeName
              readonly $fullTypeName: {full_type_name_with_generics}
              readonly $typeArgs: {type_args_field_type}
              readonly $isPhantom: typeof {name}.$isPhantom = {name}.$isPhantom

            {field_decls}

              private constructor(typeArgs: {type_args_field_type}, fields: {name}Fields{type_params_use}) {{
                this.$fullTypeName = composeSuiType(
                  {name}.$typeName,
                  ...typeArgs
                ) as {full_type_name_with_generics}
                this.$typeArgs = typeArgs

            {field_assignments}
              }}

              static reified{reified_type_params}(
                {reified_args_list}
              ): {name}Reified{to_phantom_type_args} {{
                const reifiedBcs = {reified_bcs_init}
                return {{
                  typeName: {name}.$typeName,
                  fullTypeName: composeSuiType(
                    {name}.$typeName,
                    ...[{extract_types}]
                  ) as {full_type_as_type_with_generics},
                  typeArgs: [{extract_types}] as {type_args_as_phantom},
                  isPhantom: {name}.$isPhantom,
                  reifiedTypeArgs: [{reified_arg_names}],
                  fromFields: (fields: Record<string, any>) => {name}.fromFields({reified_args_for_static}, fields),
                  fromFieldsWithTypes: (item: FieldsWithTypes) => {name}.fromFieldsWithTypes({reified_args_for_static}, item),
                  fromBcs: (data: Uint8Array) => {name}.fromFields({reified_args_for_static}, reifiedBcs.parse(data)),
                  bcs: reifiedBcs,
                  fromJSONField: (field: any) => {name}.fromJSONField({reified_args_for_static}, field),
                  fromJSON: (json: Record<string, any>) => {name}.fromJSON({reified_args_for_static}, json),
                  fromSuiParsedData: (content: SuiParsedData) => {name}.fromSuiParsedData({reified_args_for_static}, content),
                  fromSuiObjectData: (content: SuiObjectData) => {name}.fromSuiObjectData({reified_args_for_static}, content),
                  fetch: async (client: SupportedSuiClient, id: string) => {name}.fetch(client, {reified_args_for_static}, id),
                  new: (fields: {name}Fields{to_phantom_type_args}) => {{
                    return new {name}([{extract_types}], fields)
                  }},
                  kind: 'StructClassReified',
                }}
              }}

              static get r(): typeof {name}.reified {{
                return {name}.reified
              }}

              static phantom{reified_type_params}(
                {reified_args_list}
              ): PhantomReified<ToTypeStr<{name}{to_phantom_type_args}>> {{
                return phantom({name}.reified({reified_arg_names}))
              }}

              static get p(): typeof {name}.phantom {{
                return {name}.phantom
              }}

            {bcs_section}

              static fromFields{reified_type_params}(
                {reified_arg_first}
                fields: Record<string, any>
              ): {name}{to_phantom_type_args} {{
                return {name}.reified({reified_arg_vars}).new({{
            {from_fields_decodes}
                }})
              }}

              static fromFieldsWithTypes{reified_type_params}(
                {reified_arg_first}
                item: FieldsWithTypes
              ): {name}{to_phantom_type_args} {{
                if (!is{name}(item.type)) {{
                  throw new Error('not a {name} type')
                }}
                assertFieldsWithTypesArgsMatch(item, {type_args_array})

                return {name}.reified({reified_arg_vars}).new({{
            {from_fields_with_types_decodes}
                }})
              }}

              static fromBcs{reified_type_params}(
                {reified_arg_first}
                data: Uint8Array
              ): {name}{to_phantom_type_args} {{
                {from_bcs_body}
              }}

              toJSONField(): {name}JSONField{type_params_use} {{
                return {{
            {to_json_fields}
                }}
              }}

              toJSON(): {name}JSON{type_params_use} {{
                return {{ $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }}
              }}

              static fromJSONField{reified_type_params}(
                {reified_arg_first}
                field: any
              ): {name}{to_phantom_type_args} {{
                return {name}.reified({reified_arg_vars}).new({{
            {from_json_decodes}
                }})
              }}

              static fromJSON{reified_type_params}(
                {reified_arg_first}
                json: Record<string, any>
              ): {name}{to_phantom_type_args} {{
                if (json.$typeName !== {name}.$typeName) {{
                  throw new Error(`not a {name} json object: expected '${{{name}.$typeName}}' but got '${{json.$typeName}}'`)
                }}
                assertReifiedTypeArgsMatch(
                  composeSuiType({name}.$typeName, {extract_type_vars}),
                  json.$typeArgs,
                  {type_args_array}
                )

                return {name}.fromJSONField({type_args_for_call}, json)
              }}

              static fromSuiParsedData{reified_type_params}(
                {reified_arg_first}
                content: SuiParsedData
              ): {name}{to_phantom_type_args} {{
                if (content.dataType !== 'moveObject') {{
                  throw new Error('not an object')
                }}
                if (!is{name}(content.type)) {{
                  throw new Error(`object at ${{(content.fields as any).id}} is not a {name} object`)
                }}
                return {name}.fromFieldsWithTypes({type_args_for_call}, content)
              }}

              static fromSuiObjectData{reified_type_params}(
                {reified_arg_first}
                data: SuiObjectData
              ): {name}{to_phantom_type_args} {{
                if (data.bcs) {{
                  if (data.bcs.dataType !== 'moveObject' || !is{name}(data.bcs.type)) {{
                    throw new Error(`object at is not a {name} object`)
                  }}

                  const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
                  if (gotTypeArgs.length !== {num_type_params}) {{
                    throw new Error(
                      `type argument mismatch: expected {num_type_params} type arguments but got '${{gotTypeArgs.length}}'`
                    )
                  }}
                  {type_arg_checks}

                  return {name}.fromBcs({type_args_for_call}, fromBase64(data.bcs.bcsBytes))
                }}
                if (data.content) {{
                  return {name}.fromSuiParsedData({type_args_for_call}, data.content)
                }}
                throw new Error(
                  'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
                )
              }}

              static async fetch{reified_type_params}(
                client: SupportedSuiClient,
                {reified_arg_first}
                id: string
              ): Promise<{name}{to_phantom_type_args}> {{
                const res = await fetchObjectBcs(client, id)
                if (!is{name}(res.type)) {{
                  throw new Error(`object at id ${{id}} is not a {name} object`)
                }}

                return {name}.fromBcs({type_args_for_call}, res.bcsBytes)
              }}
            }}"#,
            name = self.name,
            full_type_template = full_type_template,
            num_type_params = num_type_params,
            type_param_extends = type_param_extends,
            type_params_use = type_params_use,
            is_phantom_array = is_phantom_array,
            full_type_name_with_generics = full_type_name_with_generics,
            full_type_as_type_with_generics = full_type_as_type_with_generics,
            type_args_field_type = type_args_field_type,
            type_args_as_phantom = self.emit_type_args_as_phantom(),
            reified_type_params = reified_type_params,
            to_phantom_type_args = to_phantom_type_args,
            extract_types = extract_types,
            extract_type_vars = self.emit_extract_type_vars(),
            inner_fields_section = inner_fields_section,
            reified_bcs_init = reified_bcs_init,
            reified_args_list = reified_args_list,
            reified_arg_names = self.emit_reified_arg_names(),
            reified_args_for_static = self.emit_reified_args_for_static(),
            reified_arg_vars = self.emit_reified_arg_vars(),
            reified_arg_first = self.emit_reified_arg_first(),
            type_args_array = self.emit_type_args_array(),
            type_args_for_call = self.emit_type_args_for_call(),
            type_arg_checks = self.emit_type_arg_checks(),
            bcs_section = bcs_section,
            from_bcs_body = from_bcs_body,
            field_decls = field_decls.join("\n"),
            field_assignments = field_assignments.join("\n"),
            from_fields_decodes = from_fields_decodes.join("\n"),
            from_fields_with_types_decodes = from_fields_with_types_decodes.join("\n"),
            to_json_fields = to_json_fields.join("\n"),
            from_json_decodes = from_json_decodes.join("\n"),
        };

        // Add struct-level JSDoc if available
        if let Some(jsdoc) = format_jsdoc(&self.doc_comment, "") {
            format!("{}\n{}", jsdoc, class_body)
        } else {
            class_body
        }
    }

    // ========================================================================
    // Non-phantom BCS helpers
    // ========================================================================

    /// Emit BCS type param constraints for non-phantom params: `<Element extends BcsType<any>>`
    fn emit_bcs_type_params(&self) -> String {
        let params: Vec<String> = self
            .type_params
            .iter()
            .filter(|p| !p.is_phantom)
            .map(|p| format!("{} extends BcsType<any>", p.name))
            .collect();
        if params.is_empty() {
            String::new()
        } else {
            format!("<{}>", params.join(", "))
        }
    }

    /// Emit BCS params for instantiateBcs: `(Element: Element)`
    fn emit_bcs_params(&self) -> String {
        let params: Vec<String> = self
            .type_params
            .iter()
            .filter(|p| !p.is_phantom)
            .map(|p| format!("{}: {}", p.name, p.name))
            .collect();
        if params.is_empty() {
            String::new()
        } else {
            format!("({})", params.join(", "))
        }
    }

    /// Emit __inner field - only for 0x1::option::Option
    fn emit_inner_fields(&self) -> String {
        // __inner is only generated for the specific Option type from move-stdlib
        if let PackageInfo::System { address } = &self.package_info {
            if address == "0x1" && self.name == "Option" && self.type_params.len() == 1 {
                let param = &self.type_params[0];
                return format!(
                    "  __inner: {} = null as unknown as {} // for type checking in reified.ts",
                    param.name, param.name
                );
            }
        }
        String::new()
    }

    // ========================================================================
    // Type parameter helpers
    // ========================================================================

    /// Emit type param extends for class declaration: `<T extends PhantomTypeArgument>`
    fn emit_type_param_extends(&self) -> String {
        if self.type_params.is_empty() {
            return String::new();
        }

        let params: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                let extends = if p.is_phantom {
                    "PhantomTypeArgument"
                } else {
                    "TypeArgument"
                };
                format!("{} extends {}", p.name, extends)
            })
            .collect();

        format!("<{}>", params.join(", "))
    }

    /// Emit `[true, false]` for $isPhantom
    fn emit_is_phantom_array(&self) -> String {
        let phantoms: Vec<String> = self
            .type_params
            .iter()
            .map(|p| if p.is_phantom { "true" } else { "false" }.to_string())
            .collect();
        format!("[{}]", phantoms.join(", "))
    }

    /// Emit full type with generics for $fullTypeName type: `\`0x2::balance::Supply<${PhantomToTypeStr<T>}>\``
    fn emit_full_type_with_generics(&self) -> String {
        let type_args: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("${{PhantomToTypeStr<{}>}}", p.name)
                } else {
                    format!("${{ToTypeStr<{}>}}", p.name)
                }
            })
            .collect();

        match &self.package_info {
            PackageInfo::System { address } => {
                format!(
                    "`{}::{}<{}>`",
                    address,
                    self.module_struct_path,
                    type_args.join(", ")
                )
            }
            PackageInfo::Dynamic { .. } => {
                // For dynamic packages, use template literal type with ${string} for the address part
                // This preserves type safety while allowing runtime address resolution
                format!(
                    "`${{string}}::{}<{}>`",
                    self.module_struct_path,
                    type_args.join(", ")
                )
            }
        }
    }

    /// Emit full type as type for reified return: used in reified() return type
    fn emit_full_type_as_type_with_generics(&self) -> String {
        let type_args: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("${{PhantomToTypeStr<ToPhantomTypeArgument<{}>>}}", p.name)
                } else {
                    format!("${{ToTypeStr<ToTypeArgument<{}>>}}", p.name)
                }
            })
            .collect();

        match &self.package_info {
            PackageInfo::System { address } => {
                format!(
                    "`{}::{}<{}>`",
                    address,
                    self.module_struct_path,
                    type_args.join(", ")
                )
            }
            PackageInfo::Dynamic { .. } => {
                // For dynamic packages, use template literal type with ${string} for the address part
                // This preserves type safety while allowing runtime address resolution
                format!(
                    "`${{string}}::{}<{}>`",
                    self.module_struct_path,
                    type_args.join(", ")
                )
            }
        }
    }

    /// Emit type args field type: `[PhantomToTypeStr<T>]`
    fn emit_type_args_field_type(&self) -> String {
        let types: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("PhantomToTypeStr<{}>", p.name)
                } else {
                    format!("ToTypeStr<{}>", p.name)
                }
            })
            .collect();
        format!("[{}]", types.join(", "))
    }

    /// Emit type args as phantom for typeArgs in reified
    fn emit_type_args_as_phantom(&self) -> String {
        let types: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("PhantomToTypeStr<ToPhantomTypeArgument<{}>>", p.name)
                } else {
                    format!("ToTypeStr<ToTypeArgument<{}>>", p.name)
                }
            })
            .collect();
        format!("[{}]", types.join(", "))
    }

    /// Emit reified type params: `<T extends PhantomReified<PhantomTypeArgument>>`
    fn emit_reified_type_params(&self) -> String {
        let params: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("{} extends PhantomReified<PhantomTypeArgument>", p.name)
                } else {
                    format!("{} extends Reified<TypeArgument, any>", p.name)
                }
            })
            .collect();
        format!("<{}>", params.join(", "))
    }

    /// Emit ToPhantomTypeArgument type args: `<ToPhantomTypeArgument<T>>`
    fn emit_to_phantom_type_args(&self) -> String {
        let types: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("ToPhantomTypeArgument<{}>", p.name)
                } else {
                    format!("ToTypeArgument<{}>", p.name)
                }
            })
            .collect();
        format!("<{}>", types.join(", "))
    }

    /// Emit extract types using type param names: `extractType(T), extractType(U)`
    fn emit_extract_types(&self) -> String {
        self.type_params
            .iter()
            .map(|p| format!("extractType({})", p.name))
            .collect::<Vec<_>>()
            .join(", ")
    }

    /// Emit extract types using spread: `...[extractType(typeArg)]` or `...typeArgs.map(extractType)`
    fn emit_extract_type_vars(&self) -> String {
        if self.type_params.len() == 1 {
            "...[extractType(typeArg)]".to_string()
        } else {
            "...typeArgs.map(extractType)".to_string()
        }
    }

    /// Emit reified args list: `T: T, U: U`
    fn emit_reified_args_list(&self) -> String {
        self.type_params
            .iter()
            .map(|p| format!("{}: {}", p.name, p.name))
            .collect::<Vec<_>>()
            .join(", ")
    }

    /// Emit ToTypeStr args for JSON type alias: `[ToTypeStr<T>, ToTypeStr<U>]` or `[PhantomToTypeStr<T>]` for phantom params
    fn emit_to_type_str_args(&self) -> String {
        if self.type_params.is_empty() {
            return "[]".to_string();
        }

        let args: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                if p.is_phantom {
                    format!("PhantomToTypeStr<{}>", p.name)
                } else {
                    format!("ToTypeStr<{}>", p.name)
                }
            })
            .collect();

        format!("[{}]", args.join(", "))
    }

    /// Emit reified arg names for class reified() method: `T, U`
    fn emit_reified_arg_names(&self) -> String {
        self.type_params
            .iter()
            .map(|p| p.name.clone())
            .collect::<Vec<_>>()
            .join(", ")
    }

    /// Emit reified args for passing to static methods: `T` or `[A, B]`
    fn emit_reified_args_for_static(&self) -> String {
        if self.type_params.len() == 1 {
            self.type_params[0].name.clone()
        } else {
            let names: Vec<_> = self.type_params.iter().map(|p| p.name.clone()).collect();
            format!("[{}]", names.join(", "))
        }
    }

    /// Emit reified arg var names for static methods: `typeArg` or `typeArgs[0], typeArgs[1]`
    fn emit_reified_arg_vars(&self) -> String {
        if self.type_params.len() == 1 {
            "typeArg".to_string()
        } else {
            (0..self.type_params.len())
                .map(|i| format!("typeArgs[{}]", i))
                .collect::<Vec<_>>()
                .join(", ")
        }
    }

    /// Emit type args array for passing to assertFieldsWithTypesArgsMatch: `[typeArg]` or `typeArgs`
    fn emit_type_args_array(&self) -> String {
        if self.type_params.len() == 1 {
            "[typeArg]".to_string()
        } else {
            "typeArgs".to_string()
        }
    }

    /// Emit type args for passing to static methods: `typeArg` or `typeArgs`
    fn emit_type_args_for_call(&self) -> String {
        if self.type_params.len() == 1 {
            "typeArg".to_string()
        } else {
            "typeArgs".to_string()
        }
    }

    /// Emit first arg for static methods: `typeArg: T,` or `typeArgs: [A, B],`
    fn emit_reified_arg_first(&self) -> String {
        if self.type_params.len() == 1 {
            format!("typeArg: {},", self.type_params[0].name)
        } else {
            let types: Vec<_> = self.type_params.iter().map(|p| p.name.clone()).collect();
            format!("typeArgs: [{}],", types.join(", "))
        }
    }

    /// Emit type argument checks in fromSuiObjectData
    fn emit_type_arg_checks(&self) -> String {
        let num_params = self.type_params.len();
        let type_args_ref = if num_params == 1 {
            "[typeArg]"
        } else {
            "typeArgs"
        };
        format!(
            r#"for (let i = 0; i < {num_params}; i++) {{
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType({type_args_ref}[i]))
        if (gotTypeArg !== expectedTypeArg) {{
          throw new Error(
            `type argument mismatch at position ${{i}}: expected '${{expectedTypeArg}}' but got '${{gotTypeArg}}'`
          )
        }}
      }}"#,
            num_params = num_params,
            type_args_ref = type_args_ref,
        )
    }

    // ========================================================================
    // Helper methods
    // ========================================================================

    fn emit_type_params_decl(&self) -> String {
        if self.type_params.is_empty() {
            return String::new();
        }

        let params: Vec<String> = self
            .type_params
            .iter()
            .map(|p| {
                let extends = if p.is_phantom {
                    "PhantomTypeArgument"
                } else {
                    "TypeArgument"
                };
                format!("{} extends {}", p.name, extends)
            })
            .collect();

        format!("<{}>", params.join(", "))
    }

    fn emit_type_params_use(&self) -> String {
        if self.type_params.is_empty() {
            return String::new();
        }

        let params: Vec<String> = self.type_params.iter().map(|p| p.name.clone()).collect();
        format!("<{}>", params.join(", "))
    }
}

impl FieldTypeIR {
    /// Check if this type uses Vector (recursively)
    pub fn uses_vector(&self) -> bool {
        match self {
            FieldTypeIR::Vector(_) => true,
            FieldTypeIR::Datatype { type_args, .. } => type_args.iter().any(|a| a.uses_vector()),
            _ => false,
        }
    }

    /// Check if this type uses address (recursively)
    pub fn uses_address(&self) -> bool {
        match self {
            FieldTypeIR::Primitive(p) => p == "address",
            FieldTypeIR::Vector(inner) => inner.uses_address(),
            FieldTypeIR::Datatype { type_args, .. } => type_args.iter().any(|a| a.uses_address()),
            _ => false,
        }
    }

    /// Check if this type has any phantom struct type arguments (requires ToPhantom import)
    pub fn uses_phantom_struct_args(&self) -> bool {
        match self {
            FieldTypeIR::Vector(inner) => inner.uses_phantom_struct_args(),
            FieldTypeIR::Datatype {
                type_args,
                type_arg_is_phantom,
                ..
            } => {
                // Check if any args are phantom and need ToPhantom wrapping:
                // 1. Phantom position with Datatype argument
                // 2. Phantom position with Vector argument
                // 3. Phantom position with non-phantom TypeParam argument
                type_args
                    .iter()
                    .zip(type_arg_is_phantom.iter())
                    .any(|(arg, is_phantom)| {
                        if *is_phantom {
                            match arg {
                                FieldTypeIR::Datatype { .. } | FieldTypeIR::Vector(_) => true,
                                FieldTypeIR::TypeParam {
                                    is_phantom: param_is_phantom,
                                    ..
                                } => {
                                    // Non-phantom type param in phantom position needs ToPhantom
                                    !param_is_phantom
                                }
                                _ => false,
                            }
                        } else {
                            false
                        }
                    })
                    || type_args.iter().any(|a| a.uses_phantom_struct_args())
            }
            _ => false,
        }
    }

    /// Check if this field type needs fieldToJSON (for Option, Vector)
    pub fn needs_field_to_json(&self) -> bool {
        match self {
            FieldTypeIR::Vector(_) => true,
            FieldTypeIR::Datatype { full_type_name, .. } => is_option_type(full_type_name),
            FieldTypeIR::TypeParam { .. } => true,
            _ => false,
        }
    }

    /// Convert to TypeScript type for use in ToField<...>
    pub fn to_ts_type(&self) -> String {
        match self {
            FieldTypeIR::Primitive(p) => format!("'{}'", p),
            FieldTypeIR::Vector(inner) => format!("Vector<{}>", inner.to_ts_type()),
            FieldTypeIR::Datatype {
                class_name,
                type_args,
                type_arg_is_phantom,
                kind,
                ..
            } => {
                // For enums, use {Name}Variant instead of {Name}
                let type_name = if *kind == DatatypeKind::Enum {
                    format!("{}Variant", class_name)
                } else {
                    class_name.clone()
                };

                if type_args.is_empty() {
                    type_name
                } else {
                    // Wrap phantom args with ToPhantom<>
                    let args: Vec<String> = type_args
                        .iter()
                        .zip(type_arg_is_phantom.iter())
                        .map(|(arg, is_phantom)| {
                            let ts_type = arg.to_ts_type();
                            if *is_phantom {
                                match arg {
                                    // Wrap complex types (datatype and vector) with ToPhantom
                                    FieldTypeIR::Datatype { .. } | FieldTypeIR::Vector(_) => {
                                        format!("ToPhantom<{}>", ts_type)
                                    }
                                    // Also wrap non-phantom type params when they go into phantom positions
                                    FieldTypeIR::TypeParam {
                                        is_phantom: param_is_phantom,
                                        ..
                                    } => {
                                        if !param_is_phantom {
                                            // Non-phantom type param in phantom position needs ToPhantom
                                            format!("ToPhantom<{}>", ts_type)
                                        } else {
                                            // Phantom type param in phantom position - already phantom
                                            ts_type
                                        }
                                    }
                                    // Primitives don't need wrapping
                                    _ => ts_type,
                                }
                            } else {
                                ts_type
                            }
                        })
                        .collect();
                    format!("{}<{}>", type_name, args.join(", "))
                }
            }
            FieldTypeIR::TypeParam { name, .. } => name.clone(),
        }
    }

    /// Convert to BCS definition
    pub fn to_bcs(&self) -> String {
        match self {
            FieldTypeIR::Primitive(p) => match p.as_str() {
                "u8" | "u16" | "u32" | "u64" | "u128" | "u256" => format!("bcs.{}()", p),
                "bool" => "bcs.bool()".to_string(),
                "address" => "bcs.bytes(32).transform({ input: (val: string) => fromHex(val), output: (val: Uint8Array) => toHex(val) })".to_string(),
                _ => format!("bcs.{}()", p),
            },
            FieldTypeIR::Vector(inner) => format!("bcs.vector({})", inner.to_bcs()),
            FieldTypeIR::Datatype {
                class_name,
                type_args,
                type_arg_is_phantom,
                ..
            } => {
                // Filter out phantom type args for BCS - they don't affect encoding
                let non_phantom_args: Vec<String> = type_args
                    .iter()
                    .zip(type_arg_is_phantom.iter())
                    .filter(|(_, is_phantom)| !**is_phantom)
                    .map(|(arg, _)| arg.to_bcs())
                    .collect();

                if non_phantom_args.is_empty() {
                    format!("{}.bcs", class_name)
                } else {
                    format!("{}.bcs({})", class_name, non_phantom_args.join(", "))
                }
            }
            FieldTypeIR::TypeParam { name, .. } => name.clone(),
        }
    }

    /// Convert to reified() call for decoding
    fn to_reified(&self) -> String {
        match self {
            FieldTypeIR::Primitive(p) => format!("'{}'", p),
            FieldTypeIR::Vector(inner) => {
                format!("vector({})", inner.to_reified())
            }
            FieldTypeIR::Datatype {
                class_name,
                type_args,
                type_arg_is_phantom,
                ..
            } => {
                if type_args.is_empty() {
                    format!("{}.reified()", class_name)
                } else {
                    // Wrap phantom type args with phantom()
                    let args: Vec<String> = type_args
                        .iter()
                        .zip(type_arg_is_phantom.iter())
                        .map(|(arg, is_phantom)| {
                            if *is_phantom {
                                format!("phantom({})", arg.to_reified())
                            } else {
                                arg.to_reified()
                            }
                        })
                        .collect();
                    format!("{}.reified({})", class_name, args.join(", "))
                }
            }
            FieldTypeIR::TypeParam { name, .. } => name.clone(),
        }
    }

    /// Convert to reified() call using runtime variable names (for fromFields, fromFieldsWithTypes, etc.)
    /// `total_type_params` is needed to determine whether to use `typeArg` or `typeArgs[n]`
    pub fn to_reified_runtime(&self, total_type_params: usize) -> String {
        match self {
            FieldTypeIR::Primitive(p) => format!("'{}'", p),
            FieldTypeIR::Vector(inner) => {
                format!("vector({})", inner.to_reified_runtime(total_type_params))
            }
            FieldTypeIR::Datatype {
                class_name,
                type_args,
                type_arg_is_phantom,
                ..
            } => {
                if type_args.is_empty() {
                    format!("{}.reified()", class_name)
                } else {
                    // Wrap phantom type args with phantom()
                    let args: Vec<String> = type_args
                        .iter()
                        .zip(type_arg_is_phantom.iter())
                        .map(|(arg, is_phantom)| {
                            if *is_phantom {
                                match arg {
                                    FieldTypeIR::TypeParam {
                                        is_phantom: param_is_phantom,
                                        ..
                                    } => {
                                        if *param_is_phantom {
                                            // Phantom type param in phantom position - already PhantomReified
                                            arg.to_reified_runtime(total_type_params)
                                        } else {
                                            // Non-phantom type param in phantom position - wrap with phantom()
                                            format!(
                                                "phantom({})",
                                                arg.to_reified_runtime(total_type_params)
                                            )
                                        }
                                    }
                                    // Wrap other types (datatype, vector, primitive) with phantom()
                                    _ => {
                                        format!(
                                            "phantom({})",
                                            arg.to_reified_runtime(total_type_params)
                                        )
                                    }
                                }
                            } else {
                                arg.to_reified_runtime(total_type_params)
                            }
                        })
                        .collect();
                    format!("{}.reified({})", class_name, args.join(", "))
                }
            }
            FieldTypeIR::TypeParam { index, .. } => {
                // For single type param, use `typeArg`; for multiple, use `typeArgs[n]`
                // Type params are already PhantomReified when phantom, no need to wrap
                if total_type_params == 1 {
                    "typeArg".to_string()
                } else {
                    format!("typeArgs[{}]", index)
                }
            }
        }
    }

    /// Convert to reified() call using runtime variable names - always uses indexed access
    /// Use this for enums which always use typeArgs[n] even for single type param
    pub fn to_reified_runtime_indexed(&self, _total_type_params: usize) -> String {
        match self {
            FieldTypeIR::Primitive(p) => format!("'{}'", p),
            FieldTypeIR::Vector(inner) => {
                format!(
                    "vector({})",
                    inner.to_reified_runtime_indexed(_total_type_params)
                )
            }
            FieldTypeIR::Datatype {
                class_name,
                type_args,
                type_arg_is_phantom,
                ..
            } => {
                if type_args.is_empty() {
                    format!("{}.reified()", class_name)
                } else {
                    let args: Vec<String> = type_args
                        .iter()
                        .zip(type_arg_is_phantom.iter())
                        .map(|(arg, is_phantom)| {
                            if *is_phantom {
                                match arg {
                                    FieldTypeIR::TypeParam {
                                        is_phantom: param_is_phantom,
                                        ..
                                    } => {
                                        if *param_is_phantom {
                                            // Phantom type param in phantom position - already PhantomReified
                                            arg.to_reified_runtime_indexed(_total_type_params)
                                        } else {
                                            // Non-phantom type param in phantom position - wrap with phantom()
                                            format!(
                                                "phantom({})",
                                                arg.to_reified_runtime_indexed(_total_type_params)
                                            )
                                        }
                                    }
                                    // Wrap other types (datatype, vector, primitive) with phantom()
                                    _ => {
                                        format!(
                                            "phantom({})",
                                            arg.to_reified_runtime_indexed(_total_type_params)
                                        )
                                    }
                                }
                            } else {
                                arg.to_reified_runtime_indexed(_total_type_params)
                            }
                        })
                        .collect();
                    format!("{}.reified({})", class_name, args.join(", "))
                }
            }
            FieldTypeIR::TypeParam { index, .. } => {
                // Always use indexed access for enums
                format!("typeArgs[{}]", index)
            }
        }
    }

    /// Convert field to JSON field line
    pub fn to_json_field(&self, field_name: &str) -> String {
        match self {
            FieldTypeIR::Primitive(p) => match p.as_str() {
                "u64" | "u128" | "u256" => {
                    format!("      {}: this.{}.toString(),", field_name, field_name)
                }
                _ => format!("      {}: this.{},", field_name, field_name),
            },
            FieldTypeIR::Vector(inner) => {
                // Vectors need fieldToJSON with type annotation
                let inner_ts = inner.to_json_ts_type();
                let bcs_name = self.to_json_bcs_name();
                format!(
                    "      {}: fieldToJSON<Vector<{}>>(`{}`, this.{}),",
                    field_name, inner_ts, bcs_name, field_name
                )
            }
            FieldTypeIR::Datatype { full_type_name, .. } => {
                // Check if this is a primitive-like type based on full type path
                // These types serialize directly to JSON without .toJSONField()
                if is_primitive_like_type(full_type_name) {
                    format!("      {}: this.{},", field_name, field_name)
                } else if is_option_type(full_type_name) {
                    // Option needs fieldToJSON with type annotation
                    let bcs_name = self.to_json_bcs_name();
                    let ts_type = self.to_json_ts_type();
                    format!(
                        "      {}: fieldToJSON<{}>(`{}`, this.{}),",
                        field_name, ts_type, bcs_name, field_name
                    )
                } else {
                    format!("      {}: this.{}.toJSONField(),", field_name, field_name)
                }
            }
            FieldTypeIR::TypeParam { name, index, .. } => {
                // Type parameters need fieldToJSON with $typeArgs
                format!(
                    "      {}: fieldToJSON<{}>(`${{this.$typeArgs[{}]}}`, this.{}),",
                    field_name, name, index, field_name
                )
            }
        }
    }

    /// Get the TypeScript type for JSON field (used in fieldToJSON)
    fn to_json_ts_type(&self) -> String {
        match self {
            FieldTypeIR::Primitive(p) => format!("'{}'", p),
            FieldTypeIR::Vector(inner) => format!("Vector<{}>", inner.to_json_ts_type()),
            FieldTypeIR::Datatype {
                class_name,
                type_args,
                type_arg_is_phantom,
                kind,
                ..
            } => {
                // For enums, use {Name}Variant instead of {Name}
                let type_name = if *kind == DatatypeKind::Enum {
                    format!("{}Variant", class_name)
                } else {
                    class_name.clone()
                };

                if type_args.is_empty() {
                    type_name
                } else {
                    // Wrap phantom args with ToPhantom<> (same as to_ts_type)
                    let args: Vec<String> = type_args
                        .iter()
                        .zip(type_arg_is_phantom.iter())
                        .map(|(arg, is_phantom)| {
                            let ts_type = arg.to_json_ts_type();
                            if *is_phantom {
                                match arg {
                                    // Wrap complex types (datatype and vector) with ToPhantom
                                    FieldTypeIR::Datatype { .. } | FieldTypeIR::Vector(_) => {
                                        format!("ToPhantom<{}>", ts_type)
                                    }
                                    // Also wrap non-phantom type params when they go into phantom positions
                                    FieldTypeIR::TypeParam {
                                        is_phantom: param_is_phantom,
                                        ..
                                    } => {
                                        if !param_is_phantom {
                                            format!("ToPhantom<{}>", ts_type)
                                        } else {
                                            ts_type
                                        }
                                    }
                                    // Primitives don't need wrapping
                                    _ => ts_type,
                                }
                            } else {
                                ts_type
                            }
                        })
                        .collect();
                    format!("{}<{}>", type_name, args.join(", "))
                }
            }
            FieldTypeIR::TypeParam { name, .. } => name.clone(),
        }
    }

    /// Get the BCS type name for JSON field annotation (used in template literal)
    pub fn to_json_bcs_name(&self) -> String {
        match self {
            FieldTypeIR::Primitive(p) => p.clone(),
            FieldTypeIR::Vector(inner) => format!("vector<{}>", inner.to_json_bcs_name()),
            FieldTypeIR::Datatype {
                class_name,
                type_args,
                ..
            } => {
                if type_args.is_empty() {
                    // Use $typeName for datatypes
                    format!("${{{}.$typeName}}", class_name)
                } else {
                    let args: Vec<String> =
                        type_args.iter().map(|a| a.to_json_bcs_name()).collect();
                    format!("${{{}.$typeName}}<{}>", class_name, args.join(", "))
                }
            }
            FieldTypeIR::TypeParam { index, .. } => format!("${{this.$typeArgs[{}]}}", index),
        }
    }

    /// Generate the TypeScript type for this field in JSONField type alias
    /// This aligns with ToJSON<T> conditional type and runtime fieldToJSON() behavior
    pub fn to_json_field_type(&self) -> String {
        match self {
            FieldTypeIR::Primitive(p) => match p.as_str() {
                // Large integers serialize as strings
                "u64" | "u128" | "u256" => "string".to_string(),
                "bool" => "boolean".to_string(),
                "u8" | "u16" | "u32" => "number".to_string(),
                "address" => "string".to_string(),
                _ => "any".to_string(), // fallback for unknown primitives
            },
            FieldTypeIR::Vector(inner) => {
                // Vectors become arrays of the inner type's JSON field type
                let inner_type = inner.to_json_field_type();
                // Wrap in parentheses if it's a union type to fix precedence
                // e.g., "(string | null)[]" not "string | null[]"
                if inner_type.contains(" | ") {
                    format!("({})[]", inner_type)
                } else {
                    format!("{}[]", inner_type)
                }
            }
            FieldTypeIR::Datatype {
                full_type_name,
                type_args,
                kind,
                ..
            } => {
                // Primitive-like types (String, ID, UID, Url, TypeName) serialize as strings
                if is_primitive_like_type(full_type_name) {
                    "string".to_string()
                } else if is_option_type(full_type_name) {
                    // Option<T> becomes inner_type | null
                    if let Some(inner) = type_args.first() {
                        format!("{} | null", inner.to_json_field_type())
                    } else {
                        "any | null".to_string()
                    }
                } else if *kind == DatatypeKind::Enum {
                    // For enums, use ToJSON<EnumVariant> to handle union type distribution
                    format!("ToJSON<{}>", self.to_json_ts_type())
                } else {
                    // Regular structs use ToJSON wrapper
                    // ToJSON<Struct> resolves to ReturnType<Struct['toJSONField']>
                    // This avoids needing to import {Struct}JSONField from dependencies
                    format!("ToJSON<{}>", self.to_json_ts_type())
                }
            }
            FieldTypeIR::TypeParam { name, .. } => {
                // Type parameters use ToJSON for proper mapping
                format!("ToJSON<{}>", name)
            }
        }
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    fn make_clock_ir() -> StructIR {
        StructIR {
            name: "Clock".to_string(),
            module_struct_path: "clock::Clock".to_string(),
            package_info: PackageInfo::System {
                address: "0x2".to_string(),
            },
            type_params: vec![],
            fields: vec![
                FieldIR {
                    ts_name: "id".to_string(),
                    move_name: "id".to_string(),
                    field_type: FieldTypeIR::Datatype {
                        class_name: "UID".to_string(),
                        full_type_name: "0x2::object::UID".to_string(),
                        type_args: vec![],
                        type_arg_is_phantom: vec![],
                        kind: DatatypeKind::Struct,
                    },
                    doc_comment: None,
                },
                FieldIR {
                    ts_name: "timestampMs".to_string(),
                    move_name: "timestamp_ms".to_string(),
                    field_type: FieldTypeIR::Primitive("u64".to_string()),
                    doc_comment: None,
                },
            ],
            struct_imports: vec![StructImport {
                path: "../object/structs".to_string(),
                class_name: "UID".to_string(),
                alias: None,
            }],
            uses_vector: false,
            uses_address: false,
            uses_phantom_struct_args: false,
            has_non_phantom_type_params: false,
            uses_field_to_json: false,
            doc_comment: None,
        }
    }

    #[test]
    fn test_clock_struct() {
        let clock = make_clock_ir();
        let output = clock.emit("../../_framework");

        assert!(output.contains("export function isClock"));
        assert!(output.contains("export interface ClockFields"));
        assert!(output.contains("export class Clock"));
        assert!(output.contains("timestampMs: ToField<'u64'>"));
        assert!(output.contains("`0x2::clock::Clock`")); // Full type name with address
    }

    #[test]
    #[ignore] // Run with: cargo test -- --ignored --nocapture
    fn print_clock_output() {
        let clock = make_clock_ir();
        let output = clock.emit("../../_framework");
        println!("{}", output);
    }

    fn make_supply_ir() -> StructIR {
        StructIR {
            name: "Supply".to_string(),
            module_struct_path: "balance::Supply".to_string(),
            package_info: PackageInfo::System {
                address: "0x2".to_string(),
            },
            type_params: vec![TypeParamIR {
                name: "T".to_string(),
                is_phantom: true,
            }],
            fields: vec![FieldIR {
                ts_name: "value".to_string(),
                move_name: "value".to_string(),
                field_type: FieldTypeIR::Primitive("u64".to_string()),
                doc_comment: None,
            }],
            struct_imports: vec![],
            uses_vector: false,
            uses_address: false,
            uses_phantom_struct_args: false,
            has_non_phantom_type_params: false,
            uses_field_to_json: false,
            doc_comment: None,
        }
    }

    #[test]
    fn test_supply_struct_with_type_param() {
        let supply = make_supply_ir();
        let output = supply.emit("../../_framework");

        assert!(output.contains("export function isSupply"));
        assert!(output.contains("export interface SupplyFields<T extends PhantomTypeArgument>"));
        assert!(output.contains("export class Supply<T extends PhantomTypeArgument>"));
        assert!(output.contains("static readonly $isPhantom = [true] as const"));
        assert!(output.contains("extractType(T)"));
    }

    #[test]
    #[ignore] // Run with: cargo test -- --ignored --nocapture
    fn print_supply_output() {
        let supply = make_supply_ir();
        let output = supply.emit("../../_framework");
        println!("{}", output);
    }
}
