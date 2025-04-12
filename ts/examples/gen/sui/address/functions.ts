import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function toU256(tx: Transaction, a: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::to_u256`,
    arguments: [pure(tx, a, `address`)],
  })
}

export function fromU256(tx: Transaction, n: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::from_u256`,
    arguments: [pure(tx, n, `u256`)],
  })
}

export function fromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function toBytes(tx: Transaction, a: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::to_bytes`,
    arguments: [pure(tx, a, `address`)],
  })
}

export function toAsciiString(tx: Transaction, a: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::to_ascii_string`,
    arguments: [pure(tx, a, `address`)],
  })
}

export function toString(tx: Transaction, a: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::to_string`,
    arguments: [pure(tx, a, `address`)],
  })
}

export function fromAsciiBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::from_ascii_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function hexCharValue(tx: Transaction, c: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::hex_char_value`,
    arguments: [pure(tx, c, `u8`)],
  })
}

export function length(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::address::length`, arguments: [] })
}

export function max(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::address::max`, arguments: [] })
}
