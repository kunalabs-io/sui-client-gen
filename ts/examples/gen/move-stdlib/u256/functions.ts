import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function bitwiseNot(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::bitwise_not`,
    arguments: [pure(tx, x, `u256`)],
  })
}

export interface MaxArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::max`,
    arguments: [pure(tx, args.x, `u256`), pure(tx, args.y, `u256`)],
  })
}

export interface MinArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::min`,
    arguments: [pure(tx, args.x, `u256`), pure(tx, args.y, `u256`)],
  })
}

export interface DiffArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::diff`,
    arguments: [pure(tx, args.x, `u256`), pure(tx, args.y, `u256`)],
  })
}

export interface DivideAndRoundUpArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::divide_and_round_up`,
    arguments: [pure(tx, args.x, `u256`), pure(tx, args.y, `u256`)],
  })
}

export interface PowArgs {
  base: bigint | TransactionArgument
  exponent: number | TransactionArgument
}

export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::pow`,
    arguments: [pure(tx, args.base, `u256`), pure(tx, args.exponent, `u8`)],
  })
}

export function tryAsU8(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::try_as_u8`,
    arguments: [pure(tx, x, `u256`)],
  })
}

export function tryAsU16(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::try_as_u16`,
    arguments: [pure(tx, x, `u256`)],
  })
}

export function tryAsU32(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::try_as_u32`,
    arguments: [pure(tx, x, `u256`)],
  })
}

export function tryAsU64(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::try_as_u64`,
    arguments: [pure(tx, x, `u256`)],
  })
}

export function tryAsU128(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::try_as_u128`,
    arguments: [pure(tx, x, `u256`)],
  })
}

export function toString(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::to_string`,
    arguments: [pure(tx, x, `u256`)],
  })
}
