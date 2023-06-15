import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface DiffArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function diff(txb: TransactionBlock, args: DiffArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::diff`,
    arguments: [pure(txb, args.x, `u64`), pure(txb, args.y, `u64`)],
  })
}

export interface DivideAndRoundUpArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function divideAndRoundUp(txb: TransactionBlock, args: DivideAndRoundUpArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::divide_and_round_up`,
    arguments: [pure(txb, args.x, `u64`), pure(txb, args.y, `u64`)],
  })
}

export interface MaxArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function max(txb: TransactionBlock, args: MaxArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::max`,
    arguments: [pure(txb, args.x, `u64`), pure(txb, args.y, `u64`)],
  })
}

export interface MinArgs {
  x: bigint | TransactionArgument
  y: bigint | TransactionArgument
}

export function min(txb: TransactionBlock, args: MinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::min`,
    arguments: [pure(txb, args.x, `u64`), pure(txb, args.y, `u64`)],
  })
}

export interface PowArgs {
  base: bigint | TransactionArgument
  exponent: number | TransactionArgument
}

export function pow(txb: TransactionBlock, args: PowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::pow`,
    arguments: [pure(txb, args.base, `u64`), pure(txb, args.exponent, `u8`)],
  })
}

export function sqrt(txb: TransactionBlock, x: bigint | TransactionArgument) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::math::sqrt`, arguments: [pure(txb, x, `u64`)] })
}

export function sqrtU128(txb: TransactionBlock, x: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::math::sqrt_u128`,
    arguments: [pure(txb, x, `u128`)],
  })
}
