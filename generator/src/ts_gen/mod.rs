//! TypeScript code generation using a domain-focused IR.
//!
//! This module uses a "coarse-grained" IR approach:
//! - The Builder captures domain intent (what to generate)
//! - The Emitter handles syntax (how it looks in TypeScript)
//!
//! This avoids the "AST Trap" of modeling TypeScript's exact AST in Rust.

mod builder;
pub mod compat;
mod enums;
mod env_config;
mod functions;
mod imports;
mod init;
mod structs;
mod utils;

// Re-export public API
pub use builder::{
    emit_module_structs_from_ir, gen_module_functions, gen_module_structs, EnumIRBuilder,
    FunctionIRBuilder, StructIRBuilder,
};
pub use enums::{EnumIR, EnumVariantIR};
pub use functions::{emit_functions_file, FunctionIR, FunctionParamIR, FunctionStructImport, ParamTypeIR};
pub use imports::{ImportPathResolver, TsImportsBuilder};
pub use init::{gen_init_loader, gen_package_init};
pub use structs::{
    DatatypeImport, DatatypeKind, FieldIR, FieldTypeIR, PackageInfo, StructIR, StructImport,
    TypeParamIR,
};
pub use utils::{
    is_reserved_word, module_import_name, package_import_name, sanitize_identifier,
    JS_RESERVED_WORDS,
};
pub use env_config::{gen_envs_index, EnvConfigIR, EnvPackageConfigIR};
