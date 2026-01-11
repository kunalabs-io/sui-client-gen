# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**sui-client-gen** is a TypeScript SDK code generator for Sui Move smart contracts. It generates type-safe TypeScript client SDKs from Move source code or on-chain packages with no IDLs or ABIs required.

## Build Commands

### Rust Generator

```bash
# Build
cargo build --release

# Run all tests
cargo test

# Run snapshot tests only
cargo test --test snapshot_tests

# Run model_builder integration tests
cargo test --test model_builder_integration

# Review snapshot diffs
cargo insta review

# Accept snapshots after review
cargo insta accept

# Run the generator (slow - avoid during iteration)
cargo run -p sui-client-gen -- --manifest ./gen.toml --out ./gen --clean
```

### TypeScript (from ts/ directory)

```bash
pnpm install
pnpm run build:example    # Build example project
pnpm run check            # TypeScript type check
pnpm run lint             # ESLint
pnpm run lint:fix         # ESLint with auto-fix
pnpm run test             # Run vitest (single run)
pnpm run test:watch       # Run vitest in watch mode
```

**Slow commands - avoid during iteration:**
```bash
pnpm run gen:example      # Regenerate example code
pnpm run gen:all          # Regenerate all
```

## Architecture

### Pipeline Overview

```
gen.toml + RPC/GraphQL access
    ↓
Model Building (move_package_alt + move_model_2)
  ├─ Source packages (local/git) → move_package_alt resolution
  ├─ Published packages → Published.toml metadata + GraphQL type origins
  └─ On-chain packages (RPC IDs) → Fetch + parse bytecode
    ↓
Coarse-grained IR (StructIR, EnumIR, FunctionIR)
    ↓
TypeScript Emission
    ↓
Output: _framework/, <package>/, _dependencies/
```

### Key Modules (in generator/src/)

| Module | Purpose |
|--------|---------|
| `driver.rs` | Main orchestrator |
| `model_builder.rs` | Builds Move models using move_package_alt + move_model_2 |
| `manifest.rs` | Parses `gen.toml` configuration |
| `multi_env.rs` | Multi-environment model building with compatibility checking |
| `graphql/` | GraphQL client and per-chain-id cache for type origin queries |
| `ts_gen/builder.rs` | IR construction (Move → StructIR/EnumIR/FunctionIR) |
| `ts_gen/structs.rs` | Struct/field type emission |
| `ts_gen/enums.rs` | Enum emission |
| `ts_gen/functions.rs` | Function binding emission |
| `ts_gen/imports.rs` | Import path resolution & deduplication |
| `ts_gen/env_config.rs` | Environment configuration generation |
| `ts_gen/compat.rs` | Environment compatibility checking (struct/enum/function) |
| `package_cache.rs` | RPC-side cache for on-chain packages |
| `layout.rs` | Output filesystem structure |
| `framework_sources.rs` | Embeds `framework/*.ts` runtime files |

### Output Structure

```
<out>/
  _framework/           # Runtime helpers (reified.ts, loader.ts, util.ts, vector.ts, env.ts)
  _envs/                # Environment configs (sibling to _framework/)
    index.ts            # Registers envs, sets default, re-exports env API
    <env>.ts            # e.g., mainnet.ts, testnet.ts (from gen.toml [environments])
  <top-level-pkg>/      # Packages from gen.toml (kebab-case)
    init.ts             # Loader registration
    <module>/
      structs.ts        # Struct/enum classes
      functions.ts      # Function bindings (top-level only)
  _dependencies/
    <pkg-name>/         # Dependency structs by kebab-case package name
                        # (if name collision: pkg-name-1, pkg-name-2, etc.)
```

## Testing Workflow for Code Generation Changes

**Use snapshot tests for fast iteration, not full regeneration.**

1. **Create IR fixture** that reproduces the issue in `generator/tests/snapshot_tests.rs`
2. **Add snapshot test** using `insta::assert_snapshot!()`
3. **Run failing test**: `cargo test --test snapshot_tests test_name`
4. **Apply fix** in the relevant `generator/src/ts_gen/` module
5. **Review snapshots**: `cargo insta review`
6. **Accept**: `cargo insta accept`
7. **Verify**: `cargo test`

**Avoid running `gen:example`, `gen:all`, or full generator during iteration** - these are slow (require RPC calls, Move compilation). Only run them after all snapshot tests pass for final verification.

## Critical Implementation Notes

- **Determinism**: Use `BTreeMap/BTreeSet` for anything affecting output order (not `HashMap`)
- **Special types**: Match on `full_type_name` not `class_name` to detect special types (String, ID, Option, etc.) - class names can be aliased
- **Import collisions**: When two datatypes share the same name from different paths, create deterministic aliases
- **Framework runtime**: Edit TS sources in `generator/framework/*.ts`, they're embedded via `include_str!()`

## Key Concepts

- **Reified types**: Runtime type-safe representation of structs with type parameters; core to the SDK's type safety
- **gen.toml**: Configuration file specifying packages to generate (source: local/git, on-chain: id)
- **Type Origin Table**: Maps struct definitions to their original defining package (handles upgrades)
- **Phantom types**: Generic parameters that don't require runtime data
- **Environment configuration**: Runtime environment switching via `_envs/` - supports mainnet/testnet/custom envs with different package addresses
- **Multi-environment generation**: Builds models for ALL environments in gen.toml, checks compatibility, generates `_envs/<env>.ts` for each. Fails with helpful errors if struct/enum/function signatures differ between environments.

## Sui Framework Pinning

All Sui dependencies are pinned to `mainnet-v1.62.1` revision for stability.

## Investigating Upstream Dependencies

When you need to understand how upstream Rust dependencies work (e.g., `move_package_alt`, `move_model_2`), look into their source code:

- **Cargo cached sources**: `~/.cargo/registry/src/` for crates.io packages
- **Git checkouts**: `~/.cargo/git/checkouts/` for git dependencies

Key upstream crates to investigate for this project:
- `move-package-alt`: Package resolution, Published.toml handling, environment support
- `move-model-2`: Move type system, struct/function definitions

Use this to clarify behavior, debug issues, or understand APIs that aren't well documented.

## Architecture Decision Records

Significant design decisions are documented in `docs/adr/`. Key ADRs:

- **ADR-001**: Legacy package address handling in `id_map` - explains how `model_builder.rs`
  handles packages that `move_package_alt` identifies as `"unnamed_legacy_package"`
