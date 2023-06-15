use std::{
    collections::{BTreeMap, HashSet},
    sync::Arc,
};

use anyhow::{anyhow, Result};
use move_core_types::account_address::AccountAddress;
use sui_json_rpc_types::{SuiObjectDataOptions, SuiRawData, SuiRawMovePackage};
use sui_sdk::{apis::ReadApi, types::base_types::ObjectID};
use tokio::sync::RwLock;

pub struct PackageCache<'a> {
    rpc_client: &'a ReadApi,
    cache: Arc<RwLock<BTreeMap<AccountAddress, SuiRawMovePackage>>>,
}

impl<'a> PackageCache<'a> {
    pub fn new(rpc_client: &'a ReadApi) -> Self {
        Self {
            rpc_client,
            cache: Arc::new(RwLock::new(BTreeMap::new())),
        }
    }

    async fn fetch_missing_pkgs(&mut self, addrs: &[AccountAddress]) -> Result<()> {
        let cache = self.cache.read().await;
        let to_fetch = addrs
            .iter()
            .filter(|addr| !cache.contains_key(addr))
            .map(|addr| ObjectID::from(*addr))
            .collect::<HashSet<_>>()
            .into_iter()
            .collect::<Vec<_>>();
        drop(cache);

        if to_fetch.is_empty() {
            return Ok(());
        }

        let fetch_res = self
            .rpc_client
            .multi_get_object_with_options(to_fetch, SuiObjectDataOptions::new().with_bcs())
            .await?;
        let mut cache = self.cache.write().await;
        for obj_read in fetch_res {
            let obj = obj_read
                .into_object()
                .map_err(|e| anyhow!("package object does not exist or was deleted: {}", e))?;
            let addr = AccountAddress::from(obj.object_id);
            let obj = obj.bcs.ok_or_else(|| anyhow!("bcs field not found"))?;
            match obj {
                SuiRawData::Package(pkg) => {
                    cache.insert(addr, pkg);
                }
                SuiRawData::MoveObject(_) => {
                    return Err(anyhow!(
                        "dependency ID contains a Sui object, not a Move package: {}",
                        addr
                    ));
                }
            }
        }

        Ok(())
    }

    pub async fn get_multi(
        &mut self,
        addrs: Vec<AccountAddress>,
    ) -> Result<Vec<SuiRawMovePackage>> {
        self.fetch_missing_pkgs(&addrs).await?;

        let cache = self.cache.read().await;
        let pkgs = addrs
            .iter()
            .map(|addr| cache.get(addr).cloned().unwrap())
            .collect();
        Ok(pkgs)
    }

    pub async fn get(&mut self, addr: AccountAddress) -> Result<SuiRawMovePackage> {
        self.fetch_missing_pkgs(&[addr]).await?;

        let cache = self.cache.read().await;
        let pkg = cache.get(&addr).cloned().unwrap();
        Ok(pkg)
    }
}

impl Clone for PackageCache<'_> {
    fn clone(&self) -> Self {
        Self {
            rpc_client: self.rpc_client,
            cache: self.cache.clone(),
        }
    }
}
