import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export interface DiffArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::math::diff`,
    arguments: [pure(tx, args.u641, `u64`), pure(tx, args.u642, `u64`)],
  })
}

export interface DivideAndRoundUpArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::math::divide_and_round_up`,
    arguments: [pure(tx, args.u641, `u64`), pure(tx, args.u642, `u64`)],
  })
}

export interface MaxArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::math::max`,
    arguments: [pure(tx, args.u641, `u64`), pure(tx, args.u642, `u64`)],
  })
}

export interface MinArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::math::min`,
    arguments: [pure(tx, args.u641, `u64`), pure(tx, args.u642, `u64`)],
  })
}

export interface PowArgs {
  u64: bigint | TransactionArgument
  u8: number | TransactionArgument
}

export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::math::pow`,
    arguments: [pure(tx, args.u64, `u64`), pure(tx, args.u8, `u8`)],
  })
}

export function sqrt(tx: Transaction, u64: bigint | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::math::sqrt`, arguments: [pure(tx, u64, `u64`)] })
}

export function sqrtU128(tx: Transaction, u128: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::math::sqrt_u128`,
    arguments: [pure(tx, u128, `u128`)],
  })
}
