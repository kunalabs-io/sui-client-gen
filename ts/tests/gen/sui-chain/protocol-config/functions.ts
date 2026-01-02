import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function isFeatureEnabled(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::protocol_config::is_feature_enabled`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}
