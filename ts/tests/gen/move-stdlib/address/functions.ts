import { PUBLISHED_AT } from '..'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function length(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::length`,
    arguments: [],
  })
}
