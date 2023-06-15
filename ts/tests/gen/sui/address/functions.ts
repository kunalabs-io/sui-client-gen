import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export function length(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::address::length`, arguments: [] })
}

export function max(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::address::max`, arguments: [] })
}

export function toBytes(txb: TransactionBlock, a: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::to_bytes`,
    arguments: [pure(txb, a, `address`)],
  })
}

export function fromBytes(txb: TransactionBlock, bytes: Array<number | TransactionArgument>) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::from_bytes`,
    arguments: [pure(txb, bytes, `vector<u8>`)],
  })
}

export function fromU256(txb: TransactionBlock, n: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::from_u256`,
    arguments: [pure(txb, n, `u256`)],
  })
}

export function toAsciiString(txb: TransactionBlock, a: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::to_ascii_string`,
    arguments: [pure(txb, a, `address`)],
  })
}

export function toString(txb: TransactionBlock, a: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::to_string`,
    arguments: [pure(txb, a, `address`)],
  })
}

export function toU256(txb: TransactionBlock, a: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::to_u256`,
    arguments: [pure(txb, a, `address`)],
  })
}
