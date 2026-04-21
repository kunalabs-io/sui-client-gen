import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'

/**
 * Should be converted to a native function.
 * Current implementation only works for Sui.
 */
export function length(tx: Transaction, options?: { env?: EnvConfig }): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std', options?.env)}::address::length`,
    arguments: [],
  })
}
