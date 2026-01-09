# Docs

## gen.toml

`gen.toml` is the configuration file for the generator. It has the following sections:

### [config]

The configuration section for the generator:

```toml
[config]
environment = "testnet"              # Required: the environment to generate code for
graphql = "https://..."              # Optional: GraphQL endpoint override
output = "./out"                     # Optional: output directory (can also be set via CLI)
```

- `environment` - Required. The environment to generate code for. This determines the chain ID for validation and which addresses are used for package resolution. Can be:
  - Default environments: `mainnet` or `testnet`
  - Custom environment defined in `[environments]` section

- `graphql` - Optional. Override the GraphQL endpoint. Takes precedence over environment-specific endpoints.

- `output` - Optional. Output directory for generated code. Can be overridden via CLI with `-o/--out`.

### [packages]

The packages section lists packages to generate code for. The syntax is the same as dependencies in `Move.toml`:

```toml
[packages]
my_package = { local = "./path/to/package" }
git_package = { git = "https://github.com/org/repo", rev = "main", subdir = "packages/pkg" }
mvr_package = { r.mvr = "@namespace/package" }
onchain_package = { on-chain = true }
```

The dependency resolution works the same as in `Move.toml` -- if there are packages that transitively depend on the same package of a different version, this needs to be resolved by specifying overrides in `[dep-replacements.<env>]`.

### [environments]

Optional section for defining custom environments. Default environments (`mainnet`, `testnet`) don't need to be defined but can be listed to override their GraphQL endpoint.

```toml
[environments]
# Custom environment: chain-id required
staging = "abcd1234"                                              # String shorthand
staging_alt = { chain-id = "abcd1234", graphql = "https://..." }  # Full form with graphql

# Default environment override: only graphql allowed, no chain-id
testnet = { graphql = "https://my-testnet-endpoint.com/graphql" }
```

**Validation rules:**
- Custom environments MUST specify a `chain-id`
- Default environments (`mainnet`, `testnet`) CANNOT specify a `chain-id`
- The `environment` in `[config]` must exist in `[environments]` or be a default

### [dep-replacements.<env>]

Environment-scoped dependency replacements. These override how transitive dependencies are resolved for a specific environment:

```toml
[dep-replacements.staging]
# Override source location and use a different environment's Published.toml
some_dep = { local = "../other-version", use-environment = "testnet" }

# Override published addresses without changing source
other_dep = { published-at = "0x123...", original-id = "0x456..." }

# Mark as override dependency (for diamond dependency resolution)
diamond_dep = { git = "https://...", rev = "main", override = true }
```

Available fields:
- Source override: `local`, `git`, `r.mvr`, `on-chain` (same as [packages])
- `published-at` - Override the published-at address
- `original-id` - Override the original-id address
- `use-environment` - Use a different environment's Published.toml
- `rename-from` - Rename from a different package name
- `override` - Mark as override dependency (boolean)

## CLI Options

```
sui-client-gen [OPTIONS]

Options:
  -m, --manifest <PATH>     Path to gen.toml [default: ./gen.toml]
  -o, --out <PATH>          Output directory (overrides manifest config)
  -e, --environment <ENV>   Override environment from manifest
      --graphql <URL>       Override GraphQL endpoint
      --clean               Clean output directory before generating
```

## Overview of the generated code

The generated code has the following structure:

```
<root>
├── _dependencies
│    ├── move-stdlib
│    ├── sui-framework
│    └── ...
├── _framework
│    ├── env.ts
│    └── ...
├── _envs
│    ├── index.ts
│    ├── mainnet.ts
│    └── testnet.ts
├── <package>
│    ├── <module-1>
│    │   ├── functions.ts
│    │   └── structs.ts
│    ├── <module-2>
│    │   └── ...
│    └── init.ts
├── <other packages from gen.toml>
├── .prettierignore
└── .eslintignore
```

**`_framework`** directory contains functions and utilities required for the operation of the generated SDK, including the environment management runtime (`env.ts`).

**`_envs`** directory contains environment configurations and is the primary entry point for environment management:
- `index.ts` - Registers all environments, sets the default (from `[config].environment`), and re-exports the environment API
- `<env>.ts` - Environment-specific configuration files containing package addresses and type origins. One file is generated for **each environment** defined in `gen.toml`'s `[environments]` section.

**`_dependencies`** contains generated code of the direct and transitive dependencies of packages listed in `gen.toml`. Dependencies are organized by kebab-case package name (with `-1`, `-2` suffixes if names collide). While their contents are similar to those of listed packages, these are not intended to be imported or used directly as its APIs are not guaranteed to be stable and may change. Any package code that's intended to be used directly in the app should be listed in `gen.toml`.

Each **`<package>`** directory contains a separate directory for each of its modules and an `init.ts` file.

`init.ts` contains some internal initialization functionalities that are not intended to be used directly.

Each module directory further contains `functions.ts` and `structs.ts` corresponding to the functions and structs defined in the module.

**`.prettierignore`** and **`.eslintignore`** are generated to prevent linters and formatters from processing the generated code. The generated code is already properly formatted.

## Environment Switching

The generated SDK supports runtime environment switching, allowing you to use the same codebase for different networks (mainnet, testnet, custom environments).

### Auto-initialization

When you import anything from the generated code, the default environment (specified in `[config].environment` of your `gen.toml`) is automatically set. No manual initialization is required.

```ts
// Just import and use - default environment is already active
import { createBar } from './gen/examples/fixture/functions'
```

### Switching Environments

You can switch environments at runtime using `setActiveEnv()`:

```ts
import { setActiveEnv } from './gen/_envs'

// Switch to testnet
setActiveEnv('testnet')

// Switch to mainnet
setActiveEnv('mainnet')

// Switch to custom environment (must be defined in gen.toml [environments])
setActiveEnv('staging')
```

### Custom Environment Configuration

For advanced use cases, you can provide a custom environment configuration at runtime without pre-defining it in `gen.toml`:

```ts
import { setActiveEnvWithConfig, type EnvConfig } from './gen/_envs'

const customConfig: EnvConfig = {
  packages: {
    'my-package': {
      originalId: '0x123...',
      publishedAt: '0x456...',
      typeOrigins: {
        'main::MyStruct': '0x123...',
      },
    },
  },
  dependencies: {
    sui: {
      originalId: '0x2',
      publishedAt: '0x2',
      typeOrigins: {
        'object::UID': '0x2',
      },
    },
  },
}

setActiveEnvWithConfig(customConfig)
```

### Dynamic Address Overrides

When a smart contract is upgraded on-chain, you may need to point function calls to a new package address without regenerating code. Both `setActiveEnv()` and `setActiveEnvWithConfig()` accept an optional second parameter for address overrides:

```ts
import { setActiveEnv } from './gen/_envs'

// After contract upgrade, override the publishedAt address
setActiveEnv('mainnet', {
  'my-package': '0xNEW_ADDRESS_AFTER_UPGRADE',
})

// Now all function calls to 'my-package' use the new address
// Other packages remain unchanged
```

The overrides only affect `getPublishedAt()` lookups. When you call `setActiveEnv()` again without overrides, any previous overrides are cleared:

```ts
setActiveEnv('mainnet', { 'my-package': '0xOVERRIDDEN' })
// getPublishedAt('my-package') returns '0xOVERRIDDEN'

setActiveEnv('mainnet')
// getPublishedAt('my-package') returns the original address from the env config
```

### Querying Active Environment

```ts
import { getActiveEnvName, getActiveEnv, getRegisteredEnvs } from './gen/_envs'

// Get the name of the active environment
const envName = getActiveEnvName() // 'mainnet', 'testnet', 'custom', etc.

// Get the full config of the active environment
const config = getActiveEnv()

// List all registered environments
const envs = getRegisteredEnvs() // ['mainnet', 'testnet', ...]
```

### Environment Configuration Structure

Each environment configuration has the following structure:

```ts
interface EnvConfig {
  packages: Record<string, PackageConfig>
  dependencies: Record<string, PackageConfig>
}

interface PackageConfig {
  originalId: string      // Original package ID (version 1)
  publishedAt: string     // Current published-at address for function calls
  typeOrigins: Record<string, string>  // "module::TypeName" -> defining address
}
```

### Multi-Environment Generation and Compatibility

When you define multiple environments in `gen.toml`, the generator builds models for **all** environments and checks that they are compatible. This ensures the generated TypeScript code works correctly across all environments at runtime.

**What the generator checks:**
- **Structs**: Same field count, same field names, and compatible field types
- **Enums**: Same variant count, same variant names, and compatible variant types
- **Functions**: Same parameter count, same parameter names, and compatible parameter types

**What the generator allows (asymmetry):**
- A struct, enum, or function can exist in one environment but not another. At runtime, accessing missing items will fail with a clear error from `getPublishedAt()` or `getTypeOrigin()`.
- Extra fields or parameters in one environment (but not the other) will cause a compatibility error.

**Example error:**
```
Environment compatibility errors:
  - Struct 'dep::lib::DepStruct': field count mismatch (env_1: 1, env_2: 2)
```

This check prevents generating code that would compile but fail unexpectedly at runtime when switching environments.

## Functions

Function binding are generated for each function in packages listed in `gen.toml`, including non-public functions as these can be used with `devInspect` calls.

For each function, an `Args` interface is generated whose field names match function parameter names (for on-chain modules where they're generated based on parameter types since the names aren't available in the bytecode).

### Primitive parameters

In case of primitive types (`bool`, `u8`, `u16`, `u32`, `u64`, `u128`, `u256`, `address`), the values can be passed in directly. Here's how primitive Move types map to TS types in function bindings:

| Move                  | TS                              
| --------------------- | -----------
| `u8`, `u16`, `u32`    | `number`   
| `u64`, `u128`, `u256` | `bigint`   
| `bool`                | `boolean`  
| `address`             | `string`   

It's also possible to pass them in form of `TransactionArgument` which makes it possible to use the return values of previous calls as inputs to this call with a `TransactionBlock`.

### Object parameters

Passing in object references can be done with an ID string (e.g., `"0x12345"`), `ObjectCallArg`, or `TransactionArgument` (as defined in  `@mysten/sui.js`). This makes it composable with return values from other calls in the `TransactionBlock` and allows manual construction using `txb.object(...)`.

### Vectors

Vector arguments can also be passed in directly as TS arrays. When non-primitive types are used, the framework will internally convert the array using `txb.makeMoveVec`.

When the argument is passed in as `TransactionArgument` instead of an array, the value will be used as is and not converted using `makeMoveVec`. This makes it possible to pass in return values from previous calls in the `TransactionBlock` or construct arguments using `makeMoveVec` manually (this applies to vectors of primitive types also).

### Strings and ID

String types (`0x1::string::String` and `0x1::ascii::String`) and ID (`0x2::object::ID`) have special handling in that they can be passed in directly as a `string` (and not need to be constructed manually using related function calls). Similar to other types, they can also be passed in as `TransactionArgument` allowing for composability within a `TransactionBlock`.

### Option

Option type (`0x1::option::Option`) also has special handling in that the underlying value can be passed in directly and it will be automatically wrapped into `Option<T>` where passing in `null` corresponds to `none`. In the case of non-primitive types, this means that the framework will call `0x1::option::some` or `0x1::option:none` internally to do the wrapping (with primitive types this is not necessary as it will be done by the Sui runtime).

If the value is passed in as `TransactionArgument` no wrapping will be done and the argument will be used as is. This allows for the argument to be constructed manually and for composability with other function calls in the `TransactionBlock`.

In the case of option vectors `vector<Option<T>>`, if the value is passed in as array, the conversion described above will be applied to each element, while if it's passed in as `TransactionArgument` no conversion will be done and the argument will be used as is.

## Structs

There are multiple things generated for each struct.

First, each struct's bcs definition is registered with a global `bcs` object, which can be found under `_framework/bcs.ts`. It's OK to use it directly for deserialization but recommended to fork it with `new BCS(bcs)`.

Each struct also has an `is<struct name>` function generated that is used for checking whether the given type is the struct.

The `Fields` interface holds the field names and types of the struct. The `Fields` interface is also used as a constructor argument for the struct class.

Move field types are mapped to TS types as follows:

| Move                        | TS           |
| --------------------------- | ------------ |
| `u8`, `u16`, `u32`          | `number`     |
| `u64`, `u128`, `u256`       | `bigint`     |
| `bool`                      | `boolean`    |
| `address`                   | `string`     |
| `0x1::string::String`       | `string`     |
| `0x1::ascii::String`        | `string`     |
| `0x2::object::ID`           | `string`     |
| `0x2::object::UID`          | `string`     |
| `0x2::url::Url`             | `string`     |
| `0x1::option::Option<T>`    | `T \| null`   |
| `vector<T>`                 | `T[]`        |

The struct class holds the above fields as well as the `$typeName` and `$numTypeParams` static fields and the `$typeArgs` field in case the struct has type parameters. The `$typeName` field holds the full name of the type with the address but without type parameters (e.g., `0x2::balance::Balance` and not `0x2::balance::Balance<T>`).

The struct class can be instantiated in multiple ways:
- using the constructor by passing in the fields manually
- using the `fromFields` static method by passing in the fields as when decoded from bcs
- using the `fromFieldsWithTypes` static method by passing in the fields as returned by the RPC response with `showContent` option set to `true`
- using the `fromSuiParsedData` which is a wrapper around `fromFieldsWithTypes` that takes in the `content` field of the RPC response
- using the `fromBcs` static method by passing in the bcs bytes

For structs with the `key` ability, the `fetch` static method is also generated, which fetches the object from the chain by its ID.

## Design Doc

For more technical details and reasoning behind the design decisions, see the design doc https://github.com/kunalabs-io/sui-client-gen/issues/1.
