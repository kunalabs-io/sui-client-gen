import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface MultiplyU64Args {
  val: bigint | TransactionArgument
  multiplier: TransactionObjectInput
}

/**
 * Multiply a u64 integer by a fixed-point number, truncating any
 * fractional part of the product. This will abort if the product
 * overflows.
 */
export function multiplyU64(tx: Transaction, args: MultiplyU64Args) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::fixed_point32::multiply_u64`,
    arguments: [pure(tx, args.val, `u64`), obj(tx, args.multiplier)],
  })
}

export interface DivideU64Args {
  val: bigint | TransactionArgument
  divisor: TransactionObjectInput
}

/**
 * Divide a u64 integer by a fixed-point number, truncating any
 * fractional part of the quotient. This will abort if the divisor
 * is zero or if the quotient overflows.
 */
export function divideU64(tx: Transaction, args: DivideU64Args) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::fixed_point32::divide_u64`,
    arguments: [pure(tx, args.val, `u64`), obj(tx, args.divisor)],
  })
}

export interface CreateFromRationalArgs {
  numerator: bigint | TransactionArgument
  denominator: bigint | TransactionArgument
}

/**
 * Create a fixed-point value from a rational number specified by its
 * numerator and denominator. Calling this function should be preferred
 * for using `Self::create_from_raw_value` which is also available.
 * This will abort if the denominator is zero. It will also
 * abort if the numerator is nonzero and the ratio is not in the range
 * 2^-32 .. 2^32-1. When specifying decimal fractions, be careful about
 * rounding errors: if you round to display N digits after the decimal
 * point, you can use a denominator of 10^N to avoid numbers where the
 * very small imprecision in the binary representation could change the
 * rounding, e.g., 0.0125 will round down to 0.012 instead of up to 0.013.
 */
export function createFromRational(tx: Transaction, args: CreateFromRationalArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::fixed_point32::create_from_rational`,
    arguments: [pure(tx, args.numerator, `u64`), pure(tx, args.denominator, `u64`)],
  })
}

/** Create a fixedpoint value from a raw value. */
export function createFromRawValue(tx: Transaction, value: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::fixed_point32::create_from_raw_value`,
    arguments: [pure(tx, value, `u64`)],
  })
}

/**
 * Accessor for the raw u64 value. Other less common operations, such as
 * adding or subtracting FixedPoint32 values, can be done using the raw
 * values directly.
 */
export function getRawValue(tx: Transaction, num: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::fixed_point32::get_raw_value`,
    arguments: [obj(tx, num)],
  })
}

/** Returns true if the ratio is zero. */
export function isZero(tx: Transaction, num: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::fixed_point32::is_zero`,
    arguments: [obj(tx, num)],
  })
}
