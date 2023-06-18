import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export function decode(
  txb: TransactionBlock,
  hex: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hex::decode`,
    arguments: [pure(txb, hex, `vector<u8>`)],
  })
}

export function decodeByte(txb: TransactionBlock, hex: number | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hex::decode_byte`,
    arguments: [pure(txb, hex, `u8`)],
  })
}

export function encode(
  txb: TransactionBlock,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hex::encode`,
    arguments: [pure(txb, bytes, `vector<u8>`)],
  })
}
