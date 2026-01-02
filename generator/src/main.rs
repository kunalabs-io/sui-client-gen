use std::collections::{BTreeMap, BTreeSet};
use std::path::{Path, PathBuf};

use anyhow::Result;
use clap::*;
use colored::*;
use move_core_types::account_address::AccountAddress;
use move_model_2::source_kind::SourceKind;
use move_model_2::{compiled_model, model, source_model};
use move_package::source_package::parsed_manifest::PackageName;
use move_symbol_pool::Symbol;
use std::io::Write;
use sui_client_gen::framework_sources;
use sui_client_gen::manifest::{parse_gen_manifest_from_file, GenManifest, Package};
use sui_client_gen::model_builder::{
    build_models, OnChainModelResult, SourceModelResult, TypeOriginTable, VersionTable,
};
use sui_client_gen::package_cache::PackageCache;
use sui_client_gen::ts_gen::{
    self, gen_module_structs, gen_package_index, module_import_name, package_import_name,
};
use sui_move_build::SuiPackageHooks;
use sui_sdk::types::SYSTEM_PACKAGE_ADDRESSES;
use sui_sdk::SuiClientBuilder;

const DEFAULT_RPC: &str = "https://fullnode.mainnet.sui.io:443";

// ============================================================================
// Output Layout - Structured representation of the output directory structure
// ============================================================================

/// Represents the overall output directory structure.
/// This makes path calculations explicit and centralized.
struct OutputLayout {
    /// Root output directory (e.g., "./generated")
    root: PathBuf,
    /// Path to _framework directory
    framework_dir: PathBuf,
}

impl OutputLayout {
    fn new(out_root: PathBuf) -> Self {
        let framework_dir = out_root.join("_framework");
        Self {
            root: out_root,
            framework_dir,
        }
    }

    /// Get the path for a package within the output.
    fn package_path(
        &self,
        pkg_id: &AccountAddress,
        top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
        is_source: bool,
    ) -> PackageLayout {
        let is_top_level = top_level_pkg_names.contains_key(pkg_id);

        let path = match top_level_pkg_names.get(pkg_id) {
            Some(pkg_name) => self.root.join(package_import_name(*pkg_name)),
            None => {
                let dep_dir = if is_source { "source" } else { "onchain" };
                self.root
                    .join("_dependencies")
                    .join(dep_dir)
                    .join(pkg_id.to_hex_literal())
            }
        };

        PackageLayout::new(path, is_top_level)
    }
}

/// Represents the layout of a single package directory.
/// Encapsulates the "levels from root" logic for relative paths.
struct PackageLayout {
    /// Path to this package's directory
    path: PathBuf,
    /// Whether this is a top-level package (affects path depths)
    is_top_level: bool,
    /// Levels from root: 0 for top-level, 2 for dependencies
    levels_from_root: u8,
}

impl PackageLayout {
    fn new(path: PathBuf, is_top_level: bool) -> Self {
        let levels_from_root = if is_top_level { 0 } else { 2 };
        Self {
            path,
            is_top_level,
            levels_from_root,
        }
    }

    /// Get the framework import path relative to init.ts (at package root)
    fn framework_rel_path_for_init(&self) -> String {
        let init_levels = self.levels_from_root + 1;
        (0..init_levels).map(|_| "..").collect::<Vec<_>>().join("/") + "/_framework"
    }

    /// Get the path for a module directory within this package.
    fn module_path(&self, module_name: Symbol) -> PathBuf {
        self.path.join(module_import_name(module_name))
    }
}

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
        help = "Path to the output directory. If omitted, the current directory will be used.",
        default_value = "."
    )]
    out: String,

    #[arg(
        long,
        help = "Remove all contents of the output directory before generating, except for gen.toml. Use with caution."
    )]
    clean: bool,
}

#[tokio::main]
async fn main() -> Result<()> {
    let args = Args::parse();

    move_package::package_hooks::register_package_hooks(Box::new(SuiPackageHooks));

    let manifest = parse_gen_manifest_from_file(Path::new(&args.manifest))?;
    let rpc_url = match &manifest.config {
        Some(config) => config
            .rpc
            .clone()
            .unwrap_or_else(|| DEFAULT_RPC.to_string()),
        None => DEFAULT_RPC.to_string(),
    };
    let rpc_client = SuiClientBuilder::default().build(rpc_url).await?;

    let chain_id = {
        if let Err(e) = rpc_client.check_api_version() {
            eprintln!("{}", format!("[warning] {e}").yellow().bold());
        }

        rpc_client.read_api().get_chain_identifier().await.ok()
    };

    let mut progress_output = std::io::stderr();

    // build models
    let mut cache = PackageCache::new(rpc_client.read_api());
    let (source_model, on_chain_model) = build_models(
        &mut cache,
        &manifest.packages,
        &PathBuf::from(&args.manifest),
        chain_id,
        &mut progress_output,
    )
    .await?;

    if source_model.is_none() && on_chain_model.is_none() {
        writeln!(std::io::stderr(), "No packages to generate.")?;
        return Ok(());
    }

    // clean output
    if args.clean {
        clean_output(&PathBuf::from(&args.out))?;
    }

    // separate modules by package
    let source_pkgs: BTreeMap<AccountAddress, source_model::Package> = source_model
        .as_ref()
        .map(|m| m.env.packages().map(|pkg| (pkg.address(), pkg)).collect())
        .unwrap_or_default();

    let on_chain_pkgs: BTreeMap<AccountAddress, compiled_model::Package> = on_chain_model
        .as_ref()
        .map(|m| m.env.packages().map(|pkg| (pkg.address(), pkg)).collect())
        .unwrap_or_default();

    // gen top-level packages and dependencies
    let (source_top_level_addr_map, on_chain_top_level_addr_map) =
        resolve_top_level_pkg_addr_map(&source_model, &on_chain_model, &manifest);

    // Setup output layout
    let output = OutputLayout::new(PathBuf::from(args.out));
    std::fs::create_dir_all(&output.root)?;

    // gen _framework
    writeln!(progress_output, "{}", "GENERATING FRAMEWORK".green().bold())?;

    std::fs::create_dir_all(&output.framework_dir)?;
    write_str_to_file(
        framework_sources::LOADER,
        &output.framework_dir.join("loader.ts"),
    )?;
    write_str_to_file(
        framework_sources::UTIL,
        &output.framework_dir.join("util.ts"),
    )?;
    write_str_to_file(
        framework_sources::REIFIED,
        &output.framework_dir.join("reified.ts"),
    )?;
    write_str_to_file(
        framework_sources::VECTOR,
        &output.framework_dir.join("vector.ts"),
    )?;
    write_str_to_file(
        &ts_gen::gen_init_loader(
            match source_pkgs.is_empty() {
                false => Some((
                    source_pkgs.keys().copied().collect::<Vec<_>>(),
                    &source_top_level_addr_map,
                )),
                true => None,
            },
            match on_chain_pkgs.is_empty() {
                false => Some((
                    on_chain_pkgs.keys().copied().collect::<Vec<_>>(),
                    &on_chain_top_level_addr_map,
                )),
                true => None,
            },
        ),
        &output.framework_dir.join("init-loader.ts"),
    )?;

    if let Some(m) = &source_model {
        writeln!(
            progress_output,
            "{}",
            "GENERATING SOURCE PACKAGES".green().bold()
        )?;
        gen_packages_for_model(
            source_pkgs,
            &source_top_level_addr_map,
            &m.published_at,
            &m.type_origin_table,
            &m.version_table,
            true,
            &output,
        )?;
    }
    if let Some(m) = &on_chain_model {
        writeln!(
            progress_output,
            "{}",
            "GENERATING ON-CHAIN PACKAGES".green().bold()
        )?;
        gen_packages_for_model(
            on_chain_pkgs,
            &on_chain_top_level_addr_map,
            &m.published_at,
            &m.type_origin_table,
            &m.version_table,
            false,
            &output,
        )?;
    }

    // gen .eslintrc.json
    write_str_to_file(
        framework_sources::ESLINTRC,
        &output.root.join(".eslintrc.json"),
    )?;

    Ok(())
}

fn clean_output(out_root: &Path) -> Result<()> {
    let mut paths_to_remove = vec![];
    for entry in std::fs::read_dir(out_root)? {
        let entry = entry?;
        let path = entry.path();
        if path.is_file() && path.file_name().unwrap() == "gen.toml" {
            continue;
        }
        paths_to_remove.push(path);
    }

    for path in paths_to_remove {
        if path.is_dir() {
            std::fs::remove_dir_all(path)?;
        } else {
            std::fs::remove_file(path)?;
        }
    }

    Ok(())
}

fn write_str_to_file(s: &str, path: &Path) -> Result<()> {
    if s.is_empty() {
        return Ok(());
    }

    std::fs::write(path, s)?;
    Ok(())
}

/// Creates a mapping between address and package name for top-level packages.
fn resolve_top_level_pkg_addr_map(
    source_model: &Option<SourceModelResult>,
    on_chain_model: &Option<OnChainModelResult>,
    manifest: &GenManifest,
) -> (
    BTreeMap<AccountAddress, Symbol>,
    BTreeMap<AccountAddress, Symbol>,
) {
    let mut source_top_level_package_names: BTreeSet<PackageName> = BTreeSet::new();
    let mut on_chain_top_level_package_names: BTreeSet<PackageName> = BTreeSet::new();
    for (name, pkg) in manifest.packages.iter() {
        match pkg {
            Package::Dependency(_) => {
                source_top_level_package_names.insert(*name);
            }
            Package::OnChain(_) => {
                on_chain_top_level_package_names.insert(*name);
            }
        }
    }

    let source_top_level_id_map: BTreeMap<AccountAddress, Symbol> = if let Some(m) = source_model {
        m.id_map
            .iter()
            .filter_map(|(id, name)| {
                if source_top_level_package_names.contains(name) {
                    Some((*id, *name))
                } else {
                    None
                }
            })
            .collect()
    } else {
        BTreeMap::new()
    };

    let on_chain_top_level_id_map: BTreeMap<AccountAddress, Symbol> =
        if let Some(m) = on_chain_model {
            m.id_map
                .iter()
                .filter_map(|(id, name)| {
                    if on_chain_top_level_package_names.contains(name) {
                        Some((*id, *name))
                    } else {
                        None
                    }
                })
                .collect()
        } else {
            BTreeMap::new()
        };

    (source_top_level_id_map, on_chain_top_level_id_map)
}

fn gen_packages_for_model<HasSource: SourceKind>(
    pkgs: BTreeMap<AccountAddress, model::Package<HasSource>>,
    top_level_pkg_names: &BTreeMap<AccountAddress, Symbol>,
    published_at_map: &BTreeMap<AccountAddress, AccountAddress>,
    type_origin_table: &TypeOriginTable,
    version_table: &VersionTable,
    is_source: bool,
    output: &OutputLayout,
) -> Result<()> {
    if pkgs.is_empty() {
        return Ok(());
    }

    for (pkg_id, pkg) in pkgs.iter() {
        let pkg_layout = output.package_path(pkg_id, top_level_pkg_names, is_source);
        std::fs::create_dir_all(&pkg_layout.path)?;

        // generate index.ts
        let published_at = published_at_map.get(pkg_id).unwrap_or(pkg_id);
        let versions = version_table.get(pkg_id).unwrap();
        let version_list: Vec<(String, u64)> = versions
            .iter()
            .map(|(addr, seq)| (addr.to_hex_literal(), seq.value()))
            .collect();
        let index_content = gen_package_index(
            &pkg_id.to_hex_literal(),
            &published_at.to_hex_literal(),
            &version_list,
            SYSTEM_PACKAGE_ADDRESSES.contains(pkg_id),
        );
        write_str_to_file(&index_content, &pkg_layout.path.join("index.ts"))?;

        // generate init.ts
        write_str_to_file(
            &ts_gen::gen_package_init(pkg, &pkg_layout.framework_rel_path_for_init()),
            &pkg_layout.path.join("init.ts"),
        )?;

        // generate modules
        for module in pkg.modules() {
            let module_path = pkg_layout.module_path(module.name());
            std::fs::create_dir_all(&module_path)?;

            // generate <module>/functions.ts (only for top-level packages)
            if pkg_layout.is_top_level {
                let content = ts_gen::gen_module_functions(
                    &module,
                    top_level_pkg_names,
                    is_source,
                    pkg_layout.levels_from_root,
                );
                if !content.is_empty() {
                    write_str_to_file(&content, &module_path.join("functions.ts"))?;
                }
            }

            // generate <module>/structs.ts
            let content = gen_module_structs(
                &module,
                type_origin_table,
                version_table,
                top_level_pkg_names,
                is_source,
                pkg_layout.levels_from_root,
            );
            write_str_to_file(&content, &module_path.join("structs.ts"))?;
        }
    }

    Ok(())
}
