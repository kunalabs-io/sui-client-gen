import { PUBLISHED_AT } from '..'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::other_module::new`, arguments: [] })
}
