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
pub use init::{gen_init_loader, gen_package_init};
pub use structs::{FieldIR, FieldTypeIR, PackageInfo, StructIR, StructImport, TypeParamIR};
pub use types::{ImportTracker, MoveTypeIR};
pub use utils::{gen_package_index, module_import_name, package_import_name, JS_RESERVED_WORDS};
