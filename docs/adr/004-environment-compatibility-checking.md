# ADR 004: Environment Compatibility Checking

## Status

Accepted

## Context

With multi-environment code generation (ADR-003), a single SDK serves multiple environments.
This creates a potential problem: what if the same struct or function has different signatures
across environments?

Consider:

```move
// On mainnet (deployed months ago)
struct UserProfile {
    name: String,
    email: String,
}

// On testnet (recently deployed with new field)
struct UserProfile {
    name: String,
    email: String,
    avatar_url: Option<String>,  // New field!
}
```

If the generated SDK assumes testnet's 3-field struct, it will fail to decode mainnet objects.
Conversely, SDK code assuming mainnet's 2-field struct will miss testnet data.

The challenge: **balance flexibility with safety**.

- **Flexibility**: Allow environment-specific features (test-only structs, staging functions)
- **Safety**: Prevent runtime failures from structural mismatches

## Decision

Implement **asymmetric compatibility checking** with strict matching on shared items:

### Rule 1: Missing Items Are Allowed

If a struct/enum/function exists in some environments but not others, this is permitted:

```
Mainnet:  [StructA, StructB]
Testnet:  [StructA, StructB, TestHelper]  ✓ OK - TestHelper only on testnet
```

This allows:

- Test-only utilities that don't exist on mainnet
- Staged features not yet deployed to production
- Environment-specific integrations

### Rule 2: Shared Items Must Match Exactly

If an item exists in multiple environments, its signature must be identical:

```
Mainnet:  struct Foo { a: u64, b: String }
Testnet:  struct Foo { a: u64, b: String }     ✓ OK - exact match

Mainnet:  struct Bar { x: u64 }
Testnet:  struct Bar { x: u64, y: u64 }        ✗ FAIL - field count differs
```

Checked properties:

- **Structs**: Field count, field names, field types, type parameter count, phantom status
- **Enums**: Variant count, variant names, variant field compatibility
- **Functions**: Parameter count, parameter names, parameter types, type parameter count

### Rule 3: Type Names Compared by Suffix

Package addresses differ across environments, so type comparisons ignore the address prefix:

```
Mainnet type: 0xabc::module::MyStruct
Testnet type: 0xdef::module::MyStruct

Comparison:   module::MyStruct == module::MyStruct  ✓ Match
```

The `extract_type_suffix()` function strips the package address for comparison.

### Rule 4: Report All Errors at Once

When incompatibilities are found, all errors are collected and reported together:

```
Error: Environment compatibility check failed

Struct 'UserProfile' incompatible between mainnet and testnet:
  - Field count mismatch: mainnet has 2, testnet has 3
  - Type mismatch for field 'status': mainnet has 'u8', testnet has 'u64'

Function 'init_pool' incompatible between mainnet and staging:
  - Parameter count mismatch: mainnet has 3, staging has 4
```

This helps developers fix all issues in one iteration rather than repeatedly.

## Rationale

### Why allow missing items?

Real-world scenarios require environment-specific code:

1. **Testing**: `TestHelper` structs and `mock_*` functions that only exist in test envs
2. **Staged rollouts**: Features deployed to staging before mainnet
3. **Environment utilities**: `DevnetFaucet` functions that don't make sense on mainnet

Requiring all items to exist everywhere would be too restrictive.

### Why require exact matches for shared items?

Structural differences cause subtle runtime bugs:

- **BCS decoding fails**: Extra/missing fields corrupt deserialization
- **Type tag mismatches**: Wrong type origins cause transaction failures
- **Silent data loss**: Missing fields decoded as defaults without warning

Compile-time checking catches these before deployment.

### Why compare type suffixes instead of full type names?

The same logical type has different addresses per environment:

```
Mainnet Coin<0x2::sui::SUI>
Testnet Coin<0x2::sui::SUI>      # Same 0x2 because it's a system package

Mainnet MyToken<0xabc::token::T>
Testnet MyToken<0xdef::token::T>  # Different addresses for user packages
```

Comparing full type names would flag every type as incompatible.
Suffix comparison (`token::T == token::T`) captures logical equivalence.

### Why batch error reporting?

Single-error-at-a-time wastes developer time:

1. Run generator → see error A
2. Fix A, run again → see error B
3. Fix B, run again → see error C
4. ...

Batch reporting shows A, B, C together for one fix cycle.

## Consequences

### Positive

- **Flexibility**: Test-only features don't pollute mainnet SDK
- **Safety**: Structural mismatches caught at generation time
- **Developer experience**: All errors shown at once
- **Determinism**: Default environment drives code generation

### Negative

- **Complexity**: Additional validation pass required
- **Asymmetric understanding**: Users must understand "missing OK, mismatch bad"
- **False negatives**: Suffix comparison could miss some logical type differences
- **Performance**: Compatibility checking adds generation time

## Implementation

### Core Module

`generator/src/ts_gen/compat.rs` - All compatibility checking logic

### Key Functions

| Function | Purpose |
|----------|---------|
| `check_struct_compatibility()` | Compare struct field signatures |
| `check_enum_compatibility()` | Compare enum variant signatures |
| `check_function_compatibility()` | Compare function parameter signatures |
| `extract_type_suffix()` | Strip package address from type name |
| `collect_compat_errors()` | Aggregate errors across all environments |

### Checking Flow

```rust
// In multi_env.rs
let compat_errors = check_compatibility(
    &default_ir_snapshot,
    &other_env_ir_snapshots,
);

if !compat_errors.is_empty() {
    return Err(format_compat_errors(&compat_errors));
}
```

### IR Snapshots

Compatibility checking extracts "snapshots" from IR:

```rust
struct StructSnapshot {
    name: String,
    field_names: Vec<String>,
    field_types: Vec<String>,  // Suffix only
    type_params: Vec<(String, bool)>,  // (name, is_phantom)
}
```

These snapshots are compared across environments without full IR details.

## References

- `generator/src/ts_gen/compat.rs` - Compatibility checking implementation
- `generator/src/multi_env.rs` (lines 257-269) - Where checking is invoked
- ADR-003 - Multi-environment generation (context for this ADR)
