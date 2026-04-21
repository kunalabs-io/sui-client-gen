import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'

/**
 * Register the `SUI` Coin to acquire its `Supply`.
 * This should be called only once during genesis creation.
 */
export function new_(tx: Transaction, options?: { env?: EnvConfig }): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::sui::new`,
    arguments: [],
  })
}

export interface TransferArgs {
  c: TransactionObjectInput
  recipient: string | TransactionArgument
}

export function transfer(
  tx: Transaction,
  args: TransferArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::sui::transfer`,
    arguments: [
      obj(tx, args.c),
      pure(tx, args.recipient, `address`),
    ],
  })
}
