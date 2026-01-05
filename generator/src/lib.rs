pub mod driver;
pub mod framework_sources;
pub mod graphql;
pub mod io;
pub mod layout;
pub mod manifest;
pub mod model_builder;
pub mod ts_gen;

use move_package_alt::flavor::MoveFlavor;
use sui_package_alt::SuiFlavor;

/// Default GraphQL endpoint for Sui mainnet.
pub const DEFAULT_GRAPHQL: &str = "https://graphql.mainnet.sui.io/graphql";

/// Get the expected chain identifier for a given environment name.
///
/// Returns `None` for unknown environments (which will skip validation).
pub fn expected_chain_id(environment: &str) -> Option<String> {
    SuiFlavor::default_environments()
        .get(environment)
        .cloned()
}
