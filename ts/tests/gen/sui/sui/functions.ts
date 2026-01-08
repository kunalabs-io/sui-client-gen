import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

/**
 * Register the `SUI` Coin to acquire its `Supply`.
 * This should be called only once during genesis creation.
 */
export function new_(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::sui::new`,
    arguments: [],
  })
}

export interface TransferArgs {
  c: TransactionObjectInput
  recipient: string | TransactionArgument
}

export function transfer(tx: Transaction, args: TransferArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::sui::transfer`,
    arguments: [obj(tx, args.c), pure(tx, args.recipient, `address`)],
  })
}
