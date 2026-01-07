//! Integration tests for multi-environment code generation with compatibility checking.
//!
//! This test suite verifies:
//! - `multi_env_basic`: Compatible environments (same struct structure) should succeed
//! - `multi_env_fail`: Incompatible environments (different struct fields) should fail
//!
//! ## Running Tests
//! ```bash
//! cargo test --test multi_env_integration
//! ```

use std::path::PathBuf;

use sui_client_gen::graphql::GraphQLCache;
use sui_client_gen::manifest::parse_gen_manifest_from_file;
use sui_client_gen::multi_env::build_multi_env_models;

/// Get the path to multi_env_basic fixtures
fn multi_env_basic_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests/fixtures/multi_env_basic")
}

/// Get the path to multi_env_fail fixtures
fn multi_env_fail_path() -> PathBuf {
    PathBuf::from(env!("CARGO_MANIFEST_DIR")).join("tests/fixtures/multi_env_fail")
}

// ===========================================================================
// MULTI-ENV BASIC TESTS (should succeed)
// ===========================================================================

#[tokio::test]
async fn test_multi_env_basic_succeeds() {
    let fixtures = multi_env_basic_path();
    let gen_toml_path = fixtures.join("gen.toml");

    let manifest =
        parse_gen_manifest_from_file(&gen_toml_path).expect("Failed to parse fixture gen.toml");

    let mut graphql_cache = GraphQLCache::new();

    let result = build_multi_env_models(&manifest, &gen_toml_path, &mut graphql_cache).await;

    assert!(
        result.is_ok(),
        "multi_env_basic should succeed but got: {:?}",
        result.err()
    );

    let multi_env_result = result.unwrap();

    // Verify both environments were processed
    assert_eq!(
        multi_env_result.all_envs.len(),
        2,
        "Should have 2 environments"
    );
    assert!(
        multi_env_result.all_envs.contains(&"env_1".to_string()),
        "Should contain env_1"
    );
    assert!(
        multi_env_result.all_envs.contains(&"env_2".to_string()),
        "Should contain env_2"
    );

    // Verify default environment
    assert_eq!(
        multi_env_result.default_env, "env_1",
        "Default env should be env_1"
    );

    // Verify we have type origins for both environments
    assert!(
        multi_env_result.env_type_origins.contains_key("env_1"),
        "Should have type origins for env_1"
    );
    assert!(
        multi_env_result.env_type_origins.contains_key("env_2"),
        "Should have type origins for env_2"
    );
}

#[tokio::test]
async fn test_multi_env_basic_asymmetry_allowed() {
    // In multi_env_basic:
    // - env_1: dep::lib::DepStruct { value: u64 }, new_dep(u64)
    // - env_2: dep::lib::DepStruct { value: u64 }, new_dep(u64), get_value(&DepStruct)
    //
    // The extra function in env_2 should be allowed (asymmetry is OK)
    let fixtures = multi_env_basic_path();
    let gen_toml_path = fixtures.join("gen.toml");

    let manifest =
        parse_gen_manifest_from_file(&gen_toml_path).expect("Failed to parse fixture gen.toml");

    let mut graphql_cache = GraphQLCache::new();

    let result = build_multi_env_models(&manifest, &gen_toml_path, &mut graphql_cache).await;

    assert!(
        result.is_ok(),
        "Asymmetric environments (extra function in env_2) should be allowed"
    );
}

// ===========================================================================
// MULTI-ENV FAIL TESTS (should fail with compatibility error)
// ===========================================================================

#[tokio::test]
async fn test_multi_env_fail_incompatible() {
    // In multi_env_fail:
    // - env_1: dep::lib::DepStruct { value: u64 }
    // - env_2: dep::lib::DepStruct { value: u64, another_value: u64 }
    //
    // Different field count should be detected as incompatible
    let fixtures = multi_env_fail_path();
    let gen_toml_path = fixtures.join("gen.toml");

    let manifest =
        parse_gen_manifest_from_file(&gen_toml_path).expect("Failed to parse fixture gen.toml");

    let mut graphql_cache = GraphQLCache::new();

    let result = build_multi_env_models(&manifest, &gen_toml_path, &mut graphql_cache).await;

    let error = match result {
        Err(e) => e,
        Ok(_) => panic!("multi_env_fail should fail due to incompatible struct"),
    };
    let error_msg = error.to_string();

    // Verify the error message contains helpful information
    assert!(
        error_msg.contains("compatibility") || error_msg.contains("incompatible"),
        "Error should mention compatibility: {}",
        error_msg
    );
    assert!(
        error_msg.contains("DepStruct"),
        "Error should mention the incompatible struct name: {}",
        error_msg
    );
}

#[tokio::test]
async fn test_multi_env_fail_error_mentions_envs() {
    let fixtures = multi_env_fail_path();
    let gen_toml_path = fixtures.join("gen.toml");

    let manifest =
        parse_gen_manifest_from_file(&gen_toml_path).expect("Failed to parse fixture gen.toml");

    let mut graphql_cache = GraphQLCache::new();

    let result = build_multi_env_models(&manifest, &gen_toml_path, &mut graphql_cache).await;

    let error = match result {
        Err(e) => e,
        Ok(_) => panic!("multi_env_fail should fail"),
    };
    let error_msg = error.to_string();

    // Error should mention which environments are incompatible
    assert!(
        error_msg.contains("env_1") || error_msg.contains("env_2"),
        "Error should mention environment names: {}",
        error_msg
    );
}

#[tokio::test]
async fn test_multi_env_fail_error_mentions_field_difference() {
    let fixtures = multi_env_fail_path();
    let gen_toml_path = fixtures.join("gen.toml");

    let manifest =
        parse_gen_manifest_from_file(&gen_toml_path).expect("Failed to parse fixture gen.toml");

    let mut graphql_cache = GraphQLCache::new();

    let result = build_multi_env_models(&manifest, &gen_toml_path, &mut graphql_cache).await;

    let error = match result {
        Err(e) => e,
        Ok(_) => panic!("multi_env_fail should fail"),
    };
    let error_msg = error.to_string();

    // Error should explain the difference (different field count or fields)
    assert!(
        error_msg.contains("field") || error_msg.contains("1") && error_msg.contains("2"),
        "Error should explain the field difference: {}",
        error_msg
    );
}
