import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function encode(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hex::encode`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export function decode(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hex::decode`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export function decodeByte(txb: TransactionBlock, u8: number | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hex::decode_byte`,
    arguments: [pure(txb, u8, `u8`)],
  })
}
