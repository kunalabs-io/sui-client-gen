import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export function blake2b256(txb: TransactionBlock, data: Array<number | TransactionArgument>) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hash::blake2b256`,
    arguments: [pure(txb, data, `vector<u8>`)],
  })
}

export function keccak256(txb: TransactionBlock, data: Array<number | TransactionArgument>) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hash::keccak256`,
    arguments: [pure(txb, data, `vector<u8>`)],
  })
}
