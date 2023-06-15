import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface CreateFromRationalArgs {
  numerator: bigint | TransactionArgument
  denominator: bigint | TransactionArgument
}

export function createFromRational(txb: TransactionBlock, args: CreateFromRationalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::create_from_rational`,
    arguments: [pure(txb, args.numerator, `u64`), pure(txb, args.denominator, `u64`)],
  })
}

export function createFromRawValue(txb: TransactionBlock, value: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::create_from_raw_value`,
    arguments: [pure(txb, value, `u64`)],
  })
}

export interface DivideU64Args {
  val: bigint | TransactionArgument
  divisor: ObjectArg
}

export function divideU64(txb: TransactionBlock, args: DivideU64Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::divide_u64`,
    arguments: [pure(txb, args.val, `u64`), obj(txb, args.divisor)],
  })
}

export function getRawValue(txb: TransactionBlock, num: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::get_raw_value`,
    arguments: [obj(txb, num)],
  })
}

export function isZero(txb: TransactionBlock, num: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::is_zero`,
    arguments: [obj(txb, num)],
  })
}

export interface MultiplyU64Args {
  val: bigint | TransactionArgument
  multiplier: ObjectArg
}

export function multiplyU64(txb: TransactionBlock, args: MultiplyU64Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::multiply_u64`,
    arguments: [pure(txb, args.val, `u64`), obj(txb, args.multiplier)],
  })
}
