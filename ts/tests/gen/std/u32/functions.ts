import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function bitwiseNot(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u32::bitwise_not`,
    arguments: [pure(tx, x, `u32`)],
  })
}

export interface MaxArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u32::max`,
    arguments: [pure(tx, args.x, `u32`), pure(tx, args.y, `u32`)],
  })
}

export interface MinArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u32::min`,
    arguments: [pure(tx, args.x, `u32`), pure(tx, args.y, `u32`)],
  })
}

export interface DiffArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u32::diff`,
    arguments: [pure(tx, args.x, `u32`), pure(tx, args.y, `u32`)],
  })
}

export interface DivideAndRoundUpArgs {
  x: number | TransactionArgument
  y: number | TransactionArgument
}

export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u32::divide_and_round_up`,
    arguments: [pure(tx, args.x, `u32`), pure(tx, args.y, `u32`)],
  })
}

export interface PowArgs {
  base: number | TransactionArgument
  exponent: number | TransactionArgument
}

export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u32::pow`,
    arguments: [pure(tx, args.base, `u32`), pure(tx, args.exponent, `u8`)],
  })
}

export function sqrt(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u32::sqrt`,
    arguments: [pure(tx, x, `u32`)],
  })
}

export function tryAsU8(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u32::try_as_u8`,
    arguments: [pure(tx, x, `u32`)],
  })
}

export function tryAsU16(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u32::try_as_u16`,
    arguments: [pure(tx, x, `u32`)],
  })
}

export function toString(tx: Transaction, x: number | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::u32::to_string`,
    arguments: [pure(tx, x, `u32`)],
  })
}
