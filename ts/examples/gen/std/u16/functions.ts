import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function bitwiseNot(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u16::bitwise_not`,
    arguments: [pure(tx, x, `u16`)],
  })
}

export interface MaxArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u16::max`,
    arguments: [pure(tx, args.x, `u16`), pure(tx, args.y, `u16`)],
  })
}

export interface MinArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u16::min`,
    arguments: [pure(tx, args.x, `u16`), pure(tx, args.y, `u16`)],
  })
}

export interface DiffArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u16::diff`,
    arguments: [pure(tx, args.x, `u16`), pure(tx, args.y, `u16`)],
  })
}

export interface DivideAndRoundUpArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u16::divide_and_round_up`,
    arguments: [pure(tx, args.x, `u16`), pure(tx, args.y, `u16`)],
  })
}

export interface PowArgs {
  base: number | TransactionArgument
  exponent: number | TransactionArgument
}

export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u16::pow`,
    arguments: [pure(tx, args.base, `u16`), pure(tx, args.exponent, `u8`)],
  })
}

export function sqrt(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u16::sqrt`,
    arguments: [pure(tx, x, `u16`)],
  })
}

export function tryAsU8(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u16::try_as_u8`,
    arguments: [pure(tx, x, `u16`)],
  })
}

export function toString(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u16::to_string`,
    arguments: [pure(tx, x, `u16`)],
  })
}
