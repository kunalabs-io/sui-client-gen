import { PUBLISHED_AT } from '..'
import { Transaction } from '@mysten/sui/transactions'

export function permit(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::internal::permit`,
    typeArguments: [typeArg],
    arguments: [],
  })
}
