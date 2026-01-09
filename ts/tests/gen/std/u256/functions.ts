import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'

/**
 * Returns the bitwise not of the value.
 * Each bit that is 1 becomes 0. Each bit that is 0 becomes 1.
 */
export function bitwiseNot(tx: Transaction, x: bigint | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::bitwise_not`,
    arguments: [pure(tx, x, `u256`)],
  })
}

export interface MaxArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** Return the larger of `x` and `y` */
export function max(tx: Transaction, args: MaxArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::max`,
    arguments: [pure(tx, args.x, `u256`), pure(tx, args.y, `u256`)],
  })
}

export interface MinArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** Return the smaller of `x` and `y` */
export function min(tx: Transaction, args: MinArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::min`,
    arguments: [pure(tx, args.x, `u256`), pure(tx, args.y, `u256`)],
  })
}

export interface DiffArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** Return the absolute value of x - y */
export function diff(tx: Transaction, args: DiffArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::diff`,
    arguments: [pure(tx, args.x, `u256`), pure(tx, args.y, `u256`)],
  })
}

export interface DivideAndRoundUpArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** Calculate x / y, but round up the result. */
export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::divide_and_round_up`,
    arguments: [pure(tx, args.x, `u256`), pure(tx, args.y, `u256`)],
  })
}

export interface PowArgs {
  base: bigint | TransactionArgument
  exponent: number | TransactionArgument
}

/** Return the value of a base raised to a power */
export function pow(tx: Transaction, args: PowArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::pow`,
    arguments: [pure(tx, args.base, `u256`), pure(tx, args.exponent, `u8`)],
  })
}

/** Try to convert a `u256` to a `u8`. Returns `None` if the value is too large. */
export function tryAsU8(tx: Transaction, x: bigint | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::try_as_u8`,
    arguments: [pure(tx, x, `u256`)],
  })
}

/** Try to convert a `u256` to a `u16`. Returns `None` if the value is too large. */
export function tryAsU16(tx: Transaction, x: bigint | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::try_as_u16`,
    arguments: [pure(tx, x, `u256`)],
  })
}

/** Try to convert a `u256` to a `u32`. Returns `None` if the value is too large. */
export function tryAsU32(tx: Transaction, x: bigint | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::try_as_u32`,
    arguments: [pure(tx, x, `u256`)],
  })
}

/** Try to convert a `u256` to a `u64`. Returns `None` if the value is too large. */
export function tryAsU64(tx: Transaction, x: bigint | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::try_as_u64`,
    arguments: [pure(tx, x, `u256`)],
  })
}

/** Try to convert a `u256` to a `u128`. Returns `None` if the value is too large. */
export function tryAsU128(tx: Transaction, x: bigint | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::try_as_u128`,
    arguments: [pure(tx, x, `u256`)],
  })
}

export function toString(tx: Transaction, x: bigint | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u256::to_string`,
    arguments: [pure(tx, x, `u256`)],
  })
}
