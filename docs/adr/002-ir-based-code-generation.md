# ADR 002: IR-Based Code Generation Architecture

## Status

Accepted

## Context

The original sui-client-gen used `genco`, a quasi-quoting library for Rust code generation.
While genco produced terse, compact code, it had significant drawbacks:

- **Esoteric macros**: Heavy use of Rust macros made the codebase intimidating to contributors
- **Opaque output**: Difficult to understand what TypeScript would be generated without running it
- **Hard to test**: No way to test generation logic without compiling Move packages and making RPC calls
- **Coupled concerns**: Model building and code emission were intertwined

As the project matured and added features (enums, multi-environment support), the genco approach
became increasingly difficult to maintain. The codebase needed to be more approachable for:

- Open source contributors unfamiliar with Rust macros
- LLM-based coding assistants (agentic coding)
- Future multi-language support (Rust SDK planned)

## Decision

Adopt a three-phase pipeline with an explicit Intermediate Representation (IR):

```
Move Model (via move_model_2)
       │
       ▼
┌─────────────────────────────────────────────┐
│  IR Construction                            │
│  - StructIRBuilder  → StructIR              │
│  - EnumIRBuilder    → EnumIR                │
│  - FunctionIRBuilder → FunctionIR           │
└─────────────────────────────────────────────┘
       │
       ▼
┌─────────────────────────────────────────────┐
│  TypeScript Emission                        │
│  - StructIR.emit_body()                     │
│  - EnumIR.emit_body()                       │
│  - FunctionIR.emit()                        │
│  - formatdoc! templates                     │
└─────────────────────────────────────────────┘
       │
       ▼
Generated TypeScript Code
```

### Coarse-Grained IR (not fine-grained AST)

The IR captures domain-specific concepts, not TypeScript syntax:

- **StructIR**: Struct name, fields, type parameters, package info, usage flags
- **EnumIR**: Enum name, variants (unit/struct/tuple), type parameters
- **FunctionIR**: Function name, parameters, type parameters, purity flags

This avoids the "AST trap" of modeling TypeScript's full syntax in Rust.

### Builder Pattern

Each IR type has a corresponding builder:

- `StructIRBuilder::new(model, ...).build() → StructIR`
- `EnumIRBuilder::new(model, ...).build() → EnumIR`
- `FunctionIRBuilder::new(model, ...).build() → FunctionIR`

Builders handle the complexity of:

- Type matching (using `full_type_name` for reliable special type detection)
- Import resolution and collision handling
- Feature flag detection (`uses_vector`, `uses_address`, etc.)

### Template-Based Emission

Emission uses `formatdoc!` macros from the `indoc` crate:

```rust
formatdoc! {"
    export class {name} {{
        {fields}

        constructor({params}) {{
            {body}
        }}
    }}
", name = self.name, ...}
```

This is more readable than AST builders while still being type-safe.

## Rationale

### Why not use a fine-grained TypeScript AST?

A fine-grained AST (modeling every TypeScript syntax node) would:

- Require mapping every language feature to Rust types
- Make the codebase harder to understand (more indirection)
- Provide marginal benefit for our use case (we generate specific patterns)

The coarse-grained IR captures "what to generate" not "how it looks syntactically."

### Why separate IR from emission?

Separation enables:

1. **Snapshot testing**: Build IR fixtures directly in tests, call emit, snapshot the result
2. **Validation**: Check IR properties before emission (e.g., compatibility across environments)
3. **Multi-language support**: Same IR can drive different emitters (TypeScript now, Rust later)
4. **Debugging**: Inspect IR to understand what will be generated

### Why is this better for agentic coding?

LLMs work more effectively with:

- Explicit data types with clear field names
- Separation of concerns (understanding IR vs understanding templates)
- Snapshot tests they can reference and extend
- Code that reads like documentation

The old macro-heavy approach was opaque to pattern matching.

### Why formatdoc! instead of string concatenation?

`formatdoc!` provides:

- Automatic indentation handling
- Compile-time format string validation
- Readable multi-line templates
- No runtime overhead

## Consequences

### Positive

- **52 snapshot tests** covering struct, enum, and function generation
- **Faster iteration**: Change emission logic, run tests, review snapshots
- **Easier onboarding**: New contributors can understand IR types without macro expertise
- **Multi-language ready**: IR is language-agnostic; only emitters are TypeScript-specific
- **Better test coverage**: 168 Rust tests total, 8,692 lines in ts_gen module

### Negative

- **More lines of code**: Less terse than genco (but more maintainable)
- **Two-step changes**: IR changes may require emission updates (and vice versa)
- **Learning curve**: Contributors need to understand IR structure

## Implementation

### Core IR Modules

| Module | Purpose |
|--------|---------|
| `ts_gen/builder.rs` | IR construction (StructIRBuilder, EnumIRBuilder, FunctionIRBuilder) |
| `ts_gen/structs.rs` | StructIR definition + `emit_body()`, `emit_class()` |
| `ts_gen/enums.rs` | EnumIR definition + emission (parent class, variants, type guards) |
| `ts_gen/functions.rs` | FunctionIR definition + `emit()` |
| `ts_gen/imports.rs` | Import path resolution, collision handling, consolidation |

### Key Functions

- `StructIRBuilder::build()` - Extracts struct info from Move model
- `StructIR::emit_body()` - Generates TypeScript class code
- `emit_combined_imports_with_enums()` - Consolidates imports for a module

### Testing

- `generator/tests/snapshot_tests.rs` - Test infrastructure
- `generator/tests/snapshots/*.snap` - 52 snapshot files

## References

- `generator/src/ts_gen/mod.rs` - Architecture decision documentation
- `indoc` crate: https://crates.io/crates/indoc
- Previous genco implementation: Git history before v0.5.0
