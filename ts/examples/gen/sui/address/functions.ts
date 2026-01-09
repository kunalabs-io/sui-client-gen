import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'

/**
 * Convert `a` into a u256 by interpreting `a` as the bytes of a big-endian integer
 * (e.g., `to_u256(0x1) == 1`)
 */
export function toU256(tx: Transaction, a: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::address::to_u256`,
    arguments: [pure(tx, a, `address`)],
  })
}

/**
 * Convert `n` into an address by encoding it as a big-endian integer (e.g., `from_u256(1) = @0x1`)
 * Aborts if `n` > `MAX_ADDRESS`
 */
export function fromU256(tx: Transaction, n: bigint | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::address::from_u256`,
    arguments: [pure(tx, n, `u256`)],
  })
}

/**
 * Convert `bytes` into an address.
 * Aborts with `EAddressParseError` if the length of `bytes` is not 32
 */
export function fromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::address::from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/** Convert `a` into BCS-encoded bytes. */
export function toBytes(tx: Transaction, a: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::address::to_bytes`,
    arguments: [pure(tx, a, `address`)],
  })
}

/** Convert `a` to a hex-encoded ASCII string */
export function toAsciiString(tx: Transaction, a: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::address::to_ascii_string`,
    arguments: [pure(tx, a, `address`)],
  })
}

/** Convert `a` to a hex-encoded string */
export function toString(tx: Transaction, a: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::address::to_string`,
    arguments: [pure(tx, a, `address`)],
  })
}

/**
 * Converts an ASCII string to an address, taking the numerical value for each character. The
 * string must be Base16 encoded, and thus exactly 64 characters long.
 * For example, the string "00000000000000000000000000000000000000000000000000000000DEADB33F"
 * will be converted to the address @0xDEADB33F.
 * Aborts with `EAddressParseError` if the length of `s` is not 64,
 * or if an invalid character is encountered.
 */
export function fromAsciiBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::address::from_ascii_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function hexCharValue(tx: Transaction, c: number | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::address::hex_char_value`,
    arguments: [pure(tx, c, `u8`)],
  })
}

/** Length of a Sui address in bytes */
export function length(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::address::length`,
    arguments: [],
  })
}

/** Largest possible address */
export function max(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::address::max`,
    arguments: [],
  })
}
