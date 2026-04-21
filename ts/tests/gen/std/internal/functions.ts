import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'

/**
 * Construct a new `Permit` for the type `T`.
 * Can only be called by the module that defines the type `T`.
 */
export function permit(
  tx: Transaction,
  typeArg: string,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std', options?.env)}::internal::permit`,
    typeArguments: [typeArg],
    arguments: [],
  })
}
