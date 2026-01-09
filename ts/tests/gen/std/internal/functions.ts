import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'

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
