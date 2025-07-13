import { PUBLISHED_AT } from '..'
import { Transaction } from '@mysten/sui/transactions'

export function create(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::accumulator::create`, arguments: [] })
}
