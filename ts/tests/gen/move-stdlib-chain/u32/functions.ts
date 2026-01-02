import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function bitwiseNot(tx: Transaction, u32: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u32::bitwise_not`,
    arguments: [pure(tx, u32, `u32`)],
  })
}

export interface MaxArgs {
  u321: number | TransactionArgument
  u322: number | TransactionArgument
}

export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u32::max`,
    arguments: [pure(tx, args.u321, `u32`), pure(tx, args.u322, `u32`)],
  })
}

export interface MinArgs {
  u321: number | TransactionArgument
  u322: number | TransactionArgument
}

export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u32::min`,
    arguments: [pure(tx, args.u321, `u32`), pure(tx, args.u322, `u32`)],
  })
}

export interface DiffArgs {
  u321: number | TransactionArgument
  u322: number | TransactionArgument
}

export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u32::diff`,
    arguments: [pure(tx, args.u321, `u32`), pure(tx, args.u322, `u32`)],
  })
}

export interface DivideAndRoundUpArgs {
  u321: number | TransactionArgument
  u322: number | TransactionArgument
}

export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u32::divide_and_round_up`,
    arguments: [pure(tx, args.u321, `u32`), pure(tx, args.u322, `u32`)],
  })
}

export interface PowArgs {
  u32: number | TransactionArgument
  u8: number | TransactionArgument
}

export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u32::pow`,
    arguments: [pure(tx, args.u32, `u32`), pure(tx, args.u8, `u8`)],
  })
}

export function sqrt(tx: Transaction, u32: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u32::sqrt`,
    arguments: [pure(tx, u32, `u32`)],
  })
}

export function tryAsU8(tx: Transaction, u32: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u32::try_as_u8`,
    arguments: [pure(tx, u32, `u32`)],
  })
}

export function tryAsU16(tx: Transaction, u32: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u32::try_as_u16`,
    arguments: [pure(tx, u32, `u32`)],
  })
}

export function toString(tx: Transaction, u32: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u32::to_string`,
    arguments: [pure(tx, u32, `u32`)],
  })
}
