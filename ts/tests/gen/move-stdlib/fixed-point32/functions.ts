import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface CreateFromRationalArgs {
  numerator: bigint | TransactionArgument
  denominator: bigint | TransactionArgument
}

export function createFromRational(tx: Transaction, args: CreateFromRationalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::create_from_rational`,
    arguments: [pure(tx, args.numerator, `u64`), pure(tx, args.denominator, `u64`)],
  })
}

export function createFromRawValue(tx: Transaction, value: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::create_from_raw_value`,
    arguments: [pure(tx, value, `u64`)],
  })
}

export interface DivideU64Args {
  val: bigint | TransactionArgument
  divisor: TransactionObjectInput
}

export function divideU64(tx: Transaction, args: DivideU64Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::divide_u64`,
    arguments: [pure(tx, args.val, `u64`), obj(tx, args.divisor)],
  })
}

export function getRawValue(tx: Transaction, num: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::get_raw_value`,
    arguments: [obj(tx, num)],
  })
}

export function isZero(tx: Transaction, num: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::is_zero`,
    arguments: [obj(tx, num)],
  })
}

export interface MultiplyU64Args {
  val: bigint | TransactionArgument
  multiplier: TransactionObjectInput
}

export function multiplyU64(tx: Transaction, args: MultiplyU64Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::multiply_u64`,
    arguments: [pure(tx, args.val, `u64`), obj(tx, args.multiplier)],
  })
}
