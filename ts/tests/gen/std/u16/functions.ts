import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'

/**
 * Returns the bitwise not of the value.
 * Each bit that is 1 becomes 0. Each bit that is 0 becomes 1.
 */
export function bitwiseNot(tx: Transaction, x: number | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u16::bitwise_not`,
    arguments: [pure(tx, x, `u16`)],
  })
}

export interface MaxArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

/** Return the larger of `x` and `y` */
export function max(tx: Transaction, args: MaxArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u16::max`,
    arguments: [
      pure(tx, args.x, `u16`),
      pure(tx, args.y, `u16`),
    ],
  })
}

export interface MinArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

/** Return the smaller of `x` and `y` */
export function min(tx: Transaction, args: MinArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u16::min`,
    arguments: [
      pure(tx, args.x, `u16`),
      pure(tx, args.y, `u16`),
    ],
  })
}

export interface DiffArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

/** Return the absolute value of x - y */
export function diff(tx: Transaction, args: DiffArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u16::diff`,
    arguments: [
      pure(tx, args.x, `u16`),
      pure(tx, args.y, `u16`),
    ],
  })
}

export interface DivideAndRoundUpArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

/** Calculate x / y, but round up the result. */
export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u16::divide_and_round_up`,
    arguments: [
      pure(tx, args.x, `u16`),
      pure(tx, args.y, `u16`),
    ],
  })
}

export interface PowArgs {
  base: number | TransactionArgument
  exponent: number | TransactionArgument
}

/** Return the value of a base raised to a power */
export function pow(tx: Transaction, args: PowArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u16::pow`,
    arguments: [
      pure(tx, args.base, `u16`),
      pure(tx, args.exponent, `u8`),
    ],
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
 * math::sqrt(8 * 1000000) => 2828; // same as above, 2828 / 1000 (2.828)
 * ```
 */
export function sqrt(tx: Transaction, x: number | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u16::sqrt`,
    arguments: [pure(tx, x, `u16`)],
  })
}

/** Try to convert a `u16` to a `u8`. Returns `None` if the value is too large. */
export function tryAsU8(tx: Transaction, x: number | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u16::try_as_u8`,
    arguments: [pure(tx, x, `u16`)],
  })
}

export function toString(tx: Transaction, x: number | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u16::to_string`,
    arguments: [pure(tx, x, `u16`)],
  })
}
