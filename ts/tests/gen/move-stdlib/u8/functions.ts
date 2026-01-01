import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function bitwiseNot(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::u8::bitwise_not`, arguments: [pure(tx, x, `u8`)] })
}

export interface MaxArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::max`,
    arguments: [pure(tx, args.x, `u8`), pure(tx, args.y, `u8`)],
  })
}

export interface MinArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::min`,
    arguments: [pure(tx, args.x, `u8`), pure(tx, args.y, `u8`)],
  })
}

export interface DiffArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::diff`,
    arguments: [pure(tx, args.x, `u8`), pure(tx, args.y, `u8`)],
  })
}

export interface DivideAndRoundUpArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::divide_and_round_up`,
    arguments: [pure(tx, args.x, `u8`), pure(tx, args.y, `u8`)],
  })
}

export interface PowArgs {
  base: number | TransactionArgument
  exponent: number | TransactionArgument
}

export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u8::pow`,
    arguments: [pure(tx, args.base, `u8`), pure(tx, args.exponent, `u8`)],
  })
}

export function sqrt(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::u8::sqrt`, arguments: [pure(tx, x, `u8`)] })
}

export function toString(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::u8::to_string`, arguments: [pure(tx, x, `u8`)] })
}
