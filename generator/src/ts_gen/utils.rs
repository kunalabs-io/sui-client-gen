//! Shared utility functions for TypeScript code generation.

use convert_case::{Case, Casing};
use move_symbol_pool::Symbol;

/// JavaScript reserved words that cannot be used as identifiers.
#[rustfmt::skip]
pub const JS_RESERVED_WORDS: [&str; 64] = [
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

/// Generate the `index.ts` content for a package.
pub fn gen_package_index(
    pkg_id: &str,
    published_at: &str,
    versions: &[(String, u64)], // (published_at_addr, version_number)
    is_system_package: bool,
) -> String {
    let mut lines = Vec::new();
    lines.push(format!("export const PACKAGE_ID = '{}'", pkg_id));
    lines.push(format!("export const PUBLISHED_AT = '{}'", published_at));

    if !is_system_package {
        for (ver_published_at, version) in versions {
            lines.push(format!("export const PKG_V{} = '{}'", version, ver_published_at));
        }
    }

    lines.join("\n") + "\n"
}

