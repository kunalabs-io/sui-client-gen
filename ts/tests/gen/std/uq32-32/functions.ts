import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'

export interface FromQuotientArgs {
  numerator: bigint | TransactionArgument
  denominator: bigint | TransactionArgument
}

/**
 * Create a fixed-point value from a quotient specified by its numerator and denominator.
 * `from_quotient` and `from_int` should be preferred over using `from_raw`.
 * Unless the denominator is a power of two, fractions can not be represented accurately,
 * so be careful about rounding errors.
 * Aborts if the denominator is zero.
 * Aborts if the input is non-zero but so small that it will be represented as zero, e.g. smaller
 * than 2^{-32}.
 * Aborts if the input is too large, e.g. larger than or equal to 2^32.
 */
export function fromQuotient(tx: Transaction, args: FromQuotientArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::from_quotient`,
    arguments: [
      pure(tx, args.numerator, `u64`),
      pure(tx, args.denominator, `u64`),
    ],
  })
}

/**
 * Create a fixed-point value from an integer.
 * `from_int` and `from_quotient` should be preferred over using `from_raw`.
 */
export function fromInt(tx: Transaction, integer: number | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::from_int`,
    arguments: [pure(tx, integer, `u32`)],
  })
}

export interface AddArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

/**
 * Add two fixed-point numbers, `a + b`.
 * Aborts if the sum overflows.
 */
export function add(tx: Transaction, args: AddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::add`,
    arguments: [
      obj(tx, args.a),
      obj(tx, args.b),
    ],
  })
}

export interface SubArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

/**
 * Subtract two fixed-point numbers, `a - b`.
 * Aborts if `a < b`.
 */
export function sub(tx: Transaction, args: SubArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::sub`,
    arguments: [
      obj(tx, args.a),
      obj(tx, args.b),
    ],
  })
}

export interface MulArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

/**
 * Multiply two fixed-point numbers, truncating any fractional part of the product.
 * Aborts if the product overflows.
 */
export function mul(tx: Transaction, args: MulArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::mul`,
    arguments: [
      obj(tx, args.a),
      obj(tx, args.b),
    ],
  })
}

export interface DivArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

/**
 * Divide two fixed-point numbers, truncating any fractional part of the quotient.
 * Aborts if the divisor is zero.
 * Aborts if the quotient overflows.
 */
export function div(tx: Transaction, args: DivArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::div`,
    arguments: [
      obj(tx, args.a),
      obj(tx, args.b),
    ],
  })
}

/** Convert a fixed-point number to an integer, truncating any fractional part. */
export function toInt(tx: Transaction, a: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::to_int`,
    arguments: [obj(tx, a)],
  })
}

export interface IntMulArgs {
  val: bigint | TransactionArgument
  multiplier: TransactionObjectInput
}

/**
 * Multiply a `u64` integer by a fixed-point number, truncating any fractional part of the product.
 * Aborts if the product overflows.
 */
export function intMul(tx: Transaction, args: IntMulArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::int_mul`,
    arguments: [
      pure(tx, args.val, `u64`),
      obj(tx, args.multiplier),
    ],
  })
}

export interface IntDivArgs {
  val: bigint | TransactionArgument
  divisor: TransactionObjectInput
}

/**
 * Divide a `u64` integer by a fixed-point number, truncating any fractional part of the quotient.
 * Aborts if the divisor is zero.
 * Aborts if the quotient overflows.
 */
export function intDiv(tx: Transaction, args: IntDivArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::int_div`,
    arguments: [
      pure(tx, args.val, `u64`),
      obj(tx, args.divisor),
    ],
  })
}

export interface LeArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

/** Less than or equal to. Returns `true` if and only if `a <= a`. */
export function le(tx: Transaction, args: LeArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::le`,
    arguments: [
      obj(tx, args.a),
      obj(tx, args.b),
    ],
  })
}

export interface LtArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

/** Less than. Returns `true` if and only if `a < b`. */
export function lt(tx: Transaction, args: LtArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::lt`,
    arguments: [
      obj(tx, args.a),
      obj(tx, args.b),
    ],
  })
}

export interface GeArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

/** Greater than or equal to. Returns `true` if and only if `a >= b`. */
export function ge(tx: Transaction, args: GeArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::ge`,
    arguments: [
      obj(tx, args.a),
      obj(tx, args.b),
    ],
  })
}

export interface GtArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

/** Greater than. Returns `true` if and only if `a > b`. */
export function gt(tx: Transaction, args: GtArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::gt`,
    arguments: [
      obj(tx, args.a),
      obj(tx, args.b),
    ],
  })
}

/**
 * Accessor for the raw u64 value. Can be paired with `from_raw` to perform less common operations
 * on the raw values directly.
 */
export function toRaw(tx: Transaction, a: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::to_raw`,
    arguments: [obj(tx, a)],
  })
}

/**
 * Accessor for the raw u64 value. Can be paired with `to_raw` to perform less common operations
 * on the raw values directly.
 */
export function fromRaw(
  tx: Transaction,
  rawValue: bigint | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::uq32_32::from_raw`,
    arguments: [pure(tx, rawValue, `u64`)],
  })
}
