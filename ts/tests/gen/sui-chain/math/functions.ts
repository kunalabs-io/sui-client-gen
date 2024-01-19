import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface MaxArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function max(txb: TransactionBlock, args: MaxArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::max`,
    arguments: [pure(txb, args.u641, `u64`), pure(txb, args.u642, `u64`)],
  })
}

export interface MinArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function min(txb: TransactionBlock, args: MinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::min`,
    arguments: [pure(txb, args.u641, `u64`), pure(txb, args.u642, `u64`)],
  })
}

export interface DiffArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function diff(txb: TransactionBlock, args: DiffArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::diff`,
    arguments: [pure(txb, args.u641, `u64`), pure(txb, args.u642, `u64`)],
  })
}

export interface PowArgs {
  u64: bigint | TransactionArgument
  u8: number | TransactionArgument
}

export function pow(txb: TransactionBlock, args: PowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::pow`,
    arguments: [pure(txb, args.u64, `u64`), pure(txb, args.u8, `u8`)],
  })
}

export function sqrt(txb: TransactionBlock, u64: bigint | TransactionArgument) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::math::sqrt`, arguments: [pure(txb, u64, `u64`)] })
}

export function sqrtU128(txb: TransactionBlock, u128: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::sqrt_u128`,
    arguments: [pure(txb, u128, `u128`)],
  })
}

export interface DivideAndRoundUpArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function divideAndRoundUp(txb: TransactionBlock, args: DivideAndRoundUpArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::divide_and_round_up`,
    arguments: [pure(txb, args.u641, `u64`), pure(txb, args.u642, `u64`)],
  })
}
