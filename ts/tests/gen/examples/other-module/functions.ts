import { PUBLISHED_AT } from '..'
import { Transaction } from '@mysten/sui/transactions'

export function new_(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::other_module::new`, arguments: [] })
}
