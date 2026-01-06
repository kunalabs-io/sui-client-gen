import { getPublishedAt } from '../../_envs'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function permit(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::internal::permit`,
    typeArguments: [typeArg],
    arguments: [],
  })
}
