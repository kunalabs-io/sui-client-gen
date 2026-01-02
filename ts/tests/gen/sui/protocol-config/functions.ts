import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function isFeatureEnabled(
  tx: Transaction,
  featureFlagName: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::protocol_config::is_feature_enabled`,
    arguments: [pure(tx, featureFlagName, `vector<u8>`)],
  })
}
