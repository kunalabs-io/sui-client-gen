import { getPublishedAt } from '../../_envs'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function new_(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::other_module::new`,
    arguments: [],
  })
}
