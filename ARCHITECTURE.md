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

  - **`rpc`**: optional RPC URL. If omitted, the generator uses `DEFAULT_RPC` (`generator/src/lib.rs`).

- **`[packages]`**
  - Each entry can be:
    - **Move dependency** (same schema as `Move.toml` dependencies via `move_package`):
      - `{ local = "..." }`
      - `{ git = "...", subdir = "...", rev = "...", override = true }` (and related Move fields)
    - **On-chain package**:
      - `{ id = "0x..." }`

Example (`ts/examples/gen/gen.toml`):

```toml
[config]
rpc = "https://fullnode.testnet.sui.io:443"

[packages]
Examples = { local = "../../../move/examples" }
Sui = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/sui-framework", rev = "mainnet-v1.62.1", override = true }
MoveStdlib = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/move-stdlib", rev = "mainnet-v1.62.1", override = true }
```

Current limitations (enforced in `model_builder.rs`):

- **No external deps** (Move “external” dependency kind) in `gen.toml`
- **No on-chain deps** specified via Move dependency kind (only `{ id = ... }` is supported)

---

## CLI entrypoint

The binary entrypoint is `generator/src/main.rs`:

- Parses args (`--manifest`, `--out`, `--clean`)
- Registers Sui Move package hooks (`SuiPackageHooks`)
- Calls `driver::run(RunOptions)`

### Running the generator locally (from this repo)

From the repo root:

```bash
# Generate into an output dir
cargo run -p sui-client-gen -- --manifest ./gen.toml --out ./gen --clean
```

To regenerate the checked-in example output (uses `ts/examples/gen/gen.toml`):

```bash
cargo run -p sui-client-gen -- --manifest ts/examples/gen/gen.toml --out ts/examples/gen --clean
```

Notes:

- **RPC is required** even for “source” packages because the generator tries to resolve type origin/version info from chain (it will warn + fall back if a package can’t be fetched).
- `--clean` deletes everything under `--out` except `gen.toml` (see `generator/src/io.rs`).

---

## Model building (Move packages → `move_model_2::Model`)

Model building is centralized in `generator/src/model_builder.rs`.
The driver can build **two independent models**:

- **Source model**: packages from local paths or git deps
- **On-chain model**: packages fetched from RPC by ID

### Source model (local/git)

Implemented in `build_source_model(...)`:

- Creates a temporary “stub” Move package (a minimal `Move.toml`) whose dependencies are the packages from `gen.toml`.
  - Local dependency paths are canonicalized relative to `gen.toml`.
- Uses Move build tooling to build a single `ResolvedGraph` for all requested packages.
  - Uses Sui flavor + implicit deps (`sui_move_build::implicit_deps(latest_system_packages())`)
  - Sets `skip_fetch_latest_git_deps = true` (so pin `rev` for git deps)
- Builds a Move model environment: `move_package::compilation::model_builder::build(...)`

Additional metadata computed for codegen:

- **`id_map`**: address → package name mapping derived by BFS over the `ResolvedGraph`
  - Used to determine which packages are “top-level” vs “dependencies” in output layout.
- **`published_at`**: original package ID → published-at ID (if available) via `gather_published_ids`
- **`type_origin_table`**: for each package, maps `module::Datatype` → origin package address
  - Prefer reading `type_origin_table` from the on-chain package object when possible
  - Falls back to “self-origin” if the on-chain package can’t be fetched
- **`version_table`**: maps each origin package address to its on-chain `SequenceNumber` (used for `PKG_V{N}` exports)

### On-chain model (RPC package IDs)

Implemented in `build_on_chain_model(...)`:

- Resolves “original package ID” for each requested package.
  - If the package is upgraded, the “original” is version 1 (or minimal version for system-upgraded framework packages).
- Traverses on-chain dependency graph via each package’s `linkage_table`:
  - Collects all reachable packages
  - Chooses the **highest upgraded version** for each original package ID
- Fetches raw modules (`SuiRawMovePackage.module_map`) via `PackageCache`
- Builds compiled model: `Model::from_compiled(&id_map, modules)`
- Computes `published_at`, `type_origin_table`, `version_table` similarly to the source model.

### RPC caching

`generator/src/package_cache.rs` provides `PackageCache`, a small RPC-side cache for `SuiRawMovePackage` objects to avoid repeated calls during:

- on-chain model graph traversal
- type origin / version resolution

---

## Output layout (filesystem structure)

Paths are centralized in `generator/src/layout.rs`:

- `OutputLayout`: represents the output root and `_framework` path
- `PackageLayout`: represents one package output folder and computes “levels from root”

### Top-level vs dependency packages

Packages listed directly in `gen.toml` are considered **top-level** and are written under:

- `<out>/<package-name>/...`

Transitive dependencies are written under:

- `<out>/_dependencies/source/<0xaddr>/...` for source deps
- `<out>/_dependencies/onchain/<0xaddr>/...` for on-chain deps

### Generated tree (typical)

```text
<out>/
  gen.toml                      (user-provided, not generated)
  .eslintrc.json                (generated)
  _framework/                   (generated runtime support)
    loader.ts
    reified.ts
    util.ts
    vector.ts
    init-loader.ts
  <top-level-pkg>/              (e.g. examples/)
    index.ts
    init.ts
    <module>/                   (kebab-case)
      structs.ts
      functions.ts              (top-level packages only)
  _dependencies/
    source/<0xaddr>/<module>/structs.ts
    onchain/<0xaddr>/<module>/structs.ts
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
- **`loader.ts`**: runtime registry to load “reified classes” by type string
- **`vector.ts`**: `Vector<T>` implementation
- **`init-loader.ts`**: generated list of package init registrars (source + onchain)

---

## What gets generated per package

### `index.ts`

Generated by `ts_gen::gen_package_index` (`generator/src/ts_gen/utils.rs`).

Exports:

- **`PACKAGE_ID`**: original package ID
- **`PUBLISHED_AT`**: published-at package ID (may differ if upgraded)
- **`PKG_V{N}`** (non-system packages only): published-at ID for each on-chain version discovered

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
- a dependency package (`../../_dependencies/<source|onchain>/<addr>/<module>/structs`)
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

## Testing and snapshots

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
