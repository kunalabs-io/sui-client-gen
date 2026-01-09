import { getPublishedAt } from '../../_envs'
import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'

/**
 * Construct a new `Permit` for the type `T`.
 * Can only be called by the module that defines the type `T`.
 */
export function permit(tx: Transaction, typeArg: string): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::internal::permit`,
    typeArguments: [typeArg],
    arguments: [],
  })
}
