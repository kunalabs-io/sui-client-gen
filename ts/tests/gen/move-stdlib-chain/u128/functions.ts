import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export interface MaxArgs {
  u1281: bigint | TransactionArgument
  u1282: bigint | TransactionArgument
}

export function max(tx: Transaction, args: MaxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u128::max`,
    arguments: [pure(tx, args.u1281, `u128`), pure(tx, args.u1282, `u128`)],
  })
}

export interface MinArgs {
  u1281: bigint | TransactionArgument
  u1282: bigint | TransactionArgument
}

export function min(tx: Transaction, args: MinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u128::min`,
    arguments: [pure(tx, args.u1281, `u128`), pure(tx, args.u1282, `u128`)],
  })
}

export interface DiffArgs {
  u1281: bigint | TransactionArgument
  u1282: bigint | TransactionArgument
}

export function diff(tx: Transaction, args: DiffArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u128::diff`,
    arguments: [pure(tx, args.u1281, `u128`), pure(tx, args.u1282, `u128`)],
  })
}

export interface DivideAndRoundUpArgs {
  u1281: bigint | TransactionArgument
  u1282: bigint | TransactionArgument
}

export function divideAndRoundUp(tx: Transaction, args: DivideAndRoundUpArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u128::divide_and_round_up`,
    arguments: [pure(tx, args.u1281, `u128`), pure(tx, args.u1282, `u128`)],
  })
}

export interface PowArgs {
  u128: bigint | TransactionArgument
  u8: number | TransactionArgument
}

export function pow(tx: Transaction, args: PowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::u128::pow`,
    arguments: [pure(tx, args.u128, `u128`), pure(tx, args.u8, `u8`)],
  })
}

export function sqrt(tx: Transaction, u128: bigint | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::u128::sqrt`, arguments: [pure(tx, u128, `u128`)] })
}
