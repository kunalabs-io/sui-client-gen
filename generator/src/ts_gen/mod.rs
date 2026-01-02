//! TypeScript code generation using a domain-focused IR.
//!
//! This module uses a "coarse-grained" IR approach:
//! - The Builder captures domain intent (what to generate)
//! - The Emitter handles syntax (how it looks in TypeScript)
//!
//! This avoids the "AST Trap" of modeling TypeScript's exact AST in Rust.

mod builder;
mod enums;
mod functions;
mod imports;
mod init;
mod structs;
mod types;
mod utils;

// Re-export public API
pub use builder::{
    gen_module_functions, gen_module_structs, EnumIRBuilder, FunctionIRBuilder, StructIRBuilder,
};
pub use enums::{EnumIR, EnumVariantIR};
pub use functions::{FunctionIR, FunctionParamIR, ParamTypeIR};
pub use imports::{GenContext, ImportPathResolver, TsImportsBuilder};
pub use init::{gen_init_loader, gen_package_init};
pub use structs::{
    DatatypeImport, DatatypeKind, FieldIR, FieldTypeIR, PackageInfo, StructIR, StructImport,
    TypeParamIR,
};
pub use utils::{
    gen_package_index, is_reserved_word, module_import_name, package_import_name,
    sanitize_identifier, JS_RESERVED_WORDS,
};
