import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface MultiplyU64Args {
  u64: bigint | TransactionArgument
  fixedPoint32: ObjectArg
}

export function multiplyU64(txb: TransactionBlock, args: MultiplyU64Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::multiply_u64`,
    arguments: [pure(txb, args.u64, `u64`), obj(txb, args.fixedPoint32)],
  })
}

export interface DivideU64Args {
  u64: bigint | TransactionArgument
  fixedPoint32: ObjectArg
}

export function divideU64(txb: TransactionBlock, args: DivideU64Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::divide_u64`,
    arguments: [pure(txb, args.u64, `u64`), obj(txb, args.fixedPoint32)],
  })
}

export interface CreateFromRationalArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function createFromRational(txb: TransactionBlock, args: CreateFromRationalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::create_from_rational`,
    arguments: [pure(txb, args.u641, `u64`), pure(txb, args.u642, `u64`)],
  })
}

export function createFromRawValue(txb: TransactionBlock, u64: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::create_from_raw_value`,
    arguments: [pure(txb, u64, `u64`)],
  })
}

export function getRawValue(txb: TransactionBlock, fixedPoint32: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::get_raw_value`,
    arguments: [obj(txb, fixedPoint32)],
  })
}

export function isZero(txb: TransactionBlock, fixedPoint32: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::is_zero`,
    arguments: [obj(txb, fixedPoint32)],
  })
}
