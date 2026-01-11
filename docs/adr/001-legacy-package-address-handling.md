# ADR 001: Legacy Package Address Handling in id_map

## Status

Accepted

## Context

When generating TypeScript code from Move packages, we need to map package addresses
to folder names. The `id_map` (`BTreeMap<AccountAddress, PackageName>`) serves this purpose.

Legacy Move packages (those using the old package format without `published-at` metadata)
present a challenge:

- Their package name in Move.toml may be PascalCase (e.g., "ScallopPool")
- Their address name in `[addresses]` is snake_case (e.g., "scallop_pool")
- `move_package_alt` returns "unnamed_legacy_package" as the package name for these

This caused "Missing folder name for package 0x..." panics when address lookup failed.

## Decision

For building `id_map`, we use different strategies based on package type:

### Named Packages (not "unnamed_legacy_package")

- Look up by package name in `named_addresses()`
- Fall back to snake_case version of package name (e.g., "ScallopPool" → "scallop_pool")
- Use the package name as the `id_map` value

### Legacy Packages ("unnamed_legacy_package")

- Iterate through ALL `Defined` addresses in `named_addresses()`
- Use the address name directly as the `id_map` value
- This captures the package's own address AND its dependencies

## Rationale

### Why not use `model.packages()`?

The Move model (`move_model_2`) only includes packages with compiled source code. On-chain
dependencies (fetched as bytecode) are not in the model but ARE in `root_pkg.packages()`.

We need ALL dependencies in `id_map`, not just the ones that were compiled locally.

### Why iterate ALL addresses for legacy packages?

Legacy packages see a "flattened" view of all transitive addresses via `named_addresses()`.
The package's own address doesn't have a special marker—it's just one of many `Defined`
addresses. There's no reliable way to distinguish the package's "own" address from its
dependencies' addresses.

### Why is this safe?

`move_package_alt` enforces global address consistency via `legacy_insert_unique_or_error`:

- Same address name MUST map to same address value across the dependency graph
- Conflicts cause build errors before code generation even starts

This guarantee means:

- `std = 0x1` will always be `std = 0x1` everywhere in the dependency graph
- No risk of conflicting mappings from different packages
- Processing order doesn't matter—same address always gets same name

### Why use address names (snake_case)?

`package_import_name()` uses `from_case(Case::Snake).to_case(Case::Kebab)`:

- `scallop_pool` → `scallop-pool` ✓
- `ScallopPool` → `scalloppool` ✗

Using snake_case address names ensures correct kebab-case folder names for TypeScript imports.

## Consequences

### Positive

- Legacy packages like ScallopPool work correctly
- Folder names are properly kebab-cased
- Import paths resolve correctly across all generated code
- No special-casing for specific packages

### Negative

- For legacy packages, we add more entries to `id_map` than strictly necessary
  (dependencies get added multiple times, but with consistent values—this is harmless)
- Relies on `move_package_alt`'s consistency guarantee (which is enforced at build time)

## Implementation

See `generator/src/model_builder.rs`, function `build_id_map_from_root_pkg()`.

## References

- `move_package_alt` source: `~/.cargo/git/checkouts/sui-*/*/external-crates/move/crates/move-package-alt/`
- `graph/package_info.rs`: `legacy_named_addresses()`, `legacy_insert_unique_or_error()`
- `legacy/legacy_parser.rs`: `NO_NAME_LEGACY_PACKAGE_NAME = "unnamed_legacy_package"`
