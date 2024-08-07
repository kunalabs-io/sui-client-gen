# sui-client-gen

A tool for generating TS SDKs for Sui Move smart contracts. Supports code generation both for source code and on-chain packages with no IDLs or ABIs required.

## Quick Start

1. Install the generator by either:

   - `cargo install --locked --git https://github.com/kunalabs-io/sui-client-gen.git` (you might have to install some [build dependencies](https://docs.sui.io/guides/developer/getting-started/sui-install#all-linux-prerequisites))
   - or downloading a binary from https://github.com/kunalabs-io/sui-client-gen/releases/

2. Create a new directory and in it a `gen.toml` file like so:

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

3. Run the generator from inside the directory: `sui-client-gen`
4. Run the linter / formatter on the generated code: `pnpm eslint . --fix`

## Usage Examples

### Import generated functions and structs

```ts
import { faucetMint } from "./gen/fixture/example-coin/functions";
import { createPoolWithCoins } from "./gen/amm/util/functions";
import {
  createExampleStruct,
  specialTypes,
} from "./gen/examples/examples/functions";
import { Pool } from "./gen/amm/pool/structs";
```

### Create an AMM pool

```ts
const tx = new Transaction();

const [suiCoin] = tx.splitCoin(tx.gas, [1_000_000n]);
const exampleCoin = faucetMint(tx, FAUCET_ID);

const lp = createPoolWithCoins(
  tx,
  ["0x2:sui::SUI", `${EXAMPLE_PACKAGE_ID}::example_coin::EXAMPLE_COIN`],
  {
    registry: REGISTRY_ID, // or tx.object(REGISTRY_ID)
    initA: suiCoin,
    initB: exampleCoin,
    lpFeeBps: 30n, // or tx.pure.u64(30n)
    adminFeePct: 10n, // or tx.pure.u64(10n)
  }
);
tx.transferObjects([lp], tx.pure.address(addresss));

await client.signAndExecuteTransaction({
  transaction: tx,
  signer,
});
```

### Fetch Pool object

```ts
import { EXAMPLE_COIN } from "./gen/my-coin/example-coin/structs";
import { SUI } from "./gen/sui/sui/structs";

// see following section for explanation about "reified"
const poolReified = Pool.r(SUI.p, EXAMPLE_COIN.p); // or Pool.reified(SUI.phantom(), EXAMPLE_COIN.phantom())

const pool = await poolReified.fetch(client, POOL_ID);

// alternatively
const res = await client.getObject({
  id: POOL_ID,
  options: { showContent: true },
});
const pool = poolReified.fromSuiParsedData(res.data.content);

console.log(pool);
```

### Reified

The structs code generated by `sui-client-gen` is fully type safe, including for structs with type parameters (generics). This means that:

- when loading objects from external sources (e.g. from the chain via the `fetch` call), the type of the object is checked against the type parameter at runtime
- object's generic fields are also type inferred, so the type of the field is known statically at compile time, including for any number of nested generic fields or vectors

This is achieved by using the so-called "reified" types. For example, the `Pool` struct has two phantom type parameters, `A` and `B`, which represent the types of the two assets in the pool. Its Move definition looks like this:

```move
struct Pool<phantom A, phantom B> has key { ... }
```

So when the generator is run, it will generate classes for each type defined in the package, including for the `Pool` struct. The `Pool` class on its cannot be instantiated directly, but instead has to be "reified" with the types of the assets in the pool.
This is done by calling the `Pool.r` (shorthand for `Pool.reified`) method, which returns a new class with the type parameters filled in:

```ts
const reified = Pool.r(SUI.p, EXAMPLE_COIN.p);

// alternatively
const reified = Pool.reified(SUI.phantom(), EXAMPLE_COIN.phantom());
// in case of phantom parameters we can also pass in arbitrary types as strings:
const reified = Pool.reified(
  phantom("0x2::sui::SUI"),
  phantom(`${EXAMPLE_PACKAGE_ID}::example_coin::EXAMPLE_COIN`)
);
```

The `reified` class can then be used to fetch objects from the chain (or other things, such as decoding it from BCS or serialized JSON), which will be checked against the type parameters at runtime and decoded:

```ts
const pool = await reified.fetch(client, POOL_ID);
const pool = reified.fromBcs(bcsBytes);
const pool = reified.fromJSON(jsonData);
```

In case our struct recieves non-phantom type parameters, we need to pass in the reified types as instead of phantom. For example, the `ExampleStruct` struct has a non-phantom type parameter `T`:

```move
struct ExampleStruct<T> has key { ... }
```

So when reifying it, we need to pass in reified types as arguments. For example, this will construct a reified type for `ExampleStruct` with `T` set to `Pool` (concretely, `ExampleStruct<Pool<SUI, EXAMPLE_COIN>>`):

```ts
const reified = ExampleStruct.r(Pool.r(SUI.p, EXAMPLE_COIN.p));
```

Now when we fetch an object of type `ExampleStruct<Pool<SUI, EXAMPLE_COIN>>` from the chain by ID, its type will be checked against the type parameter `T` at runtime (so that we're not accidentally fetching an object of different type), and the inherent generic field, in this case `Pool`, will be correctly decoded and statically inferred.

#### Wrapping reified types in higher level classes

For each struct, the generator will also generate a handy type alias for the reified type, which can be used to wrap the reified type in a higher level class. For example, the `Pool` struct has `PoolReified` alias generated for it.

So now a higher level class that wraps the reified type can be defined like so:

```ts
import { PhantomTypeArgument } from "./gen/_framework/reified"; // it's TypeArgument for non-phantom types
import { PoolReified } from "./gen/amm/pool/structs";

class PoolWrapper<
  A extends PhantomTypeArgument,
  B extends PhantomTypeArgument
> {
  readonly reified: PoolReified<A, B>;

  constructor(reified: PoolReified<A, B>) {
    this.reified = reified;
  }
}
```

And then used like so with the type inferrence being carried over to the higher level class:

```ts
const poolWrapper = new PoolWrapper(Pool.r(SUI.p, EXAMPLE_COIN.p));
```

And if for whatever reason we don't want to define our wrapper classes as generic, we can use the `PhantomTypeArgument` (or `TypeArgument` for non-phantom) type to define them as non-generic (which will sever the type inferrence):

```ts
class PoolWrapper {
  readonly reified: PoolReified<PhantomTypeArgument, PhantomTypeArgument>;

  constructor(reified: PoolReified<PhantomTypeArgument, PhantomTypeArgument>) {
    this.reified = reified;
  }
}
```

#### Loader

In some situations it may be more convenient to load reified types using a type string instead of passing in reified types as arguments. This can be done by calling `loader.reified(type: string)`:

```ts
import { loader } from "./gen/_framework/loader";

const reified = loader.reified(
  "0x555::pool::Pool<0x2::sui::SUI, 0x666::example_coin::EXAMPLE_COIN>"
);
```

This can be useful in situations where the type is not known at compile time. The loaded reified type can then be used in the same way as before.

Note that if the type is using non-phantom type parameters (generics), the corresponding structs must be available in the generated dependency graph (listed in `gen.toml` or a transitive depencency) otherwise it will fail due to missing definitions. Same goes for the type itself.

### Function binding special type handling

The following types:

- `std::ascii::String` and `std::string::String`
- `sui::object::ID`
- `vector<T>` where either:
  - `T` is a valid type for a pure inputs, checked resursively
  - is a vector of objects
  - is a vector of results from previous calls in the same transaction block
- `std::option::Option`

Have special handling so that they can be used directly as inputs to function bindings instead
of having to manually construct them with `tx.pure`:

```ts
const e1 = createExampleStruct(tx);
const e2 = createExampleStruct(tx);

specialTypes(tx, {
  asciiString: "example ascii string", // or tx.pure.string('example ascii string')
  utf8String: "example utf8 string", // or tx.pure.string('example utf8 string')
  vectorOfU64: [1n, 2n], // or tx.pure.vector('u64', [1n, 2n])
  vectorOfObjects: [e1, e2], // or tx.makeMoveVec({ elements: [e1, e2], type: ExampleStruct.$typeName })
  idField: "0x12345", // or tx.pure.address('0x12345')
  address: "0x12345", // or tx.pure.address('0x12345')
  optionSome: 5n, // or tx.pure.option('u64', 5n)
  optionNone: null, // or tx.pure.option('u64', null)
});
```

## Caveats

- When specifying both source and on-chain packages, the generator will currently generate two separate dependency graphs (one for on-chain and one for source). This is due to a technical detail and will be resolved in a future version so that only a single dependency graph is generated (https://github.com/kunalabs-io/sui-client-gen/issues/1#issuecomment-1554754842).
- Since whitespace detection relies on some Rust nightly features which are currently unstable (https://github.com/udoprog/genco/issues/39#issuecomment-1569076737), the generated code is not formatted nicely. Usage of formatters on the generated code (e.g., `prettier`, `eslint`) is recommended.
- Because ESLint renames some types (e.g., `String` -> `string`) due to the `@typescript-eslint/ban-types` rule which breaks the generated code, an `.eslintrc.json` file is generated in the root directory to turn off this rule.
- When re-running the generator, the files generated on previous run will _not_ be automatically deleted in order to avoid accidental data wipes. The old files can either be deleted manually before re-running the tool (it's safe to delete everything aside from `gen.toml`) or by running the generator with `--clean` (use with caution).

## Docs

For more detailed usage documentation, check out the [docs](https://github.com/kunalabs-io/sui-client-gen/blob/master/DOC.md).
For technical details on the internals and reasoning behind the design decisions, check out the [design doc](https://github.com/kunalabs-io/sui-client-gen/issues/1).
