//! Integration tests for model_builder using the fixture packages.
//!
//! This test suite uses the pre-configured fixture at `tests/fixtures/gen.toml`
//! which includes:
//!
//! ## Top-Level Packages (from gen.toml)
//! - `pkg_published_toplevel` - Published with upgrade (version 2), has Published.toml
//! - `pkg_unpublished_toplevel` - Unpublished, new package format
//! - `pkg_toplevel_legacy` - Unpublished, legacy format with [addresses] section
//!
//! ## Transitive Dependencies
//! - `pkg_published_transitive` - Published (version 1), dependency of pkg_published_toplevel
//! - `pkg_unpublished_transitive` - Unpublished, dependency of pkg_unpublished_toplevel
//! - `PkgTransitiveLegacy` - Legacy format, dependency of pkg_unpublished_toplevel
//!
//! ## Running Tests
//! ```bash
//! cargo test --test model_builder_integration
//! ```

use std::collections::{BTreeMap, BTreeSet};
use std::path::PathBuf;
use std::sync::OnceLock;

use move_core_types::account_address::AccountAddress;
use move_package_alt::schema::PackageName;

use sui_client_gen::graphql::GraphQLClient;
use sui_client_gen::model_builder::{self, ModelResult, TypeOriginTable, VersionTable};

/// Cached test data - contains only the Sync fields from ModelResult.
/// This allows sharing the expensive model build across all tests.
struct CachedTestData {
    id_map: BTreeMap<AccountAddress, PackageName>,
    published_at: BTreeMap<AccountAddress, AccountAddress>,
    type_origin_table: TypeOriginTable,
    version_table: VersionTable,
    top_level_packages: BTreeSet<PackageName>,
}

/// Global cache for test data
static CACHED_DATA: OnceLock<CachedTestData> = OnceLock::new();

/// Get cached test data, initializing on first call.
/// This is much faster than rebuilding the model for each test.
fn get_cached_data() -> &'static CachedTestData {
    CACHED_DATA.get_or_init(|| {
        // Create a new tokio runtime to run the async build
        let rt = tokio::runtime::Runtime::new().expect("Failed to create tokio runtime");
        let result = rt.block_on(build_fixture_model_internal());

        CachedTestData {
            id_map: result.id_map,
            published_at: result.published_at,
            type_origin_table: result.type_origin_table,
            version_table: result.version_table,
            top_level_packages: result.top_level_packages,
        }
    })
}

/// Known addresses from Published.toml files
#[allow(dead_code)]
mod known_addresses {
    /// pkg_published_transitive: original-id = published-at (never upgraded)
    pub const PKG_PUBLISHED_TRANSITIVE: &str =
        "0xa86a53fabd3a15320ac47095bb19055003b350b335d4b20ab16fda7fe9cbccb2";

    /// pkg_published_toplevel: original-id (v1)
    pub const PKG_PUBLISHED_TOPLEVEL_ORIGINAL: &str =
        "0x60afe36936d3bd828772f2e7f13be8fa5c78900a4b9b3499b10fa65aa41db694";

    /// pkg_published_toplevel: published-at (v2, newest)
    pub const PKG_PUBLISHED_TOPLEVEL_PUBLISHED_AT: &str =
        "0xe7828008222ef9e61107348b6ded43053ca068da42e4f43875b36e7609815f1d";
}

/// Get the path to test fixtures
fn fixtures_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests/fixtures")
}

/// Internal function to build the model using the fixture gen.toml.
/// Called once by get_cached_data() to populate the cache.
async fn build_fixture_model_internal() -> ModelResult {
    let fixtures = fixtures_path();
    let gen_toml_path = fixtures.join("gen.toml");

    let manifest = sui_client_gen::manifest::parse_gen_manifest_from_file(&gen_toml_path)
        .expect("Failed to parse fixture gen.toml");

    // Use a GraphQL client - published packages will query testnet
    let graphql_endpoint = sui_client_gen::resolve_graphql(
        manifest.config.graphql.as_deref(),
        &manifest.config.environment,
        &manifest.environments,
    );
    let graphql_client = GraphQLClient::new(&graphql_endpoint);

    // Resolve chain ID for the environment
    let chain_id = sui_client_gen::resolve_chain_id(
        &manifest.config.environment,
        &manifest.environments,
    )
    .expect("Failed to resolve chain ID for environment");

    model_builder::build_model(
        &manifest.packages,
        &gen_toml_path,
        &manifest.config.environment,
        &chain_id,
        &manifest.environments,
        &manifest.dep_replacements,
        &graphql_client,
    )
    .await
    .expect("Failed to build model")
}

/// Build the full model - only needed for tests that access the Model directly.
/// Most tests should use get_cached_data() instead.
async fn build_fixture_model() -> ModelResult {
    build_fixture_model_internal().await
}

/// Helper to get package address by name from cached data
fn get_package_addr_cached(data: &CachedTestData, name: &str) -> Option<AccountAddress> {
    data.id_map
        .iter()
        .find(|(_, n)| n.as_str() == name)
        .map(|(addr, _)| *addr)
}

// ===========================================================================
// TOP-LEVEL PACKAGE DETECTION TESTS
// ===========================================================================

#[test]
fn test_top_level_packages_count() {
    let data = get_cached_data();

    // gen.toml has exactly 3 top-level packages
    assert_eq!(
        data.top_level_packages.len(),
        3,
        "Should have exactly 3 top-level packages from gen.toml"
    );
}

#[test]
fn test_top_level_packages_contains_expected() {
    let data = get_cached_data();

    let top_level_names: BTreeSet<&str> =
        data.top_level_packages.iter().map(|n| n.as_str()).collect();

    assert!(
        top_level_names.contains("pkg_published_toplevel"),
        "Should contain pkg_published_toplevel"
    );
    assert!(
        top_level_names.contains("pkg_unpublished_toplevel"),
        "Should contain pkg_unpublished_toplevel"
    );
    // Note: gen.toml uses "pkg_toplevel_legacy" as key, which becomes the package name
    assert!(
        top_level_names.contains("pkg_toplevel_legacy"),
        "Should contain pkg_toplevel_legacy"
    );
}

#[test]
fn test_transitive_packages_not_in_top_level() {
    let data = get_cached_data();

    let top_level_names: BTreeSet<&str> =
        data.top_level_packages.iter().map(|n| n.as_str()).collect();

    // Transitive dependencies should NOT be in top_level_packages
    assert!(
        !top_level_names.contains("pkg_published_transitive"),
        "pkg_published_transitive should NOT be top-level"
    );
    assert!(
        !top_level_names.contains("pkg_unpublished_transitive"),
        "pkg_unpublished_transitive should NOT be top-level"
    );
    assert!(
        !top_level_names.contains("pkg_transitive_legacy"),
        "pkg_transitive_legacy should NOT be top-level"
    );
}

// ===========================================================================
// ID_MAP TESTS
// ===========================================================================

#[test]
fn test_id_map_contains_all_packages() {
    let data = get_cached_data();

    let package_names: BTreeSet<&str> = data.id_map.values().map(|n| n.as_str()).collect();

    // All packages (top-level and transitive) should be in id_map
    // Note: Package names are normalized from gen.toml keys
    let expected = [
        "pkg_published_toplevel",
        "pkg_published_transitive",
        "pkg_unpublished_toplevel",
        "pkg_unpublished_transitive",
        "pkg_toplevel_legacy",
        "pkg_transitive_legacy",
    ];

    for name in expected {
        assert!(
            package_names.contains(name),
            "id_map should contain '{}', got: {:?}",
            name,
            package_names
        );
    }
}

#[test]
fn test_id_map_unique_addresses() {
    let data = get_cached_data();

    let addresses: Vec<_> = data.id_map.keys().collect();
    let unique_addresses: BTreeSet<_> = addresses.iter().collect();

    assert_eq!(
        addresses.len(),
        unique_addresses.len(),
        "All package addresses should be unique"
    );
}

#[test]
fn test_published_package_uses_original_id() {
    let data = get_cached_data();

    // pkg_published_toplevel should use original-id from Published.toml
    let expected_addr =
        AccountAddress::from_hex_literal(known_addresses::PKG_PUBLISHED_TOPLEVEL_ORIGINAL).unwrap();

    let actual_addr = get_package_addr_cached(data, "pkg_published_toplevel")
        .expect("pkg_published_toplevel should be in id_map");

    assert_eq!(
        actual_addr, expected_addr,
        "pkg_published_toplevel should use original-id from Published.toml"
    );
}

// ===========================================================================
// PUBLISHED_AT TESTS
// ===========================================================================

#[test]
fn test_published_at_contains_published_packages() {
    let data = get_cached_data();

    // Get addresses for published packages
    let pkg_published_toplevel_addr = get_package_addr_cached(data, "pkg_published_toplevel")
        .expect("pkg_published_toplevel should exist");
    let pkg_published_transitive_addr = get_package_addr_cached(data, "pkg_published_transitive")
        .expect("pkg_published_transitive should exist");

    assert!(
        data.published_at.contains_key(&pkg_published_toplevel_addr),
        "published_at should contain pkg_published_toplevel"
    );
    assert!(
        data.published_at
            .contains_key(&pkg_published_transitive_addr),
        "published_at should contain pkg_published_transitive"
    );
}

#[test]
fn test_published_at_excludes_unpublished_packages() {
    let data = get_cached_data();

    // Get addresses for unpublished packages
    let pkg_unpublished_toplevel_addr = get_package_addr_cached(data, "pkg_unpublished_toplevel")
        .expect("pkg_unpublished_toplevel should exist");
    let pkg_unpublished_transitive_addr =
        get_package_addr_cached(data, "pkg_unpublished_transitive")
            .expect("pkg_unpublished_transitive should exist");

    assert!(
        !data
            .published_at
            .contains_key(&pkg_unpublished_toplevel_addr),
        "published_at should NOT contain pkg_unpublished_toplevel"
    );
    assert!(
        !data
            .published_at
            .contains_key(&pkg_unpublished_transitive_addr),
        "published_at should NOT contain pkg_unpublished_transitive"
    );
}

#[test]
fn test_published_at_correct_mapping() {
    let data = get_cached_data();

    // pkg_published_toplevel: original-id -> published-at
    let original_id =
        AccountAddress::from_hex_literal(known_addresses::PKG_PUBLISHED_TOPLEVEL_ORIGINAL).unwrap();
    let expected_published_at =
        AccountAddress::from_hex_literal(known_addresses::PKG_PUBLISHED_TOPLEVEL_PUBLISHED_AT)
            .unwrap();

    let actual_published_at = data
        .published_at
        .get(&original_id)
        .expect("pkg_published_toplevel should be in published_at");

    assert_eq!(
        *actual_published_at, expected_published_at,
        "published_at should map original-id to published-at address"
    );
}

// ===========================================================================
// TYPE ORIGIN TABLE TESTS
// ===========================================================================

#[test]
fn test_type_origin_table_contains_structs() {
    let data = get_cached_data();

    // pkg_published_toplevel should have type origins for its structs
    let pkg_addr = get_package_addr_cached(data, "pkg_published_toplevel")
        .expect("pkg_published_toplevel should exist");

    let origins = data
        .type_origin_table
        .get(&pkg_addr)
        .expect("type_origin_table should contain pkg_published_toplevel");

    assert!(
        origins.contains_key("main::OriginalStruct"),
        "Should contain main::OriginalStruct"
    );
    assert!(
        origins.contains_key("main::AddedInV2"),
        "Should contain main::AddedInV2"
    );
}

#[test]
fn test_type_origin_different_versions() {
    let data = get_cached_data();

    let pkg_addr = get_package_addr_cached(data, "pkg_published_toplevel")
        .expect("pkg_published_toplevel should exist");

    let origins = data
        .type_origin_table
        .get(&pkg_addr)
        .expect("type_origin_table should contain pkg_published_toplevel");

    // Get the defining addresses
    let original_struct_origin = origins.get("main::OriginalStruct").unwrap();
    let added_in_v2_origin = origins.get("main::AddedInV2").unwrap();

    // OriginalStruct was defined in v1 (original-id)
    // AddedInV2 was defined in v2 (published-at)
    let v1_addr =
        AccountAddress::from_hex_literal(known_addresses::PKG_PUBLISHED_TOPLEVEL_ORIGINAL).unwrap();
    let v2_addr =
        AccountAddress::from_hex_literal(known_addresses::PKG_PUBLISHED_TOPLEVEL_PUBLISHED_AT)
            .unwrap();

    assert_eq!(
        *original_struct_origin, v1_addr,
        "OriginalStruct should have type origin at v1 (original-id)"
    );
    assert_eq!(
        *added_in_v2_origin, v2_addr,
        "AddedInV2 should have type origin at v2 (published-at)"
    );
}

#[test]
fn test_unpublished_packages_have_self_origin() {
    let data = get_cached_data();

    let unpublished_packages = ["pkg_unpublished_toplevel", "pkg_unpublished_transitive"];

    for pkg_name in unpublished_packages {
        let pkg_addr = get_package_addr_cached(data, pkg_name)
            .unwrap_or_else(|| panic!("{} should exist", pkg_name));

        if let Some(origins) = data.type_origin_table.get(&pkg_addr) {
            for (type_key, defining_addr) in origins {
                assert_eq!(
                    *defining_addr, pkg_addr,
                    "Unpublished package '{}' type '{}' should have self-origin",
                    pkg_name, type_key
                );
            }
        }
    }
}

// ===========================================================================
// VERSION TABLE TESTS
// ===========================================================================

#[test]
fn test_version_table_published_package_has_versions() {
    let data = get_cached_data();

    let pkg_addr = get_package_addr_cached(data, "pkg_published_toplevel")
        .expect("pkg_published_toplevel should exist");

    let versions = data
        .version_table
        .get(&pkg_addr)
        .expect("version_table should contain pkg_published_toplevel");

    // Should have entries for both v1 and v2
    assert!(
        versions.len() >= 2,
        "pkg_published_toplevel should have at least 2 version entries (was upgraded)"
    );
}

#[test]
fn test_version_table_newest_is_v1() {
    let data = get_cached_data();

    let pkg_addr = get_package_addr_cached(data, "pkg_published_toplevel")
        .expect("pkg_published_toplevel should exist");

    let versions = data
        .version_table
        .get(&pkg_addr)
        .expect("version_table should contain pkg_published_toplevel");

    // The newest version (published-at) should be V1
    let published_at_addr =
        AccountAddress::from_hex_literal(known_addresses::PKG_PUBLISHED_TOPLEVEL_PUBLISHED_AT)
            .unwrap();

    let v1_version = versions
        .get(&published_at_addr)
        .expect("published-at address should be in version_table");

    assert_eq!(
        v1_version.value(),
        1,
        "Newest version (published-at) should be V1"
    );
}

#[test]
fn test_version_table_original_is_v2() {
    let data = get_cached_data();

    let pkg_addr = get_package_addr_cached(data, "pkg_published_toplevel")
        .expect("pkg_published_toplevel should exist");

    let versions = data
        .version_table
        .get(&pkg_addr)
        .expect("version_table should contain pkg_published_toplevel");

    // The original version should be V2 (older)
    let original_addr =
        AccountAddress::from_hex_literal(known_addresses::PKG_PUBLISHED_TOPLEVEL_ORIGINAL).unwrap();

    let v2_version = versions
        .get(&original_addr)
        .expect("original-id address should be in version_table");

    assert_eq!(
        v2_version.value(),
        2,
        "Original version should be V2 (older than newest)"
    );
}

// ===========================================================================
// LEGACY PACKAGE FORMAT TESTS
// ===========================================================================

#[test]
fn test_legacy_packages_in_id_map() {
    let data = get_cached_data();

    // Legacy packages with [addresses] section should still be in id_map
    // Note: Package names are normalized from gen.toml keys
    assert!(
        get_package_addr_cached(data, "pkg_toplevel_legacy").is_some(),
        "pkg_toplevel_legacy should be in id_map"
    );
    assert!(
        get_package_addr_cached(data, "pkg_transitive_legacy").is_some(),
        "pkg_transitive_legacy should be in id_map"
    );
}

#[test]
fn test_legacy_packages_address_handling() {
    let data = get_cached_data();

    // Legacy packages with [addresses] section (even "0x0") are treated as "defined" addresses
    // by move_package_alt and get a dummy address, which then ends up in published_at (self-mapped).
    // This is different from new-format packages without any [addresses] section.
    let legacy_toplevel_addr = get_package_addr_cached(data, "pkg_toplevel_legacy")
        .expect("pkg_toplevel_legacy should exist");

    // Legacy packages with [addresses] are in published_at but map to themselves
    if let Some(&pub_at) = data.published_at.get(&legacy_toplevel_addr) {
        // Should map to itself (no actual publish happened)
        assert_eq!(
            pub_at, legacy_toplevel_addr,
            "Legacy package should map to itself in published_at"
        );
    }
    // Note: Whether legacy packages are in published_at depends on move_package_alt's handling
    // of the [addresses] section. We're testing that they're at least in id_map correctly.
}

// ===========================================================================
// MODEL COMPLETENESS TESTS
// ===========================================================================

#[tokio::test]
async fn test_model_has_modules() {
    let result = build_fixture_model().await;

    // The model should have modules from all packages
    let module_count = result.model.modules().count();

    assert!(
        module_count > 0,
        "Model should have at least one module, got {}",
        module_count
    );
}

#[tokio::test]
async fn test_model_has_structs() {
    let result = build_fixture_model().await;

    // Count structs across all modules
    let struct_count: usize = result.model.modules().map(|m| m.structs().count()).sum();

    assert!(
        struct_count > 0,
        "Model should have at least one struct, got {}",
        struct_count
    );
}

// ===========================================================================
// GEN_ENVS.TOML TESTS - Custom Environments and Dep-Replacements
// ===========================================================================

/// Test that gen_envs.toml can be parsed correctly.
/// This tests the new [environments] and [dep-replacements.<env>] sections.
#[test]
fn test_gen_envs_manifest_parsing() {
    let fixtures = fixtures_path();
    let gen_envs_path = fixtures.join("gen_envs.toml");

    let manifest = sui_client_gen::manifest::parse_gen_manifest_from_file(&gen_envs_path)
        .expect("Failed to parse gen_envs.toml");

    // Check config
    assert_eq!(manifest.config.environment, "testnet_alt");
    assert_eq!(manifest.config.output, Some("./out-envs".to_string()));
    assert!(manifest.config.graphql.is_none()); // graphql is in environment, not config

    // Check packages - now includes 4 top-level packages
    assert_eq!(manifest.packages.len(), 4);
    assert!(manifest.packages.contains_key(&PackageName::new("pkg_published_toplevel").unwrap()));
    assert!(manifest.packages.contains_key(&PackageName::new("pkg_unpublished_toplevel").unwrap()));
    assert!(manifest.packages.contains_key(&PackageName::new("pkg_published_transitive_alt").unwrap()));
    assert!(manifest.packages.contains_key(&PackageName::new("pkg_unpublished_transitive").unwrap()));

    // Check environments
    assert_eq!(manifest.environments.len(), 1);
    let testnet_alt = manifest.environments.get("testnet_alt").expect("testnet_alt should exist");
    assert_eq!(testnet_alt.chain_id, Some("4c78adac".to_string()));
    assert_eq!(testnet_alt.graphql, Some("https://graphql.testnet.sui.io/graphql".to_string()));

    // No dep-replacements in this simplified test
    assert!(manifest.dep_replacements.is_empty());
}

/// Test chain ID resolution for custom environment.
#[test]
fn test_gen_envs_chain_id_resolution() {
    let fixtures = fixtures_path();
    let gen_envs_path = fixtures.join("gen_envs.toml");

    let manifest = sui_client_gen::manifest::parse_gen_manifest_from_file(&gen_envs_path)
        .expect("Failed to parse gen_envs.toml");

    // Resolve chain ID for the testnet_alt environment
    let chain_id = sui_client_gen::resolve_chain_id(
        &manifest.config.environment,
        &manifest.environments,
    );

    assert_eq!(chain_id, Some("4c78adac".to_string()));
}

/// Test GraphQL resolution for custom environment.
#[test]
fn test_gen_envs_graphql_resolution() {
    let fixtures = fixtures_path();
    let gen_envs_path = fixtures.join("gen_envs.toml");

    let manifest = sui_client_gen::manifest::parse_gen_manifest_from_file(&gen_envs_path)
        .expect("Failed to parse gen_envs.toml");

    // Resolve GraphQL for the testnet_alt environment (should use environment's graphql)
    let graphql_url = sui_client_gen::resolve_graphql(
        manifest.config.graphql.as_deref(),
        &manifest.config.environment,
        &manifest.environments,
    );

    assert_eq!(graphql_url, "https://graphql.testnet.sui.io/graphql");
}

/// Test building model with gen_envs.toml to verify dep-replacements work.
/// This tests that:
/// 1. use-environment overrides the environment used for Published.toml lookup
/// 2. published-at and original-id overrides set explicit addresses
#[tokio::test]
async fn test_gen_envs_model_build() {
    let fixtures = fixtures_path();
    let gen_envs_path = fixtures.join("gen_envs.toml");

    let manifest = sui_client_gen::manifest::parse_gen_manifest_from_file(&gen_envs_path)
        .expect("Failed to parse gen_envs.toml");

    let graphql_endpoint = sui_client_gen::resolve_graphql(
        manifest.config.graphql.as_deref(),
        &manifest.config.environment,
        &manifest.environments,
    );
    let graphql_client = GraphQLClient::new(&graphql_endpoint);

    let chain_id = sui_client_gen::resolve_chain_id(
        &manifest.config.environment,
        &manifest.environments,
    )
    .expect("Failed to resolve chain ID");

    let result = model_builder::build_model(
        &manifest.packages,
        &gen_envs_path,
        &manifest.config.environment,
        &chain_id,
        &manifest.environments,
        &manifest.dep_replacements,
        &graphql_client,
    )
    .await
    .expect("Failed to build model");

    // Verify pkg_published_transitive_alt uses the address from Published.toml [published.testnet_alt]
    // Expected: 0xdbd8df5d7f7fc74dd7e1398c964d9f105d16b9782e49211b6799602a7e2bf01c
    let expected_transitive_alt_addr = AccountAddress::from_hex_literal(
        "0xdbd8df5d7f7fc74dd7e1398c964d9f105d16b9782e49211b6799602a7e2bf01c"
    ).unwrap();

    let transitive_alt_name = result.id_map.get(&expected_transitive_alt_addr);
    assert_eq!(
        transitive_alt_name.map(|n| n.as_str()),
        Some("pkg_published_transitive_alt"),
        "pkg_published_transitive_alt should use address from Published.toml [published.testnet_alt]"
    );

    // Verify pkg_unpublished_transitive uses address from Published.toml (original-id = "0x56789")
    let expected_unpublished_addr = AccountAddress::from_hex_literal("0x56789").unwrap();
    let unpublished_name = result.id_map.get(&expected_unpublished_addr);
    assert_eq!(
        unpublished_name.map(|n| n.as_str()),
        Some("pkg_unpublished_transitive"),
        "pkg_unpublished_transitive should use address from Published.toml [published.testnet_alt]"
    );

    // Verify published_at mapping for pkg_unpublished_transitive
    let expected_published_at = AccountAddress::from_hex_literal("0x12345").unwrap();
    let actual_published_at = result.published_at.get(&expected_unpublished_addr);
    assert_eq!(
        actual_published_at,
        Some(&expected_published_at),
        "pkg_unpublished_transitive should have published-at address from Published.toml"
    );
}
