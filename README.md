# sui-client-gen

A tool for generating TS SDKs for Sui Move smart contracts. Supports code generation both for source code and on-chain packages with no IDLs or ABIs required.

## Caveats
- When specifying both source and on-chain packages, the generator will currently generate two separate dependency graphs (one for on-chain and one for source). This is due to a technical detail and will be resolved in a future version so that only a single dependency graph is generated (https://github.com/kunalabs-io/sui-client-gen/issues/1#issuecomment-1554754842).
- Since whitespace detection relies on some Rust nightly features which are currently unstable (https://github.com/udoprog/genco/issues/39#issuecomment-1569076737), the generated code is not formatted nicely. Usage of formatters on the generated code (e.g., `prettier`, `eslint`) is recommended.
- Because ESLint renames some types (e.g., `String` -> `string`) due to the `@typescript-eslint/ban-types` rule which breaks the generated code, an `.eslintrc.json` file is generated in the root directory to turn off this rule.
- When re-running the generator, the files generated on previous run will *not* be automatically deleted in order to avoid accidental data wipes. The old files can either be deleted manually before re-running the tool (it's safe to delete everything aside from `gen.toml`) or by running the generator with `--clean` (use with caution).

## Quick Start

1) Install the generator by either:
   - `cargo install --locked --git https://github.com/kunalabs-io/sui-client-gen.git`
   - or downloading a binary from https://github.com/kunalabs-io/sui-client-gen/releases/

3) Create a new directory and in it a `gen.toml` file like so:

```toml
[config]
# will be set to mainnet by default if omitted
rpc = "https://fullnode.devnet.sui.io:443"

[packages]
# based on source code (syntax same as in Move.toml):
DeepBook = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/deepbook", rev = "releases/sui-v1.4.0-release" }
AMM = { local = "../move/amm" }
# an on-chain package:
FooPackage = { id = "0x12345" }
```

3) Run the generator from inside the directory: `sui-client-gen`
4) Run the linter / formatter on the generated code: `pnpm eslint . --fix`

## Usage Examples

### Import generated functions and structs
```ts
import { faucetMint } from './gen/fixture/example-coin/functions'
import { createPoolWithCoins } from './gen/amm/util/functions'
import { createExampleStruct, specialTypes } from './gen/examples/examples/functions'
import { Pool } from './gen/amm/pool/structs'
```

### Create an AMM pool
```ts
const txb = new TransactionBlock()

const [suiCoin] = txb.splitCoin(tx.gas, [tx.pure(1_000_000)])
const exampleCoin = faucetMint(txb, FAUCET_ID)

const lp = createPoolWithCoins(
    txb,
    ['0x2:sui::SUI', `${EXAMPLE_PACKAGE_ID}::example_coin::EXAMPLE_COIN`],
    {
        registry: REGISTRY_ID, // or txb.object(REGISTRY_ID)
        initA: suiCoin,
        initB: exampleCoin,
        lpFeeBps: 30n, // or txb.pure(30n)
        adminFeePct: 10n // or txb.pure(10n)
    }
)
tx.transferObjects([lp], txb.pure(addresss))

await signer.signAndExecuteTransactionBlock({ transactionBLock: txb })
```

### Fetch Pool object
```ts
const pool = await Pool.fetch(provider, POOL_ID)

// alternatively
const res = await provider.getObject({ id: POOL_ID, options: { showContent: true } })
const pool = Pool.fromSuiParsedData(res.data.content)

console.log(pool)
```

### Special types

```ts
const e1 = createExampleStruct(txb)
const e2 = createExampleStruct(txb)

specialTypes(txb, {
    asciiString: 'example ascii string', // or txb.pure('example ascii string', BCS.STRING)
    utf8String: 'example utf8 string', // or txb.pure('example utf8 string', BCS.STRING)
    vectorOfU64: [1n, 2n], // or txb.pure([1n, 2n], 'vector<u64>')
    vectorOfObjects: [e1, e2], // or txb.makeMoveVec({ objects: [e1, e2], type: ExampleStruct.$typeName })
    idField: '0x12345', // or txb.pure(normalizeSuiAddress('0x12345'), BCS.ADDRESS)
    address: '0x12345', // or txb.pure(normalizeSuiAddress('0x12345'), BCS.ADDRESS)
    optionSome: 5n, // or txb.pure([5n], 'vector<u64>')
    optionNone: null, // or txb.pure([], 'vector<u64>')
})
```

## Docs

For more detailed usage documentation, check out the [docs](https://github.com/kunalabs-io/sui-client-gen/blob/master/DOC.md).
For technical details on the internals and reasoning behind the design decisions, check out the [design doc](https://github.com/kunalabs-io/sui-client-gen/issues/1).
