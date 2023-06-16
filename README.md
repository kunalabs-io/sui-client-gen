# sui-client-gen

A tool for generating TS SDKs for Sui Move smart contracts. Supports code generation both for source code and on-chain packages.

## Caveats
- When specifying both source and on-chain packages, the generator will currently generate two separate dependency graphs (one for on-chain and one for source). This is due to a technical detail and will be resolved in a future version so that only a single dependency graph is generated (https://github.com/kunalabs-io/sui-client-gen/issues/1#issuecomment-1554754842).
- Since whitespace detection relies on some Rust nightly features which are currently unstable (https://github.com/udoprog/genco/issues/39#issuecomment-1569076737), the generated code is not formatted nicely. Usage of formatters on the generated code (e.g., `prettier`, `eslint`) is recommended.
- Because ESLint renames some types (e.g., `String` -> `string`) due to the `@typescript-eslint/ban-types` rule which breaks the generated code, an `.eslintrc.json` file is generated in the root directory to turn off this rule.
- When re-running the generator, the files generated on previous run will *not* be automatically deleted in order to avoid accidental data wipes. The old files should be deleted manually before re-running the tool (it's safe to delete everything aside from `gen.toml`).

## Getting Started

1) Install the generator: `cargo install --locked --git https://github.com/kunalabs-io/sui-client-gen.git`

2) Create a new directory and in it a `gen.toml` file like so:

```toml
[config]
# will be set to mainnet by default if ommitted
rpc = "https://fullnode.devnet.sui.io:443"

[packages]
# based on source code (syntax same as in Move.toml):
DeepBook = { git = "https://github.com/MystenLabs/sui.git", subdir = "crates/sui-framework/packages/deepbook", rev = "releases/sui-v1.4.0-release" }
# an on-chain package:
FooPackage = { id = "0x12345" }
```

3) Run the generator from inside the directory: `sui-client-gen`
4) Run the linter on the generated code: `pnpm eslint . --fix`

## Docs

For more info see the design doc https://github.com/kunalabs-io/sui-client-gen/issues/1
