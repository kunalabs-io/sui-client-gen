import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export interface MaxArgs {
  u2561: bigint | TransactionArgument
  u2562: bigint | TransactionArgument
}

export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::max`,
    arguments: [pure(tx, args.u2561, `u256`), pure(tx, args.u2562, `u256`)],
  })
}

export interface MinArgs {
  u2561: bigint | TransactionArgument
  u2562: bigint | TransactionArgument
}

export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::min`,
    arguments: [pure(tx, args.u2561, `u256`), pure(tx, args.u2562, `u256`)],
  })
}

export interface DiffArgs {
  u2561: bigint | TransactionArgument
  u2562: bigint | TransactionArgument
}

export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::diff`,
    arguments: [pure(tx, args.u2561, `u256`), pure(tx, args.u2562, `u256`)],
  })
}

export interface DivideAndRoundUpArgs {
  u2561: bigint | TransactionArgument
  u2562: bigint | TransactionArgument
}

export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::divide_and_round_up`,
    arguments: [pure(tx, args.u2561, `u256`), pure(tx, args.u2562, `u256`)],
  })
}

export interface PowArgs {
  u256: bigint | TransactionArgument
  u8: number | TransactionArgument
}

export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u256::pow`,
    arguments: [pure(tx, args.u256, `u256`), pure(tx, args.u8, `u8`)],
  })
}
