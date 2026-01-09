import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'

export function new_(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::other_module::new`,
    arguments: [],
  })
}
