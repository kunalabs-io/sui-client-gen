use std::collections::{BTreeMap, HashMap};

use anyhow::{bail, Result};
use convert_case::{Case, Casing};
use genco::prelude::*;
use genco::tokens::{Item, ItemStr};
use move_binary_format::normalized::Type as MType;
use move_core_types::account_address::AccountAddress;
use move_model::model::{FieldEnv, FunctionEnv, GlobalEnv, ModuleEnv, StructEnv};
use move_model::symbol::{Symbol, SymbolPool};
use move_model::ty::{PrimitiveType, Type};

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

/// Returns module name that's used in import paths (converts kebab case as that's idiomatic in TS).
pub fn module_import_name(module: &ModuleEnv) -> String {
    module
        .get_name()
        .display(module.env.symbol_pool())
        .to_string()
        .from_case(Case::Snake)
        .to_case(Case::Kebab)
}

/// Returns package name that's used in import paths (converts to kebab case as that's idiomatic in TS).
pub fn package_import_name(pkg_name: move_symbol_pool::Symbol) -> String {
    pkg_name
        .to_string()
        .from_case(Case::Pascal)
        .to_case(Case::Kebab)
}

pub struct FrameworkImportCtx {
    framework_rel_path: String,
    is_source: bool,
}

impl FrameworkImportCtx {
    pub fn new(levels_from_root: u8, is_source: bool) -> Self {
        let framework_rel_path = if levels_from_root == 0 {
            "./_framework".to_string()
        } else {
            (0..levels_from_root)
                .map(|_| "..")
                .collect::<Vec<_>>()
                .join("/")
                + "/_framework"
        };

        FrameworkImportCtx {
            framework_rel_path,
            is_source,
        }
    }

    pub fn import(&self, module: &str, name: &str) -> js::Import {
        js::import(format!("{}/{}", self.framework_rel_path, module), name)
    }

    pub fn import_bcs(&self) -> js::Import {
        if self.is_source {
            self.import("bcs", "bcsSource").with_alias("bcs")
        } else {
            self.import("bcs", "bcsOnchain").with_alias("bcs")
        }
    }

    pub fn import_init_loader_if_needed(&self) -> js::Import {
        if self.is_source {
            self.import("init-source", "initLoaderIfNeeded")
        } else {
            self.import("init-onchain", "initLoaderIfNeeded")
        }
    }

    pub fn import_struct_class_loader(&self) -> js::Import {
        if self.is_source {
            self.import("loader", "structClassLoaderSource")
        } else {
            self.import("loader", "structClassLoaderOnchain")
        }
    }
}

/// A context for generating import paths for struct classes. This is needed to avoid name conflicts
/// when importing different structs of the same name.
pub struct StructClassImportCtx<'env, 'a> {
    // a map storing class names that have already been used and their import paths
    // to avoid name conflicts
    reserved_names: HashMap<String, Vec<String>>,
    module: &'env ModuleEnv<'env>,
    is_top_level: bool,
    is_source: bool,
    top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
}

impl<'env, 'a> StructClassImportCtx<'env, 'a> {
    fn new(
        reserved_names: Vec<String>,
        module: &'env ModuleEnv,
        is_source: bool,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    ) -> Self {
        StructClassImportCtx {
            reserved_names: reserved_names
                .into_iter()
                .map(|name| (name, vec!["".to_string()]))
                .collect(),
            module,
            is_top_level: top_level_pkg_names.contains_key(module.self_address()),
            is_source,
            top_level_pkg_names,
        }
    }

    pub fn from_module(
        module: &'env ModuleEnv,
        is_source: bool,
        top_level_pkg_names: &'a BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    ) -> Self {
        let reserved_names = module
            .get_structs()
            .map(|strct| {
                strct
                    .get_name()
                    .display(module.env.symbol_pool())
                    .to_string()
            })
            .collect();
        StructClassImportCtx::new(reserved_names, module, is_source, top_level_pkg_names)
    }

    /// Returns the import path for a struct. If the struct is defined in the current module,
    /// returns `None`.
    pub fn import_path_for_struct(&self, strct: &StructEnv) -> Option<String> {
        let module_name = module_import_name(&strct.module_env);

        if strct.module_env.self_address() == self.module.self_address()
            && strct.module_env.get_id() == self.module.get_id()
        {
            // if the struct is defined in the current module, we don't need to import anything
            None
        } else if strct.module_env.self_address() == self.module.self_address() {
            // if the struct is defined in a different module in the same package, we use
            // the short version of the import path
            Some(format!("../{}/structs", module_name))
        } else {
            let strct_is_top_level = self
                .top_level_pkg_names
                .contains_key(strct.module_env.self_address());

            if self.is_top_level && strct_is_top_level {
                let strct_pkg_name = package_import_name(
                    *self
                        .top_level_pkg_names
                        .get(strct.module_env.self_address())
                        .unwrap(),
                );

                Some(format!("../../{}/{}/structs", strct_pkg_name, module_name))
            } else if self.is_top_level {
                let dep_dir = if self.is_source { "source" } else { "onchain" };

                Some(format!(
                    "../../_dependencies/{}/{}/{}/structs",
                    dep_dir,
                    strct.module_env.self_address().to_hex_literal(),
                    module_name
                ))
            } else if strct_is_top_level {
                let strct_pkg_name = package_import_name(
                    *self
                        .top_level_pkg_names
                        .get(strct.module_env.self_address())
                        .unwrap(),
                );

                Some(format!(
                    "../../../../{}/{}/structs",
                    strct_pkg_name, module_name
                ))
            } else {
                Some(format!(
                    "../../{}/{}/structs",
                    strct.module_env.self_address().to_hex_literal(),
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
    pub fn get_class(&mut self, strct: &StructEnv) -> js::Tokens {
        let class_name = strct.get_name().display(strct.symbol_pool()).to_string();
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

pub fn gen_package_init_ts(modules: &[ModuleEnv], framework: &FrameworkImportCtx) -> js::Tokens {
    let struct_class_loader = &framework.import("loader", "StructClassLoader");
    // TODO use canonical module names
    quote! {
        export function registerClasses(loader: $struct_class_loader) {
            $(ref toks {
                for module in modules.iter() {
                    let module_name = module
                        .get_name()
                        .display(module.env.symbol_pool())
                        .to_string();

                    let mut imported_name = module_name.to_case(Case::Camel);
                    if JS_RESERVED_WORDS.contains(&imported_name.as_str()) {
                        imported_name.push('_');
                    }

                    let module_import = &js::import(
                        format!("./{}/structs", module_import_name(module)),
                        imported_name,
                    )
                    .into_wildcard();

                    for strct in module.get_structs() {
                        let strct_name = strct
                            .get_name()
                            .display(module.env.symbol_pool())
                            .to_string();

                        quote_in! { *toks =>
                            loader.register($(module_import).$(strct_name));$['\r']
                        }
                    }
                }
            })
        }
    }
}

pub fn gen_init_ts(
    pkg_ids: Vec<AccountAddress>,
    top_level_pkg_names: &BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    is_source: bool,
) -> js::Tokens {
    let struct_class_loader = if is_source {
        js::import("./loader", "structClassLoaderSource").with_alias("structClassLoader")
    } else {
        js::import("./loader", "structClassLoaderOnchain").with_alias("structClassLoader")
    };

    quote! {
        let initialized = false;

        export function initLoaderIfNeeded() {
            if (initialized) {
                return
            };
            initialized = true;

            $(ref toks {
                for pkg_id in pkg_ids {
                    let pkg_init_path = match top_level_pkg_names.get(&pkg_id) {
                        Some(pkg_name) => {
                            format!("../{}/init", package_import_name(*pkg_name))
                        },
                        None=> {
                            if is_source {
                                format!("../_dependencies/source/{}/init", pkg_id.to_hex_literal())
                            } else {
                                format!("../_dependencies/onchain/{}/init", pkg_id.to_hex_literal())
                            }
                        }
                    };

                    let pkg_import = &js::import(
                        pkg_init_path,
                        format!("{}_{}", "package", pkg_id.short_str_lossless())
                    )
                    .into_wildcard();

                    quote_in! { *toks =>
                        $(pkg_import).registerClasses($(&struct_class_loader));$['\r']
                    }
                }
            })
        }
    }
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

fn gen_bcs_def_for_type(
    ty: &Type,
    env: &GlobalEnv,
    type_param_names: &Vec<QuoteItem>,
) -> js::Tokens {
    let mut toks = js::Tokens::new();
    toks.append(Item::OpenQuote(true));

    fn inner(
        toks: &mut Tokens<JavaScript>,
        ty: &Type,
        env: &GlobalEnv,
        type_param_names: &Vec<QuoteItem>,
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
            Type::Struct(mid, sid, ts) => {
                let struct_env = env.get_module(*mid).into_struct(*sid);

                quote_in! { *toks => $(struct_env.get_full_name_with_address()) };

                if !ts.is_empty() {
                    quote_in! { *toks => < };
                    let len = ts.len();
                    for (i, ty) in ts.iter().enumerate() {
                        inner(toks, ty, env, type_param_names);
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
                inner(toks, ty, env, type_param_names);
                quote_in! { *toks => > };
            }
            Type::Primitive(ty) => match ty {
                PrimitiveType::U8 => quote_in!(*toks => u8),
                PrimitiveType::U16 => quote_in!(*toks => u16),
                PrimitiveType::U32 => quote_in!(*toks => u32),
                PrimitiveType::U64 => quote_in!(*toks => u64),
                PrimitiveType::U128 => quote_in!(*toks => u128),
                PrimitiveType::U256 => quote_in!(*toks => u256),
                PrimitiveType::Bool => quote_in!(*toks => bool),
                PrimitiveType::Address => quote_in!(*toks => address),
                PrimitiveType::Signer => quote_in!(*toks => signer),
                _ => panic!("unexpected type: {:?}", ty),
            },
            _ => panic!("unexpected type: {:?}", ty),
        }
    }

    inner(&mut toks, ty, env, type_param_names);
    toks.append(Item::CloseQuote);

    toks
}

pub struct FunctionsGen<'env> {
    env: &'env GlobalEnv,
    framework: FrameworkImportCtx,
}

impl<'env> FunctionsGen<'env> {
    pub fn new(env: &'env GlobalEnv, framework: FrameworkImportCtx) -> Self {
        FunctionsGen { env, framework }
    }

    fn symbol_pool(&self) -> &SymbolPool {
        self.env.symbol_pool()
    }

    fn field_name_from_type(&self, ty: &Type, type_param_names: Vec<Symbol>) -> Result<String> {
        let name = match ty {
            Type::Primitive(ty) => format!("{}", ty),
            Type::Vector(ty) => {
                "vec".to_string()
                    + &self
                        .field_name_from_type(ty, type_param_names)?
                        .to_case(Case::Pascal)
            }
            Type::Struct(mid, sid, _) => {
                let module = self.env.get_module(*mid);
                module
                    .get_struct(*sid)
                    .get_identifier()
                    .unwrap()
                    .to_string()
                    .to_case(Case::Camel)
            }
            Type::Reference(_, ty) => self.field_name_from_type(ty, type_param_names)?,
            Type::TypeParameter(idx) => type_param_names[*idx as usize]
                .display(self.symbol_pool())
                .to_string()
                .to_case(Case::Camel),
            _ => bail!(
                "unexpected type: {}",
                ty.display(&self.env.get_type_display_ctx())
            ),
        };
        Ok(name)
    }

    fn param_to_field_name(
        &self,
        name: Option<Symbol>,
        type_: &Type,
        type_param_names: Vec<Symbol>,
    ) -> String {
        if let Some(name) = name {
            let mut name = name
                .display(self.symbol_pool())
                .to_string()
                .to_case(Case::Camel);

            // When the param name is `_` we use the type as the field name.
            if name.is_empty() {
                name = self.field_name_from_type(type_, type_param_names).unwrap();
            };

            name
        } else {
            self.field_name_from_type(type_, type_param_names).unwrap()
        }
    }

    fn is_tx_context(&self, ty: &Type) -> bool {
        match ty {
            Type::Struct(mid, sid, ts) => match self.env.get_struct_type(*mid, *sid, ts).unwrap() {
                MType::Struct {
                    address,
                    module,
                    name,
                    type_arguments: _,
                } => {
                    address == AccountAddress::TWO
                        && module.into_string() == "tx_context"
                        && name.into_string() == "TxContext"
                }
                _ => panic!(),
            },
            Type::Reference(_, ty) => self.is_tx_context(ty),
            _ => false,
        }
    }

    /// Returns type parameter names for a function. If type parameter names are not defined
    /// it will return `T0`, `T1`, etc.
    fn func_type_param_names(&self, func: &FunctionEnv) -> Vec<Symbol> {
        func.get_named_type_parameters()
            .into_iter()
            .map(|param| {
                let name = param.0.display(self.symbol_pool()).to_string();

                if name.starts_with("unknown#") {
                    let name = name.replace("unknown#", "T");
                    self.symbol_pool().make(&name)
                } else {
                    param.0
                }
            })
            .collect()
    }

    // Generates TS interface field names from function's params. Used in the `<..>Args` interface
    // or function binding params.
    // If the param names are not defined (e.g. `_`), it will generate a name based on the type.
    // In case this causes a name collision, it will append a number to the name.
    fn params_to_field_names(
        &self,
        func: &FunctionEnv,
        ignore_tx_context: bool,
    ) -> Vec<(String, Type)> {
        let params = func.get_parameters();
        let param_types = func.get_parameter_types();
        let type_param_names = self.func_type_param_names(func);

        let param_to_field_name = |idx: usize| {
            // When there are no named parameters (e.g. on-chain modules), the `params` vector
            // will always be empty. In this case, we generate names based on the type.
            if params.len() == func.get_parameter_count() {
                let param = &params[idx];
                self.param_to_field_name(Some(param.0), &param.1, type_param_names.clone())
            } else {
                let type_ = &param_types[idx];
                self.param_to_field_name(None, type_, type_param_names.clone())
            }
        };

        let mut name_count = HashMap::<String, usize>::new();

        #[allow(clippy::needless_range_loop)]
        for idx in 0..func.get_parameter_count() {
            let type_ = &param_types[idx];
            if ignore_tx_context && self.is_tx_context(type_) {
                continue;
            }

            let name = param_to_field_name(idx);
            let count = name_count.get(&name).map(|count| *count + 1).unwrap_or(1);
            name_count.insert(name, count);
        }

        let mut current_count = HashMap::<String, usize>::new();

        (0..func.get_parameter_count())
            .filter_map(|idx| {
                let type_ = param_types[idx].clone();
                if ignore_tx_context && self.is_tx_context(&type_) {
                    return None;
                }

                let mut name = param_to_field_name(idx);
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

                Some((name, type_))
            })
            .collect()
    }

    fn fun_arg_if_name(func: &FunctionEnv) -> String {
        let name = func.get_name_str();

        // function names ending with `_` are common, so handle this specifically
        // TODO: remove this once there's a more general way to handle this
        if name.ends_with('_') {
            return name.from_case(Case::Snake).to_case(Case::Pascal) + "_Args";
        } else {
            return name.from_case(Case::Snake).to_case(Case::Pascal) + "Args";
        }
    }

    /// Generates a TS type for a function's parameter type. Used in the `<..>Args` interface.
    fn param_type_to_field_type(&self, ty: &Type) -> js::Tokens {
        let object_arg = &self.framework.import("util", "ObjectArg");
        let generic_arg = &self.framework.import("util", "GenericArg");
        let transaction_argument =
            &js::import("@mysten/sui.js/transactions", "TransactionArgument");

        match ty {
            Type::Primitive(ty) => match ty {
                PrimitiveType::U8 | PrimitiveType::U16 | PrimitiveType::U32 => {
                    quote!(number | $transaction_argument)
                }
                PrimitiveType::U64 | PrimitiveType::U128 | PrimitiveType::U256 => {
                    quote!(bigint | $transaction_argument)
                }
                PrimitiveType::Bool => quote!(boolean | $transaction_argument),
                PrimitiveType::Address => quote!(string | $transaction_argument),
                PrimitiveType::Signer => quote!(string | $transaction_argument),
                _ => panic!("unexpected primitive type: {:?}", ty),
            },
            Type::Vector(ty) => {
                quote!(Array<$(self.param_type_to_field_type(ty))> | $transaction_argument)
            }
            Type::Struct(mid, sid, ts) => {
                let module = self.env.get_module(*mid);
                let strct = module.get_struct(*sid);

                match strct.get_full_name_with_address().as_ref() {
                    "0x1::string::String" | "0x1::ascii::String" => {
                        quote!(string | $transaction_argument)
                    }
                    "0x2::object::ID" => quote!(string | $transaction_argument),
                    "0x1::option::Option" => {
                        quote!(($(self.param_type_to_field_type(&ts[0])) | $(transaction_argument) | null))
                    }
                    _ => quote!($object_arg),
                }
            }
            Type::Reference(_, ty) => self.param_type_to_field_type(ty),
            Type::TypeParameter(_) => quote!($generic_arg),
            _ => panic!("unexpected type: {:?}", ty),
        }
    }

    /// Generates the `<..>Args` interface for a function.
    pub fn gen_fun_args_if(
        &self,
        func: &FunctionEnv,
        tokens: &mut Tokens<JavaScript>,
    ) -> Result<()> {
        let param_field_names = self.params_to_field_names(func, true);
        if param_field_names.len() < 2 {
            return Ok(());
        }

        quote_in! { *tokens =>
            export interface $(FunctionsGen::fun_arg_if_name(func)) {
                $(for (field_name, param_type) in param_field_names join (; )=>
                    $field_name: $(self.param_type_to_field_type(&param_type))
                )
            }$['\n']
        };

        Ok(())
    }

    fn is_pure(&self, ty: &Type) -> bool {
        match ty {
            Type::Primitive(_) => true,
            Type::Reference(_, ty) => self.is_pure(ty),
            Type::Vector(ty) => self.is_pure(ty),
            Type::Struct(mid, sid, ts) => {
                let module = self.env.get_module(*mid);
                let strct = module.get_struct(*sid);

                match strct.get_full_name_with_address().as_ref() {
                    "0x1::string::String" | "0x1::ascii::String" => true,
                    "0x2::object::ID" => true,
                    "0x1::option::Option" => self.is_pure(&ts[0]),
                    _ => false,
                }
            }
            _ => false,
        }
    }

    // returns Option's type argument if the type is Option
    fn is_option<'a>(&self, ty: &'a Type) -> Option<&'a Type> {
        match ty {
            Type::Struct(mid, sid, ts) => {
                let module = self.env.get_module(*mid);
                let strct = module.get_struct(*sid);

                match strct.get_full_name_with_address().as_ref() {
                    "0x1::option::Option" => Some(&ts[0]),
                    _ => None,
                }
            }
            Type::Reference(_, ty) => self.is_option(ty),
            _ => None,
        }
    }

    #[allow(clippy::only_used_in_recursion)]
    fn type_strip_ref(&self, ty: Type) -> Type {
        match ty {
            Type::Reference(_, ty) => self.type_strip_ref(*ty),
            _ => ty,
        }
    }

    fn param_to_txb_arg(
        &self,
        ty: Type,
        arg_field_name: String,
        func_type_param_names: Vec<Symbol>,
        single_param: bool,
    ) -> js::Tokens {
        let import_with_possible_alias = |field_name: &str| {
            if single_param && arg_field_name == field_name {
                self.framework.import("util", field_name).with_alias(field_name.to_owned() + "_")
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
        let ty_tok = gen_bcs_def_for_type(&ty, self.env, &type_param_names);

        if self.is_pure(&ty) {
            quote!($pure(txb, $arg_field_name, $ty_tok))
        } else if let Some(ty) = self.is_option(&ty) {
            let ty_tok = gen_bcs_def_for_type(ty, self.env, &type_param_names);
            quote!($option(txb, $ty_tok, $arg_field_name))
        } else {
            match ty {
                Type::TypeParameter(_) => {
                    let ty_tok = gen_bcs_def_for_type(&ty, self.env, &type_param_names);
                    quote!($generic(txb, $ty_tok, $arg_field_name))
                }
                Type::Vector(ty) => {
                    let ty_tok = gen_bcs_def_for_type(&ty, self.env, &type_param_names);
                    quote!($vector(txb, $ty_tok, $arg_field_name))
                }
                _ => {
                    quote!($obj(txb, $arg_field_name))
                }
            }
        }
    }

    /// Returns the TS function binding name for a function.
    pub fn fun_name(func: &FunctionEnv) -> String {
        let mut fun_name_str = func
            .get_name_str()
            .from_case(Case::Snake)
            .to_case(Case::Camel);
        if JS_RESERVED_WORDS.contains(&fun_name_str.as_str()) {
            fun_name_str.push('_');
        };
        // function names ending with `_` are common, so handle this specifically
        // TODO: remove this once there's a more general way to handle this
        if func.get_name_str().ends_with('_') {
            fun_name_str.push('_');
        }
        fun_name_str
    }

    /// Generates a function binding for a function.
    pub fn gen_fun_binding(
        &self,
        func: &FunctionEnv,
        tokens: &mut Tokens<JavaScript>,
    ) -> Result<()> {
        let transaction_block = &js::import("@mysten/sui.js/transactions", "TransactionBlock");
        let published_at = &js::import("..", "PUBLISHED_AT");

        func.get_type_parameter_count();

        let param_field_names = self.params_to_field_names(func, true);
        let type_arg_count = func.get_type_parameter_count();

        let func_type_param_names = self.func_type_param_names(func);
        let single_param = param_field_names.len() == 1;

        quote_in! { *tokens =>
            export function $(FunctionsGen::fun_name(func))(
                txb: $transaction_block,
                $(gen_type_args_param(type_arg_count, None::<&str>, ","))
                $(match param_field_names.len() {
                    0 => (),
                    1 => $(&param_field_names[0].0): $(self.param_type_to_field_type(&param_field_names[0].1)),
                    _ => args: $(FunctionsGen::fun_arg_if_name(func))
                })
            ) {
                return txb.moveCall({
                    target: $[str]($($published_at)::$[const](func.get_full_name_str())),
                    $(match type_arg_count {
                        0 => (),
                        1 => { typeArguments: [typeArg], },
                        _ => { typeArguments: typeArgs, },
                    })
                    arguments: [
                        $(if param_field_names.len() == 1 {
                            $(self.param_to_txb_arg(
                                param_field_names[0].1.clone(), param_field_names[0].0.clone(),
                                func_type_param_names, single_param
                            ))
                        } else {
                            $(for (field_name, type_) in param_field_names join (, ) =>
                                $(self.param_to_txb_arg(
                                    type_, "args.".to_string() + &field_name,
                                    func_type_param_names.clone(), single_param
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

pub struct StructsGen<'env, 'a> {
    env: &'env GlobalEnv,
    import_ctx: StructClassImportCtx<'env, 'a>,
    framework: FrameworkImportCtx,
}

impl<'env, 'a> StructsGen<'env, 'a> {
    pub fn new(
        env: &'env GlobalEnv,
        import_ctx: StructClassImportCtx<'env, 'a>,
        framework: FrameworkImportCtx,
    ) -> Self {
        StructsGen {
            env,
            import_ctx,
            framework,
        }
    }

    fn symbol_pool(&self) -> &SymbolPool {
        self.env.symbol_pool()
    }

    /// Generates a TS interface field name from a struct field.
    fn gen_field_name(&self, field: &FieldEnv) -> impl FormatInto<JavaScript> {
        let name = field
            .get_name()
            .display(self.symbol_pool())
            .to_string()
            .to_case(Case::Camel);
        quote_fn! {
            $name
        }
    }

    fn gen_field_name_non_reserved(&self, field: &FieldEnv) -> impl FormatInto<JavaScript> {
        let name = field
            .get_name()
            .display(self.symbol_pool())
            .to_string()
            .to_case(Case::Camel);
        let name = if JS_RESERVED_WORDS.contains(&name.as_str()) {
            name + "_"
        } else {
            name
        };
        quote_fn! {
            $name
        }
    }

    /// Generates a TS interface field type for a struct field. References class structs generated
    /// in other modules by importing them when needed.
    fn gen_struct_class_field_type(
        &mut self,
        ty: &Type,
        type_param_names: Vec<Symbol>,
        wrap_type_parameter: Option<js::Tokens>,
    ) -> js::Tokens {
        self.gen_struct_class_field_type_inner(
            ty,
            type_param_names,
            wrap_type_parameter,
            true,
        )
    }

    fn gen_struct_class_field_type_inner(
        &mut self,
        ty: &Type,
        type_param_names: Vec<Symbol>,
        wrap_type_parameter: Option<js::Tokens>,
        is_top_level: bool,
    ) -> js::Tokens {
        let to_field = &self.framework.import("reified", "ToField");

        let to_field_if_top_level = |ty| if is_top_level {
            quote!($to_field<$ty>)
        } else {
            quote!($ty)
        };

        match ty {
            Type::Primitive(ty) => match ty {
                PrimitiveType::U8 => to_field_if_top_level(quote!($[str](u8))),
                PrimitiveType::U16 => to_field_if_top_level(quote!($[str](u16))),
                PrimitiveType::U32 => to_field_if_top_level(quote!($[str](u32))),
                PrimitiveType::U64 => to_field_if_top_level(quote!($[str](u64))),
                PrimitiveType::U128 => to_field_if_top_level(quote!($[str](u128))),
                PrimitiveType::U256 => to_field_if_top_level(quote!($[str](u256))),
                PrimitiveType::Bool => to_field_if_top_level(quote!($[str](bool))),
                PrimitiveType::Address => to_field_if_top_level(quote!($[str](address))),
                _ => panic!("unexpected primitive type: {:?}", ty),
            },
            Type::Vector(ty) => {
                quote!(Array<$(self.gen_struct_class_field_type_inner(ty, type_param_names, wrap_type_parameter, is_top_level))>)
            }
            Type::Struct(mid, sid, ts) => {
                let field_module = self.env.get_module(*mid);
                let field_strct = field_module.get_struct(*sid);

                // special case some types
                /*
                match field_strct.get_full_name_with_address().as_ref() {
                    "0x1::string::String" | "0x1::ascii::String" => quote!(string),
                    "0x2::url::Url" => quote!(string),
                    "0x2::object::ID" => quote!(string),
                    "0x2::object::UID" => quote!(string),
                    "0x1::option::Option" => {
                        let ty = &ts[0];
                        quote!(($(self.gen_struct_class_field_type(ty, type_param_names, wrap_type_parameter)) | null))
                    }
                    _ => {
                        let class = self.import_ctx.get_class(&field_strct);
                        let non_phantom_param_idxs = (0..ts.len())
                            .filter(|idx| !field_strct.is_phantom_parameter(*idx))
                            .collect::<Vec<_>>();

                        quote!($class$(if !non_phantom_param_idxs.is_empty() {
                            <$(for idx in non_phantom_param_idxs join (, ) =>
                                $(self.gen_struct_class_field_type(&ts[idx], type_param_names.clone(), None))
                            )>
                        }))
                    }
                }
                */
                let class = self.import_ctx.get_class(&field_strct);
                let non_phantom_param_idxs = (0..ts.len())
                    .filter(|idx| !field_strct.is_phantom_parameter(*idx))
                    .collect::<Vec<_>>();

                to_field_if_top_level(quote!($class$(if !non_phantom_param_idxs.is_empty() {
                    <$(for idx in non_phantom_param_idxs join (, ) =>
                        $(self.gen_struct_class_field_type_inner(&ts[idx], type_param_names.clone(), wrap_type_parameter.clone(), false))
                    )>
                })))

            }
            Type::TypeParameter(idx) => {
                let ty = type_param_names[*idx as usize]
                    .display(self.symbol_pool())
                    .to_string();
                to_field_if_top_level(match wrap_type_parameter {
                    Some(wrap_type_parameter) => quote!($wrap_type_parameter<$ty>),
                    None => quote!($ty),
                })
            }
            _ => panic!("unexpected type: {:?}", ty),
        }
    }

    /// Returns the type parameters of a struct. If the source map is available, the type parameters
    /// are named according to the source map. Otherwise, they are named `T0`, `T1`, etc.
    fn strct_type_param_names(&self, strct: &StructEnv) -> Vec<Symbol> {
        let symbol_pool = strct.module_env.env.symbol_pool();

        strct
            .get_named_type_parameters()
            .into_iter()
            .map(|param| {
                let name = param.0.display(self.symbol_pool()).to_string();

                if name.starts_with("unknown#") {
                    let name = name.replace("unknown#", "T");
                    symbol_pool.make(&name)
                } else {
                    param.0
                }
            })
            .collect()
    }

    fn strct_non_phantom_type_param_names(&self, strct: &StructEnv) -> Vec<Symbol> {
        let type_params = self.strct_type_param_names(strct);

        (0..strct.get_type_parameters().len())
            .filter_map(|idx| {
                if strct.is_phantom_parameter(idx) {
                    None
                } else {
                    Some(type_params[idx])
                }
            })
            .collect()
    }

    pub fn gen_struct_bcs_def_field_value(
        &mut self,
        ty: &Type,
        type_param_names: Vec<Symbol>,
    ) -> js::Tokens {
        let bcs = &js::import("@mysten/bcs", "bcs");
        let from_hex = &js::import("@mysten/bcs", "fromHEX");
        let to_hex = &js::import("@mysten/bcs", "toHEX");
        match ty {
            Type::Primitive(ty) => match ty {
                PrimitiveType::U8 => quote!($bcs.u8()),
                PrimitiveType::U16 => quote!($bcs.u16()),
                PrimitiveType::U32 => quote!($bcs.u32()),
                PrimitiveType::U64 => quote!($bcs.u64()),
                PrimitiveType::U128 => quote!($bcs.u128()),
                PrimitiveType::U256 => quote!($bcs.u256()),
                PrimitiveType::Bool => quote!($bcs.bool()),
                PrimitiveType::Address => quote!($bcs.bytes(32).transform({
                    input: (val: string) => $from_hex(val),
                    output: (val: Uint8Array) => $to_hex(val),
                })),
                PrimitiveType::Signer => quote!($bcs.bytes(32)),
                _ => panic!("unexpected primitive type: {:?}", ty),
            },
            Type::Vector(ty) => {
                quote!($bcs.vector($(self.gen_struct_bcs_def_field_value(ty, type_param_names))))
            }
            Type::Struct(mid, sid, ts) => {
                let field_module = self.env.get_module(*mid);
                let field_strct = field_module.get_struct(*sid);

                let class = self.import_ctx.get_class(&field_strct);
                let non_phantom_param_idxs = (0..ts.len())
                    .filter(|idx| !field_strct.is_phantom_parameter(*idx))
                    .collect::<Vec<_>>();

                quote!($class.bcs$(if !non_phantom_param_idxs.is_empty() {
                    ($(for idx in non_phantom_param_idxs join (, ) =>
                        $(self.gen_struct_bcs_def_field_value(&ts[idx], type_param_names.clone()))
                    ))
                }))
            }
            Type::TypeParameter(idx) => {
                quote!($(type_param_names[*idx as usize].display(self.symbol_pool()).to_string()))
            }
            _ => panic!("unexpected type: {:?}", ty),
        }
    }

    pub fn gen_reified(
        &mut self,
        ty: &Type,
        type_param_names: &Vec<Tokens<JavaScript>>,
    ) -> js::Tokens {
        let reified = &self.framework.import("reified", "reified").into_wildcard();
        match ty {
            Type::Primitive(ty) => match ty {
                PrimitiveType::U8 => quote!($[str](u8)),
                PrimitiveType::U16 => quote!($[str](u16)),
                PrimitiveType::U32 => quote!($[str](u32)),
                PrimitiveType::U64 => quote!($[str](u64)),
                PrimitiveType::U128 => quote!($[str](u128)),
                PrimitiveType::U256 => quote!($[str](u256)),
                PrimitiveType::Bool => quote!($[str](bool)),
                PrimitiveType::Address => quote!($[str](address)),
                _ => panic!("unexpected primitive type: {:?}", ty),
            },
            Type::Vector(ty) => {
                quote!($reified.vector($(self.gen_reified(ty, type_param_names))))
            }
            Type::Struct(mid, sid, ts) => {
                let field_module = self.env.get_module(*mid);
                let field_strct = field_module.get_struct(*sid);

                let class = self.import_ctx.get_class(&field_strct);

                quote!($class.reified($(if !ts.is_empty() {
                    $(for t in ts join (, ) =>
                        $(self.gen_reified(t, type_param_names))
                    )
                })))
            }
            Type::TypeParameter(idx) => {
                quote!($(type_param_names[*idx as usize].clone()))
            }
            _ => panic!("unexpected type: {:?}", ty),
        }
    }

    fn gen_from_fields_field_decode(&mut self, field: &FieldEnv) -> js::Tokens {
        let decode_from_fields_generic_or_special = &self
            .framework
            .import("reified", "decodeFromFields");

        let strct = &field.struct_env;

        let field_arg_name = format!(
            "fields.{}",
            field.get_name().display(self.symbol_pool())
        );

        let type_param_names = match strct.get_type_parameters().len() {
            0 => vec![],
            1 => vec![quote!(typeArg)],
            n => (0..n)
                .map(|idx| quote!(typeArgs[$idx]))
                .collect::<Vec<_>>(),
        };
        let reified = self.gen_reified(&field.get_type(), &type_param_names);

        quote!(
            $decode_from_fields_generic_or_special($(reified), $(field_arg_name))
        )
    }

    fn gen_from_fields_with_types_field_decode(&mut self, field: &FieldEnv) -> js::Tokens {
        let decode_from_fields_with_types_generic_or_special = &self
            .framework
            .import("reified", "decodeFromFieldsWithTypes");

        let strct = &field.struct_env;

        let field_arg_name = format!(
            "item.fields.{}",
            field.get_name().display(self.symbol_pool())
        );

        let type_param_names = match strct.get_type_parameters().len() {
            0 => vec![],
            1 => vec![quote!(typeArg)],
            n => (0..n)
                .map(|idx| quote!(typeArgs[$idx]))
                .collect::<Vec<_>>(),
        };
        let reified = self.gen_reified(&field.get_type(), &type_param_names);

        quote!(
            $decode_from_fields_with_types_generic_or_special($(reified), $(field_arg_name))
        )
    }

    /// Generates the `is<StructName>` function for a struct.
    pub fn gen_is_type_func(&self, tokens: &mut js::Tokens, strct: &StructEnv) {
        let compress_sui_type = &self.framework.import("util", "compressSuiType");

        let struct_name = strct.get_name().display(self.symbol_pool()).to_string();
        let type_params = self.strct_type_param_names(strct);

        quote_in! { *tokens =>
            export function is$(&struct_name)(type: string): boolean {
                type = $compress_sui_type(type);
                $(if type_params.is_empty() {
                    return type === $[str]($[const](strct.get_full_name_with_address()))
                } else {
                    return type.startsWith($[str]($[const](strct.get_full_name_with_address())<))
                });
            }
        }
        tokens.line();
    }

    /// Generates TS type param tokens for a struct. Ignores phantom type parameters as these
    /// are not used in the generated code.
    /// E.g. for `struct Foo<T, P>`, this generates `<T, P>`.
    fn gen_params_toks(&self, strct: &StructEnv, extends_or_wraps: &ExtendsOrWraps) -> js::Tokens {
        let non_phantom_params = self.strct_non_phantom_type_param_names(strct);
        if non_phantom_params.is_empty() {
            return quote!();
        }

        match extends_or_wraps {
            ExtendsOrWraps::Extends(extends) => {
                quote!(<$(for param in &non_phantom_params join (, ) => $(
                param.display(self.symbol_pool()).to_string()) extends $extends
            )>)
            }
            ExtendsOrWraps::Wraps(wraps) => {
                quote!(<$(for param in &non_phantom_params join (, ) => $wraps<$(
                param.display(self.symbol_pool()).to_string())>
            )>)
            }
            ExtendsOrWraps::None => quote!(<$(for param in &non_phantom_params join (, ) => $(
                param.display(self.symbol_pool()).to_string())
            )>),
        }
    }

    fn fields_if_name(&self, strct: &StructEnv) -> String {
        let struct_name = strct.get_name().display(self.symbol_pool()).to_string();
        format!("{}Fields", &struct_name)
    }

    /// Generates the `<StructName>Fields` interface name including it's (non-phantom) type parameters.
    fn gen_fields_if_name_with_params(
        &self,
        strct: &StructEnv,
        extends_or_wraps: &ExtendsOrWraps,
    ) -> js::Tokens {
        quote! { $(self.fields_if_name(strct))$(self.gen_params_toks(strct, extends_or_wraps)) }
    }

    /// Generates the `<StructName>Fields` interface.
    pub fn gen_fields_if(&mut self, tokens: &mut js::Tokens, strct: &StructEnv) {
        let type_argument = &self.framework.import("reified", "TypeArgument");
        let extends = ExtendsOrWraps::Extends(quote!($type_argument));

        quote_in! { *tokens =>
            export interface $(self.gen_fields_if_name_with_params(strct, &extends)) {
                $(for field in strct.get_fields() join (; )=>
                    $(self.gen_field_name(&field)): $(
                        self.gen_struct_class_field_type(&field.get_type(), self.strct_type_param_names(strct), None)
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
    pub fn gen_struct_class(&mut self, tokens: &mut js::Tokens, strct: &StructEnv) {
        let fields_with_types = &self.framework.import("util", "FieldsWithTypes");
        let field_to_json = &self.framework.import("reified", "fieldToJSON");
        let type_argument = &self.framework.import("reified", "TypeArgument");
        let reified_type_argument = &self.framework.import("reified", "ReifiedTypeArgument");
        let to_type_argument = &self.framework.import("reified", "ToTypeArgument");
        let to_bcs = &self.framework.import("reified", "toBcs");
        let extract_type = &self.framework.import("reified", "extractType");
        let assert_fields_with_types_args_match = &self
            .framework
            .import("reified", "assertFieldsWithTypesArgsMatch");
        let sui_parsed_data = &js::import("@mysten/sui.js/client", "SuiParsedData");
        let sui_client = &js::import("@mysten/sui.js/client", "SuiClient");
        let bcs = &js::import("@mysten/bcs", "bcs");
        let bcs_type = &js::import("@mysten/bcs", "BcsType");

        strct.get_abilities().has_key();

        let struct_name = strct.get_name().display(self.symbol_pool()).to_string();
        let type_params = self.strct_type_param_names(strct);
        let type_params_str = type_params
            .iter()
            .map(|param| param.display(self.symbol_pool()).to_string())
            .collect::<Vec<_>>();
        let fields = strct.get_fields().collect::<Vec<_>>();
        let non_phantom_params = self.strct_non_phantom_type_param_names(strct);
        let non_phantom_param_strs = non_phantom_params
            .iter()
            .map(|param| param.display(self.symbol_pool()).to_string())
            .collect::<Vec<_>>();
        let non_phantom_param_idxs = (0..type_params.len())
            .filter(|idx| !strct.is_phantom_parameter(*idx))
            .collect::<Vec<_>>();

        let bcs_def_name = if non_phantom_params.is_empty() {
            quote!($[str]($[const](&struct_name)))
        } else {
            self.interpolate(format!(
                "{}<{}>",
                &struct_name,
                non_phantom_param_strs
                    .iter()
                    .map(|param| format!("${{{}.name}}", param))
                    .collect::<Vec<_>>()
                    .join(", ")
            ))
        };

        let extends_type_argument = ExtendsOrWraps::Extends(quote!($type_argument));
        let extends_reified_type_argument = ExtendsOrWraps::Extends(quote!($reified_type_argument));
        let wraps_to_type_argument = ExtendsOrWraps::Wraps(quote!($to_type_argument));

        // string
        // [string, string, ...]
        let type_args_type = &match type_params.len() {
            0 => quote!(),
            1 => quote!(string),
            _ => quote!([$(for _ in &type_params join (, ) => string)]),
        };

        // readonly $typeArg: string
        // readonly $typeArgs: [string, string, ...]
        let type_args_field_if_any: js::Tokens = match type_params.len() {
            0 => quote!(),
            1 => quote!(readonly $$typeArg: string;$['\n']),
            _ => {
                quote!(readonly $$typeArgs: $type_args_type;$['\n'])
            }
        };

        // typeArg: string,
        // typeArgs: [string, string, ...],
        let type_args_param_for_constructor_if_any: js::Tokens = match type_params.len() {
            0 => quote!(),
            1 => quote!(typeArg: string,),
            _ => quote!(typeArgs: $type_args_type,),
        };

        // typeArg: T0,
        // typeArgs: [T0, T1, ReifiedTypeArgument, T3, ...],
        let type_args_param_if_any: &js::Tokens = &match type_params.len() {
            0 => quote!(),
            1 => quote!(
                $(if strct.is_phantom_parameter(0) {
                    typeArg: $reified_type_argument
                } else {
                    typeArg: $(type_params[0].display(self.symbol_pool()).to_string())
                }),
            ),
            _ => quote!(typeArgs: [$(for idx in 0..type_params.len() join (, ) => 
                    $(if strct.is_phantom_parameter(idx) {
                        $reified_type_argument
                    } else {
                        $(&type_params[idx].display(self.symbol_pool()).to_string())
                    })
                )],),
        };

        quote_in! { *tokens =>
            export class $(&struct_name)$(self.gen_params_toks(strct, &extends_type_argument)) {
                static readonly $$typeName = $[str]($[const](strct.get_full_name_with_address()));
                static readonly $$numTypeParams = $(type_params.len());$['\n']

                readonly $$typeName = $(&struct_name).$$typeName;$['\n']

                static get bcs() {
                    return $(if !non_phantom_params.is_empty() {
                        <$(for param in non_phantom_param_strs.iter() join (, ) =>
                            $param extends $bcs_type<any>
                        )>($(for param in non_phantom_param_strs.iter() join (, ) =>
                            $param: $param
                        )) =>
                    })
                    $bcs.struct($bcs_def_name, {$['\n']
                        $(for field in strct.get_fields() join (, ) =>
                            $(field.get_name().display(self.symbol_pool()).to_string()):
                                $(self.gen_struct_bcs_def_field_value(&field.get_type(), self.strct_type_param_names(strct)))
                        )$['\n']
                    $['\n']})
                };$['\n']

                $type_args_field_if_any;

                $(for field in strct.get_fields() join (; ) =>
                    readonly $(self.gen_field_name(&field)):
                        $(self.gen_struct_class_field_type(
                            &field.get_type(), self.strct_type_param_names(strct), None
                        ))
                )$['\n']

                private constructor($type_args_param_for_constructor_if_any $(match fields.len() {
                        0 => (),
                        1 => {
                            $(self.gen_field_name_non_reserved(&fields[0])): $(
                                self.gen_struct_class_field_type(&fields[0].get_type(), self.strct_type_param_names(strct), None)
                            ),
                        },
                        _ => { fields: $(self.gen_fields_if_name_with_params(strct, &ExtendsOrWraps::None)), }
                    })
                ) {
                    $(match type_params.len() {
                        0 => (),
                        1 => this.$$typeArg = typeArg;$['\n'],
                        _ => this.$$typeArgs = typeArgs;$['\n'],
                    })

                    $(match fields.len() {
                        0 => (),
                        1 => this.$(self.gen_field_name(&fields[0])) = $(self.gen_field_name_non_reserved(&fields[0]));,
                        _ => {
                            $(for field in &fields join (; ) =>
                                this.$(self.gen_field_name(field)) = fields.$(self.gen_field_name(field));
                            )
                        }
                    })
                }$['\n']

                static new$(self.gen_params_toks(strct, &extends_reified_type_argument))(
                    $type_args_param_if_any $(match fields.len() {
                        0 => (),
                        1 => {
                            $(self.gen_field_name_non_reserved(&fields[0])): $(
                                self.gen_struct_class_field_type(
                                    &fields[0].get_type(), self.strct_type_param_names(strct), Some(quote!($to_type_argument))
                                )
                            ),
                        },
                        _ => { fields: $(self.gen_fields_if_name_with_params(strct, &wraps_to_type_argument)), }
                    })
                ): $(&struct_name)$(self.gen_params_toks(strct, &wraps_to_type_argument)) {
                    return new $(&struct_name)(
                        $(match type_params.len() {
                            0 => (),
                            1 => { $extract_type(typeArg), },
                            _ => { typeArgs.map($extract_type) as $type_args_type, },
                        })
                        $(match fields.len() {
                            0 => (),
                            1 => $(self.gen_field_name_non_reserved(&fields[0])),
                            _ => fields,
                        })
                    )
                }$['\n']

                static reified$(self.gen_params_toks(strct, &extends_reified_type_argument))(
                    $(for (idx, param) in type_params_str.iter().enumerate() join (, ) => 
                        $(if strct.is_phantom_parameter(idx) {
                            $param: $reified_type_argument
                        } else {
                            $param: $param
                        })
                    )
                ) {
                    return {
                        typeName: $(&struct_name).$$typeName,
                        typeArgs: [$(for param in &type_params_str join (, ) => $param)],
                        fromFields: (fields: Record<string, any>) =>
                            $(&struct_name).fromFields(
                                $(match type_params.len() {
                                    0 => (),
                                    1 => { $(type_params_str[0].clone()), },
                                    _ => { [$(for param in &type_params_str join (, ) => $param)], },
                                })
                                fields,
                            ),
                        fromFieldsWithTypes: (item: $fields_with_types) =>
                            $(&struct_name).fromFieldsWithTypes(
                                $(match type_params.len() {
                                    0 => (),
                                    1 => { $(type_params_str[0].clone()), },
                                    _ => { [$(for param in &type_params_str join (, ) => $param)], },
                                })
                                item,
                            ),
                        fromBcs: (data: Uint8Array) =>
                            $(&struct_name).fromBcs(
                                $(match type_params.len() {
                                    0 => (),
                                    1 => { $(type_params_str[0].clone()), },
                                    _ => { [$(for param in &type_params_str join (, ) => $param)], },
                                })
                                data,
                            ),
                        bcs: $(&struct_name).bcs$(if !non_phantom_params.is_empty() {
                            ($(for param in &non_phantom_param_strs join (, ) => $to_bcs($param)))
                        }),
                        __class: null as unknown as ReturnType<typeof $(&struct_name).new$(self.gen_params_toks(strct, &wraps_to_type_argument))>,
                    }
                }$['\n']

                static fromFields$(self.gen_params_toks(strct, &extends_reified_type_argument))(
                    $type_args_param_if_any fields: Record<string, any>
                ): $(&struct_name)$(self.gen_params_toks(strct, &wraps_to_type_argument)) {
                    return $(&struct_name).new(
                        $(match type_params.len() {
                            0 => (),
                            1 => { typeArg, },
                            _ => { typeArgs, },
                        })
                        $(match fields.len() {
                            0 => (),
                            1 => $(self.gen_from_fields_field_decode(&fields[0])),
                            _ => {{
                                $(for field in &fields join (, ) =>
                                    $(self.gen_field_name(field)): $(self.gen_from_fields_field_decode(field))
                                )
                            }}
                        })
                    )
                }$['\n']

                static fromFieldsWithTypes$(self.gen_params_toks(strct, &extends_reified_type_argument))(
                    $type_args_param_if_any item: $fields_with_types
                ): $(&struct_name)$(self.gen_params_toks(strct, &wraps_to_type_argument)) {
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

                    return $(&struct_name).new(
                        $(match type_params.len() {
                            0 => (),
                            1 => { typeArg, },
                            _ => { typeArgs, },
                        })
                        $(match fields.len() {
                            0 => (),
                            1 => $(self.gen_from_fields_with_types_field_decode(&fields[0])),
                            _ => {{
                                $(for field in &fields join (, ) =>
                                    $(self.gen_field_name(field)): $(self.gen_from_fields_with_types_field_decode(field))
                                )
                            }}
                        })
                    )
                }$['\n']

                static fromBcs$(self.gen_params_toks(strct, &extends_reified_type_argument))(
                    $type_args_param_if_any data: Uint8Array
                ): $(&struct_name)$(self.gen_params_toks(strct, &wraps_to_type_argument)) {
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
                            let this_type_arg_or_args = |idx: usize| {
                                match type_params.len() {
                                    0 => quote!(""),
                                    1 => quote!(this.$$typeArg),
                                    _ => quote!(this.$$typeArgs[$idx])
                                }
                            };
                            let type_param_names = (0..strct.get_type_parameters().len())
                                .map(|idx| QuoteItem::Interpolated(this_type_arg_or_args(idx)))
                                .collect::<Vec<_>>();

                            for field in fields {
                                let name = self.gen_field_name(&field);
                                let this_name = quote!(this.$(self.gen_field_name(&field)));

                                match field.get_type() {
                                    Type::Struct(mid, sid, _) => {
                                        let field_module = self.env.get_module(mid);
                                        let field_strct = field_module.get_struct(sid);

                                        // handle special types
                                        match field_strct.get_full_name_with_address().as_ref() {
                                            "0x1::string::String" | "0x1::ascii::String" => {
                                                quote_in!(*toks => $name: $this_name,)
                                            }
                                            "0x2::url::Url" => {
                                                quote_in!(*toks => $name: $this_name,)
                                            }
                                            "0x2::object::ID" => {
                                                quote_in!(*toks => $name: $this_name,)
                                            }
                                            "0x2::object::UID" => {
                                                quote_in!(*toks => $name: $this_name, )
                                            }
                                            "0x1::option::Option" => {
                                                let type_name = gen_bcs_def_for_type(&field.get_type(), self.env, &type_param_names);
                                                quote_in!(*toks => $name: $field_to_json($type_name, $this_name),)
                                            }
                                            _ => {
                                                quote_in!(*toks => $name: $this_name.toJSONField(),)
                                            }
                                        }
                                    }
                                    Type::Primitive(ty) => match ty {
                                        PrimitiveType::U64 | PrimitiveType::U128 | PrimitiveType::U256 => {
                                            quote_in!(*toks => $name: $this_name.toString(),)
                                        }
                                        _ => {
                                            quote_in!(*toks => $name: $this_name,)
                                        }
                                    },
                                    Type::Vector(_) => {
                                        let type_name = gen_bcs_def_for_type(&field.get_type(), self.env, &type_param_names);

                                        quote_in!(*toks => $name: $field_to_json($type_name, $this_name),)
                                    }
                                    Type::TypeParameter(i) => {
                                        quote_in!(*toks => $name: $field_to_json($(this_type_arg_or_args(i as usize)), $this_name),)
                                    }
                                    _ => {
                                        let name = self.gen_field_name(&field);
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
                        $(match type_params.len() {
                            0 => (),
                            1 => { $$typeArg: this.$$typeArg, },
                            _ => { $$typeArgs: this.$$typeArgs, },
                        })
                        ...this.toJSONField()
                    }
                }$['\n']

                $(if strct.get_abilities().has_key() {
                    static fromSuiParsedData$(self.gen_params_toks(strct, &extends_reified_type_argument))(
                        $type_args_param_if_any content: $sui_parsed_data
                    ): $(&struct_name)$(self.gen_params_toks(strct, &wraps_to_type_argument)) {
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

                    static async fetch$(self.gen_params_toks(strct, &extends_reified_type_argument))(
                        client: $sui_client, $type_args_param_if_any id: string
                    ): Promise<$(&struct_name)$(self.gen_params_toks(strct, &wraps_to_type_argument))> {
                        const res = await client.getObject({
                            id,
                            options: {
                                showContent: true,
                            },
                        });
                        if (res.error) {
                            throw new Error($(self.interpolate(
                                format!("error fetching {} object at id ${{id}}: ${{res.error.code}}", &struct_name))
                            ));
                        }
                        if (res.data?.content?.dataType !== "moveObject" || !is$(&struct_name)(res.data.content.type)) {
                            throw new Error($(self.interpolate(
                                format!("object at id ${{id}} is not a {} object", &struct_name))
                            ));
                        }$['\r']

                        return $(&struct_name).fromFieldsWithTypes(
                            $(match type_params.len() {
                                0 => (),
                                1 => { typeArg, },
                                _ => { typeArgs, },
                            })
                            res.data.content
                        );
                    }$['\n']
                })
            }
        }
        tokens.line()
    }

    pub fn gen_struct_sep_comment(&self, tokens: &mut js::Tokens, strct: &StructEnv) {
        let struct_name = strct.get_name().display(self.symbol_pool()).to_string();
        tokens.line();
        tokens.append(format!(
            "/* ============================== {} =============================== */",
            struct_name
        ));
        tokens.line()
    }
}
