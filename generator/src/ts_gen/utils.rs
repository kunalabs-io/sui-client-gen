//! Shared utility functions for TypeScript code generation.

use convert_case::{Case, Casing};
use move_symbol_pool::Symbol;

/// JavaScript reserved words that cannot be used as identifiers.
/// This comprehensive list includes:
/// - ECMAScript reserved words (strict mode)
/// - Future reserved words
/// - Literals that can't be identifiers (true, false, null)
/// - TypeScript reserved words
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

/// Check if a name is a JavaScript/TypeScript reserved word.
/// Use this for all identifier validation across the generator.
pub fn is_reserved_word(name: &str) -> bool {
    JS_RESERVED_WORDS.contains(&name)
}

/// Sanitize an identifier by appending underscore if it's a reserved word.
/// Returns the original name if it's not reserved.
pub fn sanitize_identifier(name: &str) -> String {
    if is_reserved_word(name) {
        format!("{}_", name)
    } else {
        name.to_string()
    }
}

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
        .from_case(Case::Snake)
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
            lines.push(format!(
                "export const PKG_V{} = '{}'",
                version, ver_published_at
            ));
        }
    }

    lines.join("\n") + "\n"
}
