//! Framework TypeScript sources embedded at compile time.
//!
//! These are the runtime support files that get copied to `_framework/` in the generated output.
//! The source files live in `generator/framework/` for easier editing with proper IDE support.

/// ESLint configuration to suppress common warnings in generated code.
pub static ESLINTRC: &str = include_str!("../framework/.eslintrc.json");

/// The struct class loader - provides runtime type lookup and reification.
pub static LOADER: &str = include_str!("../framework/loader.ts");

/// Utility functions for type parsing, transaction building, and type compression.
pub static UTIL: &str = include_str!("../framework/util.ts");

/// Core reified type system - struct/vector/enum class interfaces and decode/encode helpers.
pub static REIFIED: &str = include_str!("../framework/reified.ts");

/// Vector class implementation with full reification support.
pub static VECTOR: &str = include_str!("../framework/vector.ts");

/// Environment management runtime - provides setActiveEnv, getPublishedAt, getTypeOrigin, etc.
/// Also contains the EnvConfig and PackageConfig type definitions.
pub static ENV: &str = include_str!("../framework/env.ts");
