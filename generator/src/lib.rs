pub mod driver;
pub mod framework_sources;
pub mod graphql;
pub mod io;
pub mod layout;
pub mod manifest;
pub mod model_builder;
pub mod ts_gen;

/// Default GraphQL endpoint for Sui mainnet.
pub const DEFAULT_GRAPHQL: &str = "https://graphql.mainnet.sui.io/graphql";
