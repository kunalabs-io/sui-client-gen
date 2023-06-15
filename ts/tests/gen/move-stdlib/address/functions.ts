import { PUBLISHED_AT } from '..'
import { TransactionBlock } from '@mysten/sui.js'

export function length(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::address::length`, arguments: [] })
}
