use std::collections::{BTreeMap, HashMap};

use crate::model_builder::{TypeOriginTable, VersionTable};
use anyhow::Result;
use convert_case::{Case, Casing};
use genco::prelude::*;
use genco::tokens::{Item, ItemStr};
use move_core_types::account_address::AccountAddress;
use move_model_2::compiled::Type;
use move_model_2::model::{self, Datatype, SourceKind, WITH_SOURCE};
use move_symbol_pool::Symbol;

#[rustfmt::skip]
const JS_RESERVED_WORDS: [&str; 64] = [
    "abstract", "arguments", "await", "boolean", "break", "byte", "case", "catch",
    "char", "class", "const", "continue", "debugger", "default", "delete", "do",
    "double", "else", "enum", "eval", "export", "extends", "false", "final",
    "finally", "float", "for", "function", "goto", "if", "implements", "import",
    "in", "instanceof", "int", "interface", "let", "long", "native", "new",
    "null", "package", "private", "protected", "public", "return", "short", "static",
    "super", "switch", "synchronized", "this", "throw", "throws", "transient", "true",
    "try", "typeof", "var", "void", "volatile", "while", "with", "yield"
];

#[rustfmt::skip]
const JS_STRICTLY_RESERVED_WORDS: [&str; 37] = [
    "await", "break", "case", "catch", "class", "const", "continue", "debugger",
    "default", "delete", "do", "else", "export", "extends", "false", "finally",
    "for", "function", "if", "import", "in", "instanceof", "new", "null", "return",
    "super", "switch", "this", "throw", "true", "try", "typeof", "var", "void",
    "while", "with", "yield"
];

/// Returns module name that's used in import paths (converts kebab case as that's idiomatic in TS).
pub fn module_import_name(module: Symbol) -> String {
    module
        .to_string()
        .from_case(Case::Snake)
        .to_case(Case::Kebab)
}

/// Returns package name that's used in import paths (converts to kebab case as that's idiomatic in TS).
pub fn package_import_name(pkg_name: Symbol) -> String {
    pkg_name
        .to_string()
        .from_case(Case::Pascal)
        .to_case(Case::Kebab)
}

fn struct_full_name<const HAS_SOURCE: SourceKind>(s: &model::Struct<HAS_SOURCE>) -> String {
    format!("{}::{}", s.module().name(), s.name())
}

fn func_full_name<const HAS_SOURCE: SourceKind>(f: &model::Function<HAS_SOURCE>) -> String {
    format!("{}::{}", f.module().name(), f.name())
}

pub struct FrameworkImportCtx {
    framework_rel_path: String,
}

impl FrameworkImportCtx {
    pub fn new(levels_from_root: u8) -> Self {
        let framework_rel_path = if levels_from_root == 0 {
            "./_framework".to_string()
        } else {
            (0..levels_from_root)
                .map(|_| "..")
                .collect::<Vec<_>>()
                .join("/")
                + "/_framework"
        };

        FrameworkImportCtx { framework_rel_path }
    }

    fn import(&self, module: &str, name: &str) -> js::Import {
        js::import(format!("{}/{}", self.framework_rel_path, module), name)
    }
}

/// A context for generating import paths for struct classes. This is needed to avoid name conflicts
/// when importing different structs of the same name.
pub struct StructClassImportCtx<'a> {
    // a map storing class names that have already been used and their import paths
    // to avoid name conflicts
    reserved_names: HashMap<String, Vec<String>>,
    package_address: AccountAddress,
    module: Symbol,
    is_top_level: bool,
    top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    is_structs_gen: bool,
}

impl<'a> StructClassImportCtx<'a> {
    pub fn new<const HAS_SOURCE: SourceKind>(
        reserved_names: Vec<String>,
        module: &model::Module<HAS_SOURCE>,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
        is_structs_gen: bool,
    ) -> Self {
        let package_address = module.package().address();
        let module = module.name();
        StructClassImportCtx {
            reserved_names: reserved_names
                .into_iter()
                .map(|name| (name, vec!["".to_string()]))
                .collect(),
            package_address,
            module,
            is_top_level: top_level_pkg_names.contains_key(&package_address),
            top_level_pkg_names,
            is_structs_gen,
        }
    }

    pub fn for_func_gen<const HAS_SOURCE: SourceKind>(
        module: &model::Module<HAS_SOURCE>,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    ) -> Self {
        let reserved_names = vec![];
        let is_structs_gen = false;
        StructClassImportCtx::new(reserved_names, module, top_level_pkg_names, is_structs_gen)
    }

    pub fn for_struct_gen<const HAS_SOURCE: SourceKind>(
        module: &model::Module<HAS_SOURCE>,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    ) -> Self {
        let reserved_names = module
            .structs()
            .map(|s| s.name())
            .chain(module.enums().map(|e| e.name()))
            .map(|s| s.to_string())
            .collect();
        let is_structs_gen = true;
        StructClassImportCtx::new(reserved_names, module, top_level_pkg_names, is_structs_gen)
    }

    /// Returns the import path for a struct. If the struct is defined in the current module,
    /// returns `None`.
    fn import_path_for_struct<const HAS_SOURCE: SourceKind>(
        &self,
        strct: &model::Struct<HAS_SOURCE>,
    ) -> Option<String> {
        let module = strct.module();
        let module_name = module_import_name(module.name());
        let same_package = module.package().address() == self.package_address;
        if same_package && module.name() == self.module {
            // if the struct is defined in the current module, we don't need to import anything
            if self.is_structs_gen {
                None
            } else {
                Some("./structs".to_string())
            }
        } else if same_package {
            // if the struct is defined in a different module in the same package, we use
            // the short version of the import path
            Some(format!("../{}/structs", module_name))
        } else {
            let strct_is_top_level = self
                .top_level_pkg_names
                .contains_key(&module.package().address());

            if self.is_top_level && strct_is_top_level {
                let strct_pkg_name = package_import_name(
                    *self
                        .top_level_pkg_names
                        .get(&module.package().address())
                        .unwrap(),
                );

                Some(format!("../../{}/{}/structs", strct_pkg_name, module_name))
            } else if self.is_top_level {
                let dep_dir = if HAS_SOURCE == WITH_SOURCE {
                    "source"
                } else {
                    "onchain"
                };

                Some(format!(
                    "../../_dependencies/{}/{}/{}/structs",
                    dep_dir,
                    module.package().address().to_hex_literal(),
                    module_name
                ))
            } else if strct_is_top_level {
                let strct_pkg_name = package_import_name(
                    *self
                        .top_level_pkg_names
                        .get(&module.package().address())
                        .unwrap(),
                );

                Some(format!(
                    "../../../../{}/{}/structs",
                    strct_pkg_name, module_name
                ))
            } else {
                Some(format!(
                    "../../{}/{}/structs",
                    module.package().address().to_hex_literal(),
                    module_name
                ))
            }
        }
    }

    fn name_into_import(&self, path: &str, name: &str, idx: usize) -> js::Import {
        match idx {
            0 => js::import(path, name),
            _ => js::import(path, name).with_alias(format!("{}{}", name, idx)),
        }
    }

    /// Returns the class name for a struct and imports it if necessary. If a class with the same name
    /// has already been imported, imports it with an alias (e.g. Foo1, Foo2, etc.).
    fn get_class<const HAS_SOURCE: SourceKind>(
        &mut self,
        strct: &model::Struct<HAS_SOURCE>,
    ) -> js::Tokens {
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

fn strct_qualified_member_name<const HAS_SOURCE: SourceKind>(
    strct: &model::Struct<HAS_SOURCE>,
    type_origin_table: &TypeOriginTable,
) -> (AccountAddress, Symbol, Symbol) {
    let origin_package = get_origin_pkg_addr(strct, type_origin_table);
    let module = strct.module();
    (origin_package, module.name(), strct.name())
}

fn gen_full_name_with_address<const HAS_SOURCE: SourceKind>(
    strct: &model::Struct<HAS_SOURCE>,
    type_origin_table: &TypeOriginTable,
    version_table: &VersionTable,
    open_quote: bool,
    as_type: bool,
) -> js::Tokens {
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
    let pkg_import = js::import("../index", format!("PKG_V{}", version.value()));

    // `${PKG_V1}::module::name`
    let mut toks = js::Tokens::new();
    if open_quote {
        toks.append(Item::OpenQuote(true));
    }
    toks.append(Item::Literal(ItemStr::from("${")));
    if as_type {
        quote_in!(toks => typeof $pkg_import)
    } else {
        quote_in!(toks => $pkg_import);
    }
    toks.append(Item::Literal(ItemStr::from("}")));
    quote_in!(toks => ::$(struct_full_name(strct)));
    if open_quote {
        toks.append(Item::CloseQuote);
    }

    toks
}

/// Generates a TS interface field name from a struct field.
fn gen_field_name(field: Symbol) -> impl FormatInto<JavaScript> {
    let name = field.to_string().to_case(Case::Camel);
    quote_fn! {
        $name
    }
}

pub fn gen_package_init_ts<const HAS_SOURCE: SourceKind>(
    pkg: &model::Package<HAS_SOURCE>,
    framework: &FrameworkImportCtx,
) -> js::Tokens {
    let struct_class_loader = &framework.import("loader", "StructClassLoader");
    // TODO use canonical module names
    quote! {
        export function registerClasses(loader: $struct_class_loader) {
            $(ref toks {
                for module in pkg.modules() {
                    let module_name = module.name().to_string();

                    let mut imported_name = module_name.to_case(Case::Camel);
                    if JS_RESERVED_WORDS.contains(&imported_name.as_str()) {
                        imported_name.push('_');
                    }

                    let module_import = &js::import(
                        format!("./{}/structs", module_import_name(module.name())),
                        imported_name,
                    )
                    .into_wildcard();

                    for strct in module.structs() {
                        let strct_name = strct.name().to_string();

                        quote_in! { *toks =>
                            loader.register($(module_import).$(strct_name));$['\r']
                        }
                    }
                }
            })
        }
    }
}

fn gen_init_loader_register_classes_fn_body_toks(
    pkg_ids: Vec<AccountAddress>,
    top_level_pkg_names: &BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    is_source: bool,
    toks: &mut js::Tokens,
) {
    for pkg_id in pkg_ids {
        let pkg_init_path = match top_level_pkg_names.get(&pkg_id) {
            Some(pkg_name) => {
                format!("../{}/init", package_import_name(*pkg_name))
            }
            None => {
                if is_source {
                    format!("../_dependencies/source/{}/init", pkg_id.to_hex_literal())
                } else {
                    format!("../_dependencies/onchain/{}/init", pkg_id.to_hex_literal())
                }
            }
        };

        let prefix = if is_source {
            "package_source"
        } else {
            "package_onchain"
        };

        let pkg_import = &js::import(
            pkg_init_path,
            format!("{}_{}", prefix, pkg_id.short_str_lossless()),
        )
        .into_wildcard();

        quote_in! { *toks =>
            $(pkg_import).registerClasses(loader);$['\r']
        }
    }
}

pub fn gen_init_loader_ts(
    source_pkgs_info: Option<(
        Vec<AccountAddress>,
        &BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    )>,
    onchain_pkgs_info: Option<(
        Vec<AccountAddress>,
        &BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    )>,
) -> js::Tokens {
    let struct_class_loader = &js::import("./loader", "StructClassLoader");

    let mut toks = js::Tokens::new();

    if let Some((pkg_ids, top_level_pkg_names)) = &source_pkgs_info {
        quote_in!(toks =>
            function registerClassesSource(loader: $struct_class_loader) {
                $(ref toks {
                    gen_init_loader_register_classes_fn_body_toks(pkg_ids.clone(), top_level_pkg_names, true, toks)
                })
            }$['\n']
        )
    };

    if let Some((pkg_ids, top_level_pkg_names)) = &onchain_pkgs_info {
        quote_in!(toks =>
            function registerClassesOnchain(loader: $struct_class_loader) {
                $(ref toks {
                    gen_init_loader_register_classes_fn_body_toks(pkg_ids.clone(), top_level_pkg_names, false, toks)
                })
            }$['\n']
        )
    };

    match (&source_pkgs_info, &onchain_pkgs_info) {
        (None, None) => quote_in!(toks => {
            export function registerClasses(_: $struct_class_loader) { }$['\n']
        }),
        (Some(_), None) => quote_in!(toks =>
            export function registerClasses(loader: $struct_class_loader) {
                registerClassesSource(loader);
            }$['\n']
        ),
        (None, Some(_)) => quote_in!(toks =>
            export function registerClasses(loader: $struct_class_loader) {
                registerClassesOnchain(loader);
            }$['\n']
        ),
        (Some(_), Some(_)) => quote_in!(toks =>
            export function registerClasses(loader: $struct_class_loader) {
                registerClassesOnchain(loader);
                registerClassesSource(loader);
            }$['\n']
        ),
    };

    toks
}

/// Generates `typeArgs` param for a function that takes type arguments.
/// E.g. `typeArgs: [string, string]` or `typeArg: string`.
fn gen_type_args_param(
    count: usize,
    prefix: impl FormatInto<JavaScript>,
    suffix: impl FormatInto<JavaScript>,
) -> impl FormatInto<JavaScript> {
    quote! {
        $(match count {
            0 => (),
            1 => $(prefix)typeArg: string$suffix,
            _ => $(prefix)typeArgs: [$(for _ in 0..count join (, ) => string)]$suffix
        })
    }
}

enum QuoteItem {
    Interpolated(Tokens<JavaScript>),
    #[allow(dead_code)]
    Literal(String),
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

fn gen_bcs_def_for_type<const HAS_SOURCE: SourceKind>(
    ty: &Type,
    env: &model::Model<HAS_SOURCE>,
    type_param_names: &[QuoteItem],
    import_ctx: &mut StructClassImportCtx,
) -> js::Tokens {
    let mut toks = js::Tokens::new();
    toks.append(Item::OpenQuote(true));

    fn inner<const HAS_SOURCE: SourceKind>(
        toks: &mut Tokens<JavaScript>,
        ty: &Type,
        env: &model::Model<HAS_SOURCE>,
        type_param_names: &[QuoteItem],
        import_ctx: &mut StructClassImportCtx,
    ) {
        match ty {
            Type::TypeParameter(idx) => match &type_param_names[*idx as usize] {
                QuoteItem::Interpolated(s) => {
                    toks.append(Item::Literal(ItemStr::from("${")));
                    quote_in! ( *toks => $(s.clone()));
                    toks.append(Item::Literal(ItemStr::from("}")));
                }
                QuoteItem::Literal(s) => toks.append(Item::Literal(ItemStr::from(s))),
            },
            Type::Datatype(id_tys) => {
                let (id, ts) = &**id_tys;
                let ((pid, mid), sid) = *id;
                let module_env = env.module((pid, mid));

                let struct_env = todo_panic_if_enum(&module_env, sid);
                let class = import_ctx.get_class(&struct_env);

                toks.append(Item::Literal(ItemStr::from("${")));
                quote_in! { *toks => $(class).$$typeName };
                toks.append(Item::Literal(ItemStr::from("}")));

                if !ts.is_empty() {
                    quote_in! { *toks => < };
                    let len = ts.len();
                    for (i, ty) in ts.iter().enumerate() {
                        inner(toks, ty, env, type_param_names, import_ctx);
                        if i != len - 1 {
                            quote_in! { *toks => , };
                            toks.space()
                        }
                    }
                    quote_in! { *toks => > };
                }
            }
            Type::Vector(ty) => {
                quote_in! { *toks => vector< };
                inner(toks, ty, env, type_param_names, import_ctx);
                quote_in! { *toks => > };
            }
            Type::U8 => quote_in!(*toks => u8),
            Type::U16 => quote_in!(*toks => u16),
            Type::U32 => quote_in!(*toks => u32),
            Type::U64 => quote_in!(*toks => u64),
            Type::U128 => quote_in!(*toks => u128),
            Type::U256 => quote_in!(*toks => u256),
            Type::Bool => quote_in!(*toks => bool),
            Type::Address => quote_in!(*toks => address),
            Type::Reference(_, _) => panic!("unexpected type: {:?}", ty),
        }
    }

    inner(&mut toks, ty, env, type_param_names, import_ctx);
    toks.append(Item::CloseQuote);

    toks
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

// returns Option's type argument if the type is Option
fn type_is_option(ty: &Type) -> Option<&Type> {
    match ty {
        Type::Datatype(id_tys) => {
            let (id, ts) = &**id_tys;
            let ((pid, mid), sid) = *id;
            match (pid, mid.as_str(), sid.as_str()) {
                (AccountAddress::ONE, "option", "Option") => Some(&ts[0]),
                _ => None,
            }
        }
        Type::Reference(_, ty) => type_is_option(ty),
        _ => None,
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

pub struct FunctionsGen<'a, 'model, const HAS_SOURCE: SourceKind> {
    pub import_ctx: &'a mut StructClassImportCtx<'a>,
    framework: FrameworkImportCtx,
    func: model::Function<'model, HAS_SOURCE>,
}

impl<'a, 'model, const HAS_SOURCE: SourceKind> FunctionsGen<'a, 'model, HAS_SOURCE> {
    /// Returns Ok(self) if the function has a compiled representation
    /// Otherwise returns Err(import_ctx) simply to help with lifetime issues
    pub fn new(
        import_ctx: &'a mut StructClassImportCtx<'a>,
        framework: FrameworkImportCtx,
        func: model::Function<'model, HAS_SOURCE>,
    ) -> Result<Self, &'a mut StructClassImportCtx<'a>> {
        if func.maybe_compiled().is_none() {
            // skip functions without compiled representation, e.g. macros
            assert!(HAS_SOURCE == WITH_SOURCE);
            Err(import_ctx)
        } else {
            Ok(FunctionsGen {
                import_ctx,
                framework,
                func,
            })
        }
    }

    fn gen_bcs_def_for_type(&mut self, ty: &Type, type_param_names: &[QuoteItem]) -> js::Tokens {
        gen_bcs_def_for_type(ty, self.func.model(), type_param_names, self.import_ctx)
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
            // When the param name is `_` we use the type as the field name.
            if name.is_empty() {
                self.field_name_from_type(type_, type_param_names).unwrap()
            } else {
                name
            }
        } else {
            self.field_name_from_type(type_, type_param_names).unwrap()
        }
    }

    /// Returns type parameter names for a function. If type parameter names are not defined
    /// it will return `T0`, `T1`, etc.
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

    // Generates TS interface field names from function's params. Used in the `<..>Args` interface
    // or function binding params.
    // If the param names are not defined (e.g. `_`), it will generate a name based on the type.
    // In case this causes a name collision, it will append a number to the name.
    fn params_to_field_names(&self, ignore_tx_context: bool) -> Vec<(String, Type)> {
        let params = self.parameter_variable_names();
        let param_types = &self.func.maybe_compiled().unwrap().parameters;
        let type_param_names = self.func_type_param_names();

        let param_to_field_name = |idx: usize, type_: &Type| {
            // When there are no named parameters (e.g. on-chain modules), the `params` vector
            // will always be empty. In this case, we generate names based on the type.
            if let Some(params) = &params {
                self.param_to_field_name(Some(params[idx]), type_, &type_param_names)
            } else {
                self.param_to_field_name(None, type_, &type_param_names)
            }
        };

        let mut name_count = HashMap::<String, usize>::new();

        for (idx, type_) in param_types.iter().enumerate() {
            if ignore_tx_context && type_is_tx_context(type_) {
                continue;
            }

            let name = param_to_field_name(idx, type_);
            let count = name_count.get(&name).map(|count| *count + 1).unwrap_or(1);
            name_count.insert(name, count);
        }

        let mut current_count = HashMap::<String, usize>::new();

        param_types
            .iter()
            .enumerate()
            .filter_map(|(idx, type_)| {
                if ignore_tx_context && type_is_tx_context(type_) {
                    return None;
                }

                let mut name = param_to_field_name(idx, type_);
                let total_count = name_count.get(&name).unwrap();

                let i = current_count
                    .get(&name)
                    .map(|count| *count + 1)
                    .unwrap_or(1);
                current_count.insert(name.clone(), i);

                name = if *total_count > 1 {
                    format!("{}{}", name, i)
                } else {
                    name
                };

                Some((name, type_.clone()))
            })
            .collect()
    }

    fn fun_arg_if_name(&self) -> String {
        let name = self.func.name().to_string();

        // function names ending with `_` are common, so handle this specifically
        // TODO: remove this once there's a more general way to handle this
        name.from_case(Case::Snake).to_case(Case::Pascal)
            + if name.ends_with('_') { "_Args" } else { "Args" }
    }

    /// Generates a TS type for a function's parameter type. Used in the `<..>Args` interface.
    fn param_type_to_field_type(&self, ty: &Type) -> js::Tokens {
        let generic_arg = &self.framework.import("util", "GenericArg");
        let transaction_argument = &js::import("@mysten/sui/transactions", "TransactionArgument");
        let transaction_object_input =
            &js::import("@mysten/sui/transactions", "TransactionObjectInput");

        match ty {
            Type::U8 | Type::U16 | Type::U32 => {
                quote!(number | $transaction_argument)
            }
            Type::U64 | Type::U128 | Type::U256 => {
                quote!(bigint | $transaction_argument)
            }
            Type::Bool => quote!(boolean | $transaction_argument),
            Type::Address => quote!(string | $transaction_argument),
            Type::Vector(ty) => {
                quote!(Array<$(self.param_type_to_field_type(ty))> | $transaction_argument)
            }
            Type::Datatype(id_tys) => {
                let (id, ts) = &**id_tys;
                let ((pid, mid), sid) = *id;
                match (pid, mid.as_str(), sid.as_str()) {
                    (AccountAddress::ONE, "string", "String")
                    | (AccountAddress::ONE, "ascii", "String") => {
                        quote!(string | $transaction_argument)
                    }
                    (AccountAddress::TWO, "object", "ID") => {
                        quote!(string | $transaction_argument)
                    }
                    (AccountAddress::ONE, "option", "Option") => {
                        quote!(($(self.param_type_to_field_type(&ts[0])) | $transaction_argument | null))
                    }
                    _ => quote!($transaction_object_input),
                }
            }
            Type::Reference(_, ty) => self.param_type_to_field_type(ty),
            Type::TypeParameter(_) => quote!($generic_arg),
        }
    }

    /// Generates the `<..>Args` interface for a function.
    pub fn gen_fun_args_if(&self, tokens: &mut Tokens<JavaScript>) -> Result<()> {
        let param_field_names = self.params_to_field_names(true);
        if param_field_names.len() < 2 {
            return Ok(());
        }

        quote_in! { *tokens =>
            export interface $(self.fun_arg_if_name()) {
                $(for (field_name, param_type) in param_field_names join (; )=>
                    $field_name: $(self.param_type_to_field_type(&param_type))
                )
            }$['\n']
        };

        Ok(())
    }

    #[allow(clippy::only_used_in_recursion)]
    fn type_strip_ref(&self, ty: Type) -> Type {
        match ty {
            Type::Reference(_, ty) => self.type_strip_ref(*ty),
            _ => ty,
        }
    }

    fn param_to_tx_arg(
        &mut self,
        ty: Type,
        arg_field_name: String,
        func_type_param_names: &[String],
        single_param: bool,
    ) -> js::Tokens {
        let import_with_possible_alias = |field_name: &str| {
            if single_param && arg_field_name == field_name {
                self.framework
                    .import("util", field_name)
                    .with_alias(field_name.to_owned() + "_")
            } else {
                self.framework.import("util", field_name)
            }
        };
        let obj = import_with_possible_alias("obj");
        let pure = import_with_possible_alias("pure");
        let generic = import_with_possible_alias("generic");
        let vector = import_with_possible_alias("vector");
        let option = import_with_possible_alias("option");

        let num_type_params = func_type_param_names.len();
        let type_param_names = match num_type_params {
            0 => vec![],
            1 => vec![QuoteItem::Interpolated(quote!(typeArg))],
            _ => (0..num_type_params)
                .map(|idx| QuoteItem::Interpolated(quote!(typeArgs[$idx])))
                .collect::<Vec<_>>(),
        };

        let ty = self.type_strip_ref(ty);
        let ty_tok = self.gen_bcs_def_for_type(&ty, &type_param_names);

        if type_is_pure(&ty) {
            quote!($pure(tx, $arg_field_name, $ty_tok))
        } else if let Some(ty) = type_is_option(&ty) {
            let ty_tok = self.gen_bcs_def_for_type(ty, &type_param_names);
            quote!($option(tx, $ty_tok, $arg_field_name))
        } else {
            match ty {
                Type::TypeParameter(_) => {
                    let ty_tok = self.gen_bcs_def_for_type(&ty, &type_param_names);
                    quote!($generic(tx, $ty_tok, $arg_field_name))
                }
                Type::Vector(ty) => {
                    let ty_tok = self.gen_bcs_def_for_type(&ty, &type_param_names);
                    quote!($vector(tx, $ty_tok, $arg_field_name))
                }
                _ => {
                    quote!($obj(tx, $arg_field_name))
                }
            }
        }
    }

    /// Returns the TS function binding name for a function.
    fn fun_name(&self) -> String {
        let func = self.func;
        let mut fun_name_str = func
            .name()
            .to_string()
            .from_case(Case::Snake)
            .to_case(Case::Camel);
        if JS_RESERVED_WORDS.contains(&fun_name_str.as_str()) {
            fun_name_str.push('_');
        };
        // function names ending with `_` are common, so handle this specifically
        // TODO: remove this once there's a more general way to handle this
        if func.name().as_str().ends_with('_') {
            fun_name_str.push('_');
        }
        fun_name_str
    }

    /// Generates a function binding for a function.
    pub fn gen_fun_binding(&mut self, tokens: &mut Tokens<JavaScript>) -> Result<()> {
        let transaction = &js::import("@mysten/sui/transactions", "Transaction");
        let published_at = &js::import("..", "PUBLISHED_AT");

        let param_field_names = self.params_to_field_names(true);

        let func_type_param_names = self.func_type_param_names();
        let type_arg_count = func_type_param_names.len();
        let single_param = param_field_names.len() == 1;

        let convert_reserved_if_needed = |name: &str| {
            if JS_STRICTLY_RESERVED_WORDS.contains(&name) {
                name.to_owned() + "_"
            } else {
                name.to_owned()
            }
        };

        quote_in! { *tokens =>
            export function $(self.fun_name())(
                tx: $transaction,
                $(gen_type_args_param(type_arg_count, None::<&str>, ","))
                $(match param_field_names.len() {
                    0 => (),
                    1 => {$(convert_reserved_if_needed(&param_field_names[0].0)): $(self.param_type_to_field_type(&param_field_names[0].1)),},
                    _ => {args: $(self.fun_arg_if_name()),}
                })
                published_at: string = $published_at
            ) {
                return tx.moveCall({
                    target: $[str]($(published_at)::$[const](func_full_name(&self.func))),
                    $(match type_arg_count {
                        0 => (),
                        1 => { typeArguments: [typeArg], },
                        _ => { typeArguments: typeArgs, },
                    })
                    arguments: [
                        $(if param_field_names.len() == 1 {
                            $(self.param_to_tx_arg(
                                param_field_names[0].1.clone(), convert_reserved_if_needed(&param_field_names[0].0),
                                &func_type_param_names, single_param
                            ))
                        } else {
                            $(for (field_name, type_) in param_field_names join (, ) =>
                                $(self.param_to_tx_arg(
                                    type_, "args.".to_string() + &field_name,
                                    &func_type_param_names, single_param
                                ))
                            )
                        })
                    ],
                })
            }$['\n']
        };

        Ok(())
    }
}

enum ExtendsOrWraps {
    None,
    Extends(js::Tokens),
    Wraps(js::Tokens),
}

pub struct StructsGen<'a, 'model, const HAS_SOURCE: SourceKind> {
    pub import_ctx: &'a mut StructClassImportCtx<'a>,
    framework: FrameworkImportCtx,
    type_origin_table: &'a TypeOriginTable,
    version_table: &'a VersionTable,
    strct: model::Struct<'model, HAS_SOURCE>,
}

impl<'a, 'model, const HAS_SOURCE: SourceKind> StructsGen<'a, 'model, HAS_SOURCE> {
    pub fn new(
        import_ctx: &'a mut StructClassImportCtx<'a>,
        framework: FrameworkImportCtx,
        type_origin_table: &'a TypeOriginTable,
        version_table: &'a VersionTable,
        strct: model::Struct<'model, HAS_SOURCE>,
    ) -> Self {
        StructsGen {
            import_ctx,
            framework,
            type_origin_table,
            version_table,
            strct,
        }
    }

    fn gen_full_name_with_address(&self, open_quote: bool, as_type: bool) -> js::Tokens {
        gen_full_name_with_address(
            &self.strct,
            self.type_origin_table,
            self.version_table,
            open_quote,
            as_type,
        )
    }

    fn gen_bcs_def_for_type(&mut self, ty: &Type, type_param_names: &[QuoteItem]) -> js::Tokens {
        gen_bcs_def_for_type(ty, self.strct.model(), type_param_names, self.import_ctx)
    }

    /// Generates a TS interface field type for a struct field. References class structs generated
    /// in other modules by importing them when needed.
    fn gen_struct_class_field_type(
        &mut self,
        ty: &Type,
        type_param_names: &[String],
        wrap_non_phantom_type_parameter: Option<js::Tokens>,
        wrap_phantom_type_parameter: Option<js::Tokens>,
    ) -> js::Tokens {
        self.gen_struct_class_field_type_inner(
            ty,
            type_param_names,
            wrap_non_phantom_type_parameter,
            wrap_phantom_type_parameter,
            true,
        )
    }

    fn gen_struct_class_field_type_inner(
        &mut self,
        ty: &Type,
        type_param_names: &[String],
        wrap_non_phantom_type_parameter: Option<js::Tokens>,
        wrap_phantom_type_parameter: Option<js::Tokens>,
        is_top_level: bool,
    ) -> js::Tokens {
        let to_field = &self.framework.import("reified", "ToField");
        let to_phantom = &self
            .framework
            .import("reified", "ToTypeStr")
            .with_alias("ToPhantom");
        let vector = &self.framework.import("vector", "Vector");

        let field_type = match ty {
            Type::U8 => quote!($[str](u8)),
            Type::U16 => quote!($[str](u16)),
            Type::U32 => quote!($[str](u32)),
            Type::U64 => quote!($[str](u64)),
            Type::U128 => quote!($[str](u128)),
            Type::U256 => quote!($[str](u256)),
            Type::Bool => quote!($[str](bool)),
            Type::Address => quote!($[str](address)),
            Type::Vector(ty) => {
                quote!($vector<$(self.gen_struct_class_field_type_inner(
                    ty, type_param_names, wrap_non_phantom_type_parameter, wrap_phantom_type_parameter, false
                ))>)
            }
            Type::Datatype(id_tys) => {
                let (id, ts) = &**id_tys;
                let ((pid, mid), sid) = *id;
                let field_module = self.strct.model().module((pid, mid));

                let field_strct = todo_panic_if_enum(&field_module, sid);
                let class = self.import_ctx.get_class(&field_strct);

                let strct_type_params = &self.strct.compiled().type_parameters;
                let field_strct_type_params = &field_strct.compiled().type_parameters;
                let type_param_inner_toks = ts.iter().enumerate().map(|(idx, t)| {
                    let is_phantom = field_strct_type_params[idx].is_phantom;
                    let wrap_to_phantom = is_phantom
                        && match t {
                            Type::TypeParameter(t_idx) => {
                                !strct_type_params[*t_idx as usize].is_phantom
                            }
                            Type::Datatype(_) | Type::Vector(_) => true,
                            _ => false,
                        };

                    let inner = self.gen_struct_class_field_type_inner(
                        t,
                        type_param_names,
                        wrap_non_phantom_type_parameter.clone(),
                        wrap_phantom_type_parameter.clone(),
                        false,
                    );
                    if wrap_to_phantom {
                        quote!($to_phantom<$inner>)
                    } else {
                        quote!($inner)
                    }
                });

                quote!($class$(if !ts.is_empty() {
                    <$(for param in type_param_inner_toks join (, ) => $param)>
                }))
            }
            Type::TypeParameter(idx) => {
                let ty = type_param_names[*idx as usize].clone();

                let is_phantom = self.strct.compiled().type_parameters[*idx as usize].is_phantom;
                let wrap = if is_phantom {
                    wrap_phantom_type_parameter
                } else {
                    wrap_non_phantom_type_parameter
                };

                match wrap {
                    Some(wrap_type_parameter) => quote!($wrap_type_parameter<$ty>),
                    None => quote!($ty),
                }
            }
            Type::Reference(_, _) => panic!("unexpected type: {:?}", ty),
        };

        if is_top_level {
            quote!($to_field<$field_type>)
        } else {
            quote!($field_type)
        }
    }

    /// Returns the type parameters of a struct. If the source map is available, the type parameters
    /// are named according to the source map. Otherwise, they are named `T0`, `T1`, etc.
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

    fn strct_non_phantom_type_param_names(&self) -> Vec<String> {
        let type_params = self.strct_type_param_names();

        self.strct
            .compiled()
            .type_parameters
            .iter()
            .zip(type_params)
            .filter_map(|(compiled, name)| {
                if !compiled.is_phantom {
                    Some(name)
                } else {
                    None
                }
            })
            .collect()
    }

    fn gen_struct_bcs_def_field_value(
        &mut self,
        ty: &Type,
        type_param_names: &[String],
    ) -> js::Tokens {
        let bcs = &js::import("@mysten/sui/bcs", "bcs");
        let from_hex = &js::import("@mysten/sui/utils", "fromHEX");
        let to_hex = &js::import("@mysten/sui/utils", "toHEX");
        match ty {
            Type::U8 => quote!($bcs.u8()),
            Type::U16 => quote!($bcs.u16()),
            Type::U32 => quote!($bcs.u32()),
            Type::U64 => quote!($bcs.u64()),
            Type::U128 => quote!($bcs.u128()),
            Type::U256 => quote!($bcs.u256()),
            Type::Bool => quote!($bcs.bool()),
            Type::Address => quote!($bcs.bytes(32).transform({
                input: (val: string) => $from_hex(val),
                output: (val: Uint8Array) => $to_hex(val),
            })),
            Type::Vector(ty) => {
                quote!($bcs.vector($(self.gen_struct_bcs_def_field_value(ty, type_param_names))))
            }
            Type::Datatype(id_tys) => {
                let (id, ts) = &**id_tys;
                let ((pid, mid), sid) = *id;
                let field_module = self.strct.model().module((pid, mid));
                let field_strct = todo_panic_if_enum(&field_module, sid);

                let class = self.import_ctx.get_class(&field_strct);
                let field_strct_type_params = &field_strct.compiled().type_parameters;
                let non_phantom_param_idxs = (0..ts.len())
                    .filter(|idx| !field_strct_type_params[*idx].is_phantom)
                    .collect::<Vec<_>>();

                quote!($class.bcs$(if !non_phantom_param_idxs.is_empty() {
                    ($(for idx in non_phantom_param_idxs join (, ) =>
                        $(self.gen_struct_bcs_def_field_value(&ts[idx], type_param_names))
                    ))
                }))
            }
            Type::TypeParameter(idx) => {
                quote!($(type_param_names[*idx as usize].to_owned()))
            }
            Type::Reference(_, _) => panic!("unexpected type: {:?}", ty),
        }
    }

    fn gen_reified(&mut self, ty: &Type, type_param_names: &[Tokens<JavaScript>]) -> js::Tokens {
        let reified = &self.framework.import("reified", "reified").into_wildcard();
        match ty {
            Type::U8 => quote!($[str](u8)),
            Type::U16 => quote!($[str](u16)),
            Type::U32 => quote!($[str](u32)),
            Type::U64 => quote!($[str](u64)),
            Type::U128 => quote!($[str](u128)),
            Type::U256 => quote!($[str](u256)),
            Type::Bool => quote!($[str](bool)),
            Type::Address => quote!($[str](address)),
            Type::Vector(ty) => {
                quote!($reified.vector($(self.gen_reified(ty, type_param_names))))
            }
            Type::Datatype(id_tys) => {
                let (id, ts) = &**id_tys;
                let ((pid, mid), sid) = *id;
                let field_module = self.strct.model().module((pid, mid));

                let field_strct = todo_panic_if_enum(&field_module, sid);
                let class = self.import_ctx.get_class(&field_strct);

                let strct_type_params = &self.strct.compiled().type_parameters;
                let field_strct_type_params = &field_strct.compiled().type_parameters;
                let toks = ts.iter().enumerate().map(|(idx, ty)| {
                    let wrap_to_phantom = field_strct_type_params[idx].is_phantom
                        && match &ts[idx] {
                            Type::TypeParameter(t_idx) => {
                                !strct_type_params[*t_idx as usize].is_phantom
                            }
                            _ => true,
                        };

                    let inner = self.gen_reified(ty, type_param_names);
                    if wrap_to_phantom {
                        quote!($reified.phantom($inner))
                    } else {
                        quote!($inner)
                    }
                });

                quote!($class.reified($(if !ts.is_empty() {
                    $(for t in toks join (, ) => $t)
                })))
            }
            Type::TypeParameter(idx) => {
                quote!($(type_param_names[*idx as usize].clone()))
            }
            Type::Reference(_, _) => panic!("unexpected type: {:?}", ty),
        }
    }

    fn gen_from_fields_field_decode(
        &mut self,
        strct_type_arity: usize,
        name: Symbol,
        type_: &Type,
    ) -> js::Tokens {
        let decode_from_fields = &self.framework.import("reified", "decodeFromFields");

        let field_arg_name = format!("fields.{name}");

        let type_param_names = match strct_type_arity {
            0 => vec![],
            1 => vec![quote!(typeArg)],
            n => (0..n).map(|idx| quote!(typeArgs[$idx])).collect::<Vec<_>>(),
        };
        let reified = self.gen_reified(type_, &type_param_names);

        quote!(
            $decode_from_fields($(reified), $(field_arg_name))
        )
    }

    fn gen_from_fields_with_types_field_decode(
        &mut self,
        strct_type_arity: usize,
        name: Symbol,
        type_: &Type,
    ) -> js::Tokens {
        let decode_from_fields_with_types_generic_or_special = &self
            .framework
            .import("reified", "decodeFromFieldsWithTypes");

        let field_arg_name = format!("item.fields.{name}");

        let type_param_names = match strct_type_arity {
            0 => vec![],
            1 => vec![quote!(typeArg)],
            n => (0..n).map(|idx| quote!(typeArgs[$idx])).collect::<Vec<_>>(),
        };
        let reified = self.gen_reified(type_, &type_param_names);

        quote!(
            $decode_from_fields_with_types_generic_or_special($(reified), $(field_arg_name))
        )
    }

    fn gen_from_json_field_field_decode(
        &mut self,
        strct_type_arity: usize,
        name: Symbol,
        type_: &Type,
    ) -> js::Tokens {
        let decode_from_json_field = &self.framework.import("reified", "decodeFromJSONField");

        let field_arg_name = quote!(field.$(gen_field_name(name)));

        let type_param_names = match strct_type_arity {
            0 => vec![],
            1 => vec![quote!(typeArg)],
            n => (0..n).map(|idx| quote!(typeArgs[$idx])).collect::<Vec<_>>(),
        };
        let reified = self.gen_reified(type_, &type_param_names);

        quote!(
            $decode_from_json_field($(reified), $(field_arg_name))
        )
    }

    /// Generates the `is<StructName>` function for a struct.
    pub fn gen_is_type_func(&self, tokens: &mut js::Tokens) {
        let compress_sui_type = &self.framework.import("util", "compressSuiType");

        let struct_name = self.strct.name().to_string();
        let type_params = self.strct_type_param_names();

        quote_in! { *tokens =>
            export function is$(&struct_name)(type: string): boolean {
                type = $compress_sui_type(type);
                $(if type_params.is_empty() {
                    return type === $(self.gen_full_name_with_address(true, false))
                } else {
                    return type.startsWith($(self.gen_full_name_with_address(true, false)) + '<')
                });
            }
        }
        tokens.line();
    }

    /// Generates TS type param tokens for a struct. Ignores phantom type parameters as these
    /// are not used in the generated code.
    /// E.g. for `struct Foo<T, P>`, this generates `<T, P>`.
    fn gen_params_toks(
        &self,
        param_names: Vec<impl FormatInto<JavaScript>>,
        extends_or_wraps_non_phantom: &ExtendsOrWraps,
        extends_or_wraps_phantom: &ExtendsOrWraps,
    ) -> js::Tokens {
        if param_names.is_empty() {
            return quote!();
        }

        let compiled_type_parameters = &self.strct.compiled().type_parameters;
        let extend_or_wrap = |idx: usize| {
            if compiled_type_parameters[idx].is_phantom {
                extends_or_wraps_phantom
            } else {
                extends_or_wraps_non_phantom
            }
        };

        let param_toks = param_names
            .into_iter()
            .enumerate()
            .map(|(idx, param_name)| {
                let extend_or_wrap = extend_or_wrap(idx);
                match extend_or_wrap {
                    ExtendsOrWraps::Extends(extends) => {
                        quote!($param_name extends $extends)
                    }
                    ExtendsOrWraps::Wraps(wraps) => {
                        quote!($wraps<$param_name>)
                    }
                    ExtendsOrWraps::None => {
                        quote!($param_name)
                    }
                }
            });

        quote!(<$(for param in param_toks join (, ) => $param)>)
    }

    fn fields_if_name(&self) -> String {
        format!("{}Fields", self.strct.name())
    }

    /// Generates the `<StructName>Fields` interface name including its type parameters.
    fn gen_fields_if_name_with_params(
        &self,
        extends_or_wraps_non_phantom: &ExtendsOrWraps,
        extends_or_wraps_phantom: &ExtendsOrWraps,
    ) -> js::Tokens {
        let type_params = self.strct_type_param_names();
        quote! { $(self.fields_if_name())$(
            self.gen_params_toks(type_params, extends_or_wraps_non_phantom, extends_or_wraps_phantom)
        ) }
    }

    /// Generates the `<StructName>Fields` interface.
    pub fn gen_fields_if(&mut self, tokens: &mut js::Tokens) {
        let type_argument = &self.framework.import("reified", "TypeArgument");
        let phantom_type_argument = &self.framework.import("reified", "PhantomTypeArgument");

        let extends_non_phantom = ExtendsOrWraps::Extends(quote!($type_argument));
        let extends_phantom = ExtendsOrWraps::Extends(quote!($phantom_type_argument));

        tokens.push();
        quote_in! { *tokens =>
            export interface $(self.gen_fields_if_name_with_params( &extends_non_phantom, &extends_phantom)) {
                $(for field in &self.strct.compiled().fields join (; )=>
                    $(gen_field_name(field.name)): $(
                        self.gen_struct_class_field_type(&field.type_, &self.strct_type_param_names(), None, None)
                    )
                )
            }
        };
        tokens.line();
    }

    fn interpolate(&self, str: String) -> js::Tokens {
        let mut toks = js::Tokens::new();
        toks.append(Item::OpenQuote(true));
        toks.append(Item::Literal(ItemStr::from(str)));
        toks.append(Item::CloseQuote);

        toks
    }

    /// Generates the struct class for a struct.
    pub fn gen_struct_class(&mut self, tokens: &mut js::Tokens) {
        let fields_with_types = &self.framework.import("util", "FieldsWithTypes");
        let compose_sui_type = &self.framework.import("util", "composeSuiType");
        let struct_class = &self.framework.import("reified", "StructClass");
        let field_to_json = &self.framework.import("reified", "fieldToJSON");
        let type_argument = &self.framework.import("reified", "TypeArgument");
        let phantom_type_argument = &self.framework.import("reified", "PhantomTypeArgument");
        let reified = &self.framework.import("reified", "Reified");
        let phantom_reified = &self.framework.import("reified", "PhantomReified");
        let to_type_argument = &self.framework.import("reified", "ToTypeArgument");
        let to_phantom_type_argument = &self.framework.import("reified", "ToPhantomTypeArgument");
        let to_type_str = &self.framework.import("reified", "ToTypeStr");
        let phantom_to_type_str = &self.framework.import("reified", "PhantomToTypeStr");
        let to_bcs = &self.framework.import("reified", "toBcs");
        let extract_type = &self.framework.import("reified", "extractType");
        let parse_type_name = &self.framework.import("util", "parseTypeName");
        let phantom = &self.framework.import("reified", "phantom");
        let assert_reified_type_args_match = &self
            .framework
            .import("reified", "assertReifiedTypeArgsMatch");
        let assert_fields_with_types_args_match = &self
            .framework
            .import("reified", "assertFieldsWithTypesArgsMatch");
        let sui_parsed_data = &js::import("@mysten/sui/client", "SuiParsedData");
        let sui_object_data = &js::import("@mysten/sui/client", "SuiObjectData");
        let sui_client = &js::import("@mysten/sui/client", "SuiClient");
        let bcs = &js::import("@mysten/sui/bcs", "bcs");
        let bcs_type = &js::import("@mysten/sui/bcs", "BcsType");
        let from_b64 = &js::import("@mysten/sui/utils", "fromB64");
        let compress_sui_type = &self.framework.import("util", "compressSuiType");

        let struct_name = self.strct.name().to_string();
        let type_params = self.strct_type_param_names();
        let non_phantom_params = self.strct_non_phantom_type_param_names();
        let strct_type_params = &self.strct.compiled().type_parameters;
        let non_phantom_param_idxs = (0..type_params.len())
            .filter(|&idx| !strct_type_params[idx].is_phantom)
            .collect::<Vec<_>>();

        let bcs_def_name = if non_phantom_params.is_empty() {
            quote!($[str]($[const](&struct_name)))
        } else {
            self.interpolate(format!(
                "{}<{}>",
                &struct_name,
                non_phantom_params
                    .iter()
                    .map(|param| format!("${{{}.name}}", param))
                    .collect::<Vec<_>>()
                    .join(", ")
            ))
        };

        // readonly $typeArg: string
        // readonly $typeArgs: [ToTypeStr<T>, PhantomToTypeStr<P>, ...]
        let type_args_field_type: &js::Tokens = &quote!([$(for (idx, param) in type_params.iter().enumerate() join (, ) =>
            $(if strct_type_params[idx].is_phantom {
                $phantom_to_type_str<$param>
            } else {
                $to_type_str<$param>
            })
        )]);

        // typeArg: T0,
        // typeArgs: [T0, T1, T2, T3, ...],
        let type_args_param_if_any: &js::Tokens = &match type_params.len() {
            0 => quote!(),
            1 => quote!(
                typeArg: $(type_params[0].clone()),
            ),
            _ => quote!(typeArgs: [$(for idx in 0..type_params.len() join (, ) =>
                    $(&type_params[idx].clone())
                )],),
        };

        let extends_type_argument = ExtendsOrWraps::Extends(quote!($type_argument));
        let extends_phantom_type_argument = ExtendsOrWraps::Extends(quote!($phantom_type_argument));
        let wraps_to_type_argument = ExtendsOrWraps::Wraps(quote!($to_type_argument));
        let wraps_phantom_to_type_argument =
            ExtendsOrWraps::Wraps(quote!($to_phantom_type_argument));

        // <T extends Reified<TypeArgument, any>, P extends PhantomReified<PhantomTypeArgument>>
        let params_toks_for_reified = &{
            let toks = type_params.iter().enumerate().map(|(idx, param)| {
                if strct_type_params[idx].is_phantom {
                    quote!($param extends $phantom_reified<$phantom_type_argument>)
                } else {
                    quote!($param extends $reified<$type_argument, any>)
                }
            });

            if type_params.is_empty() {
                quote!()
            } else {
                quote!(<$(for tok in toks join (, ) => $tok)>)
            }
        };

        // <ToTypeArgument<T>, ToPhantomTypeArgument<P>>
        let params_toks_for_to_type_argument = &self.gen_params_toks(
            type_params.clone(),
            &wraps_to_type_argument,
            &wraps_phantom_to_type_argument,
        );

        // `0x2::foo::Bar<${ToTypeStr<ToTypeArgument<T>>}, ${ToTypeStr<ToPhantomTypeArgument<P>>}>`
        let reified_full_type_name_as_toks = match type_params.len() {
            0 => quote!($(self.gen_full_name_with_address( true, true))),
            _ => {
                let mut toks = js::Tokens::new();
                toks.append(Item::OpenQuote(true));
                quote_in!(toks => $(self.gen_full_name_with_address( false, true)));
                toks.append(Item::Literal(ItemStr::from("<")));
                for (idx, param) in type_params.iter().enumerate() {
                    let is_phantom = strct_type_params[idx].is_phantom;

                    toks.append(Item::Literal(ItemStr::from("${")));
                    if is_phantom {
                        quote_in!(toks => $phantom_to_type_str<$to_phantom_type_argument<$param>>);
                    } else {
                        quote_in!(toks => $to_type_str<$to_type_argument<$param>>);
                    }
                    toks.append(Item::Literal(ItemStr::from("}")));

                    let is_last = idx == &type_params.len() - 1;
                    if !is_last {
                        toks.append(Item::Literal(ItemStr::from(", ")));
                    }
                }
                toks.append(Item::Literal(ItemStr::from(">")));
                toks.append(Item::CloseQuote);
                quote!($toks)
            }
        };

        // [PhantomToTypeStr<ToPhantomTypeArgument<T>>, ToTypeStr<ToTypeArgument<P>>, ...]
        let reified_type_args_as_toks = &quote!([$(for(idx, param) in type_params.iter().enumerate() join (, ) =>
            $(if strct_type_params[idx].is_phantom {
                $phantom_to_type_str<$to_phantom_type_argument<$param>>
            } else {
                $to_type_str<$to_type_argument<$param>>
            })
        )]);

        // `0x2::foo::Bar<${ToTypeStr<T>}, ${ToTypeStr<P>}>`
        let static_full_type_name_as_toks = &match type_params.len() {
            0 => quote!($(self.gen_full_name_with_address(true, true))),
            _ => {
                let mut toks = js::Tokens::new();
                toks.append(Item::OpenQuote(true));
                quote_in!(toks => $(self.gen_full_name_with_address(false, true)));
                toks.append(Item::Literal(ItemStr::from("<")));
                for (idx, param) in type_params.iter().enumerate() {
                    toks.append(Item::Literal(ItemStr::from("${")));
                    if strct_type_params[idx].is_phantom {
                        quote_in!(toks => $phantom_to_type_str<$param>);
                    } else {
                        quote_in!(toks => $to_type_str<$param>);
                    }
                    toks.append(Item::Literal(ItemStr::from("}")));

                    let is_last = idx == &type_params.len() - 1;
                    if !is_last {
                        toks.append(Item::Literal(ItemStr::from(", ")));
                    }
                }
                toks.append(Item::Literal(ItemStr::from(">")));
                toks.append(Item::CloseQuote);
                quote!($toks)
            }
        };

        // `[true, false]`
        let type_arg_is_phantom =
            (0..type_params.len()).map(|idx| strct_type_params[idx].is_phantom);
        let is_phantom_value_toks = &quote! {
            [$(for is_phantom in type_arg_is_phantom {
                $(if is_phantom {
                    true,
                } else {
                    false,
                })
            })]
        };

        let (a, m, n) = strct_qualified_member_name(&self.strct, self.type_origin_table);
        let is_option = (a, m.as_str(), n.as_str()) == (AccountAddress::ONE, "option", "Option");

        quote_in! { *tokens =>
            export type $(&struct_name)Reified$(self.gen_params_toks(
                type_params.clone(), &extends_type_argument, &extends_phantom_type_argument
            )) = $reified<
                $(&struct_name)$(self.gen_params_toks(type_params.clone(), &ExtendsOrWraps::None, &ExtendsOrWraps::None)),
                $(&struct_name)Fields$(self.gen_params_toks(type_params.clone(), &ExtendsOrWraps::None, &ExtendsOrWraps::None))
            >;$['\n']
        }

        tokens.push();
        let strct_type_arity = type_params.len();
        let fields = self.strct.compiled().fields.clone();
        quote_in! { *tokens =>
            export class $(&struct_name)$(self.gen_params_toks(type_params.clone(), &extends_type_argument, &extends_phantom_type_argument)) implements $struct_class {
                __StructClass = true as const;$['\n']

                static readonly $$typeName = $(self.gen_full_name_with_address(true, false));
                static readonly $$numTypeParams = $(type_params.len());
                static readonly $$isPhantom = $is_phantom_value_toks as const;$['\n']

                $(if is_option {
                    __inner: $(&type_params[0]) = null as unknown as $(&type_params[0]); $(ref toks => {
                        toks.append("// for type checking in reified.ts")
                    })$['\n'];
                })

                readonly $$typeName = $(&struct_name).$$typeName;
                readonly $$fullTypeName: $static_full_type_name_as_toks;
                readonly $$typeArgs: $type_args_field_type;
                readonly $$isPhantom = $(&struct_name).$$isPhantom;$['\n']

                $(for field in &fields join (; ) =>
                    readonly $(gen_field_name(field.name)):
                        $(self.gen_struct_class_field_type(
                            &field.type_, &self.strct_type_param_names(), None, None
                        ))
                )$['\n']

                private constructor(typeArgs: $type_args_field_type, $(match fields.len() {
                        0 => (),
                        _ => { fields: $(self.gen_fields_if_name_with_params(&ExtendsOrWraps::None, &ExtendsOrWraps::None)), }
                    })
                ) {
                    this.$$fullTypeName = $compose_sui_type(
                            $(&struct_name).$$typeName,
                            ...typeArgs
                    ) as $static_full_type_name_as_toks;
                    this.$$typeArgs = typeArgs;$['\n']

                    $(match fields.len() {
                        0 => (),
                        _ => {
                            $(for field in &fields join (; ) =>
                                this.$(gen_field_name(field.name)) = fields.$(gen_field_name(field.name));
                            )
                        }
                    })
                }$['\n']


                static reified$(params_toks_for_reified)(
                    $(for param in type_params.iter() join (, ) => $param: $param)
                ): $(&struct_name)Reified$(
                    self.gen_params_toks(type_params.clone(), &wraps_to_type_argument, &wraps_phantom_to_type_argument)
                ) {
                    return {
                        typeName: $(&struct_name).$$typeName,
                        fullTypeName: $compose_sui_type(
                            $(&struct_name).$$typeName,
                            ...[$(for param in &type_params join (, ) => $extract_type($param))]
                        ) as $reified_full_type_name_as_toks,
                        typeArgs: [
                            $(for param in &type_params join (, ) => $extract_type($param))
                        ] as $reified_type_args_as_toks,
                        isPhantom: $(&struct_name).$$isPhantom,
                        reifiedTypeArgs: [$(for param in &type_params join (, ) => $param)],
                        fromFields: (fields: Record<string, any>) =>
                            $(&struct_name).fromFields(
                                $(match type_params.len() {
                                    0 => (),
                                    1 => { $(type_params[0].clone()), },
                                    _ => { [$(for param in &type_params join (, ) => $param)], },
                                })
                                fields,
                            ),
                        fromFieldsWithTypes: (item: $fields_with_types) =>
                            $(&struct_name).fromFieldsWithTypes(
                                $(match type_params.len() {
                                    0 => (),
                                    1 => { $(type_params[0].clone()), },
                                    _ => { [$(for param in &type_params join (, ) => $param)], },
                                })
                                item,
                            ),
                        fromBcs: (data: Uint8Array) =>
                            $(&struct_name).fromBcs(
                                $(match type_params.len() {
                                    0 => (),
                                    1 => { $(type_params[0].clone()), },
                                    _ => { [$(for param in &type_params join (, ) => $param)], },
                                })
                                data,
                            ),
                        bcs: $(&struct_name).bcs$(if !non_phantom_params.is_empty() {
                            ($(for param in &non_phantom_params join (, ) => $to_bcs($param)))
                        }),
                        fromJSONField: (field: any) =>
                            $(&struct_name).fromJSONField(
                                $(match type_params.len() {
                                    0 => (),
                                    1 => { $(type_params[0].clone()), },
                                    _ => { [$(for param in &type_params join (, ) => $param)], },
                                })
                                field,
                            ),
                        fromJSON: (json: Record<string, any>) =>
                            $(&struct_name).fromJSON(
                                $(match type_params.len() {
                                    0 => (),
                                    1 => { $(type_params[0].clone()), },
                                    _ => { [$(for param in &type_params join (, ) => $param)], },
                                })
                                json,
                            ),
                        fromSuiParsedData: (content: $sui_parsed_data) =>
                            $(&struct_name).fromSuiParsedData(
                                $(match type_params.len() {
                                    0 => (),
                                    1 => { $(type_params[0].clone()), },
                                    _ => { [$(for param in &type_params join (, ) => $param)], },
                                })
                                content,
                            ),
                        fromSuiObjectData: (content: $sui_object_data) =>
                            $(&struct_name).fromSuiObjectData(
                                $(match type_params.len() {
                                    0 => (),
                                    1 => { $(type_params[0].clone()), },
                                    _ => { [$(for param in &type_params join (, ) => $param)], },
                                })
                                content,
                            ),
                        fetch: async (client: $sui_client, id: string) => $(&struct_name).fetch(
                            client,
                            $(match type_params.len() {
                                0 => (),
                                1 => { $(type_params[0].clone()), },
                                _ => { [$(for param in &type_params join (, ) => $param)], },
                            })
                            id,
                        ),
                        new: (
                            $(match fields.len() {
                                0 => (),
                                _ => { fields: $(self.gen_fields_if_name_with_params(&wraps_to_type_argument, &wraps_phantom_to_type_argument)), }
                            })
                        ) => {
                            return new $(&struct_name)(
                                [$(for param in &type_params join (, ) => $extract_type($param))],
                                $(match fields.len() {
                                    0 => (),
                                    _ => fields,
                                })
                            )
                        },
                        kind: "StructClassReified",
                    }
                }$['\n']

                static get r() {
                    $(if type_params.is_empty() {
                        return $(&struct_name).reified()
                    } else {
                        return $(&struct_name).reified
                    })
                }$['\n']

                static phantom$(params_toks_for_reified)(
                    $(for param in type_params.iter() join (, ) => $param: $param)
                ): $phantom_reified<$to_type_str<$(&struct_name)$(params_toks_for_to_type_argument)>> {
                    return $phantom($(&struct_name).reified(
                        $(for param in type_params.iter() join (, ) => $param)
                    ));
                }

                static get p() {
                    $(if type_params.is_empty() {
                        return $(&struct_name).phantom()
                    } else {
                        return $(&struct_name).phantom
                    })
                }$['\n']

                static get bcs() {
                    return $(if !non_phantom_params.is_empty() {
                        <$(for param in non_phantom_params.iter() join (, ) =>
                            $param extends $bcs_type<any>
                        )>($(for param in non_phantom_params.iter() join (, ) =>
                            $param: $param
                        )) =>
                    }) $bcs.struct($bcs_def_name, {$['\n']
                        $(for field in &fields join (, ) =>
                            $(field.name.to_string()):
                                $(self.gen_struct_bcs_def_field_value(&field.type_, &self.strct_type_param_names()))
                        )$['\n']
                    $['\n']})
                };$['\n']

                static fromFields$(params_toks_for_reified)(
                    $type_args_param_if_any fields: Record<string, any>
                ): $(&struct_name)$(params_toks_for_to_type_argument) {
                    return $(&struct_name).reified(
                        $(match type_params.len() {
                            0 => (),
                            1 => { typeArg, },
                            _ => { $(for idx in 0..type_params.len() join (, ) => typeArgs[$idx]), },
                        })
                    ).new(
                        $(match fields.len() {
                            0 => (),
                            _ => {{
                                $(for field in &fields join (, ) =>
                                    $(gen_field_name(field.name)): $(self.gen_from_fields_field_decode(strct_type_arity, field.name, &field.type_))
                                )
                            }}
                        })
                    )
                }$['\n']

                static fromFieldsWithTypes$(params_toks_for_reified)(
                    $type_args_param_if_any item: $fields_with_types
                ): $(&struct_name)$(params_toks_for_to_type_argument) {
                    if (!is$(&struct_name)(item.type)) {
                        throw new Error($[str]($[const](format!("not a {} type", &struct_name))));$['\n']
                    }
                    $(ref toks {
                        if !type_params.is_empty() {
                            let type_args_name = match type_params.len() {
                                1 => quote!([typeArg]),
                                _ => quote!(typeArgs),
                            };
                             quote_in!(*toks =>
                                $assert_fields_with_types_args_match(item, $type_args_name);
                             )
                        }
                    })$['\n']

                    return $(&struct_name).reified(
                        $(match type_params.len() {
                            0 => (),
                            1 => { typeArg, },
                            _ => { $(for idx in 0..type_params.len() join (, ) => typeArgs[$idx]), },
                        })
                    ).new(
                        $(match fields.len() {
                            0 => (),
                            _ => {{
                                $(for field in &fields join (, ) =>
                                    $(gen_field_name(field.name)): $(self.gen_from_fields_with_types_field_decode(strct_type_arity, field.name, &field.type_))
                                )
                            }}
                        })
                    )
                }$['\n']

                static fromBcs$(params_toks_for_reified)(
                    $type_args_param_if_any data: Uint8Array
                ): $(&struct_name)$(params_toks_for_to_type_argument) {
                    $(if type_params.len() == 1 && !non_phantom_params.is_empty() {
                        const typeArgs = [typeArg];$['\n']
                    })

                    return $(&struct_name).fromFields(
                        $(match type_params.len() {
                            0 => (),
                            1 => { typeArg, },
                            _ => { typeArgs, },
                        })
                        $(match non_phantom_params.len() {
                            0 => $(&struct_name).bcs.parse(data),
                            len => $(&struct_name).bcs(
                                $(for i in 0..len join (, ) => $to_bcs(typeArgs[$(non_phantom_param_idxs[i])]))
                            ).parse(data),
                        })
                    )
                }$['\n']

                toJSONField() {
                    return {$['\n']
                        $(ref toks {
                            let this_type_args = |idx: usize| quote!(this.$$typeArgs[$idx]);
                            let type_param_names = (0..strct_type_arity)
                                .map(|idx| QuoteItem::Interpolated(this_type_args(idx)))
                                .collect::<Vec<_>>();

                            for field in fields.iter() {
                                let name = gen_field_name(field.name);
                                let this_name = quote!(this.$(gen_field_name(field.name)));

                                let field_type_param = self.gen_struct_class_field_type_inner(
                                    &field.type_, &self.strct_type_param_names(), None, None, false
                                );

                                match &field.type_ {
                                    Type::Datatype(id_tys) => {
                                        let (id, _ts) = &**id_tys;
                                        let ((pid, mid), sid) = *id;
                                        let field_module = self.strct.model().module((pid, mid));
                                        let field_strct = todo_panic_if_enum(&field_module, sid);

                                        // handle special types
                                        let (fs_a, fs_m, fs_n) = strct_qualified_member_name(&field_strct, self.type_origin_table);
                                        match (fs_a, fs_m.as_str(), fs_n.as_str()) {
                                            (AccountAddress::ONE, "string", "String") |    (AccountAddress::ONE, "ascii", "String")  => {
                                                quote_in!(*toks => $name: $this_name,)
                                            }
                                            (AccountAddress::TWO, "url", "Url") => {
                                                quote_in!(*toks => $name: $this_name,)
                                            }
                                            (AccountAddress::TWO, "object", "ID") => {
                                                quote_in!(*toks => $name: $this_name,)
                                            }
                                            (AccountAddress::TWO, "object", "UID") => {
                                                quote_in!(*toks => $name: $this_name, )
                                            }
                                            (AccountAddress::ONE, "option", "Option") => {
                                                let type_name = self.gen_bcs_def_for_type(&field.type_, &type_param_names);
                                                quote_in!(*toks => $name: $field_to_json<$field_type_param>($type_name, $this_name),)
                                            }
                                            _ => {
                                                quote_in!(*toks => $name: $this_name.toJSONField(),)
                                            }
                                        }
                                    }
                                    Type::U64 | Type::U128 | Type::U256 => {
                                        quote_in!(*toks => $name: $this_name.toString(),)
                                    }
                                    Type::U8 |
                                    Type::U16 | Type::U32 | Type::Bool | Type::Address => {
                                        quote_in!(*toks => $name: $this_name,)
                                    }
                                    Type::Vector(_) => {
                                        let type_name = self.gen_bcs_def_for_type(&field.type_, &type_param_names);

                                        quote_in!(*toks => $name: $field_to_json<$field_type_param>($type_name, $this_name),)
                                    }
                                    Type::TypeParameter(i) => {
                                        quote_in!(*toks => $name: $field_to_json<$field_type_param>($(this_type_args(*i as usize)), $this_name),)
                                    }
                                    _ => {
                                        let name = gen_field_name(field.name);
                                        quote_in!(*toks => $name: $this_name.toJSONField(),)
                                    },

                                }
                            }
                        })
                    $['\n']}
                }$['\n']

                toJSON() {
                    return {
                        $$typeName: this.$$typeName,
                        $$typeArgs: this.$$typeArgs,
                        ...this.toJSONField()
                    }
                }$['\n']

                static fromJSONField$(params_toks_for_reified)(
                    $type_args_param_if_any field: any
                ): $(&struct_name)$(params_toks_for_to_type_argument) {
                    return $(&struct_name).reified(
                        $(match type_params.len() {
                            0 => (),
                            1 => { typeArg, },
                            _ => { $(for idx in 0..type_params.len() join (, ) => typeArgs[$idx]), },
                        })
                    ).new(
                        $(match fields.len() {
                            0 => (),
                            _ => {{
                                $(for field in &fields join (, ) =>
                                    $(gen_field_name(field.name)): $(self.gen_from_json_field_field_decode(strct_type_arity, field.name, &field.type_))
                                )
                            }}
                        })
                    )
                }$['\n']

                static fromJSON$(params_toks_for_reified)(
                    $type_args_param_if_any json: Record<string, any>
                ): $(&struct_name)$(params_toks_for_to_type_argument) {
                    if (json.$$typeName !==  $(&struct_name).$$typeName) {
                        throw new Error("not a WithTwoGenerics json object")
                    };
                    $(if !type_params.is_empty() {
                        $assert_reified_type_args_match(
                            $compose_sui_type($(&struct_name).$$typeName,
                            $(match type_params.len() {
                                1 => { $extract_type(typeArg) },
                                _ => { ...typeArgs.map($extract_type) },
                            })),
                            json.$$typeArgs,
                            $(match type_params.len() {
                                1 => { [typeArg] },
                                _ => { typeArgs },
                            }),
                        )
                    })$['\n']

                    return $(&struct_name).fromJSONField(
                        $(match type_params.len() {
                            0 => (),
                            1 => { typeArg, },
                            _ => { typeArgs, },
                        })
                        json,
                    )
                }$['\n']

                static fromSuiParsedData$(params_toks_for_reified)(
                    $type_args_param_if_any content: $sui_parsed_data
                ): $(&struct_name)$(params_toks_for_to_type_argument) {
                    if (content.dataType !== "moveObject") {
                        throw new Error("not an object");
                    }
                    if (!is$(&struct_name)(content.type)) {
                        throw new Error($(self.interpolate(
                            format!("object at ${{(content.fields as any).id}} is not a {} object", &struct_name))
                        ));
                    }
                    return $(&struct_name).fromFieldsWithTypes(
                        $(match type_params.len() {
                            0 => (),
                            1 => { typeArg, },
                            _ => { typeArgs, },
                        })
                        content
                    );
                }$['\n']

                static fromSuiObjectData$(params_toks_for_reified)(
                    $type_args_param_if_any data: $sui_object_data
                ): $(&struct_name)$(params_toks_for_to_type_argument) {
                    if (data.bcs) {
                        if (data.bcs.dataType !== "moveObject" || !is$(&struct_name)(data.bcs.type)) {
                            throw new Error($(self.interpolate(
                                format!("object at is not a {} object", &struct_name))
                            ));
                        }$['\n']
                        $(match type_params.len() {
                            0 => (),
                            1 => {
                                const gotTypeArgs = $parse_type_name(data.bcs.type).typeArgs;
                                if (gotTypeArgs.length !== 1) {
                                    throw new Error($(self.interpolate(
                                        "type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'".to_string()
                                    )));
                                };
                                const gotTypeArg = $compress_sui_type(gotTypeArgs[0]);
                                const expectedTypeArg = $compress_sui_type($extract_type(typeArg));
                                if (gotTypeArg !== $compress_sui_type($extract_type(typeArg))) {
                                    throw new Error($(self.interpolate(
                                        "type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'".to_string()
                                    )));
                                };
                            },
                            n => {
                                const gotTypeArgs = $parse_type_name(data.bcs.type).typeArgs;
                                if (gotTypeArgs.length !== $n) {
                                    throw new Error($(self.interpolate(
                                        format!("type argument mismatch: expected {} type arguments but got ${{gotTypeArgs.length}}", n)
                                    )));
                                };
                                for (let i = 0; i < $n; i++) {
                                    const gotTypeArg = $compress_sui_type(gotTypeArgs[i]);
                                    const expectedTypeArg = $compress_sui_type($extract_type(typeArgs[i]));
                                    if (gotTypeArg !== expectedTypeArg) {
                                        throw new Error($(self.interpolate(
                                            "type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'".to_string()
                                        )));
                                    }
                                };
                            }
                        })$['\n']

                        return $(&struct_name).fromBcs(
                            $(match type_params.len() {
                                0 => (),
                                1 => { typeArg, },
                                _ => { typeArgs, },
                            })
                            $from_b64(data.bcs.bcsBytes)
                        );
                    }
                    if (data.content) {
                        return $(&struct_name).fromSuiParsedData(
                            $(match type_params.len() {
                                0 => (),
                                1 => { typeArg, },
                                _ => { typeArgs, },
                            })
                            data.content
                        )
                    }

                    throw new Error(
                        "Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request."
                    );
                }$['\n']

                static async fetch$(params_toks_for_reified)(
                    client: $sui_client, $type_args_param_if_any id: string
                ): Promise<$(&struct_name)$(params_toks_for_to_type_argument)> {
                    const res = await client.getObject({
                        id,
                        options: {
                            showBcs: true,
                        },
                    });
                    if (res.error) {
                        throw new Error($(self.interpolate(
                            format!("error fetching {} object at id ${{id}}: ${{res.error.code}}", &struct_name))
                        ));
                    }
                    if (res.data?.bcs?.dataType !== "moveObject" || !is$(&struct_name)(res.data.bcs.type)) {
                        throw new Error($(self.interpolate(
                            format!("object at id ${{id}} is not a {} object", &struct_name))
                        ));
                    }$['\n']

                    return $(&struct_name).fromSuiObjectData(
                        $(match type_params.len() {
                            0 => (),
                            1 => { typeArg, },
                            _ => { typeArgs, },
                        })
                        res.data
                    );
                }$['\n']
            }
        }
        tokens.line()
    }

    pub fn gen_struct_sep_comment(&self, tokens: &mut js::Tokens) {
        let struct_name = self.strct.name();
        tokens.line();
        tokens.append(format!(
            "/* ============================== {struct_name} =============================== */",
        ));
        tokens.line()
    }
}
