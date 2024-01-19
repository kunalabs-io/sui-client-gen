import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function blake2b256(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hash::blake2b256`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export function keccak256(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hash::keccak256`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}
