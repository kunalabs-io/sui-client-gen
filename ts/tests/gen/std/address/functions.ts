import { getPublishedAt } from '../../_envs'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function length(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::address::length`,
    arguments: [],
  })
}
