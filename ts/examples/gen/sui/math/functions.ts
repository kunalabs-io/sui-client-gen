import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export interface MaxArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** DEPRECATED, use `std::u64::max` instead */
export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::math::max`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface MinArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** DEPRECATED, use `std::u64::min` instead */
export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::math::min`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface DiffArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** DEPRECATED, use `std::u64::diff` instead */
export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::math::diff`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface PowArgs {
  base: bigint | TransactionArgument
  exponent: number | TransactionArgument
}

/** DEPRECATED, use `std::u64::pow` instead */
export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::math::pow`,
    arguments: [pure(tx, args.base, `u64`), pure(tx, args.exponent, `u8`)],
  })
}

/** DEPRECATED, use `std::u64::sqrt` instead */
export function sqrt(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::math::sqrt`,
    arguments: [pure(tx, x, `u64`)],
  })
}

/** DEPRECATED, use `std::u128::sqrt` instead */
export function sqrtU128(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::math::sqrt_u128`,
    arguments: [pure(tx, x, `u128`)],
  })
}

export interface DivideAndRoundUpArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

/** DEPRECATED, use `std::u64::divide_and_round_up` instead */
export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::math::divide_and_round_up`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}
