# sui-client-gen v0.5.0: Ready for What's Next

v0.5.0 is a major release that prepares sui-client-gen for Sui's evolving ecosystem:

- **New data interfaces** — Native support for gRPC and GraphQL clients alongside JSON-RPC
- **New package manager** — Built on `move_package_alt` with multi-environment support
- **Agentic coding ready** — Both the generator codebase and the generated SDKs are optimized for AI-assisted development, with comprehensive tests and dynamic environment switching for automated test suites

---

## Enum Support

Move 2024 Edition introduced enums in mid-2024, but sui-client-gen lagged behind. Users with enum types in their contracts couldn't use the tool, and newer versions of sui-framework (which now use enums internally) were incompatible.

v0.5.0 adds first-class enum support. All three variant types are handled:

- **Unit variants** — `enum Status { Active, Inactive }`
- **Struct variants** — `enum Action { Transfer { to: address, amount: u64 } }`
- **Tuple variants** — `enum Result { Ok(T), Err(u64) }`

Generated TypeScript includes full type discrimination, BCS encoding/decoding, and the same reified type patterns you're used to for structs.

---

## Multi-Environment Code Generation

Generate a single SDK that works across mainnet, testnet, devnet, localnet, or custom environments.

```typescript
import { setActiveEnv } from "./_envs";

setActiveEnv("mainnet");
// ... all SDK calls now use mainnet addresses

setActiveEnv("testnet");
// ... now using testnet addresses
```

### Why This Matters

**Dynamic environment switching** — Apps and wallets that operate across multiple networks can switch at runtime using the same generated code.

**Testing with ephemeral environments** — When you spin up a local test environment, you need all package IDs and type origins to point to your ephemeral deployment. This is critical for agentic coding workflows—the SDK can now be pointed at test deployments dynamically, enabling AI tools like Claude Code to run your test suite against fresh deployments.

**Native integration with sui_package_alt** — Environments are defined in your Move.toml and sui-client-gen reads them directly.

### Compile-Time Compatibility Checking

During generation, we verify that struct and function signatures are compatible across all environments. If there's a mismatch—say, a struct has different fields on mainnet vs testnet—generation fails with a clear error. This prevents subtle decoding bugs at runtime.

## But we're flexible where it makes sense: structs, enums, or functions that exist only in one environment (e.g., test helpers) are allowed. The compatibility check only fails on _conflicting_ definitions, not _missing_ ones.

## Comprehensive Test Coverage

v0.5.0 adds substantial test infrastructure:

- **168 Rust tests** covering model building and code generation
- **52 snapshot tests** for codegen output verification
- **75 TypeScript tests** for runtime behavior
- **8,692 lines** of new code in the ts_gen module alone

The snapshot tests are particularly valuable—they catch regressions in generated output without requiring slow integration tests that hit RPC endpoints.

---

## Architecture Refactor: IR-Based Code Generation

The biggest internal change in v0.5.0 is a complete rewrite of the code generation pipeline.

**Before:** We used [genco](https://github.com/udoprog/genco), a quasi-quoting library with Rust macros. The code was terse but esoteric—intimidating to contributors unfamiliar with Rust macro syntax.

**After:** A clean IR (Intermediate Representation) architecture that separates concerns:

```
              ┌─────────────────────┐
              │     Move Model      │
              │ structs/enums/funcs │
              └──────────┬──────────┘
                         │
         ┌───────────────┼───────────────┐
         ▼               ▼               ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │ TypeScript│   │   Rust    │   │  Python   │
   │    IR     │   │ (planned) │   │    ...    │
   └─────┬─────┘   └─────┬─────┘   └─────┬─────┘
         ▼               ▼               ▼
   ┌───────────┐   ┌───────────┐   ┌───────────┐
   │  .ts      │   │   .rs     │   │   .py     │
   │  files    │   │           │   │           │
   └───────────┘   └───────────┘   └───────────┘
```

### Why This Matters

**Readable code** — The IR layer is plain Rust structs. No macros, no magic. Contributors can understand and modify the codebase without deep Rust expertise.

**Testable** — IR enables snapshot testing at the right level of abstraction. We can test code generation without spinning up RPC connections or compiling Move packages.

**Agentic-friendly** — AI coding assistants are dramatically more effective with this architecture. Clear separation of concerns means the AI can focus on one layer at a time.

**Multi-language support** — The architecture paves the way for Rust SDK generation (planned for a future release). The Move model is shared; only the IR and emit layers are language-specific.

---

## JSDoc Documentation from Move Comments

Documentation comments in your Move source code now flow through to generated TypeScript:

```move
/// Creates a new liquidity pool with the given parameters.
/// Returns the pool object and LP tokens.
#[deprecated]
public fun create_pool<A, B>(/* ... */) { /* ... */ }
```

Becomes:

```typescript
/**
 * Creates a new liquidity pool with the given parameters.
 * Returns the pool object and LP tokens.
 * @deprecated
 */
export function createPool<A, B>(/* ... */) {
  /* ... */
}
```

This improves IDE autocomplete, hover documentation, and makes the generated SDK more discoverable.

---

## gRPC and GraphQL Client Support

The old JSON-RPC client is deprecated. The Sui ecosystem is moving to gRPC and GraphQL, and sui-client-gen is now ready.

The `.fetch()` method on generated structs now accepts any of:

- `SuiClient` (JSON-RPC, legacy)
- `SuiGrpcClient` (gRPC)
- `SuiGraphQLClient` (GraphQL)

```typescript
const pool = await Pool.fetch(grpcClient, poolId);
```

---

## Pre-Formatted Output with dprint

Generated TypeScript is now pre-formatted using dprint:

- No more running `lint:fix` after generation
- The `gen/` directory can be excluded from your project's linting/formatting
- Faster CI since there's less code to lint

---

## Migration to move_package_alt

Under the hood, sui-client-gen now uses Sui's new package manager (`move_package_alt`):

**Simplified model building** — Previously we maintained two separate dependency graphs: one for source packages, one for on-chain packages. The new package manager unifies this.

**Named addresses are package names** — This subtle change is central to dynamic environment switching. Generated code references packages by name rather than hardcoded addresses, enabling runtime address resolution.

**Future-proof** — The old package manager is being phased out. sui-client-gen is ready for what's next.

---

## publishedAt Overrides

Point your SDK at a newly upgraded contract without publishing a new SDK version:

```typescript
setActiveEnv("mainnet", {
  "my-package": "0xNEW_UPGRADED_ADDRESS",
});
```

This is particularly useful for wallets (Chrome extensions can't update instantly) and any scenario where you need to handle contract upgrades without redeploying your frontend.

---

## Additional Improvements

- **TypeScript isolatedDeclarations support** — For large codebases using `isolatedDeclarations` to speed up `.d.ts` generation
- **Typed JSON return types** — Full type safety for `toJSON()` methods on generated structs and enums
- **Old manifest detection** — The generator detects v0.4.x `gen.toml` format and shows migration instructions
