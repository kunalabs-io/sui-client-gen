## Architecture internals (for contributors + AI agents)

This document explains how `sui-client-gen` turns a `gen.toml` manifest into a generated TypeScript SDK.
It is meant to be a **reference for maintainers** (where to change what, how the pipeline is structured, and how to test changes).

Related docs:

- **User-facing usage**: `README.md`

---

## High-level pipeline (mental model)

At a high level:

- **Input**: `gen.toml` + (optional) RPC access to fetch on-chain package metadata
- **Intermediate**:
  - Build a Move model (`move_model_2`) for the requested packages (source +/or on-chain)
  - Build a **coarse-grained IR** (Rust structs/enums) for TS emission
- **Output**: a folder containing:
  - `_framework/` runtime TS helpers
  - one folder per top-level package (plus `_dependencies/` for transitive deps)
  - `index.ts` / `init.ts` / `<module>/structs.ts` / `<module>/functions.ts`

The orchestrator is `generator/src/driver.rs`.

---

## Inputs

### `gen.toml` format

The manifest is parsed by `generator/src/manifest.rs`.

- **`[config]`**

  - **`environment`**: Required. Target environment (e.g., `mainnet`, `testnet`, or custom defined in `[environments]`). Used for resolving `Published.toml` metadata.
  - **`graphql`**: Optional. GraphQL URL for fetching type origins. If omitted, uses environment-specific default.
  - **`output`**: Optional. Output directory for generated code (can also be specified via `--out` CLI flag).

- **`[packages]`**
  - Each entry can be:
    - **Local package**: `{ local = "..." }`
    - **Git package**: `{ git = "...", subdir = "...", rev = "..." }`
    - **On-chain package**: `{ on-chain = true }`
    - **MVR package**: `{ r.mvr = "@namespace/package" }`
  - Optional flags: `override = true`, `rename-from = "..."`

Example (`ts/examples/gen/gen.toml`):

```toml
[config]
environment = "testnet"
graphql = "https://graphql.testnet.sui.io/graphql"

[packages]
amm = { local = "../../../move/amm" }
examples = { local = "../../../move/examples" }
sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "mainnet-v1.62.1", override = true }
std = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/move-stdlib", rev = "mainnet-v1.62.1", override = true }
```

- **`[environments]`** (optional)
  - Defines custom environments beyond the defaults (`mainnet`, `testnet`)
  - Default environments don't need to be listed but can be overridden for graphql endpoint
  - Custom environments require `chain-id`

  ```toml
  [environments]
  staging = "abcd1234"  # string shorthand: just chain-id
  staging_alt = { chain-id = "abcd1234", graphql = "https://..." }  # full form
  testnet = { graphql = "https://my-endpoint/graphql" }  # override default's graphql
  ```

- **`[dep-replacements.<env>]`** (optional)
  - Environment-scoped dependency overrides
  - Override source location, published-at, original-id, or bind to different environment

  ```toml
  [dep-replacements.staging]
  some_dep = { local = "../other", use-environment = "testnet" }
  other_dep = { published-at = "0x123...", original-id = "0x456..." }
  ```

---

## CLI entrypoint

The binary entrypoint is `generator/src/main.rs`:

- Parses args (`--manifest`, `--out`, `--environment`, `--graphql`, `--clean`)
- Calls `driver::run(RunOptions)`

### Running the generator locally (from this repo)

From the repo root:

```bash
# Generate into an output dir
cargo run -p sui-client-gen -- --manifest ./gen.toml --out ./gen --clean
```

To regenerate the checked-in example/test outputs:

```bash
# From ts/ directory
pnpm run gen:all       # Regenerate all (examples + tests)
pnpm run gen:example   # Regenerate examples only
pnpm run gen:tests     # Regenerate tests only
```

Notes:

- **GraphQL access is required** to resolve type origin/version info from chain (it will warn + fall back if a package can't be fetched).
- `--clean` deletes everything under `--out` except `gen.toml` (see `generator/src/io.rs`).

---

## Model building (Move packages → `move_model_2::Model`)

Model building is centralized in `generator/src/model_builder.rs`.

### Package System: `move_package_alt`

The generator uses Sui's `move_package_alt` package system which provides:

- **Environment support**: Packages can have different published metadata per environment (mainnet, testnet, etc.)
- **`Published.toml`**: Contains published package metadata for each environment:
  ```toml
  [published.testnet]
  chain-id = "4c78adac"
  published-at = "0xe782..."
  original-id = "0x60af..."
  version = 2
  ```
- **GraphQL-based type origin resolution**: Uses Sui's GraphQL API to fetch type origin tables for published packages

### `build_model(...)`

The main entry point in `model_builder.rs`:

- Uses `move_package_alt` to resolve and compile all packages from `gen.toml`
  - Local dependency paths are canonicalized relative to `gen.toml`
  - Git dependencies are fetched and cached
- Compiles to `move_model_2::Model` with full source information
- Reads `Published.toml` metadata for each package to determine published addresses

Returns `ModelResult` containing:

- **`model`**: the compiled Move model
- **`id_map`**: address → package name mapping (determines "top-level" vs "dependencies")
- **`published_at`**: original package ID → published-at ID from `Published.toml`
- **`type_origin_table`**: for each published package, maps `module::Datatype` → origin package address
  - Fetched via GraphQL using `graphql/` module
  - Falls back to "self-origin" for unpublished packages
- **`version_table`**: maps package addresses to version info
- **`top_level_packages`**: packages explicitly listed in `gen.toml`

### Multi-environment builds (`multi_env.rs`)

The driver uses `build_multi_env_models(...)` to:

- Collect all environments (from `[config].environment` + `[environments]` + `[dep-replacements.<env>]`)
- Build a model for each environment
- Check compatibility across environments (structs, enums, functions must match)
- Return `MultiEnvResult` with per-environment configs for code generation

### GraphQL caching (`graphql/`)

The `graphql/` module provides:

- **`GraphQLClient`** (`client.rs`): fetches type origin tables from Sui's GraphQL API
- **`GraphQLCache`** (`cache.rs`): per-chain-id caching to avoid repeated queries
- **`types.rs`**: response type definitions

---

## Output layout (filesystem structure)

Paths are centralized in `generator/src/layout.rs`:

- `OutputLayout`: represents the output root and `_framework` path
- `PackageLayout`: represents one package output folder and computes “levels from root”

### Top-level vs dependency packages

Packages listed directly in `gen.toml` are considered **top-level** and are written under:

- `<out>/<package-name>/...` (kebab-case)

Transitive dependencies are written under:

- `<out>/_dependencies/<pkg-name>/...` (kebab-case, with `-1`, `-2` suffixes if names collide)

### Generated tree (typical)

```text
<out>/
  gen.toml                      (user-provided, not generated)
  .prettierignore               (generated - excludes gen dir from formatters)
  .eslintignore                 (generated - excludes gen dir from linters)
  _framework/                   (generated runtime support)
    loader.ts
    reified.ts
    util.ts
    vector.ts
    env.ts                      (environment management runtime)
    init-loader.ts
  _envs/                        (environment configurations)
    index.ts                    (registers envs, sets default, re-exports API)
    mainnet.ts                  (env-specific config)
    testnet.ts
  <top-level-pkg>/              (e.g. examples/)
    init.ts
    <module>/                   (kebab-case)
      structs.ts
      functions.ts              (top-level packages only)
  _dependencies/
    <pkg-name>/<module>/structs.ts
```

### Cleaning output

`--clean` calls `clean_output()` from `generator/src/io.rs` which removes everything under `<out>/` **except** `gen.toml`.

---

## Framework runtime (`_framework/`)

Framework sources live as editable files in `generator/framework/*.ts` and are embedded at compile time via `include_str!()` in:

- `generator/src/framework_sources.rs`

The driver writes these to `<out>/_framework/`:

- **`reified.ts`**: core reified type runtime (decode/encode/type checking)
- **`util.ts`**: TS utilities for parsing/compressing types and tx argument helpers
- **`loader.ts`**: runtime registry to load "reified classes" by type string
- **`vector.ts`**: `Vector<T>` implementation
- **`env.ts`**: environment management (registry, active env, getPublishedAt, getTypeOrigin)
- **`init-loader.ts`**: generated list of package init registrars

Environment configurations are written to `<out>/_envs/`:

- **`<env>.ts`**: per-environment config (mainnet.ts, testnet.ts, etc.) with package addresses and type origins
- **`index.ts`**: registers all envs, sets default from `[config].environment`, re-exports public API

---

## What gets generated per package

### `init.ts`

Generated by `ts_gen::gen_package_init` (`generator/src/ts_gen/init.rs`).

- Imports each module’s `structs.ts` as `import * as <ModuleAlias> from './<module>/structs'`
- Registers each struct class into the framework loader (`loader.register(...)`)

### `<module>/structs.ts`

Generated by `ts_gen::gen_module_structs` (`generator/src/ts_gen/builder.rs`).

- Includes **both structs and enums** for the module
- Uses a **coarse-grained IR** to generate deterministic TS output
- Emits:
  - Combined imports (deduped, grouped, ordered)
  - All struct bodies
  - All enum bodies

### `<module>/functions.ts`

Generated by `ts_gen::gen_module_functions` (`generator/src/ts_gen/builder.rs`), which delegates to `emit_functions_file(...)`.

Important behavior:

- **Only generated for top-level packages** (see `driver.rs`), since function bindings are primarily intended for app-facing packages.

---

## TS codegen architecture (IR → emitter)

The TS generator lives under `generator/src/ts_gen/`.

Design goal: **readable templates** and a **domain IR**, not a full TypeScript AST.

### Builders (Move model → IR)

Key builder entrypoints:

- `StructIRBuilder` and `EnumIRBuilder` in `generator/src/ts_gen/builder.rs`
- `FunctionIRBuilder` in `generator/src/ts_gen/builder.rs`

They traverse `move_model_2` datatypes and build an IR that is shaped for emission:

- **structs/enums**: `StructIR`, `EnumIR`, `FieldTypeIR`
- **functions**: `FunctionIR`, `ParamTypeIR`

They also:

- compute **import lists** for referenced datatypes
- compute boolean **import needs** (e.g. whether the module uses vectors, phantom args, etc.)
- compute **deterministic aliases** when two imports would collide by name but differ by path

### IR types (core)

In `generator/src/ts_gen/structs.rs`:

- `StructIR` and `FieldIR`
- `FieldTypeIR`:
  - `Primitive`
  - `Vector`
  - `Datatype { class_name, full_type_name, type_args, type_arg_is_phantom, kind }`
  - `TypeParam { name, index, is_phantom }`
- `DatatypeKind`: `Struct | Enum`

In `generator/src/ts_gen/functions.rs`:

- `FunctionIR`, `FunctionParamIR`, `FunctionStructImport`
- `ParamTypeIR` supports: primitives, vectors, structs (object inputs), options, type params, and special string/ID cases.

### Emitters (IR → TypeScript strings)

Emitters are template-based and mostly use `indoc::formatdoc!()`:

- `generator/src/ts_gen/structs.rs`: `StructIR::emit_body()` etc.
- `generator/src/ts_gen/enums.rs`: `EnumIR::emit_body()` etc.
- `generator/src/ts_gen/functions.rs`: `emit_functions_file(...)`

Production file generation is module-level:

- `gen_module_structs()` builds all IR first, then emits combined imports once, then emits all bodies.

For tests, we also expose `emit_module_structs_from_ir(...)` (see below).

### Additional ts_gen modules

- **`compat.rs`**: Environment compatibility checking - ensures structs, enums, and functions have matching signatures across all environments
- **`env_config.rs`**: Generates per-environment configuration files (`_envs/*.ts`) with package addresses and type origins
- **`init.rs`**: Generates `init.ts` files that register structs/enums with the loader
- **`imports.rs`**: Import path resolution and deduplication (see below)
- **`doc_utils.rs`**, **`jsdoc.rs`**: Documentation/JSDoc generation
- **`format.rs`**, **`utils.rs`**: Formatting and utility functions

---

## Import management + path resolution

The generator tries hard to keep imports:

- deterministic (stable order)
- minimal (deduped)
- readable (grouped by path, multi-line for big sets)

### `TsImportsBuilder`

Defined in `generator/src/ts_gen/imports.rs`:

- Tracks:
  - wildcard imports (`import * as X from '...'`)
  - named imports (`import { A, B as C } from '...'`)
- Uses `BTreeMap/BTreeSet` internally to guarantee stable ordering.

### `ImportPathResolver`

Also in `generator/src/ts_gen/imports.rs`.

Responsible for computing the relative import path to:

- another module in the same package (`../<module>/structs`)
- a top-level package from a top-level package (`../../<pkg>/<module>/structs`)
- a dependency package (`../../_dependencies/<pkg-name>/<module>/structs`)
- and the inverse direction when the current package is itself a dependency

### Alias / collision handling

When two datatypes share the same class name but come from different paths, builders create deterministic aliases and store them in `DatatypeImport.alias`, which emits:

- `import { Coin as CoinCustom } from '...'`
- `import { String as StringAscii } from '...'`

Collision behavior is regression-protected by snapshots in `generator/tests/snapshot_tests.rs`.

---

## Special types and JSON/BCS behavior

Some Move types are treated as “primitive-like” in JSON (they serialize as a scalar value rather than a nested struct object).

Examples:

- `0x1::string::String`
- `0x1::ascii::String`
- `0x1::ascii::Char`
- `0x1::type_name::TypeName`
- `0x2::object::ID` / `0x2::object::UID`
- `0x2::url::Url`

Key implementation detail:

- **Never match on `class_name` for these** (it can be aliased).
- Instead we carry **`full_type_name`** in `FieldTypeIR::Datatype` and match against that.

Helpers live in `generator/src/ts_gen/structs.rs` and are reused for enums:

- `is_primitive_like_type(full_type_name)`
- `is_option_type(full_type_name)` (`0x1::option::Option`)
- `is_balance_type(full_type_name)` (`0x2::balance::Balance`)

If you add a new special-cased type, update these helpers and add/extend snapshot coverage.

---

## Testing

### Integration tests

Integration tests for `model_builder` are in:

- `generator/tests/model_builder_integration.rs`

These tests verify the model building pipeline using fixture packages in `generator/tests/fixtures/`:

- **Published packages**: Have `Published.toml` with testnet metadata
- **Unpublished packages**: No `Published.toml`
- **Legacy packages**: Use old `Move.toml` format with `[addresses]` section

The tests verify:
- `id_map`: package address → name mapping
- `published_at`: original ID → published-at ID mapping
- `type_origin_table`: type → defining package resolution
- `version_table`: package version ordering
- `top_level_packages`: packages specified in gen.toml

**Performance optimization**: Tests use `OnceLock`-based caching to avoid rebuilding the model for each test. The cached data is extracted once and shared across 17 tests. Only 2 tests that need the full `Model` rebuild it.

Run integration tests:

```bash
cargo test --test model_builder_integration
```

### Snapshot tests

Snapshot tests are in:

- `generator/tests/snapshot_tests.rs`
- `generator/tests/snapshots/*.snap`

They use `insta` to snapshot:

- struct bodies (`StructIR::emit_body()`)
- enum bodies (`EnumIR::emit_body()`)
- module files (combined imports + many bodies) via `emit_module_structs_from_ir(...)`
- function files via `emit_functions_file(...)`

They also include invariant assertions for common regression patterns:

- no duplicate `| TransactionArgument`
- no duplicate `| null`
- correct import aliasing
- deterministic output (same input → identical output)

### Commands

Run only snapshot tests:

```bash
cargo test --test snapshot_tests
```

Review snapshot diffs:

```bash
cargo insta review
```

Accept snapshots after manual review:

```bash
cargo insta accept
```

---

## Where to change what (cookbook)

### Add support for a new field type in `structs.ts`

- **Builder**: update field/type lowering in `generator/src/ts_gen/builder.rs` (how Move types map into `FieldTypeIR`)
- **Emitter**: update emission logic in `generator/src/ts_gen/structs.rs` and/or `generator/src/ts_gen/enums.rs`
- **Imports**: ensure new runtime helpers are imported via `emit_combined_imports_with_enums(...)`
- **Tests**: add/extend IR fixtures + snapshots in `generator/tests/snapshot_tests.rs`

### Fix import path bugs

- Update `ImportPathResolver` in `generator/src/ts_gen/imports.rs`
- Add a module-level snapshot reproducer (so it won’t regress)

### Fix function parameter type unions (`TransactionArgument`, `null`, nested arrays)

- Update `ParamTypeIR::{to_ts_param_type,to_ts_base_type}` in `generator/src/ts_gen/functions.rs`
- Add a function-level snapshot that reproduces the exact type signature

### Edit the runtime framework (`_framework`)

- Edit TS sources in `generator/framework/*.ts`
- They are embedded by `generator/src/framework_sources.rs` and written by `driver.rs`

### Add new generation outputs

- Add filesystem paths via `generator/src/layout.rs`
- Write content in `generator/src/driver.rs` (usually inside `gen_packages_for_model(...)`)

---

## Determinism rules (important for snapshots)

- Prefer `BTreeMap/BTreeSet` (or explicit sorting) for anything that affects emitted ordering.
- Avoid iterating `HashMap` when output order matters.
- When adding imports, ensure they go through `TsImportsBuilder`.

---

## Testing workflow for code generation changes

When making changes to the TypeScript code generator, follow this test-driven workflow to ensure correctness and prevent regressions:

### 1. Create a test fixture (IR)

Build an IR fixture that reproduces the issue. For example:

```rust
fn make_struct_with_issue_ir() -> StructIR {
    StructIR {
        name: "MyStruct".to_string(),
        // ... field setup that demonstrates the bug
        uses_phantom_struct_args: true,
        // ...
    }
}
```

### 2. Add snapshot tests

Create both body and module-level snapshots:

```rust
#[test]
fn test_my_issue_snapshot() {
    let ir = make_struct_with_issue_ir();
    let output = ir.emit_body();
    insta::assert_snapshot!("my_issue", output);
}

#[test]
fn test_my_issue_module_snapshot() {
    let structs = vec![make_struct_with_issue_ir()];
    let output = emit_module_structs_from_ir(&structs, &[], "../../_framework");
    insta::assert_snapshot!("module__my_issue", output);
}
```

### 3. Add invariant tests (optional but recommended)

Catch specific bugs with assertions:

```rust
#[test]
fn test_no_unused_imports() {
    let output = emit_module_structs_from_ir(&structs, &[], "../../_framework");
    
    // Check that imports are actually used
    if output.contains("import { foo }") {
        assert!(output.contains("foo("), "foo is imported but never used");
    }
}
```

### 4. Run the failing test

```bash
cargo test --test snapshot_tests test_my_issue_snapshot
```

This will create a `.snap.new` file showing the current (broken) output.

### 5. Apply your fix

Make targeted changes to the generator code:
- `generator/src/ts_gen/builder.rs` - for import logic
- `generator/src/ts_gen/structs.rs` - for struct generation
- `generator/src/ts_gen/enums.rs` - for enum generation
- etc.

### 6. Review and accept snapshots

```bash
# See the diff
cargo insta review

# Or just accept all changes
cargo insta accept
```

### 7. Verify no regressions

```bash
# Run all snapshot tests
cargo test --test snapshot_tests

# Run full test suite
cargo test
```

### 8. (Optional) Regenerate examples to verify

Only after all tests pass:

```bash
# From ts/ directory
pnpm run gen:all       # Regenerate all (examples + tests)
pnpm run gen:example   # Regenerate examples only
```

