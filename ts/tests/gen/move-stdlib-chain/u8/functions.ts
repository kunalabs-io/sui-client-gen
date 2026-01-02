import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function bitwiseNot(tx: Transaction, u8: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::bitwise_not`,
    arguments: [pure(tx, u8, `u8`)],
  })
}

export interface MaxArgs {
  u81: number | TransactionArgument
  u82: number | TransactionArgument
}

export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::max`,
    arguments: [pure(tx, args.u81, `u8`), pure(tx, args.u82, `u8`)],
  })
}

export interface MinArgs {
  u81: number | TransactionArgument
  u82: number | TransactionArgument
}

export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::min`,
    arguments: [pure(tx, args.u81, `u8`), pure(tx, args.u82, `u8`)],
  })
}

export interface DiffArgs {
  u81: number | TransactionArgument
  u82: number | TransactionArgument
}

export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::diff`,
    arguments: [pure(tx, args.u81, `u8`), pure(tx, args.u82, `u8`)],
  })
}

export interface DivideAndRoundUpArgs {
  u81: number | TransactionArgument
  u82: number | TransactionArgument
}

export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::divide_and_round_up`,
    arguments: [pure(tx, args.u81, `u8`), pure(tx, args.u82, `u8`)],
  })
}

export interface PowArgs {
  u81: number | TransactionArgument
  u82: number | TransactionArgument
}

export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::pow`,
    arguments: [pure(tx, args.u81, `u8`), pure(tx, args.u82, `u8`)],
  })
}

export function sqrt(tx: Transaction, u8: number | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::u8::sqrt`, arguments: [pure(tx, u8, `u8`)] })
}

export function toString(tx: Transaction, u8: number | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::u8::to_string`, arguments: [pure(tx, u8, `u8`)] })
}
