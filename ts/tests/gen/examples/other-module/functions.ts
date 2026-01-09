import { getPublishedAt } from '../../_envs'
import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'

export function new_(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::other_module::new`,
    arguments: [],
  })
}
