use crate::manifest::{self as GM};
use crate::package_cache::PackageCache;
use anyhow::{bail, Result};
use codespan_reporting::{
    diagnostic::Severity,
    term::termcolor::{ColorChoice, StandardStream},
};
use core::fmt;
use futures::future;
use move_binary_format::access::ModuleAccess;
use move_binary_format::file_format::{
    CompiledModule, FunctionDefinitionIndex, StructDefinitionIndex,
};
use move_bytecode_utils::Modules;
use move_core_types::account_address::AccountAddress;
use move_model::ast::{ModuleName, Spec};
use move_model::model::{FunId, FunctionData, GlobalEnv, Loc, ModuleData, ModuleId, StructId};
use move_model::{self, addr_to_big_uint};
use move_package::compilation::model_builder::ModelBuilder;
use move_package::resolution::resolution_graph::ResolvedGraph;
use move_package::source_package::parsed_manifest::{self as PM};
use move_package::{BuildConfig as MoveBuildConfig, ModelConfig};
use std::collections::{BTreeMap, HashSet, VecDeque};
use std::fs::{self, File};
use std::io::{self, Write};
use std::path::Path;
use sui_json_rpc_types::SuiRawMovePackage;
use sui_move_build::gather_published_ids;
use sui_sdk::types::base_types::SequenceNumber;
use sui_sdk::types::move_package::UpgradeInfo;
use tempfile::tempdir;

const STUB_PACKAGE_NAME: &str = "SuiClientGenRootPackageStub";

/// Wrapper struct to display a package as an inline table in the stub Move.toml.
/// This is necessary becase the `toml` crate does not currently support serializing
/// types as inline tables.
struct DependencyTOML<'a>(PM::PackageName, &'a PM::InternalDependency);
struct SubstTOML<'a>(&'a PM::Substitution);

pub struct Models {
    /// Move model for source packages defined in gen.toml
    pub source_model: GlobalEnv,
    /// Map from id to package name for source packages
    pub source_id_map: BTreeMap<AccountAddress, PM::PackageName>,
    /// Map from original package id to the published at id for source packages
    pub source_published_at: BTreeMap<AccountAddress, AccountAddress>,
    /// Move model for on-chain packages defined in gen.toml
    pub on_chain_model: GlobalEnv,
    /// Map from package id to package name for on-chain packages
    pub on_chain_id_map: BTreeMap<AccountAddress, PM::PackageName>,
    /// Map from original package id to the published at id for on-chain packages
    pub on_chain_published_at: BTreeMap<AccountAddress, AccountAddress>,
}

impl Models {
    pub async fn build(cache: &mut PackageCache<'_>, packages: &GM::Packages) -> Result<Self> {
        // separate source and on-chain packages
        let mut source_pkgs: Vec<(PM::PackageName, PM::InternalDependency)> = vec![];
        let mut on_chain_pkgs: Vec<(PM::PackageName, GM::OnChainPackage)> = vec![];
        for (name, pkg) in packages.iter() {
            match pkg.clone() {
                GM::Package::Dependency(PM::Dependency::Internal(mut dep)) => match &dep.kind {
                    // for local dependencies, convert relative paths to absolute since the stub root is in different directory
                    PM::DependencyKind::Local(relative_path) => {
                        let absolute_path = fs::canonicalize(relative_path)?;
                        dep.kind = PM::DependencyKind::Local(absolute_path);
                        source_pkgs.push((*name, dep));
                    }
                    PM::DependencyKind::Git(_) => {
                        source_pkgs.push((*name, dep));
                    }
                    PM::DependencyKind::Custom(_) => {
                        bail!("Encountered a custom dependency {} in gen.toml. Custom dependencies are not supported.", name)
                    }
                },
                GM::Package::Dependency(PM::Dependency::External(_)) => {
                    bail!("Encountered an external dependency {} in gen.toml. External dependencies are not supported.", name)
                }
                GM::Package::OnChain(pkg) => {
                    on_chain_pkgs.push((*name, pkg));
                }
            }
        }

        // build a model for source packages -- create a stub Move.toml with packages listed as dependencies
        // to build a single ResolvedGraph.
        let temp_dir = tempdir()?;
        let stub_path = temp_dir.path();
        fs::create_dir(stub_path.join("sources")).unwrap();

        let mut stub_manifest = File::create(stub_path.join("Move.toml")).unwrap();

        writeln!(stub_manifest, "[package]")?;
        writeln!(stub_manifest, "name = \"{}\"", STUB_PACKAGE_NAME)?;
        writeln!(stub_manifest, "version = \"0.1.0\"")?;

        writeln!(stub_manifest, "\n[dependencies]")?;
        for (name, dep) in source_pkgs.iter() {
            writeln!(stub_manifest, " {}", DependencyTOML(*name, dep))?;
        }

        // TODO: allow some of these options to be passed in as flags
        let mut build_config = MoveBuildConfig::default();
        build_config.skip_fetch_latest_git_deps = true;
        let resolved_graph =
            build_config.resolution_graph_for_package(stub_path, &mut io::stderr())?;

        let source_id_map = find_address_origins(&resolved_graph);
        let source_published_at = resolve_published_at(&resolved_graph, &source_id_map);

        let source_model = ModelBuilder::create(
            resolved_graph,
            ModelConfig {
                all_files_as_targets: true,
                target_filter: None,
            },
        )
        .build_model()?;

        let mut stderr = StandardStream::stderr(ColorChoice::Always);
        source_model.report_diag(&mut stderr, Severity::Warning);

        if source_model.has_errors() {
            bail!("Source model has errors.");
        }

        // build a model for on-chain packages
        let (pkg_ids, original_map) =
            resolve_on_chain_packages(cache, on_chain_pkgs.iter().map(|(_, pkg)| pkg.id).collect())
                .await?;

        let mut modules = vec![];
        let pkgs = cache.get_multi(pkg_ids).await?;
        for pkg in pkgs {
            let SuiRawMovePackage { module_map, .. } = pkg;
            for (_, bytes) in module_map {
                let module = CompiledModule::deserialize_with_defaults(&bytes)?;
                modules.push(module)
            }
        }

        let module_map = Modules::new(modules.iter());
        let dep_graph = module_map.compute_dependency_graph();
        let topo_order = dep_graph.compute_topological_order().unwrap();

        let mut on_chain_model = GlobalEnv::new();
        add_modules_to_model(&mut on_chain_model, topo_order)?;

        source_model.report_diag(&mut stderr, Severity::Warning);
        if source_model.has_errors() {
            bail!("On-chain model has errors.");
        }

        let mut on_chain_id_map: BTreeMap<AccountAddress, PM::PackageName> = BTreeMap::new();
        let mut on_chain_published_at: BTreeMap<AccountAddress, AccountAddress> = BTreeMap::new();
        for (name, pkg) in on_chain_pkgs {
            let original_id = original_map.get(&pkg.id).unwrap();

            on_chain_id_map.insert(*original_id, name);
            on_chain_published_at.insert(*original_id, pkg.id);
        }

        Ok(Self {
            source_model,
            source_id_map,
            source_published_at,
            on_chain_model,
            on_chain_id_map,
            on_chain_published_at,
        })
    }
}

/**
 * Finds the packagages where each address was first declared by descending down the
 * dependency graph breadth-first and populating the given map. This is to map package
 * names to their addresses.
 */
fn find_address_origins(graph: &ResolvedGraph) -> BTreeMap<AccountAddress, PM::PackageName> {
    let mut addr_map: BTreeMap<AccountAddress, PM::PackageName> = BTreeMap::new();

    let root = graph.root_package();
    let mut queue = VecDeque::from(vec![root]);

    while let Some(current) = queue.pop_front() {
        let pkg = graph.get_package(current);
        for name in pkg.resolved_table.values() {
            addr_map.insert(*name, current);
        }

        for dep in pkg.immediate_dependencies(graph) {
            queue.push_back(dep);
        }
    }

    addr_map
}

/// Resolve published_at addresses by gathering published ids from the graph and matching
/// them with package ids using the package name -> address map.
fn resolve_published_at(
    graph: &ResolvedGraph,
    id_map: &BTreeMap<AccountAddress, PM::PackageName>,
) -> BTreeMap<AccountAddress, AccountAddress> {
    let (_, dependency_ids) = gather_published_ids(graph);

    let mut published_at: BTreeMap<AccountAddress, AccountAddress> = BTreeMap::new();
    for (pkg_id, name) in id_map {
        if let Some(published_id) = dependency_ids.published.get(name) {
            published_at.insert(*pkg_id, **published_id);
        }
    }

    published_at
}

/**
 * Returns a list of all packages (including dependencies) where each package is mentioned only once
 * (resolved so that the highest version is used), and a mapping of all package ids to their original
 * package id (address of version 1 of the package).
 */
async fn resolve_on_chain_packages(
    dl: &mut PackageCache<'_>,
    ids: Vec<AccountAddress>,
) -> Result<(
    Vec<AccountAddress>,
    BTreeMap<AccountAddress, AccountAddress>,
)> {
    let top_level_origins = future::join_all(ids.iter().map(|addr| {
        let mut dl = dl.clone();
        async move { resolve_original_package_id(&mut dl, *addr).await.unwrap() }
    }))
    .await;

    let mut original_map: BTreeMap<_, _> = ids.clone().into_iter().zip(top_level_origins).collect();
    let mut highest_versions: BTreeMap<AccountAddress, UpgradeInfo> = BTreeMap::new();

    for pkg in dl.get_multi(ids.clone()).await? {
        let original_id = original_map.get(&pkg.id.into()).cloned().unwrap();
        match highest_versions.get(&original_id) {
            None => {
                highest_versions.insert(
                    original_id,
                    UpgradeInfo {
                        upgraded_id: pkg.id,
                        upgraded_version: pkg.version,
                    },
                );
            }
            Some(info) => {
                if info.upgraded_version < pkg.version {
                    highest_versions.insert(
                        original_id,
                        UpgradeInfo {
                            upgraded_id: pkg.id,
                            upgraded_version: pkg.version,
                        },
                    );
                }
            }
        }
    }

    let mut processed: HashSet<AccountAddress> = HashSet::new();
    let mut pkg_queue: HashSet<AccountAddress> = ids.into_iter().collect();

    while !pkg_queue.is_empty() {
        for pkg in pkg_queue.iter() {
            processed.insert(*pkg);
        }

        let pkgs = dl.get_multi(pkg_queue.drain().collect::<Vec<_>>()).await?;
        for pkg in pkgs {
            for (original_id, info) in pkg.linkage_table {
                original_map.insert(info.upgraded_id.into(), original_id.into());
                match highest_versions.get(&original_id) {
                    None => {
                        highest_versions.insert(original_id.into(), info.clone());
                    }
                    Some(existing_info) => {
                        if existing_info.upgraded_version < info.upgraded_version {
                            highest_versions.insert(original_id.into(), info.clone());
                        }
                    }
                }

                if !processed.contains(&info.upgraded_id.into()) {
                    pkg_queue.insert(info.upgraded_id.into());
                }
            }
        }
    }

    Ok((
        highest_versions
            .values()
            .map(|info| info.upgraded_id.into())
            .collect(),
        original_map,
    ))
}

async fn resolve_original_package_id(
    dl: &mut PackageCache<'_>,
    id: AccountAddress,
) -> Result<AccountAddress> {
    let pkg = dl.get(id).await?;

    if pkg.version == 1.into() {
        return Ok(id);
    }

    let origin_pkgs = pkg
        .type_origin_table
        .iter()
        .map(|origin| AccountAddress::from(origin.package))
        .collect();

    // in case of framework packages which get upgraded through a system upgrade, the first version can be != 1
    let mut min_version: SequenceNumber = u64::MAX.into();
    let mut id = id;
    for pkg in dl.get_multi(origin_pkgs).await? {
        if pkg.version < min_version {
            min_version = pkg.version;
            id = pkg.id.into();
        }
    }

    Ok(id)
}

/// Add compiled modules to the model. The `modules` list must be
/// topologically sorted by the dependency relation (i.e., a child node in the dependency graph
/// should appear earlier in the vector than its parents).
fn add_modules_to_model<'a>(
    env: &mut GlobalEnv,
    modules: impl IntoIterator<Item = &'a CompiledModule>,
) -> Result<()> {
    for (i, m) in modules.into_iter().enumerate() {
        let id = m.self_id();
        let addr = addr_to_big_uint(id.address());
        let module_name = ModuleName::new(addr, env.symbol_pool().make(id.name().as_str()));
        let module_id = ModuleId::new(i);
        let mut module_data = ModuleData::stub(module_name.clone(), module_id, m.clone());

        // add functions
        for (i, def) in m.function_defs().iter().enumerate() {
            let def_idx = FunctionDefinitionIndex(i as u16);
            let name = m.identifier_at(m.function_handle_at(def.function).name);
            let symbol = env.symbol_pool().make(name.as_str());
            let fun_id = FunId::new(symbol);
            let data = FunctionData::stub(symbol, def_idx, def.function);
            module_data.function_data.insert(fun_id, data);
            module_data.function_idx_to_id.insert(def_idx, fun_id);
        }

        // add structs
        for (i, def) in m.struct_defs().iter().enumerate() {
            let def_idx = StructDefinitionIndex(i as u16);
            let name = m.identifier_at(m.struct_handle_at(def.struct_handle).name);
            let symbol = env.symbol_pool().make(name.as_str());
            let struct_id = StructId::new(symbol);
            let data = env.create_move_struct_data(
                m,
                def_idx,
                symbol,
                Loc::default(),
                Vec::default(),
                Spec::default(),
            );
            module_data.struct_data.insert(struct_id, data);
            module_data.struct_idx_to_id.insert(def_idx, struct_id);
        }

        env.module_data.push(module_data);
    }

    Ok(())
}

impl<'a> fmt::Display for DependencyTOML<'a> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        let DependencyTOML(
            name,
            PM::InternalDependency {
                kind,
                subst,
                version: _,
                digest,
                dep_override: _,
            },
        ) = self;

        write!(f, "{} = {{ ", name)?;

        match kind {
            PM::DependencyKind::Local(local) => {
                write!(f, "local = ")?;
                f.write_str(&path_escape(local)?)?;
            }

            PM::DependencyKind::Git(PM::GitInfo {
                git_url,
                git_rev,
                subdir,
            }) => {
                write!(f, "git = ")?;
                f.write_str(&str_escape(git_url.as_str())?)?;

                write!(f, ", rev = ")?;
                f.write_str(&str_escape(git_rev.as_str())?)?;

                write!(f, ", subdir = ")?;
                f.write_str(&path_escape(subdir)?)?;
            }
            PM::DependencyKind::Custom(_) => {
                // not supported
            }
        }

        if let Some(digest) = digest {
            write!(f, ", digest = ")?;
            f.write_str(&str_escape(digest.as_str())?)?;
        }

        if let Some(subst) = subst {
            write!(f, ", addr_subst = {}", SubstTOML(subst))?;
        }

        f.write_str(" }")?;

        Ok(())
    }
}

impl<'a> fmt::Display for SubstTOML<'a> {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        /// Write an individual key value pair in the substitution.
        fn write_subst(
            f: &mut fmt::Formatter<'_>,
            addr: &PM::NamedAddress,
            subst: &PM::SubstOrRename,
        ) -> fmt::Result {
            f.write_str(&str_escape(addr.as_str())?)?;
            write!(f, " = ")?;

            match subst {
                PM::SubstOrRename::RenameFrom(named) => {
                    f.write_str(&str_escape(named.as_str())?)?;
                }

                PM::SubstOrRename::Assign(account) => {
                    f.write_str(&str_escape(&account.to_canonical_string())?)?;
                }
            }

            Ok(())
        }

        let mut substs = self.0.iter();

        let Some((addr, subst)) = substs.next() else {
            return f.write_str("{}")
        };

        f.write_str("{ ")?;

        write_subst(f, addr, subst)?;
        for (addr, subst) in substs {
            write!(f, ", ")?;
            write_subst(f, addr, subst)?;
        }

        f.write_str(" }")?;

        Ok(())
    }
}

/// Escape a string to output in a TOML file.
fn str_escape(s: &str) -> Result<String, fmt::Error> {
    toml::to_string(s).map_err(|_| fmt::Error)
}

/// Escape a path to output in a TOML file.
fn path_escape(p: &Path) -> Result<String, fmt::Error> {
    str_escape(p.to_str().ok_or(fmt::Error)?)
}
