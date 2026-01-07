//! Caching layer for GraphQL queries.
//!
//! Provides per-chain-id caching to avoid duplicate queries when building
//! models for multiple environments that share the same chain.

use std::collections::BTreeMap;

use anyhow::Result;
use move_core_types::account_address::AccountAddress;

use super::client::GraphQLClient;
use super::types::{TypeOrigin, TypeOriginMap};

/// Cache for GraphQL query results, keyed by chain ID.
///
/// Multiple environments may share the same chain (e.g., both environments
/// point to mainnet). This cache avoids re-querying the same packages when
/// building models for multiple environments on the same chain.
pub struct GraphQLCache {
    /// Map from chain_id -> per-chain cache
    chains: BTreeMap<String, ChainCache>,
}

/// Per-chain cache for GraphQL results.
struct ChainCache {
    /// GraphQL client for this chain
    client: GraphQLClient,
    /// Cached type origins: package_addr -> type origins
    type_origins: TypeOriginMap,
}

impl GraphQLCache {
    /// Create a new empty cache.
    pub fn new() -> Self {
        Self {
            chains: BTreeMap::new(),
        }
    }

    /// Get or create the chain cache for a given chain ID and GraphQL endpoint.
    fn get_or_create_chain(&mut self, chain_id: &str, graphql_url: &str) -> &mut ChainCache {
        self.chains.entry(chain_id.to_string()).or_insert_with(|| {
            ChainCache {
                client: GraphQLClient::new(graphql_url),
                type_origins: BTreeMap::new(),
            }
        })
    }

    /// Query the chain identifier from a GraphQL endpoint.
    ///
    /// This is not cached since it's typically only called once per environment
    /// during validation.
    pub async fn query_chain_identifier(&self, graphql_url: &str) -> Result<String> {
        let client = GraphQLClient::new(graphql_url);
        client.query_chain_identifier().await
    }

    /// Query type origins for multiple packages, using cache when available.
    ///
    /// Only queries packages that are not already in the cache.
    /// Returns the combined results (cached + newly queried).
    pub async fn query_type_origins(
        &mut self,
        chain_id: &str,
        graphql_url: &str,
        package_addrs: Vec<AccountAddress>,
    ) -> Result<TypeOriginMap> {
        let chain_cache = self.get_or_create_chain(chain_id, graphql_url);

        // Find packages not in cache
        let uncached_addrs: Vec<AccountAddress> = package_addrs
            .iter()
            .filter(|addr| !chain_cache.type_origins.contains_key(addr))
            .copied()
            .collect();

        // Query uncached packages
        if !uncached_addrs.is_empty() {
            let new_results = chain_cache
                .client
                .query_multiple_packages_type_origins(uncached_addrs)
                .await?;

            // Add to cache
            for (addr, origins) in new_results {
                chain_cache.type_origins.insert(addr, origins);
            }
        }

        // Return subset matching requested addresses
        let mut result = TypeOriginMap::new();
        for addr in package_addrs {
            if let Some(origins) = chain_cache.type_origins.get(&addr) {
                result.insert(addr, origins.clone());
            }
        }

        Ok(result)
    }

    /// Get a reference to the GraphQL client for a chain.
    ///
    /// Creates a new client if one doesn't exist for the chain.
    pub fn get_client(&mut self, chain_id: &str, graphql_url: &str) -> &GraphQLClient {
        let chain_cache = self.get_or_create_chain(chain_id, graphql_url);
        &chain_cache.client
    }

    /// Get cached type origins for a package if available.
    pub fn get_cached_type_origins(
        &self,
        chain_id: &str,
        package_addr: &AccountAddress,
    ) -> Option<&Vec<TypeOrigin>> {
        self.chains
            .get(chain_id)
            .and_then(|cache| cache.type_origins.get(package_addr))
    }
}

impl Default for GraphQLCache {
    fn default() -> Self {
        Self::new()
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_cache_creation() {
        let cache = GraphQLCache::new();
        assert!(cache.chains.is_empty());
    }

    #[test]
    fn test_get_or_create_chain() {
        let mut cache = GraphQLCache::new();

        // First access creates the chain
        let _chain = cache.get_or_create_chain("4c78adac", "https://example.com/graphql");
        assert_eq!(cache.chains.len(), 1);

        // Second access with same chain_id reuses existing
        let _chain = cache.get_or_create_chain("4c78adac", "https://example.com/graphql");
        assert_eq!(cache.chains.len(), 1);

        // Different chain_id creates new entry
        let _chain = cache.get_or_create_chain("different", "https://other.com/graphql");
        assert_eq!(cache.chains.len(), 2);
    }
}
