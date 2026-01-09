//! Builder for converting Move model → TypeScript IR.
//!
//! This module bridges the Move model types to our coarse-grained IR.

use std::collections::{BTreeMap, HashMap};

use anyhow::{Context, Result};
use convert_case::{Case, Casing};
use move_core_types::account_address::AccountAddress;
use move_model_2::model::{self, Datatype};
use move_model_2::normalized::Type;
use move_model_2::source_kind::SourceKind;
use move_symbol_pool::Symbol;

use super::doc_utils::{extract_deprecated, extract_doc};
use super::enums::{EnumIR, EnumVariantIR};
use super::imports::{ImportPathResolver, TsImportsBuilder};
use super::jsdoc::format_jsdoc;
use super::structs::{
    DatatypeKind, FieldIR, FieldTypeIR, PackageInfo, StructIR, StructImport, TypeParamIR,
};
use super::utils::sanitize_identifier;
use crate::model_builder::{TypeOriginTable, VersionTable};

/// Get the origin package address for a datatype (struct or enum).
/// Returns an error with context if the origin address cannot be found.
fn get_origin_pkg_addr_for_datatype(
    pkg_addr: AccountAddress,
    module_name: &str,
    datatype_name: &str,
    type_origin_table: &TypeOriginTable,
) -> Result<AccountAddress> {
    let types = type_origin_table.get(&pkg_addr).with_context(|| {
        format!(
            "origin table not found for package {}",
            pkg_addr.to_hex_literal()
        )
    })?;
    let full_name = format!("{}::{}", module_name, datatype_name);
    let origin_addr = types.get(&full_name).with_context(|| {
        format!(
            "origin address not found for {} in package {}. \
            Check consistency between original id and published at for this package.",
            full_name,
            pkg_addr.to_hex_literal()
        )
    })?;

    Ok(*origin_addr)
}

/// Build PackageInfo (System vs Dynamic) for a datatype.
/// Consolidates the logic used by both StructIRBuilder and EnumIRBuilder.
fn build_package_info_for_datatype(
    pkg_addr: AccountAddress,
    module_name: &str,
    datatype_name: &str,
    folder_names: &BTreeMap<AccountAddress, String>,
) -> PackageInfo {
    if sui_sdk::types::SYSTEM_PACKAGE_ADDRESSES.contains(&pkg_addr) {
        return PackageInfo::System {
            address: pkg_addr.to_hex_literal(),
        };
    }

    // Get the kebab-case package name from folder_names
    let pkg_name = folder_names
        .get(&pkg_addr)
        .cloned()
        .unwrap_or_else(|| pkg_addr.to_hex_literal());

    // Build the module::TypeName path for type origin lookup
    let module_type_path = format!("{}::{}", module_name, datatype_name);

    PackageInfo::Dynamic {
        pkg_name,
        module_type_path,
    }
}


/// Builds StructIR from a Move model struct.
pub struct StructIRBuilder<'a, 'model, HasSource: SourceKind> {
    strct: model::Struct<'model, HasSource>,
    #[allow(dead_code)]
    type_origin_table: &'a TypeOriginTable,
    #[allow(dead_code)]
    version_table: &'a VersionTable,
    package_address: AccountAddress,
    module_name: Symbol,
    is_top_level: bool,
    folder_names: &'a BTreeMap<AccountAddress, String>,
    top_level_pkg_names: &'a BTreeMap<AccountAddress, Symbol>,
    framework_path: String,
    /// Tracks struct imports to avoid name conflicts
    struct_imports: HashMap<String, StructImport>,
}

impl<'a, 'model, HasSource: SourceKind> StructIRBuilder<'a, 'model, HasSource> {
    pub fn new(
        strct: model::Struct<'model, HasSource>,
        type_origin_table: &'a TypeOriginTable,
        version_table: &'a VersionTable,
        folder_names: &'a BTreeMap<AccountAddress, String>,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, Symbol>,
        levels_from_root: u8,
    ) -> Self {
        let module = strct.module();
        let package_address = module.package().address();
        let module_name = module.name();
        let is_top_level = top_level_pkg_names.contains_key(&package_address);

        let framework_path = if levels_from_root == 0 {
            "./_framework".to_string()
        } else {
            (0..levels_from_root)
                .map(|_| "..")
                .collect::<Vec<_>>()
                .join("/")
                + "/_framework"
        };

        StructIRBuilder {
            strct,
            type_origin_table,
            version_table,
            package_address,
            module_name,
            is_top_level,
            folder_names,
            top_level_pkg_names,
            framework_path,
            struct_imports: HashMap::new(),
        }
    }

    /// Build the StructIR from the Move model.
    pub fn build(mut self) -> (StructIR, String) {
        let name = self.strct.name().to_string();
        let module_struct_path = format!("{}::{}", self.strct.module().name(), self.strct.name());
        let package_info = self.build_package_info();
        let type_params = self.build_type_params();
        let fields = self.build_fields();

        // Check what types are used in fields
        let uses_vector = fields.iter().any(|f| f.field_type.uses_vector());
        let uses_address = fields.iter().any(|f| f.field_type.uses_address());
        let uses_phantom_struct_args = fields
            .iter()
            .any(|f| f.field_type.uses_phantom_struct_args());
        let uses_field_to_json = fields.iter().any(|f| f.field_type.needs_field_to_json());

        let struct_imports: Vec<StructImport> = self.struct_imports.into_values().collect();

        // Check if there are non-phantom type parameters
        let has_non_phantom_type_params = type_params.iter().any(|p| !p.is_phantom);

        // Extract struct-level documentation
        let doc_comment = match self.strct.kind() {
            model::Kind::WithSource(strct) => extract_doc(&strct.summary().doc),
            model::Kind::WithoutSource(_) => None,
        };

        let ir = StructIR {
            name,
            module_struct_path,
            package_info,
            type_params,
            fields,
            struct_imports,
            uses_vector,
            uses_address,
            uses_phantom_struct_args,
            has_non_phantom_type_params,
            uses_field_to_json,
            doc_comment,
        };

        (ir, self.framework_path)
    }

    fn build_package_info(&self) -> PackageInfo {
        let pkg_addr = self.strct.module().package().address();
        let module_name_sym = self.strct.module().name();
        let datatype_name_sym = self.strct.name();
        build_package_info_for_datatype(
            pkg_addr,
            module_name_sym.as_ref(),
            datatype_name_sym.as_ref(),
            self.folder_names,
        )
    }

    fn build_type_params(&self) -> Vec<TypeParamIR> {
        let type_param_names = self.strct_type_param_names();
        let compiled = self.strct.compiled();

        compiled
            .type_parameters
            .iter()
            .zip(type_param_names)
            .map(|(param, name)| TypeParamIR {
                name,
                is_phantom: param.is_phantom,
            })
            .collect()
    }

    fn strct_type_param_names(&self) -> Vec<String> {
        match self.strct.kind() {
            model::Kind::WithSource(strct) => strct
                .info()
                .type_parameters
                .iter()
                .map(|param| param.param.user_specified_name.value.to_string())
                .collect(),
            model::Kind::WithoutSource(strct) => (0..strct.compiled().type_parameters.len())
                .map(|idx| format!("T{}", idx))
                .collect(),
        }
    }

    fn build_fields(&mut self) -> Vec<FieldIR> {
        let compiled = self.strct.compiled();
        let type_param_names = self.strct_type_param_names();

        // Extract field documentation if source is available
        let field_docs: HashMap<Symbol, Option<String>> = match self.strct.kind() {
            model::Kind::WithSource(strct) => {
                let summary = strct.summary();
                summary
                    .fields
                    .fields
                    .iter()
                    .map(|(name, field_summary)| (*name, extract_doc(&field_summary.doc)))
                    .collect()
            }
            model::Kind::WithoutSource(_) => HashMap::new(),
        };

        compiled
            .fields
            .0
            .iter()
            .map(|(_, field)| {
                let move_name = field.name.to_string();
                // Use to_case directly (infers input) to match genco behavior
                // This handles edge cases like "p2p_address" -> "p2PAddress" correctly
                let ts_name = move_name.to_case(Case::Camel);
                let field_type = self.build_field_type(&field.type_, &type_param_names);

                // Look up field documentation
                let doc_comment = field_docs.get(&field.name).cloned().flatten();

                FieldIR {
                    ts_name,
                    move_name,
                    field_type,
                    doc_comment,
                }
            })
            .collect()
    }

    fn build_field_type(&mut self, ty: &Type, type_param_names: &[String]) -> FieldTypeIR {
        match ty {
            Type::U8 => FieldTypeIR::Primitive("u8".to_string()),
            Type::U16 => FieldTypeIR::Primitive("u16".to_string()),
            Type::U32 => FieldTypeIR::Primitive("u32".to_string()),
            Type::U64 => FieldTypeIR::Primitive("u64".to_string()),
            Type::U128 => FieldTypeIR::Primitive("u128".to_string()),
            Type::U256 => FieldTypeIR::Primitive("u256".to_string()),
            Type::Bool => FieldTypeIR::Primitive("bool".to_string()),
            Type::Address => FieldTypeIR::Primitive("address".to_string()),
            Type::Vector(inner) => {
                FieldTypeIR::Vector(Box::new(self.build_field_type(inner, type_param_names)))
            }
            Type::Datatype(dt) => {
                let field_module = self.strct.model().module(dt.module);

                // Build full type name for reliable matching (e.g., "0x1::string::String")
                let full_type_name = format!(
                    "{}::{}::{}",
                    dt.module.address.to_hex_literal(),
                    dt.module.name,
                    dt.name
                );

                // Get the struct/enum from the module
                let (class_name, type_params, kind) = match field_module.datatype(dt.name) {
                    Datatype::Struct(s) => {
                        let import = self.get_import_for_struct(&s);
                        (
                            import,
                            s.compiled().type_parameters.clone(),
                            DatatypeKind::Struct,
                        )
                    }
                    Datatype::Enum(e) => {
                        let import = self.get_import_for_enum(&e);
                        (
                            import,
                            e.compiled().type_parameters.clone(),
                            DatatypeKind::Enum,
                        )
                    }
                };

                let type_args: Vec<FieldTypeIR> = dt
                    .type_arguments
                    .iter()
                    .map(|arg| self.build_field_type(arg, type_param_names))
                    .collect();

                // Track which type args are phantom based on the datatype's type parameter declarations
                let type_arg_is_phantom: Vec<bool> =
                    type_params.iter().map(|param| param.is_phantom).collect();

                FieldTypeIR::Datatype {
                    class_name,
                    full_type_name,
                    type_args,
                    type_arg_is_phantom,
                    kind,
                }
            }
            Type::TypeParameter(idx) => {
                let name = type_param_names[*idx as usize].clone();
                let is_phantom = self.strct.compiled().type_parameters[*idx as usize].is_phantom;
                FieldTypeIR::TypeParam {
                    name,
                    is_phantom,
                    index: *idx as usize,
                }
            }
            Type::Reference(_, inner) => self.build_field_type(inner, type_param_names),
            Type::Signer => panic!("unexpected Signer type in struct field"),
        }
    }

    fn get_import_for_struct<S: SourceKind>(&mut self, strct: &model::Struct<S>) -> String {
        let class_name = strct.name().to_string();
        let import_path = self.import_path_for_module(&strct.module());

        match import_path {
            None => class_name, // Same module, no import needed
            Some(path) => {
                // Check if we already have an import with this class name
                if let Some(existing) = self.struct_imports.get(&class_name) {
                    if existing.path == path {
                        // Same import, reuse
                        return class_name;
                    }
                    // Name conflict - need to create an alias
                    // Use module name from path to create a descriptive alias
                    let module_suffix = path
                        .rsplit('/')
                        .nth(1)
                        .unwrap_or("unknown")
                        .replace('-', "_")
                        .to_case(Case::Pascal);
                    let alias = format!("{}{}", class_name, module_suffix);

                    // Store with alias as key to avoid overwriting
                    self.struct_imports.insert(
                        alias.clone(),
                        StructImport {
                            path,
                            class_name: class_name.clone(),
                            alias: Some(alias.clone()),
                        },
                    );
                    return alias;
                }

                // No conflict, add the import
                self.struct_imports.insert(
                    class_name.clone(),
                    StructImport {
                        path,
                        class_name: class_name.clone(),
                        alias: None,
                    },
                );
                class_name
            }
        }
    }

    fn get_import_for_enum<S: SourceKind>(&mut self, enum_: &model::Enum<S>) -> String {
        let class_name = enum_.name().to_string();
        let import_path = self.import_path_for_module(&enum_.module());

        match import_path {
            None => class_name,
            Some(path) => {
                // Check if we already have an import with this class name
                if let Some(existing) = self.struct_imports.get(&class_name) {
                    if existing.path == path {
                        // Same import, reuse
                        return class_name;
                    }
                    // Name conflict - need to create an alias
                    let module_suffix = path
                        .rsplit('/')
                        .nth(1)
                        .unwrap_or("unknown")
                        .replace('-', "_")
                        .to_case(Case::Pascal);
                    let alias = format!("{}{}", class_name, module_suffix);

                    self.struct_imports.insert(
                        alias.clone(),
                        StructImport {
                            path,
                            class_name: class_name.clone(),
                            alias: Some(alias.clone()),
                        },
                    );
                    return alias;
                }

                self.struct_imports.insert(
                    class_name.clone(),
                    StructImport {
                        path,
                        class_name: class_name.clone(),
                        alias: None,
                    },
                );
                class_name
            }
        }
    }

    /// Get the import path to a module's structs.ts file.
    /// Uses `ImportPathResolver` for consistent path computation.
    fn import_path_for_module<S: SourceKind>(&self, module: &model::Module<S>) -> Option<String> {
        let resolver = ImportPathResolver::new(
            self.package_address,
            self.module_name,
            self.folder_names.clone(),
            self.top_level_pkg_names.clone(),
            self.is_top_level,
        );
        resolver.path_to_structs(module.package().address(), module.name())
    }
}

/// Generate structs.ts for a module (handles both structs and enums).
pub fn gen_module_structs<HasSource: SourceKind>(
    module: &model::Module<HasSource>,
    type_origin_table: &TypeOriginTable,
    version_table: &VersionTable,
    folder_names: &BTreeMap<AccountAddress, String>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    levels_from_root: u8,
) -> String {
    // Extract module-level documentation
    let module_doc = match module.kind() {
        model::Kind::WithSource(m) => extract_doc(&m.summary().doc),
        model::Kind::WithoutSource(_) => None,
    };

    let mut all_struct_irs = Vec::new();
    let mut all_enum_irs = Vec::new();
    // Key by the name used in code (alias if present, otherwise class_name)
    let mut all_imports: HashMap<String, StructImport> = HashMap::new();
    let mut framework_path = String::new();

    // Build IR for all structs
    for strct in module.structs() {
        let builder = StructIRBuilder::new(
            strct,
            type_origin_table,
            version_table,
            folder_names,
            top_level_pkg_names,
            levels_from_root + 2,
        );
        let (ir, fp) = builder.build();
        framework_path = fp;

        for imp in &ir.struct_imports {
            // Use alias as key if present, otherwise class_name
            let key = imp.alias.as_ref().unwrap_or(&imp.class_name).clone();
            all_imports.entry(key).or_insert_with(|| imp.clone());
        }
        all_struct_irs.push(ir);
    }

    // Build IR for all enums
    for enum_ in module.enums() {
        let mut builder = EnumIRBuilder::new(
            enum_,
            type_origin_table,
            version_table,
            folder_names,
            top_level_pkg_names,
            levels_from_root + 2,
        );
        let ir = builder.build();

        // Collect imports from enum
        for imp in builder.get_struct_imports() {
            // Use alias as key if present, otherwise class_name
            let key = imp.alias.as_ref().unwrap_or(&imp.class_name).clone();
            all_imports.entry(key).or_insert(imp.clone());
        }
        all_enum_irs.push(ir);
    }

    if all_struct_irs.is_empty() && all_enum_irs.is_empty() {
        return String::new();
    }

    // Set framework path if not set by structs
    if framework_path.is_empty() && !all_enum_irs.is_empty() {
        framework_path = (0..levels_from_root + 2)
            .map(|_| "..")
            .collect::<Vec<_>>()
            .join("/")
            + "/_framework";
    }

    // Emit combined imports
    let combined_imports = emit_combined_imports_with_enums(
        &framework_path,
        &all_imports,
        &all_struct_irs,
        &all_enum_irs,
    );

    // Emit struct bodies
    let struct_bodies: Vec<String> = all_struct_irs.iter().map(|ir| ir.emit_body()).collect();

    // Emit enum bodies
    let enum_bodies: Vec<String> = all_enum_irs.iter().map(|ir| ir.emit_body()).collect();

    let mut parts = Vec::new();

    // Add module-level JSDoc if present
    if let Some(jsdoc) = format_jsdoc(&module_doc, "") {
        parts.push(jsdoc);
    }

    parts.push(combined_imports);
    if !struct_bodies.is_empty() {
        parts.push(struct_bodies.join("\n\n"));
    }
    if !enum_bodies.is_empty() {
        parts.push(enum_bodies.join("\n\n"));
    }

    parts.join("\n\n")
}

/// Emit combined imports for modules with both structs and enums.
///
/// Uses `TsImportsBuilder` to generate well-organized, grouped imports.
fn emit_combined_imports_with_enums(
    framework_path: &str,
    struct_imports: &HashMap<String, StructImport>,
    structs: &[StructIR],
    enums: &[EnumIR],
) -> String {
    let mut imports = TsImportsBuilder::new();

    // Determine what framework imports are needed
    let has_type_params = structs.iter().any(|s| !s.type_params.is_empty())
        || enums.iter().any(|e| !e.type_params.is_empty());
    let has_phantom_type_params = structs
        .iter()
        .any(|s| s.type_params.iter().any(|p| p.is_phantom))
        || enums
            .iter()
            .any(|e| e.type_params.iter().any(|p| p.is_phantom));
    let has_non_phantom_type_params = structs.iter().any(|s| s.has_non_phantom_type_params)
        || enums
            .iter()
            .any(|e| e.type_params.iter().any(|p| !p.is_phantom));
    let uses_vector = structs.iter().any(|s| s.uses_vector) || enums.iter().any(|e| e.uses_vector);
    let uses_address =
        structs.iter().any(|s| s.uses_address) || enums.iter().any(|e| e.uses_address);
    let uses_phantom_struct_args = structs.iter().any(|s| s.uses_phantom_struct_args)
        || enums.iter().any(|e| e.uses_phantom_struct_args);
    let uses_field_to_json = structs.iter().any(|s| s.uses_field_to_json);
    let has_enums = !enums.is_empty();

    // Named reified imports - always include base set (including phantom, used in every struct's .phantom() method)
    let reified_path = format!("{}/reified", framework_path);
    let mut reified_imports = vec![
        "PhantomReified",
        "Reified",
        "StructClass",
        "ToField",
        "ToJSON",
        "ToTypeStr",
        "decodeFromFields",
        "decodeFromFieldsWithTypes",
        "decodeFromJSONField",
        "phantom", // Always needed - every struct has a static phantom() method
    ];

    // Add vector import when needed (for vector() calls in decode methods)
    if uses_vector {
        reified_imports.push("vector");
    }

    imports.add_named_many(&reified_path, &reified_imports);

    if has_type_params {
        imports.add_named_many(
            &reified_path,
            &[
                "extractType",
                "assertFieldsWithTypesArgsMatch",
                "assertReifiedTypeArgsMatch",
            ],
        );
    }

    if has_phantom_type_params {
        imports.add_named_many(
            &reified_path,
            &[
                "PhantomToTypeStr",
                "PhantomTypeArgument",
                "ToPhantomTypeArgument",
            ],
        );
    }

    if has_non_phantom_type_params {
        imports.add_named_many(&reified_path, &["TypeArgument", "ToTypeArgument", "toBcs"]);
    }

    // fieldToJSON is only needed when fields actually use it (Vector, Option, TypeParam fields)
    if uses_field_to_json {
        imports.add_named(&reified_path, "fieldToJSON");
    }

    if has_enums {
        imports.add_named(&reified_path, "EnumVariantClass");
    }

    if uses_phantom_struct_args {
        imports.add_named_as(&reified_path, "ToTypeStr", "ToPhantom");
    }

    // Utils import
    let util_path = format!("{}/util", framework_path);
    imports.add_named_many(
        &util_path,
        &[
            "FieldsWithTypes",
            "composeSuiType",
            "compressSuiType",
            "SupportedSuiClient",
            "fetchObjectBcs",
        ],
    );

    // parseTypeName is only needed for structs/enums with type params (used in fromSuiObjectData)
    if has_type_params {
        imports.add_named(&util_path, "parseTypeName");
    }

    // Vector import
    if uses_vector {
        imports.add_named(format!("{}/vector", framework_path), "Vector");
    }

    // Environment imports (getTypeOrigin) if any struct/enum uses dynamic package info
    // Import from _envs (sibling to _framework) to ensure auto-initialization
    let uses_env = structs.iter().any(|s| s.uses_env()) || enums.iter().any(|e| e.uses_env());
    if uses_env {
        // Replace "_framework" with "_envs" in the path
        let envs_path = framework_path.replace("_framework", "_envs");
        imports.add_named(envs_path, "getTypeOrigin");
    }

    // Struct/enum imports (from other modules) - group by path
    for imp in struct_imports.values() {
        if let Some(alias) = &imp.alias {
            imports.add_named_as(&imp.path, &imp.class_name, alias);
        } else {
            imports.add_named(&imp.path, &imp.class_name);
        }
    }

    // BCS imports
    if has_non_phantom_type_params {
        imports.add_named_many("@mysten/sui/bcs", &["BcsType", "bcs"]);
    } else {
        imports.add_named("@mysten/sui/bcs", "bcs");
    }

    // Sui client imports
    imports.add_named_many(
        "@mysten/sui/client",
        &["SuiObjectData", "SuiParsedData"],
    );

    // Sui utils imports
    if uses_address {
        imports.add_named_many("@mysten/sui/utils", &["fromBase64", "fromHex", "toHex"]);
    } else {
        imports.add_named("@mysten/sui/utils", "fromBase64");
    }

    imports.emit()
}

// ============================================================================
// EnumIRBuilder
// ============================================================================

/// Get the origin package address for an enum.
/// Get the origin package address for an enum.
fn get_origin_pkg_addr_for_enum<HasSource: SourceKind>(
    enum_: &model::Enum<HasSource>,
    type_origin_table: &TypeOriginTable,
) -> Result<AccountAddress> {
    get_origin_pkg_addr_for_datatype(
        enum_.module().package().address(),
        enum_.module().name().as_ref(),
        enum_.name().as_ref(),
        type_origin_table,
    )
}

/// Builds EnumIR from a Move model enum.
pub struct EnumIRBuilder<'a, 'model, HasSource: SourceKind> {
    enum_: model::Enum<'model, HasSource>,
    #[allow(dead_code)]
    type_origin_table: &'a TypeOriginTable,
    #[allow(dead_code)]
    version_table: &'a VersionTable,
    package_address: AccountAddress,
    module_name: Symbol,
    is_top_level: bool,
    folder_names: &'a BTreeMap<AccountAddress, String>,
    top_level_pkg_names: &'a BTreeMap<AccountAddress, Symbol>,
    #[allow(dead_code)]
    framework_path: String,
    /// Tracks struct imports to avoid name conflicts
    struct_imports: HashMap<String, StructImport>,
}

impl<'a, 'model, HasSource: SourceKind> EnumIRBuilder<'a, 'model, HasSource> {
    pub fn new(
        enum_: model::Enum<'model, HasSource>,
        type_origin_table: &'a TypeOriginTable,
        version_table: &'a VersionTable,
        folder_names: &'a BTreeMap<AccountAddress, String>,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, Symbol>,
        levels_from_root: u8,
    ) -> Self {
        let module = enum_.module();
        let package_address = module.package().address();
        let module_name = module.name();
        let is_top_level = top_level_pkg_names.contains_key(&package_address);

        let framework_path = if levels_from_root == 0 {
            "./_framework".to_string()
        } else {
            (0..levels_from_root)
                .map(|_| "..")
                .collect::<Vec<_>>()
                .join("/")
                + "/_framework"
        };

        Self {
            enum_,
            type_origin_table,
            version_table,
            package_address,
            module_name,
            is_top_level,
            folder_names,
            top_level_pkg_names,
            framework_path,
            struct_imports: HashMap::new(),
        }
    }

    pub fn build(&mut self) -> EnumIR {
        let name = self.enum_.name().to_string();

        // Determine package info (System vs Versioned)
        let _origin_addr = get_origin_pkg_addr_for_enum(&self.enum_, self.type_origin_table);
        let package_info = self.build_package_info();

        // Build type params - use source names if available (T, U, etc.), otherwise T0, T1
        let type_params: Vec<TypeParamIR> = self
            .enum_
            .summary()
            .type_parameters
            .iter()
            .zip(self.enum_.compiled().type_parameters.iter())
            .enumerate()
            .map(|(idx, (summary, compiled))| TypeParamIR {
                name: summary
                    .tparam
                    .name
                    .map(|n| n.to_string())
                    .unwrap_or_else(|| format!("T{}", idx)),
                is_phantom: compiled.is_phantom,
            })
            .collect();

        // Build module path
        let module_enum_path = format!("{}::{}", self.module_name, name);

        // Build variants - collect first to avoid borrow issues
        let model_variants: Vec<_> = self.enum_.variants().collect();
        let variants: Vec<EnumVariantIR> = model_variants
            .iter()
            .map(|v| self.build_variant(v, &type_params))
            .collect();

        // Detect special flag needs using FieldTypeIR helper methods
        let uses_vector = variants
            .iter()
            .any(|v| v.fields.iter().any(|f| f.field_type.uses_vector()));
        let uses_address = variants
            .iter()
            .any(|v| v.fields.iter().any(|f| f.field_type.uses_address()));
        let uses_phantom_struct_args = variants.iter().any(|v| {
            v.fields
                .iter()
                .any(|f| f.field_type.uses_phantom_struct_args())
        });

        // Extract enum-level documentation
        let doc_comment = extract_doc(&self.enum_.summary().doc);

        EnumIR {
            name,
            module_enum_path,
            package_info,
            type_params,
            variants,
            uses_vector,
            uses_address,
            uses_phantom_struct_args,
            doc_comment,
        }
    }

    fn build_variant(
        &mut self,
        variant: &model::Variant<'model, HasSource>,
        type_params: &[TypeParamIR],
    ) -> EnumVariantIR {
        let name = variant.name().to_string();
        let v_fields = &variant.compiled().fields.0;
        let is_tuple = variant.summary().fields.positional_fields;

        // Extract variant field documentation if source is available
        let summary = variant.summary();
        let field_docs: HashMap<Symbol, Option<String>> = summary
            .fields
            .fields
            .iter()
            .map(|(name, field_summary)| (*name, extract_doc(&field_summary.doc)))
            .collect();

        let fields: Vec<FieldIR> = v_fields
            .iter()
            .map(|(field_name, field)| {
                let move_name = field_name.to_string();
                let ts_name = self.gen_field_name(&move_name);
                let field_type = self.build_field_type(&field.type_, type_params);

                // Look up field documentation
                let doc_comment = field_docs.get(field_name).cloned().flatten();

                FieldIR {
                    move_name,
                    ts_name,
                    field_type,
                    doc_comment,
                }
            })
            .collect();

        // Extract variant-level documentation
        let doc_comment = extract_doc(&variant.summary().doc);

        EnumVariantIR {
            name,
            fields,
            is_tuple,
            doc_comment,
        }
    }

    fn build_package_info(&self) -> PackageInfo {
        let pkg_addr = self.enum_.module().package().address();
        let module_name_sym = self.enum_.module().name();
        let datatype_name_sym = self.enum_.name();
        build_package_info_for_datatype(
            pkg_addr,
            module_name_sym.as_ref(),
            datatype_name_sym.as_ref(),
            self.folder_names,
        )
    }

    fn gen_field_name(&self, move_name: &str) -> String {
        let ts_name = move_name.to_case(Case::Camel);
        sanitize_identifier(&ts_name)
    }

    fn build_field_type(&mut self, ty: &Type, type_params: &[TypeParamIR]) -> FieldTypeIR {
        // Get type param names for struct builder compatibility
        let type_param_names: Vec<String> = type_params.iter().map(|p| p.name.clone()).collect();

        match ty {
            Type::TypeParameter(idx) => {
                let idx = *idx as usize;
                let type_param = type_params.get(idx);
                let is_phantom = type_param.map(|p| p.is_phantom).unwrap_or(false);
                let name = type_param
                    .map(|p| p.name.clone())
                    .unwrap_or_else(|| format!("T{}", idx));
                FieldTypeIR::TypeParam {
                    name,
                    is_phantom,
                    index: idx,
                }
            }
            Type::Bool => FieldTypeIR::Primitive("bool".to_string()),
            Type::U8 => FieldTypeIR::Primitive("u8".to_string()),
            Type::U16 => FieldTypeIR::Primitive("u16".to_string()),
            Type::U32 => FieldTypeIR::Primitive("u32".to_string()),
            Type::U64 => FieldTypeIR::Primitive("u64".to_string()),
            Type::U128 => FieldTypeIR::Primitive("u128".to_string()),
            Type::U256 => FieldTypeIR::Primitive("u256".to_string()),
            Type::Address => FieldTypeIR::Primitive("address".to_string()),
            Type::Vector(inner) => {
                FieldTypeIR::Vector(Box::new(self.build_field_type(inner, type_params)))
            }
            Type::Datatype(dt) => self.build_struct_type(dt, &type_param_names),
            Type::Reference(_, inner) => self.build_field_type(inner, type_params),
            Type::Signer => FieldTypeIR::Primitive("string".to_string()),
        }
    }

    fn build_struct_type(
        &mut self,
        dt: &move_binary_format::normalized::Datatype<Symbol>,
        type_param_names: &[String],
    ) -> FieldTypeIR {
        let field_module = self.enum_.model().module(dt.module);

        // Build full type name for reliable matching (e.g., "0x1::string::String")
        let full_type_name = format!(
            "{}::{}::{}",
            dt.module.address.to_hex_literal(),
            dt.module.name,
            dt.name
        );

        // Get the struct/enum from the module
        let (class_name, compiled_type_params, kind) = match field_module.datatype(dt.name) {
            Datatype::Struct(s) => {
                let import = self.get_import_for_struct(&s);
                (
                    import,
                    s.compiled().type_parameters.clone(),
                    DatatypeKind::Struct,
                )
            }
            Datatype::Enum(e) => {
                let import = self.get_import_for_enum(&e);
                (
                    import,
                    e.compiled().type_parameters.clone(),
                    DatatypeKind::Enum,
                )
            }
        };

        let type_args: Vec<FieldTypeIR> = dt
            .type_arguments
            .iter()
            .map(|arg| self.build_field_type_from_normalized(arg, type_param_names))
            .collect();

        // Track which type args are phantom based on the datatype's type parameter declarations
        let type_arg_is_phantom: Vec<bool> = compiled_type_params
            .iter()
            .map(|param| param.is_phantom)
            .collect();

        FieldTypeIR::Datatype {
            class_name,
            full_type_name,
            type_args,
            type_arg_is_phantom,
            kind,
        }
    }

    fn build_field_type_from_normalized(
        &mut self,
        ty: &move_binary_format::normalized::Type<Symbol>,
        type_param_names: &[String],
    ) -> FieldTypeIR {
        use move_binary_format::normalized::Type as NType;

        match ty {
            NType::TypeParameter(idx) => {
                let idx = *idx as usize;
                let is_phantom = self
                    .enum_
                    .compiled()
                    .type_parameters
                    .get(idx)
                    .map(|p| p.is_phantom)
                    .unwrap_or(false);
                FieldTypeIR::TypeParam {
                    name: type_param_names
                        .get(idx)
                        .cloned()
                        .unwrap_or_else(|| format!("T{}", idx)),
                    is_phantom,
                    index: idx,
                }
            }
            NType::Bool => FieldTypeIR::Primitive("bool".to_string()),
            NType::U8 => FieldTypeIR::Primitive("u8".to_string()),
            NType::U16 => FieldTypeIR::Primitive("u16".to_string()),
            NType::U32 => FieldTypeIR::Primitive("u32".to_string()),
            NType::U64 => FieldTypeIR::Primitive("u64".to_string()),
            NType::U128 => FieldTypeIR::Primitive("u128".to_string()),
            NType::U256 => FieldTypeIR::Primitive("u256".to_string()),
            NType::Address => FieldTypeIR::Primitive("address".to_string()),
            NType::Signer => FieldTypeIR::Primitive("signer".to_string()),
            NType::Vector(inner) => FieldTypeIR::Vector(Box::new(
                self.build_field_type_from_normalized(inner, type_param_names),
            )),
            NType::Datatype(dt) => self.build_struct_type(dt, type_param_names),
            NType::Reference(_, inner) => {
                self.build_field_type_from_normalized(inner, type_param_names)
            }
        }
    }

    fn get_import_for_struct(&mut self, s: &model::Struct<'model, HasSource>) -> String {
        let struct_name = s.name().to_string();
        let struct_pkg_addr = s.module().package().address();
        let struct_mod_name = s.module().name();

        if struct_pkg_addr == self.package_address && struct_mod_name == self.module_name {
            // Same module
            return struct_name;
        }

        // Different module - add import
        let import_path = self.get_import_path(struct_pkg_addr, struct_mod_name);

        if let Some(existing) = self.struct_imports.get(&struct_name) {
            if existing.path == import_path {
                return struct_name;
            }
            // Name conflict - need alias
            let alias = format!("{}{}", struct_name, self.struct_imports.len());
            self.struct_imports.insert(
                alias.clone(),
                StructImport {
                    class_name: struct_name.clone(),
                    path: import_path,
                    alias: Some(alias.clone()),
                },
            );
            return alias;
        }

        self.struct_imports.insert(
            struct_name.clone(),
            StructImport {
                class_name: struct_name.clone(),
                path: import_path,
                alias: None,
            },
        );
        struct_name
    }

    fn get_import_for_enum(&mut self, e: &model::Enum<'model, HasSource>) -> String {
        let enum_name = e.name().to_string();
        let enum_pkg_addr = e.module().package().address();
        let enum_mod_name = e.module().name();

        if enum_pkg_addr == self.package_address && enum_mod_name == self.module_name {
            // Same module
            return enum_name;
        }

        // Different module - add import
        let import_path = self.get_import_path(enum_pkg_addr, enum_mod_name);

        if let Some(existing) = self.struct_imports.get(&enum_name) {
            if existing.path == import_path {
                return enum_name;
            }
            // Name conflict - need alias
            let alias = format!("{}{}", enum_name, self.struct_imports.len());
            self.struct_imports.insert(
                alias.clone(),
                StructImport {
                    class_name: enum_name.clone(),
                    path: import_path,
                    alias: Some(alias.clone()),
                },
            );
            return alias;
        }

        self.struct_imports.insert(
            enum_name.clone(),
            StructImport {
                class_name: enum_name.clone(),
                path: import_path,
                alias: None,
            },
        );
        enum_name
    }

    /// Returns the import path for a module's structs.ts file.
    /// Uses `ImportPathResolver` for consistent path computation.
    fn get_import_path(&self, pkg_addr: AccountAddress, mod_name: Symbol) -> String {
        let resolver = ImportPathResolver::new(
            self.package_address,
            self.module_name,
            self.folder_names.clone(),
            self.top_level_pkg_names.clone(),
            self.is_top_level,
        );
        // For enums, same module means empty path (no import needed)
        resolver
            .path_to_structs(pkg_addr, mod_name)
            .unwrap_or_default()
    }

    /// Get the struct imports collected during building
    pub fn get_struct_imports(&self) -> Vec<StructImport> {
        self.struct_imports.values().cloned().collect()
    }
}

// ============================================================================
// FunctionIRBuilder
// ============================================================================

use super::functions::{FunctionIR, FunctionParamIR, FunctionStructImport, ParamTypeIR};

/// Builds FunctionIR from a Move model function.
pub struct FunctionIRBuilder<'a, 'model, HasSource: SourceKind> {
    func: model::Function<'model, HasSource>,
    package_address: AccountAddress,
    module_name: Symbol,
    is_top_level: bool,
    folder_names: &'a BTreeMap<AccountAddress, String>,
    top_level_pkg_names: &'a BTreeMap<AccountAddress, Symbol>,
    #[allow(dead_code)]
    framework_path: String,
    struct_imports: HashMap<String, FunctionStructImport>,
}

impl<'a, 'model, HasSource: SourceKind> FunctionIRBuilder<'a, 'model, HasSource> {
    pub fn new(
        func: model::Function<'model, HasSource>,
        folder_names: &'a BTreeMap<AccountAddress, String>,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, Symbol>,
        levels_from_root: u8,
    ) -> Option<Self> {
        // Skip functions without compiled representation (e.g., macros)
        func.maybe_compiled()?;

        let package_address = func.module().package().address();
        let module_name = func.module().name();
        let is_top_level = top_level_pkg_names.contains_key(&package_address);
        let framework_path = "../".repeat(levels_from_root as usize) + "_framework";

        Some(FunctionIRBuilder {
            func,
            package_address,
            module_name,
            is_top_level,
            folder_names,
            top_level_pkg_names,
            framework_path,
            struct_imports: HashMap::new(),
        })
    }

    /// Build the FunctionIR from the Move function.
    pub fn build(mut self) -> FunctionIR {
        let move_name = self.func.name().to_string();
        let ts_name = self.generate_ts_name(&move_name);
        let module_name = self.module_name.to_string();
        let type_params = self.build_type_params();
        let params = self.build_params();

        // Determine what utilities are used
        let uses_generic = params.iter().any(|p| self.type_uses_generic(&p.param_type));
        let uses_option = params.iter().any(|p| self.type_uses_option(&p.param_type));
        let uses_vector = params.iter().any(|p| self.type_uses_vector(&p.param_type));
        let uses_pure = params.iter().any(|p| p.param_type.is_pure());
        let uses_obj = params.iter().any(|p| self.type_uses_obj(&p.param_type));

        // Determine which util imports need aliasing (single-param functions with conflicting names)
        let aliased_util_imports = if params.len() == 1 {
            let param_name = &params[0].ts_name;
            ["obj", "pure", "generic", "vector", "option"]
                .iter()
                .filter(|&&util_name| param_name == util_name)
                .map(|s| s.to_string())
                .collect()
        } else {
            Vec::new()
        };

        // Get the kebab-case package name for environment lookups
        let env_pkg_name = self
            .folder_names
            .get(&self.package_address)
            .cloned()
            .unwrap_or_else(|| self.package_address.to_hex_literal());

        // Extract function-level documentation
        let doc_comment = match self.func.kind() {
            model::Kind::WithSource(func) => extract_doc(&func.summary().doc),
            model::Kind::WithoutSource(_) => None,
        };

        // Extract deprecated status and note
        let (is_deprecated, deprecation_note) = match self.func.kind() {
            model::Kind::WithSource(func) => extract_deprecated(&func.summary().attributes),
            model::Kind::WithoutSource(_) => (false, None),
        };

        FunctionIR {
            move_name,
            ts_name,
            module_name,
            env_pkg_name,
            type_params,
            params,
            struct_imports: self.struct_imports.values().cloned().collect(),
            uses_generic,
            uses_option,
            uses_vector,
            uses_pure,
            uses_obj,
            aliased_util_imports,
            doc_comment,
            is_deprecated,
            deprecation_note,
        }
    }

    fn generate_ts_name(&self, move_name: &str) -> String {
        // Use from_case(Snake) to prevent digit-letter boundaries from being treated as word splits
        let ts_name = move_name.from_case(Case::Snake).to_case(Case::Camel);

        let mut sanitized = sanitize_identifier(&ts_name);

        // Handle trailing underscore in Move name
        if move_name.ends_with('_') && !sanitized.ends_with('_') {
            sanitized.push('_');
        }

        sanitized
    }

    fn build_type_params(&self) -> Vec<String> {
        match self.func.kind() {
            model::Kind::WithSource(func) => func
                .info()
                .signature
                .type_parameters
                .iter()
                .map(|tp| tp.user_specified_name.value.to_string())
                .collect(),
            model::Kind::WithoutSource(func) => (0..func.compiled().type_parameters.len())
                .map(|idx| format!("T{}", idx))
                .collect(),
        }
    }

    fn build_params(&mut self) -> Vec<FunctionParamIR> {
        let compiled = self.func.maybe_compiled().unwrap();
        let param_types = &compiled.parameters;
        let type_param_names = self.build_type_params();

        // Get parameter names if available
        let param_names: Option<Vec<Symbol>> = match self.func.kind() {
            model::Kind::WithSource(func) => Some(
                func.info()
                    .signature
                    .parameters
                    .iter()
                    .map(|(_mut, v, _ty)| v.value.name)
                    .collect(),
            ),
            model::Kind::WithoutSource(_) => None,
        };

        // Note: Move model doesn't provide per-parameter documentation
        // Parameters are documented in the function-level doc comment

        // Build params, filtering out TxContext
        let mut name_counts: HashMap<String, usize> = HashMap::new();
        let mut results = Vec::new();

        // First pass: count name occurrences
        for (idx, ty) in param_types.iter().enumerate() {
            if self.type_is_tx_context(ty) {
                continue;
            }
            let name = self.param_to_field_name(
                param_names.as_ref().map(|v| v[idx]),
                ty,
                &type_param_names,
            );
            *name_counts.entry(name).or_insert(0) += 1;
        }

        // Second pass: build params with unique names
        let mut current_counts: HashMap<String, usize> = HashMap::new();
        for (idx, ty) in param_types.iter().enumerate() {
            if self.type_is_tx_context(ty) {
                continue;
            }

            let ty = self.strip_ref(ty);
            let mut name = self.param_to_field_name(
                param_names.as_ref().map(|v| v[idx]),
                &ty,
                &type_param_names,
            );

            // Handle duplicate names
            let total = name_counts.get(&name).unwrap_or(&1);
            if *total > 1 {
                let count = current_counts.entry(name.clone()).or_insert(0);
                *count += 1;
                name = format!("{}{}", name, count);
            }

            let param_type = self.build_param_type(&ty);

            // Note: Move model doesn't provide per-parameter documentation
            results.push(FunctionParamIR {
                ts_name: name,
                param_type,
                doc_comment: None,
            });
        }

        results
    }

    fn param_to_field_name(
        &self,
        name: Option<Symbol>,
        ty: &Type,
        type_param_names: &[String],
    ) -> String {
        if let Some(name) = name {
            let name_str = name.to_string().to_case(Case::Camel);
            // When param name is `_`, use type as field name
            if name_str.is_empty() {
                self.field_name_from_type(ty, type_param_names)
            } else {
                name_str
            }
        } else {
            self.field_name_from_type(ty, type_param_names)
        }
    }

    #[allow(clippy::only_used_in_recursion)]
    fn field_name_from_type(&self, ty: &Type, type_param_names: &[String]) -> String {
        match ty {
            Type::U8 => "u8".to_string(),
            Type::U16 => "u16".to_string(),
            Type::U32 => "u32".to_string(),
            Type::U64 => "u64".to_string(),
            Type::U128 => "u128".to_string(),
            Type::U256 => "u256".to_string(),
            Type::Bool => "bool".to_string(),
            Type::Address => "address".to_string(),
            Type::Vector(inner) => {
                format!(
                    "vec{}",
                    self.field_name_from_type(inner, type_param_names)
                        .to_case(Case::Pascal)
                )
            }
            Type::Datatype(dt) => dt.name.to_string().to_case(Case::Camel),
            Type::Reference(_, inner) => self.field_name_from_type(inner, type_param_names),
            Type::TypeParameter(idx) => {
                type_param_names[*idx as usize].clone().to_case(Case::Camel)
            }
            Type::Signer => "unknown".to_string(),
        }
    }

    /// Build param type. `needs_import` indicates if the type's $typeName will be
    /// referenced in generated code (true for vector/option element types, false for
    /// top-level object params that just use obj()).
    fn build_param_type_inner(&mut self, ty: &Type, needs_import: bool) -> ParamTypeIR {
        match ty {
            Type::U8 => ParamTypeIR::Primitive("u8".to_string()),
            Type::U16 => ParamTypeIR::Primitive("u16".to_string()),
            Type::U32 => ParamTypeIR::Primitive("u32".to_string()),
            Type::U64 => ParamTypeIR::Primitive("u64".to_string()),
            Type::U128 => ParamTypeIR::Primitive("u128".to_string()),
            Type::U256 => ParamTypeIR::Primitive("u256".to_string()),
            Type::Bool => ParamTypeIR::Primitive("bool".to_string()),
            Type::Address => ParamTypeIR::Primitive("address".to_string()),
            Type::Vector(inner) => {
                // Vector element types need imports (used in vector(tx, `${Type.$typeName}`, ...))
                let inner_type = self.build_param_type_inner(inner, true);
                ParamTypeIR::Vector(Box::new(inner_type))
            }
            Type::Datatype(dt) => {
                // Check for special types
                match (dt.module.address, dt.module.name.as_str(), dt.name.as_str()) {
                    (AccountAddress::ONE, "string", "String") => {
                        // Import String from move-stdlib/string
                        self.add_special_import("String", dt.module.address, dt.module.name, None);
                        ParamTypeIR::StringType {
                            module: "string".to_string(),
                        }
                    }
                    (AccountAddress::ONE, "ascii", "String") => {
                        // Import String as String1 from move-stdlib/ascii
                        self.add_special_import(
                            "String",
                            dt.module.address,
                            dt.module.name,
                            Some("String1"),
                        );
                        ParamTypeIR::StringType {
                            module: "ascii".to_string(),
                        }
                    }
                    (AccountAddress::TWO, "object", "ID") => {
                        // Import ID from sui/object
                        self.add_special_import("ID", dt.module.address, dt.module.name, None);
                        ParamTypeIR::ID
                    }
                    (AccountAddress::ONE, "option", "Option") => {
                        // Build the inner type first to check if it's pure
                        let inner = self.build_param_type_inner(&dt.type_arguments[0], true);

                        // Import Option if:
                        // 1. We're in a nested context (needs_import = true)
                        // 2. The inner type is pure (because pure() uses ${Option.$typeName} in the BCS string)
                        // For non-pure inner types at top level, option() helper is used which doesn't need the import
                        if needs_import || inner.is_pure() {
                            self.add_special_import(
                                "Option",
                                dt.module.address,
                                dt.module.name,
                                None,
                            );
                        }
                        ParamTypeIR::Option(Box::new(inner))
                    }
                    _ => {
                        // Regular struct/enum - only import if $typeName will be used
                        let class_name = if needs_import {
                            self.get_import_for_datatype(dt)
                        } else {
                            // Don't need import, just use the type name
                            dt.name.to_string()
                        };
                        let type_args: Vec<_> = dt
                            .type_arguments
                            .iter()
                            .map(|ta| self.build_param_type_inner(ta, needs_import))
                            .collect();
                        ParamTypeIR::Struct {
                            class_name,
                            type_args,
                        }
                    }
                }
            }
            Type::Reference(_, inner) => self.build_param_type_inner(inner, needs_import),
            Type::TypeParameter(idx) => {
                let type_params = self.build_type_params();
                let name = type_params
                    .get(*idx as usize)
                    .cloned()
                    .unwrap_or_else(|| format!("T{}", idx));
                ParamTypeIR::TypeParam {
                    name,
                    index: *idx as usize,
                }
            }
            Type::Signer => ParamTypeIR::Primitive("address".to_string()),
        }
    }

    /// Build param type for a top-level function parameter.
    /// Top-level object params don't need imports (just passed to obj()).
    fn build_param_type(&mut self, ty: &Type) -> ParamTypeIR {
        self.build_param_type_inner(ty, false)
    }

    fn get_import_for_datatype(
        &mut self,
        dt: &move_binary_format::normalized::Datatype<Symbol>,
    ) -> String {
        let pkg_addr = dt.module.address;
        let mod_name = dt.module.name;
        let name = dt.name.to_string();

        // Check for duplicate class names (need alias)
        let mut alias = None;
        if let Some(existing) = self.struct_imports.get(&name) {
            if existing.path != self.get_import_path(pkg_addr, mod_name) {
                // Need to create an alias
                let alias_name = format!("{}_{}", name, self.struct_imports.len());
                alias = Some(alias_name);
            } else {
                // Same import, reuse
                return name;
            }
        }

        let path = self.get_import_path(pkg_addr, mod_name);
        let class_name = if let Some(ref alias_name) = alias {
            alias_name.clone()
        } else {
            name.clone()
        };

        self.struct_imports.insert(
            class_name.clone(),
            FunctionStructImport {
                class_name: name.clone(),
                path,
                alias,
            },
        );

        class_name
    }

    /// Add import for special types like String, Option, ID.
    /// Uses the unified get_import_path logic - no hardcoding of package names.
    fn add_special_import(
        &mut self,
        class_name: &str,
        pkg_addr: AccountAddress,
        mod_name: Symbol,
        alias: Option<&str>,
    ) {
        let import_key = alias.unwrap_or(class_name).to_string();

        // Skip if already imported
        if self.struct_imports.contains_key(&import_key) {
            return;
        }

        let path = self.get_import_path(pkg_addr, mod_name);

        self.struct_imports.insert(
            import_key,
            FunctionStructImport {
                class_name: class_name.to_string(),
                path,
                alias: alias.map(|s| s.to_string()),
            },
        );
    }

    /// Returns the import path for a module's structs.ts file.
    /// Uses `ImportPathResolver` for consistent path computation.
    fn get_import_path(&self, pkg_addr: AccountAddress, mod_name: Symbol) -> String {
        let resolver = ImportPathResolver::new(
            self.package_address,
            self.module_name,
            self.folder_names.clone(),
            self.top_level_pkg_names.clone(),
            self.is_top_level,
        );
        // For functions.ts, same module imports from ./structs (sibling file)
        resolver
            .path_to_structs(pkg_addr, mod_name)
            .unwrap_or_else(|| "./structs".to_string())
    }

    #[allow(clippy::only_used_in_recursion)]
    fn type_is_tx_context(&self, ty: &Type) -> bool {
        match ty {
            Type::Datatype(dt) => {
                dt.module.address == AccountAddress::TWO
                    && dt.module.name.as_str() == "tx_context"
                    && dt.name.as_str() == "TxContext"
            }
            Type::Reference(_, inner) => self.type_is_tx_context(inner),
            _ => false,
        }
    }

    #[allow(clippy::only_used_in_recursion)]
    fn strip_ref(&self, ty: &Type) -> Type {
        match ty {
            Type::Reference(_, inner) => self.strip_ref(inner),
            _ => ty.clone(),
        }
    }

    #[allow(clippy::only_used_in_recursion)]
    fn type_uses_generic(&self, ty: &ParamTypeIR) -> bool {
        match ty {
            ParamTypeIR::TypeParam { .. } => true,
            ParamTypeIR::Vector(inner) => self.type_uses_generic(inner),
            ParamTypeIR::Option(inner) => self.type_uses_generic(inner),
            _ => false,
        }
    }

    #[allow(clippy::only_used_in_recursion)]
    fn type_uses_option(&self, ty: &ParamTypeIR) -> bool {
        match ty {
            ParamTypeIR::Option(inner) => !inner.is_pure(),
            ParamTypeIR::Vector(inner) => self.type_uses_option(inner),
            _ => false,
        }
    }

    #[allow(clippy::only_used_in_recursion)]
    fn type_uses_vector(&self, ty: &ParamTypeIR) -> bool {
        match ty {
            ParamTypeIR::Vector(inner) => !inner.is_pure(),
            ParamTypeIR::Option(inner) => self.type_uses_vector(inner),
            _ => false,
        }
    }

    #[allow(clippy::only_used_in_recursion)]
    fn type_uses_obj(&self, ty: &ParamTypeIR) -> bool {
        match ty {
            ParamTypeIR::Struct { .. } => true,
            ParamTypeIR::Vector(inner) => self.type_uses_obj(inner),
            ParamTypeIR::Option(inner) => self.type_uses_obj(inner),
            _ => false,
        }
    }
}

/// Generate functions.ts content for a module.
pub fn gen_module_functions<HasSource: SourceKind>(
    module: &model::Module<HasSource>,
    folder_names: &BTreeMap<AccountAddress, String>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    levels_from_root: u8,
) -> String {
    use super::functions::emit_functions_file;

    // functions.ts is at <package>/<module>/functions.ts, so +2 levels from package root
    let func_levels = levels_from_root + 2;
    let framework_path = "../".repeat(func_levels as usize) + "_framework";

    let functions: Vec<_> = module
        .functions()
        .filter_map(|func| {
            FunctionIRBuilder::new(func, folder_names, top_level_pkg_names, levels_from_root)
        })
        .map(|builder| builder.build())
        .collect();

    emit_functions_file(&functions, &framework_path)
}

// =============================================================================
// Test-only helpers for module-level snapshot testing
// =============================================================================

/// Emit a complete structs.ts file from pre-built IR.
///
/// This allows snapshot tests to exercise the full file generation pipeline
/// without needing Move model building.
pub fn emit_module_structs_from_ir(
    structs: &[StructIR],
    enums: &[EnumIR],
    framework_path: &str,
) -> String {
    use std::collections::HashMap;

    if structs.is_empty() && enums.is_empty() {
        return String::new();
    }

    // Collect all imports from structs and enums
    let mut all_imports: HashMap<String, StructImport> = HashMap::new();
    for s in structs {
        for imp in &s.struct_imports {
            let key = imp.alias.as_ref().unwrap_or(&imp.class_name).clone();
            all_imports.entry(key).or_insert_with(|| imp.clone());
        }
    }

    // Emit combined imports
    let combined_imports =
        emit_combined_imports_with_enums(framework_path, &all_imports, structs, enums);

    // Emit struct bodies
    let struct_bodies: Vec<String> = structs.iter().map(|ir| ir.emit_body()).collect();

    // Emit enum bodies
    let enum_bodies: Vec<String> = enums.iter().map(|ir| ir.emit_body()).collect();

    let mut parts = vec![combined_imports];
    if !struct_bodies.is_empty() {
        parts.push(struct_bodies.join("\n\n"));
    }
    if !enum_bodies.is_empty() {
        parts.push(enum_bodies.join("\n\n"));
    }

    parts.join("\n\n")
}
