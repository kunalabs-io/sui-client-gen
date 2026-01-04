use move_core_types::account_address::AccountAddress;
use serde::Deserialize;
use std::collections::BTreeMap;

/// GraphQL response wrapper
#[derive(Debug, Deserialize)]
pub(super) struct GraphQLResponse {
    pub data: Option<GraphQLData>,
    pub errors: Option<Vec<GraphQLError>>,
}

/// GraphQL error
#[derive(Debug, Deserialize)]
#[allow(dead_code)]
pub(super) struct GraphQLError {
    pub message: String,
    #[serde(default)]
    pub locations: Vec<GraphQLLocation>,
}

/// GraphQL error location
#[derive(Debug, Deserialize)]
#[allow(dead_code)]
pub(super) struct GraphQLLocation {
    pub line: u32,
    pub column: u32,
}

/// Top-level GraphQL data for type origins query
#[derive(Debug, Deserialize)]
pub(super) struct GraphQLData {
    pub package: Option<PackageData>,
}

/// Package data from GraphQL (type origins)
#[derive(Debug, Deserialize)]
pub(super) struct PackageData {
    #[serde(rename = "typeOrigins")]
    pub type_origins: Vec<TypeOrigin>,
}

/// Type origin information from GraphQL
#[derive(Debug, Deserialize, Clone)]
pub struct TypeOrigin {
    pub module: String,
    #[serde(rename = "struct")]
    pub struct_name: String,
    #[serde(rename = "definingId")]
    pub defining_id: String,
}

/// Map of package addresses to their type origins
pub type TypeOriginMap = BTreeMap<AccountAddress, Vec<TypeOrigin>>;
