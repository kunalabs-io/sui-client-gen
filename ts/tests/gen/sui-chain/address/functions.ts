import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function toU256(tx: Transaction, address: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::to_u256`,
    arguments: [pure(tx, address, `address`)],
  })
}

export function fromU256(tx: Transaction, u256: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::from_u256`,
    arguments: [pure(tx, u256, `u256`)],
  })
}

export function fromBytes(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::from_bytes`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function toBytes(tx: Transaction, address: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::to_bytes`,
    arguments: [pure(tx, address, `address`)],
  })
}

export function toAsciiString(tx: Transaction, address: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::to_ascii_string`,
    arguments: [pure(tx, address, `address`)],
  })
}

export function toString(tx: Transaction, address: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::to_string`,
    arguments: [pure(tx, address, `address`)],
  })
}

export function fromAsciiBytes(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::from_ascii_bytes`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function hexCharValue(tx: Transaction, u8: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::hex_char_value`,
    arguments: [pure(tx, u8, `u8`)],
  })
}

export function length(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::length`,
    arguments: [],
  })
}

export function max(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::address::max`,
    arguments: [],
  })
}
