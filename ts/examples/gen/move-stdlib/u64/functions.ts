import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function bitwiseNot(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u64::bitwise_not`,
    arguments: [pure(tx, x, `u64`)],
  })
}

export interface MaxArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u64::max`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface MinArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u64::min`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface DiffArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u64::diff`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface DivideAndRoundUpArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u64::divide_and_round_up`,
    arguments: [pure(tx, args.x, `u64`), pure(tx, args.y, `u64`)],
  })
}

export interface PowArgs {
  base: bigint | TransactionArgument
  exponent: number | TransactionArgument
}

export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u64::pow`,
    arguments: [pure(tx, args.base, `u64`), pure(tx, args.exponent, `u8`)],
  })
}

export function sqrt(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::u64::sqrt`, arguments: [pure(tx, x, `u64`)] })
}

export function tryAsU8(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::u64::try_as_u8`, arguments: [pure(tx, x, `u64`)] })
}

export function tryAsU16(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u64::try_as_u16`,
    arguments: [pure(tx, x, `u64`)],
  })
}

export function tryAsU32(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u64::try_as_u32`,
    arguments: [pure(tx, x, `u64`)],
  })
}

export function toString(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::u64::to_string`, arguments: [pure(tx, x, `u64`)] })
}
