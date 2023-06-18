import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export function sha2256(
  txb: TransactionBlock,
  data: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hash::sha2_256`,
    arguments: [pure(txb, data, `vector<u8>`)],
  })
}

export function sha3256(
  txb: TransactionBlock,
  data: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hash::sha3_256`,
    arguments: [pure(txb, data, `vector<u8>`)],
  })
}
