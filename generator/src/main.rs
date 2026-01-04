//! CLI entry point for sui-client-gen.
//!
//! This module handles argument parsing and delegates to the driver for the actual work.

use std::path::PathBuf;

use anyhow::Result;
use clap::*;
use move_package::package_hooks;
use sui_move_build::SuiPackageHooks;

#[derive(Parser)]
#[clap(
    name = "sui-client-gen",
    version,
    about = "Generate TS SDKs for Sui Move smart contracts."
)]
struct Args {
    #[arg(
        short,
        long,
        help = "Path to the `gen.toml` file.",
        default_value = "./gen.toml"
    )]
    manifest: String,

    #[arg(
        short,
        long,
        help = "Path to the output directory. Overrides output in gen.toml if specified."
    )]
    out: Option<String>,

    #[arg(
        long,
        help = "Remove all contents of the output directory before generating, except for gen.toml. Use with caution."
    )]
    clean: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    package_hooks::register_package_hooks(Box::new(SuiPackageHooks));

    sui_client_gen::driver::run(sui_client_gen::driver::RunOptions {
        manifest_path: PathBuf::from(&args.manifest),
        out_dir: args.out.map(PathBuf::from),
        clean: args.clean,
    })
    .await
}
