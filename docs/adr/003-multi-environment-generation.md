# ADR 003: Multi-Environment Code Generation

## Status

Accepted

## Context

Modern Sui applications face several environment-related challenges:

1. **Cross-environment operation**: Apps and wallets need to work across mainnet, testnet, devnet,
   and custom environments simultaneously, switching at runtime based on user selection

2. **Testing with ephemeral environments**: Automated testing (especially with agentic coding tools)
   requires spinning up temporary test environments where package addresses are assigned dynamically

3. **Package manager evolution**: The new `move_package_alt` package manager introduced environments
   as a first-class concept, with per-environment address resolution and dependency overrides

4. **Contract upgrades**: Upgraded contracts may have different `publishedAt` addresses across
   environments, requiring runtime address resolution

Prior to v0.5.0, sui-client-gen generated code hardcoded to a single environment. Users needed
separate SDK builds for mainnet vs testnet, and testing required manual address patching.

## Decision

Generate a single SDK that works across all environments defined in `gen.toml`:

```
gen.toml
├── [config]
│   └── environment = "mainnet"          # Default environment
├── [environments]
│   ├── mainnet = { graphql = "..." }    # Override for defaults
│   └── staging = { chain-id = "..." }   # Custom environment
└── [dep-replacements.staging]
    └── pkg = { published-at = "0x..." } # Environment-specific overrides
```

### Output Structure

```
_envs/
├── index.ts      # Environment registration and API exports
├── mainnet.ts    # Mainnet package configs + type origins
├── testnet.ts    # Testnet package configs + type origins
└── staging.ts    # Custom environment config
```

### Runtime API

```typescript
import { setActiveEnv, getPublishedAt, getTypeOrigin } from './_envs'

// Switch environment at runtime
setActiveEnv('testnet')

// SDK now uses testnet addresses automatically
const obj = await MyStruct.fetch(client, objectId)
```

### Per-Environment Type Origins

Each environment config includes its own type origin table:

```typescript
// _envs/mainnet.ts
export const mainnetEnv: EnvConfig = {
  packages: {
    "my-package": {
      originalId: '0xabc...',
      publishedAt: '0xdef...',
      typeOrigins: {
        'module::MyStruct': '0x123...'  // Where this type was first defined
      }
    }
  }
}
```

### Build-Time Architecture

```
gen.toml [environments] section
              │
              ▼
┌────────────────────────────────────────┐
│  For each environment:                 │
│  - Create move_package_alt loader      │
│  - Set environment-specific chain_id   │
│  - Build Move model                    │
│  - Query GraphQL for type origins      │
│  - Build id_map and published_at map   │
└────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  Compatibility checking (ADR-004)      │
│  - Compare struct/enum/function sigs   │
│  - Fail on mismatches                  │
└────────────────────────────────────────┘
              │
              ▼
┌────────────────────────────────────────┐
│  Generate output                       │
│  - IR from default environment         │
│  - _envs/<env>.ts for each env         │
│  - _envs/index.ts with registration    │
└────────────────────────────────────────┘
```

## Rationale

### Why build models for ALL environments?

Each environment may have:

- Different package addresses (deployed to different networks)
- Different type origins (due to separate upgrade histories)
- Different `publishedAt` addresses (pointing to different contract versions)

Building each environment's model ensures accurate address resolution.

### Why not just parameterize addresses at runtime?

Type origins cannot be parameterized—they're embedded in BCS-decoded type tags.
The SDK must know the exact defining address for each type in each environment.

### Why use named addresses instead of raw addresses in generated code?

Generated code references packages by name:

```typescript
const publishedAt = getPublishedAt('my-package')  // Not a hardcoded 0x...
```

This enables environment switching—the name resolves to different addresses
based on the active environment.

### Why integrate with move_package_alt environments?

`move_package_alt` already handles:

- Per-environment address assignment
- Dependency resolution with environment overrides
- Chain ID validation

Reusing this infrastructure avoids reimplementing the same logic and ensures
consistency between Move compilation and SDK generation.

### Why a default environment?

The generated IR (structs, enums, functions) comes from the default environment.
Other environments are checked for compatibility but don't contribute to code generation.

This ensures:

- Deterministic output (same gen.toml → same code)
- Clear source of truth for SDK structure
- Predictable behavior when environments differ

## Consequences

### Positive

- **Single SDK for all environments**: No need for separate mainnet/testnet builds
- **Runtime switching**: `setActiveEnv()` enables dynamic environment selection
- **Testing support**: Ephemeral test environments work with `publishedAtOverrides`
- **Move PM alignment**: Environments in gen.toml mirror environments in Move.toml
- **Compile-time safety**: Compatibility checking catches mismatches before runtime

### Negative

- **Longer generation time**: Each environment requires model building and GraphQL queries
- **Larger output**: Per-environment config files add to SDK size
- **Complexity**: More moving parts than single-environment generation
- **GraphQL dependency**: Type origins require GraphQL queries per environment

## Implementation

### Key Modules

| Module | Purpose |
|--------|---------|
| `manifest.rs` | Environment configuration parsing from gen.toml |
| `multi_env.rs` | Multi-environment model building orchestration |
| `ts_gen/env_config.rs` | Per-environment TypeScript config generation |
| `ts_gen/init.rs` | `_envs/index.ts` generation |

### Key Functions

- `collect_all_environments()` - Gathers all defined environments
- `multi_env_model_build()` - Builds models for all environments
- `gen_env_config()` - Generates per-environment config file
- `gen_envs_index()` - Generates index with registration

### GraphQL Queries

Type origins are fetched via GraphQL per environment:

```graphql
query TypeOrigins($pkg: SuiAddress!, $env: String!) {
  package(address: $pkg) {
    typeOrigins {
      module
      type
      definingId
    }
  }
}
```

Results are cached by chain ID to avoid redundant queries.

## References

- `generator/src/multi_env.rs` - Multi-environment orchestration
- `generator/src/manifest.rs` - Environment configuration
- `generator/src/ts_gen/env_config.rs` - Config generation
- `generator/framework/env.ts` - Runtime environment API
- `move_package_alt` environments: `~/.cargo/git/checkouts/sui-*/*/external-crates/move/crates/move-package-alt/src/environment.rs`
