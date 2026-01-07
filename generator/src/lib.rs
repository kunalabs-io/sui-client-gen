pub mod driver;
pub mod framework_sources;
pub mod graphql;
pub mod io;
pub mod layout;
pub mod manifest;
pub mod model_builder;
pub mod multi_env;
pub mod ts_gen;

use manifest::Environments;
use move_package_alt::flavor::MoveFlavor;
use sui_package_alt::SuiFlavor;

/// Default GraphQL endpoint for Sui mainnet.
pub const DEFAULT_GRAPHQL: &str = "https://graphql.mainnet.sui.io/graphql";

/// Default GraphQL endpoint for Sui testnet.
pub const DEFAULT_TESTNET_GRAPHQL: &str = "https://graphql.testnet.sui.io/graphql";

/// Resolve the chain ID for a given environment.
///
/// Resolution order:
/// 1. Custom environment from `[environments]` section (chain_id field)
/// 2. Default environment from `SuiFlavor::default_environments()` (mainnet/testnet)
///
/// Returns `None` if environment is neither in `[environments]` nor a default.
pub fn resolve_chain_id(environment: &str, environments: &Environments) -> Option<String> {
    // Check custom environments first
    if let Some(env) = environments.get(environment) {
        return env.chain_id.clone();
    }
    // Fall back to defaults
    SuiFlavor::default_environments()
        .get(environment)
        .cloned()
}

/// Resolve the GraphQL endpoint for a given environment.
///
/// Resolution order (highest priority first):
/// 1. `config_graphql` - explicit override in `[config]` section
/// 2. Environment's graphql field from `[environments]` section
/// 3. Hardcoded defaults (mainnet: DEFAULT_GRAPHQL, testnet: DEFAULT_TESTNET_GRAPHQL)
pub fn resolve_graphql(
    config_graphql: Option<&str>,
    environment: &str,
    environments: &Environments,
) -> String {
    // Priority 1: config.graphql override
    if let Some(url) = config_graphql {
        return url.to_string();
    }
    // Priority 2: environments.<env>.graphql
    if let Some(env) = environments.get(environment) {
        if let Some(url) = &env.graphql {
            return url.clone();
        }
    }
    // Priority 3: hardcoded defaults
    match environment {
        "testnet" => DEFAULT_TESTNET_GRAPHQL.to_string(),
        _ => DEFAULT_GRAPHQL.to_string(), // mainnet or any other defaults to mainnet
    }
}
