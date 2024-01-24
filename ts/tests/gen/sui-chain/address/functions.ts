import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function max(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::address::max`, arguments: [] })
}

export function length(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::address::length`, arguments: [] })
}

export function toBytes(txb: TransactionBlock, address: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::to_bytes`,
    arguments: [pure(txb, address, `address`)],
  })
}

export function toU256(txb: TransactionBlock, address: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::to_u256`,
    arguments: [pure(txb, address, `address`)],
  })
}

export function fromU256(txb: TransactionBlock, u256: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::from_u256`,
    arguments: [pure(txb, u256, `u256`)],
  })
}

export function fromBytes(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::from_bytes`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export function toAsciiString(txb: TransactionBlock, address: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::to_ascii_string`,
    arguments: [pure(txb, address, `address`)],
  })
}

export function toString(txb: TransactionBlock, address: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::to_string`,
    arguments: [pure(txb, address, `address`)],
  })
}

export function fromAsciiBytes(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::from_ascii_bytes`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export function hexCharValue(txb: TransactionBlock, u8: number | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::address::hex_char_value`,
    arguments: [pure(txb, u8, `u8`)],
  })
}
