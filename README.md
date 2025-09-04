# sui-client-gen

A tool for generating Kotlin Multiplatform SDKs for Sui Move smart contracts. Supports code generation both for source code and on-chain packages with no IDLs or ABIs required.

## Quick Start

1. Install the generator by either:

   - `cargo install --locked --git https://github.com/mcxross/sui-client-gen.git` (you might have to install some [build dependencies](https://docs.sui.io/guides/developer/getting-started/sui-install#all-linux-prerequisites))
   - or downloading a binary from https://github.com/mcxross/sui-client-gen/releases/
   - or use the Gradle plugin by adding the following to your `build.gradle.kts`:

   ```kotlin
   plugins {
       id("xyz.mcxross.codegen") version "0.1.0"
    }

2. Create a new directory and in it a `gen.toml` file like so:

```toml
[config]
# will be set to mainnet by default if omitted
rpc = "https://fullnode.devnet.sui.io:443"

[packages]
# based on source code (syntax same as in Move.toml):
DeepBookV3 = { git = "https://github.com/MystenLabs/deepbookv3.git", subdir = "packages/deepbook", rev = "releases/sui-v1.4.0-release" }
AMM = { local = "../move/amm" }
# an on-chain package:
P2PRamp = { id = "0x12345" }
```

3. Run the generator from inside the directory: `codegen-kt`
4. Run the formatter on the generated code: `ktfmt [--kotlinlang-style] [files...]`

