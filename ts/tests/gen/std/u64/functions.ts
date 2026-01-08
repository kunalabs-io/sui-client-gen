import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

/**
 * Returns the bitwise not of the value.
 * Each bit that is 1 becomes 0. Each bit that is 0 becomes 1.
 */
export function bitwiseNot(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::bitwise_not`,
    arguments: [pure(tx, x, `u64`)],
  })
}

export interface MaxArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** Return the larger of `x` and `y` */
export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::max`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface MinArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** Return the smaller of `x` and `y` */
export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::min`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface DiffArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** Return the absolute value of x - y */
export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::diff`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface DivideAndRoundUpArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** Calculate x / y, but round up the result. */
export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::divide_and_round_up`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface PowArgs {
  base: bigint | TransactionArgument
  exponent: number | TransactionArgument
}

/** Return the value of a base raised to a power */
export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::pow`,
    arguments: [pure(tx, args.base, `u64`), pure(tx, args.exponent, `u8`)],
  })
}

/**
 * Get a nearest lower integer Square Root for `x`. Given that this
 * function can only operate with integers, it is impossible
 * to get perfect (or precise) integer square root for some numbers.
 *
 * Example:
 * ```
 * math::sqrt(9) => 3
 * math::sqrt(8) => 2 // the nearest lower square root is 4;
 * ```
 *
 * In integer math, one of the possible ways to get results with more
 * precision is to use higher values or temporarily multiply the
 * value by some bigger number. Ideally if this is a square of 10 or 100.
 *
 * Example:
 * ```
 * math::sqrt(8) => 2;
 * math::sqrt(8 * 10000) => 282;
 * // now we can use this value as if it was 2.82;
 * // but to get the actual result, this value needs
 * // to be divided by 100 (because sqrt(10000)).
 *
 *
 * math::sqrt(8 * 1000000) => 2828; // same as above, 2828 / 1000 (2.828)
 * ```
 */
export function sqrt(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::sqrt`,
    arguments: [pure(tx, x, `u64`)],
  })
}

/** Try to convert a `u64` to a `u8`. Returns `None` if the value is too large. */
export function tryAsU8(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::try_as_u8`,
    arguments: [pure(tx, x, `u64`)],
  })
}

/** Try to convert a `u64` to a `u16`. Returns `None` if the value is too large. */
export function tryAsU16(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::try_as_u16`,
    arguments: [pure(tx, x, `u64`)],
  })
}

/** Try to convert a `u64` to a `u32`. Returns `None` if the value is too large. */
export function tryAsU32(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::try_as_u32`,
    arguments: [pure(tx, x, `u64`)],
  })
}

export function toString(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u64::to_string`,
    arguments: [pure(tx, x, `u64`)],
  })
}
