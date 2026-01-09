import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'

/**
 * Should be converted to a native function.
 * Current implementation only works for Sui.
 */
export function length(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::address::length`,
    arguments: [],
  })
}
