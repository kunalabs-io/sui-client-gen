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

pub fn gen_package_init_kt<const HAS_SOURCE: SourceKind>(
    pkg: &model::Package<HAS_SOURCE>,
    framework: &FrameworkImportCtx,
) -> js::Tokens {
    todo!("Implement Kotlin package init generation")
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

pub fn gen_init_loader_kt(
    source_pkgs_info: Option<(
        Vec<AccountAddress>,
        &BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    )>,
    onchain_pkgs_info: Option<(
        Vec<AccountAddress>,
        &BTreeMap<AccountAddress, move_symbol_pool::Symbol>,
    )>,
) -> js::Tokens {
    todo!("Implement Kotlin init loader generation")
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

enum ExtendsOrWraps {
    None,
    Extends(js::Tokens),
    Wraps(js::Tokens),
}