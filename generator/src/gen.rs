use std::collections::{BTreeMap, HashMap};

use crate::model_builder::{TypeOriginTable, VersionTable};
use anyhow::Result;
use convert_case::{Case, Casing};
use genco::lang::kotlin;
use genco::prelude::*;
use move_core_types::account_address::AccountAddress;
use move_model_2::compiled::Type;
use move_model_2::model::{self, Datatype, SourceKind, WITH_SOURCE};
use move_symbol_pool::Symbol;
use once_cell::sync::Lazy;
use regex::Regex;

#[rustfmt::skip]
const KOTLIN_RESERVED_WORDS: [&str; 97] = [
    "as", "as?", "break", "class", "continue", "do", "else", "false", "for", "fun", "if", "in",
    "!in", "interface", "is", "!is", "null", "object", "package", "return", "super", "this", "throw",
    "true", "try", "typealias", "typeof", "val", "var", "when", "while",
    "by", "catch", "constructor", "delegate", "dynamic", "field", "file", "finally", "get",
    "import", "init", "param", "property", "receiver", "set", "setparam", "where",
    "actual", "abstract", "annotation", "companion", "const", "crossinline", "data", "enum",
    "expect", "external", "final", "infix", "inline", "inner", "internal", "lateinit",
    "noinline", "open", "operator", "out", "override", "private", "protected", "public",
    "reified", "sealed", "suspend", "tailrec", "vararg","it", "List", "Map", "String", "Set",
    "Any", "Unit", "Nothing", "Int", "Long", "Double","Float", "Boolean", "Byte", "Short", "Char",
    "UByte", "UShort", "UInt", "ULong",
];

/// Returns module name that's used in import paths.
pub fn module_import_name(module: Symbol) -> String {
    module
        .to_string()
        .from_case(Case::Snake)
        .to_case(Case::Snake)
}

/// Returns package name that's used in import paths.
pub fn package_import_name(pkg_name: Symbol) -> String {
    static VERSION_REGEX: Lazy<Regex> = Lazy::new(|| Regex::new(r"_v_(\d+)").unwrap());

    let snake_case = pkg_name
        .to_string()
        .from_case(Case::Pascal)
        .to_case(Case::Snake);

    VERSION_REGEX.replace_all(&snake_case, "_v$1").to_string()
}

fn struct_full_name<const HAS_SOURCE: SourceKind>(s: &model::Struct<HAS_SOURCE>) -> String {
    format!("{}::{}", s.module().name(), s.name())
}

fn func_full_name<const HAS_SOURCE: SourceKind>(f: &model::Function<HAS_SOURCE>) -> String {
    format!("{}::{}", f.module().name(), f.name())
}

/// A context for generating import paths for struct classes.
pub struct StructClassImportCtx<'a> {
    reserved_names: HashMap<String, Vec<String>>,
    _package_address: AccountAddress,
    _module: Symbol,
    top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    is_structs_gen: bool,
    current_package: &'a str,
}

impl<'a> StructClassImportCtx<'a> {
    pub fn new<const HAS_SOURCE: SourceKind>(
        reserved_names: Vec<String>,
        module: &model::Module<HAS_SOURCE>,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
        is_structs_gen: bool,
        current_package: &'a str,
    ) -> Self {
        let _package_address = module.package().address();
        let _module = module.name();
        StructClassImportCtx {
            reserved_names: reserved_names
                .into_iter()
                .map(|name| (name, vec!["".to_string()]))
                .collect(),
            _package_address,
            _module,
            top_level_pkg_names,
            is_structs_gen,
            current_package,
        }
    }

    pub fn for_func_gen<const HAS_SOURCE: SourceKind>(
        module: &model::Module<HAS_SOURCE>,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
        current_package: &'a str,
    ) -> Self {
        let reserved_names = vec![];
        let is_structs_gen = false;
        StructClassImportCtx::new(
            reserved_names,
            module,
            top_level_pkg_names,
            is_structs_gen,
            current_package,
        )
    }

    pub fn for_struct_gen<const HAS_SOURCE: SourceKind>(
        module: &model::Module<HAS_SOURCE>,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
        is_structs_gen: bool,
        current_package: &'a str,
    ) -> Self {
        let reserved_names = module
            .structs()
            .map(|s| s.name())
            .chain(module.enums().map(|e| e.name()))
            .map(|s| s.to_string())
            .collect();
        StructClassImportCtx::new(
            reserved_names,
            module,
            top_level_pkg_names,
            is_structs_gen,
            current_package,
        )
    }

    fn import_path_for_struct<const HAS_SOURCE: SourceKind>(
        &self,
        strct: &model::Struct<HAS_SOURCE>,
    ) -> Option<String> {
        let module = strct.module();

        let base_pkg = "xyz.mcxross.ksui.model";
        let full_module_pkg = format!("{}.{}", base_pkg, module.name());
        let target_package = format!("{}.data", full_module_pkg);

        if self.is_structs_gen && self.current_package == target_package {
            None
        } else {
            Some(target_package)
        }
    }

    fn name_into_import(&self, path: &str, name: &str, idx: usize) -> kotlin::Import {
        match idx {
            0 => kotlin::import(path, name),
            _ => kotlin::import(path, format!("{} as {}{}", name, name, idx)),
        }
    }

    fn get_class<const HAS_SOURCE: SourceKind>(
        &mut self,
        strct: &model::Struct<HAS_SOURCE>,
    ) -> kotlin::Tokens {
        let class_name = strct.name().to_string();
        let import_path = self.import_path_for_struct(strct);

        let import_path = match import_path {
            None => return quote!($class_name),
            Some(import_path) => import_path,
        };

        match self.reserved_names.get_mut(&class_name) {
            None => {
                self.reserved_names
                    .insert(class_name.clone(), vec![import_path.clone()]);
                let ty = self.name_into_import(&import_path, &class_name, 0);
                quote!($ty)
            }
            Some(paths) => {
                let idx = paths.iter().position(|path| path == &import_path);
                match idx {
                    None => {
                        let idx = paths.len();
                        paths.push(import_path.clone());
                        let ty = self.name_into_import(&import_path, &class_name, idx);
                        quote!($ty)
                    }
                    Some(idx) => {
                        let ty = self.name_into_import(&import_path, &class_name, idx);
                        quote!($ty)
                    }
                }
            }
        }
    }
}

fn get_origin_pkg_addr<const HAS_SOURCE: SourceKind>(
    strct: &model::Struct<HAS_SOURCE>,
    type_origin_table: &TypeOriginTable,
) -> AccountAddress {
    let addr = strct.module().package().address();
    let types = type_origin_table.get(&addr).unwrap_or_else(|| {
        panic!(
            "expected origin table to exist for packge {}",
            addr.to_hex_literal()
        )
    });
    let full_name = struct_full_name(strct);
    let origin_addr = types.get(&full_name).unwrap_or_else(|| {
        panic!(
            "unable to find origin address for struct {} in package {}. \
            check consistency between original id and published at for this package.",
            full_name,
            addr.to_hex_literal()
        )
    });

    *origin_addr
}

fn gen_full_name_with_address<const HAS_SOURCE: SourceKind>(
    strct: &model::Struct<HAS_SOURCE>,
    type_origin_table: &TypeOriginTable,
    version_table: &VersionTable,
) -> kotlin::Tokens {
    let origin_pkg_addr = get_origin_pkg_addr(strct, type_origin_table);
    let self_addr = strct.module().package().address();
    let versions = version_table.get(&self_addr).unwrap_or_else(|| {
        panic!(
            "expected version table to exist for packge {}",
            self_addr.to_hex_literal()
        )
    });
    let version = versions.get(&origin_pkg_addr).unwrap_or_else(|| {
        panic!(
            "expected version to exist for package {} in package {}",
            origin_pkg_addr.to_hex_literal(),
            self_addr.to_hex_literal()
        )
    });
    let pkg_import = kotlin::import("..", format!("PKG_V{}", version.value()));

    quote!($[str]($($pkg_import)::$[const](struct_full_name(strct))))
}

fn gen_field_name(field: Symbol) -> impl FormatInto<Kotlin> {
    let name = field.to_string().to_case(Case::Camel);
    quote_fn! {
        $name
    }
}

fn todo_panic_if_enum<'a, const HAS_SOURCE: SourceKind>(
    module: &model::Module<'a, HAS_SOURCE>,
    id: Symbol,
) -> model::Struct<'a, HAS_SOURCE> {
    match module.datatype(id) {
        Datatype::Struct(s) => s,
        Datatype::Enum(_) => panic!("enums are not supported yet"),
    }
}

fn type_is_pure(ty: &Type) -> bool {
    match ty {
        Type::U8
        | Type::U16
        | Type::U32
        | Type::U64
        | Type::U128
        | Type::U256
        | Type::Bool
        | Type::Address => true,
        Type::Reference(_, ty) => type_is_pure(ty),
        Type::Vector(ty) => type_is_pure(ty),
        Type::Datatype(id_tys) => {
            let (id, ts) = &**id_tys;
            let ((pid, mid), sid) = *id;
            match (pid, mid.as_str(), sid.as_str()) {
                (AccountAddress::ONE, "string", "String")
                | (AccountAddress::ONE, "ascii", "String")
                | (AccountAddress::TWO, "object", "ID") => true,
                (AccountAddress::ONE, "option", "Option") => type_is_pure(&ts[0]),
                _ => false,
            }
        }
        _ => false,
    }
}

fn type_is_tx_context(ty: &Type) -> bool {
    match ty {
        Type::Datatype(id_tys) => {
            let (id, _ts) = &**id_tys;
            let ((address, module), name) = *id;
            address == AccountAddress::TWO
                && module.as_str() == "tx_context"
                && name.as_str() == "TxContext"
        }
        Type::Reference(_, ty) => type_is_tx_context(ty),
        _ => false,
    }
}

pub fn gen_module_files<const HAS_SOURCE: usize>(
    module: &model::Module<HAS_SOURCE>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    package_name: &str,
) -> Result<(kotlin::Tokens, kotlin::Tokens)> {
    let mut functions_toks = kotlin::Tokens::new();
    let mut data_toks = kotlin::Tokens::new();
    let mut functions_body_toks = kotlin::Tokens::new();

    let mut import_ctx =
        StructClassImportCtx::for_func_gen(module, top_level_pkg_names, package_name);

    let module_name = module
        .name()
        .to_string()
        .from_case(Case::Snake)
        .to_case(Case::Pascal);

    let mut has_data_classes = false;

    for func in module.functions() {
        let func_gen = match FunctionsGen::new(func) {
            Ok(func_gen) => func_gen,
            Err(_) => continue,
        };

        if func_gen.has_args_struct() {
            has_data_classes = true;
        }

        func_gen.gen_fun_args_if(&mut import_ctx, &mut data_toks)?;
        func_gen.gen_fun_binding(&mut import_ctx, &mut functions_body_toks, package_name)?;
    }

    if has_data_classes {
        quote_in!(functions_toks => import $(format!("{}.data.*", package_name)));
        functions_toks.line();
    }

    functions_body_toks.indent();

    quote_in! { functions_toks =>
        object $module_name {
            $(functions_body_toks)
        }
    }

    Ok((functions_toks, data_toks))
}

pub struct FunctionsGen<'model, const HAS_SOURCE: SourceKind> {
    func: model::Function<'model, HAS_SOURCE>,
}

impl<'model, const HAS_SOURCE: SourceKind> FunctionsGen<'model, HAS_SOURCE> {
    pub fn new(func: model::Function<'model, HAS_SOURCE>) -> Result<Self, ()> {
        if func.maybe_compiled().is_none() {
            Err(())
        } else {
            Ok(FunctionsGen { func })
        }
    }

    pub fn has_args_struct(&self) -> bool {
        let param_count = self.params_to_field_names(true).len();
        param_count >= 2
    }

    fn field_name_from_type(&self, ty: &Type, type_param_names: &[String]) -> Result<String> {
        let name = match ty {
            Type::U8 => "u8".to_string(),
            Type::U16 => "u16".to_string(),
            Type::U32 => "u32".to_string(),
            Type::U64 => "u64".to_string(),
            Type::U128 => "u128".to_string(),
            Type::U256 => "u256".to_string(),
            Type::Bool => "bool".to_string(),
            Type::Address => "address".to_string(),
            Type::Vector(ty) => {
                "vec".to_string()
                    + &self
                        .field_name_from_type(ty, type_param_names)?
                        .to_case(Case::Pascal)
            }
            Type::Datatype(id_tys) => {
                let (id, _ts) = &**id_tys;
                let ((pid, mid), sid) = *id;
                let module = self.func.model().module((pid, mid));
                todo_panic_if_enum(&module, sid)
                    .name()
                    .to_string()
                    .to_case(Case::Camel)
            }
            Type::Reference(_, ty) => self.field_name_from_type(ty, type_param_names)?,
            Type::TypeParameter(idx) => type_param_names[*idx as usize]
                .to_owned()
                .to_case(Case::Camel),
        };
        Ok(name)
    }

    fn param_to_field_name(
        &self,
        name: Option<Symbol>,
        type_: &Type,
        type_param_names: &[String],
    ) -> String {
        if let Some(name) = name {
            let name = name.to_string().to_case(Case::Camel);
            if name.is_empty() || name == "_" {
                self.field_name_from_type(type_, type_param_names).unwrap()
            } else {
                name
            }
        } else {
            self.field_name_from_type(type_, type_param_names).unwrap()
        }
    }

    fn func_type_param_names(&self) -> Vec<String> {
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

    fn parameter_variable_names(&self) -> Option<Vec<Symbol>> {
        match self.func.kind() {
            model::Kind::WithSource(func) => Some(
                func.info()
                    .signature
                    .parameters
                    .iter()
                    .map(|(_mut, v, _ty)| v.value.name)
                    .collect(),
            ),
            model::Kind::WithoutSource(_) => None,
        }
    }

    fn params_to_field_names(&self, ignore_tx_context: bool) -> Vec<(String, Type)> {
        let params = self.parameter_variable_names();
        let param_types = &self.func.maybe_compiled().unwrap().parameters;
        let type_param_names = self.func_type_param_names();

        let param_to_field_name = |idx: usize, type_: &Type| {
            if let Some(params) = &params {
                self.param_to_field_name(Some(params[idx]), type_, &type_param_names)
            } else {
                self.param_to_field_name(None, type_, &type_param_names)
            }
        };

        let mut name_count = HashMap::<String, usize>::new();
        let mut fields = Vec::new();

        for (idx, type_) in param_types.iter().enumerate() {
            if ignore_tx_context && type_is_tx_context(type_) {
                continue;
            }

            let name = param_to_field_name(idx, type_);
            let count = name_count.entry(name.clone()).or_insert(0);
            *count += 1;
            fields.push((name, type_.clone()));
        }

        let mut current_count = HashMap::<String, usize>::new();
        fields
            .into_iter()
            .map(|(name, type_)| {
                let total_count = name_count.get(&name).unwrap();
                let final_name = if *total_count > 1 {
                    let i = current_count.entry(name.clone()).or_insert(1);
                    let n = format!("{}{}", name, i);
                    *i += 1;
                    n
                } else {
                    name
                };
                (final_name, type_)
            })
            .collect()
    }

    fn fun_arg_if_name(&self) -> String {
        let name = self.func.name().to_string();
        name.from_case(Case::Snake).to_case(Case::Pascal) + "Args"
    }

    fn param_type_to_field_type(
        &self,
        _import_ctx: &mut StructClassImportCtx,
        ty: &Type,
    ) -> kotlin::Tokens {
        match ty {
            Type::U8 => quote!(UByte),
            Type::U16 => quote!(UShort),
            Type::U32 => quote!(UInt),
            Type::U64 => quote!(ULong),
            Type::U128 => quote!(java.math.BigInteger),
            Type::U256 => quote!(java.math.BigInteger),
            Type::Bool => quote!(Boolean),
            Type::Address => quote!(String),
            Type::Vector(ty) => {
                quote!(List<$(self.param_type_to_field_type(_import_ctx, ty))>)
            }
            Type::Datatype(id_tys) => {
                let (id, ts) = &**id_tys;
                let ((pid, mid), sid) = *id;
                match (pid, mid.as_str(), sid.as_str()) {
                    (AccountAddress::ONE, "string", "String")
                    | (AccountAddress::ONE, "ascii", "String") => quote!(String),
                    (AccountAddress::TWO, "object", "ID") => quote!(String),
                    (AccountAddress::ONE, "option", "Option") => {
                        quote!($(self.param_type_to_field_type(_import_ctx, &ts[0]))?)
                    }
                    _ => quote!(String),
                }
            }
            Type::Reference(_, ty) => self.param_type_to_field_type(_import_ctx, ty),
            Type::TypeParameter(_) => quote!(String),
        }
    }

    pub fn gen_fun_args_if(
        &self,
        import_ctx: &mut StructClassImportCtx,
        tokens: &mut Tokens<Kotlin>,
    ) -> Result<()> {
        if !self.has_args_struct() {
            return Ok(());
        }

        let param_field_names = self.params_to_field_names(true);

        quote_in! { *tokens =>
            data class $(self.fun_arg_if_name()) (
                $(ref toks => {
                    toks.indent();

                    for (field_name, param_type) in &param_field_names {
                        quote_in!(*toks =>
                            val $field_name: $(self.param_type_to_field_type(import_ctx, param_type)),
                        );
                    }

                    toks.unindent();
                    toks.line();
                })
            )
        };
        tokens.line();
        tokens.line();

        Ok(())
    }

    #[allow(clippy::only_used_in_recursion)]
    fn type_strip_ref(&self, ty: Type) -> Type {
        match ty {
            Type::Reference(_, ty) => self.type_strip_ref(*ty),
            _ => ty,
        }
    }

    fn param_to_tx_arg(&self, ty: Type, arg_field_name: String) -> kotlin::Tokens {
        let ty = self.type_strip_ref(ty);

        if type_is_pure(&ty) {
            quote!(builder.pure($arg_field_name))
        } else {
            match ty {
                Type::TypeParameter(_) => quote!(builder.generic($arg_field_name)),
                Type::Vector(_) => quote!(builder.vector($arg_field_name)),
                _ => quote!(builder.obj($arg_field_name)),
            }
        }
    }

    fn fun_name(&self) -> String {
        let func = self.func;
        let mut fun_name_str = func
            .name()
            .to_string()
            .from_case(Case::Snake)
            .to_case(Case::Camel);
        if KOTLIN_RESERVED_WORDS.contains(&fun_name_str.as_str()) {
            fun_name_str.push('_');
        };
        fun_name_str
    }

    pub fn gen_fun_binding(
        &self,
        import_ctx: &mut StructClassImportCtx,
        tokens: &mut kotlin::Tokens,
        package_name: &str,
    ) -> Result<()> {
        let builder = kotlin::import("xyz.mcxross.ksui.ptb", "ProgrammableTransactionBuilder");
        let argument = kotlin::import("xyz.mcxross.ksui.ptb", "Argument");
        let parent_package_name = package_name
            .rsplit_once('.')
            .map(|(parent, _)| parent)
            .unwrap_or(package_name);
        let published_at = kotlin::import(parent_package_name, "PUBLISHED_AT");

        let param_field_names = self.params_to_field_names(true);
        let func_type_param_names = self.func_type_param_names();
        let type_arg_count = func_type_param_names.len();

        let fun_name_str = self.fun_name();

        let mut fn_params: Vec<Tokens<Kotlin>> = vec![quote!(builder: $builder)];

        if type_arg_count == 1 {
            fn_params.push(quote!(typeArg: String));
        } else if type_arg_count > 1 {
            fn_params.push(quote!(typeArgs: List<String>));
        }

        if !param_field_names.is_empty() {
            if param_field_names.len() == 1 {
                let (name, type_) = &param_field_names[0];
                fn_params
                    .push(quote!($(name): $(self.param_type_to_field_type(import_ctx, type_))));
            } else {
                fn_params.push(quote!(args: $(self.fun_arg_if_name())));
            }
        }

        let arguments = if param_field_names.is_empty() {
            quote!(emptyList())
        } else if param_field_names.len() == 1 {
            let (name, type_) = &param_field_names[0];
            quote!(listOf($(self.param_to_tx_arg(type_.clone(), name.clone()))))
        } else {
            let args_list = param_field_names
                .iter()
                .map(|(name, type_)| self.param_to_tx_arg(type_.clone(), format!("args.{}", name)));
            quote!(listOf($(for arg in args_list join (, ) => $arg)))
        };

        let type_arguments_toks = if type_arg_count == 0 {
            quote!(emptyList())
        } else if type_arg_count == 1 {
            quote!(listOf(typeArg))
        } else {
            quote!(typeArgs)
        };

        let target: kotlin::Tokens =
            quote!($[str]($($published_at)::$[const](func_full_name(&self.func))));

        quote_in! { *tokens =>
            fun $fun_name_str(
                $(for param in fn_params join (, ) => $param)
            ): $argument {
                return builder.moveCall(
                    target = $target,
                    typeArguments = $type_arguments_toks,
                    arguments = $arguments
                )
            }
        };
        tokens.line();

        Ok(())
    }
}

pub struct StructsGen<'a, 'model, const HAS_SOURCE: SourceKind> {
    pub import_ctx: &'a mut StructClassImportCtx<'a>,
    type_origin_table: &'a TypeOriginTable,
    version_table: &'a VersionTable,
    strct: model::Struct<'model, HAS_SOURCE>,
}

impl<'a, 'model, const HAS_SOURCE: SourceKind> StructsGen<'a, 'model, HAS_SOURCE> {
    pub fn new(
        import_ctx: &'a mut StructClassImportCtx<'a>,
        type_origin_table: &'a TypeOriginTable,
        version_table: &'a VersionTable,
        strct: model::Struct<'model, HAS_SOURCE>,
    ) -> Self {
        StructsGen {
            import_ctx,
            type_origin_table,
            version_table,
            strct,
        }
    }

    fn gen_full_name_with_address(&self) -> kotlin::Tokens {
        gen_full_name_with_address(&self.strct, self.type_origin_table, self.version_table)
    }

    fn gen_struct_class_field_type_kt(
        &mut self,
        ty: &Type,
        type_param_names: &[String],
    ) -> kotlin::Tokens {
        match ty {
            Type::U8 => quote!(UByte),
            Type::U16 => quote!(UShort),
            Type::U32 => quote!(UInt),
            Type::U64 => quote!(ULong),
            Type::U128 => quote!(java.math.BigInteger),
            Type::U256 => quote!(java.math.BigInteger),
            Type::Bool => quote!(Boolean),
            Type::Address => quote!(String),
            Type::Vector(ty) => {
                quote!(List<$(self.gen_struct_class_field_type_kt(ty, type_param_names))>)
            }
            Type::Datatype(id_tys) => {
                let (id, ts) = &**id_tys;
                let ((pid, mid), sid) = *id;
                let module_env = self.strct.model().module((pid, mid));

                let field_strct = todo_panic_if_enum(&module_env, sid);
                let class = self.import_ctx.get_class(&field_strct);

                if ts.is_empty() {
                    quote!($class)
                } else {
                    let type_args = ts
                        .iter()
                        .map(|t| self.gen_struct_class_field_type_kt(t, type_param_names));
                    quote!($class<$(for arg in type_args join (, ) => $arg)>)
                }
            }
            Type::TypeParameter(idx) => {
                let name = &type_param_names[*idx as usize];
                quote!($name)
            }
            Type::Reference(_, inner_ty) => {
                self.gen_struct_class_field_type_kt(inner_ty, type_param_names)
            }
        }
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

    pub fn gen_struct_class(&mut self, tokens: &mut kotlin::Tokens) {
        let serializable = kotlin::import("kotlinx.serialization", "Serializable");

        let struct_name = self.strct.name().to_string();
        let type_params = self.strct_type_param_names();
        let has_key = self.strct.compiled().abilities.has_key();

        let gen_params = if !type_params.is_empty() {
            quote!(<$(for p in &type_params join (, ) => $p)>)
        } else {
            quote!()
        };

        let fields = self.strct.compiled().fields.clone();

        quote_in! { *tokens =>
            @$serializable
            data class $(&struct_name)$(gen_params) (
                $(for field in &fields join (,) =>
                    // TODO: handle serial name
                    val $(gen_field_name(field.name)): $(self.gen_struct_class_field_type_kt(&field.type_, &type_params))
                )
            ) {
                companion object {
                    const val typeName = $(self.gen_full_name_with_address());
                }
            }
        };
        tokens.line();
    }

    pub fn gen_struct_sep_comment(&self, tokens: &mut kotlin::Tokens) {
        let struct_name = self.strct.name();
        tokens.line();
        tokens.append(format!(
            "/* ============================== {struct_name} =============================== */",
        ));
        tokens.line()
    }
}