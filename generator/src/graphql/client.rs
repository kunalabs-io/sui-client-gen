use anyhow::Result;
use move_core_types::account_address::AccountAddress;
use serde::de::DeserializeOwned;
use serde_json::json;

use super::types::{ChainIdentifierResponse, GraphQLResponse, TypeOrigin, TypeOriginMap};

/// GraphQL query strings
mod queries {
    pub const CHAIN_IDENTIFIER: &str = r#"
        query {
            chainIdentifier
        }
    "#;

    pub const PACKAGE_TYPE_ORIGINS: &str = r#"
        query GetPackageTypeOrigins($packageAddr: SuiAddress!) {
            package(address: $packageAddr) {
                typeOrigins {
                    module
                    struct
                    definingId
                }
            }
        }
    "#;
}

/// GraphQL client for querying Sui packages
pub struct GraphQLClient {
    client: reqwest::Client,
    endpoint: String,
}

impl GraphQLClient {
    /// Create a new GraphQL client
    pub fn new(endpoint: impl Into<String>) -> Self {
        Self {
            client: reqwest::Client::new(),
            endpoint: endpoint.into(),
        }
    }

    /// Execute a GraphQL query and return raw JSON response
    async fn execute_raw_query(
        &self,
        query: &str,
        variables: serde_json::Value,
    ) -> Result<serde_json::Value> {
        let request = json!({
            "query": query,
            "variables": variables
        });

        let response = self
            .client
            .post(&self.endpoint)
            .json(&request)
            .send()
            .await?;

        let json_response: serde_json::Value = response.json().await?;

        // Check for GraphQL errors
        if let Some(errors) = json_response.get("errors") {
            if let Some(arr) = errors.as_array() {
                let messages: Vec<String> = arr
                    .iter()
                    .filter_map(|e| e.get("message").and_then(|m| m.as_str()))
                    .map(String::from)
                    .collect();
                if !messages.is_empty() {
                    return Err(anyhow::anyhow!("GraphQL errors: {}", messages.join(", ")));
                }
            }
        }

        Ok(json_response)
    }

    /// Execute a GraphQL query with typed response
    async fn execute_query<T: DeserializeOwned>(
        &self,
        query: &str,
        variables: serde_json::Value,
    ) -> Result<T> {
        let json_response = self.execute_raw_query(query, variables).await?;
        let typed: T = serde_json::from_value(json_response)?;
        Ok(typed)
    }

    /// Query the chain identifier from the GraphQL endpoint.
    ///
    /// Returns the first 4 bytes of the genesis checkpoint digest as hex (8 characters).
    pub async fn query_chain_identifier(&self) -> Result<String> {
        let response: ChainIdentifierResponse = self
            .execute_query(queries::CHAIN_IDENTIFIER, json!({}))
            .await?;

        match response.data {
            Some(data) => Ok(data.chain_identifier),
            None => Err(anyhow::anyhow!("No chain identifier returned from GraphQL endpoint")),
        }
    }

    /// Query a single package's type origins
    pub async fn query_package_type_origins(
        &self,
        package_addr: AccountAddress,
    ) -> Result<Vec<TypeOrigin>> {
        let addr_str = format!("0x{:x}", package_addr);
        let variables = json!({
            "packageAddr": &addr_str
        });

        let response: GraphQLResponse = self
            .execute_query(queries::PACKAGE_TYPE_ORIGINS, variables)
            .await?;

        match response.data {
            Some(data) => match data.package {
                Some(pkg) => Ok(pkg.type_origins),
                None => Err(anyhow::anyhow!("Package not found at address {}", addr_str)),
            },
            None => Err(anyhow::anyhow!("No data returned for package {}", addr_str)),
        }
    }

    /// Query multiple packages' type origins in parallel.
    ///
    /// Packages that are not found on-chain are skipped (logged as warning).
    /// Only successfully queried packages are included in the result.
    pub async fn query_multiple_packages_type_origins(
        &self,
        package_addrs: Vec<AccountAddress>,
    ) -> Result<TypeOriginMap> {
        use futures::future;

        // Query all packages in parallel
        let results = future::join_all(
            package_addrs
                .iter()
                .map(|&addr| async move {
                    let result = self.query_package_type_origins(addr).await;
                    (addr, result)
                })
                .collect::<Vec<_>>(),
        )
        .await;

        let mut map = TypeOriginMap::new();
        for (addr, result) in results {
            match result {
                Ok(origins) => {
                    map.insert(addr, origins);
                }
                Err(e) => {
                    // Log warning but continue - package will use self-origin
                    eprintln!(
                        "Warning: Failed to fetch type origins for 0x{:x}: {}",
                        addr,
                        e
                    );
                }
            }
        }

        Ok(map)
    }
}
