import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface CreateFromRationalArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function createFromRational(tx: Transaction, args: CreateFromRationalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::create_from_rational`,
    arguments: [pure(tx, args.u641, `u64`), pure(tx, args.u642, `u64`)],
  })
}

export function createFromRawValue(tx: Transaction, u64: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::create_from_raw_value`,
    arguments: [pure(tx, u64, `u64`)],
  })
}

export interface DivideU64Args {
  u64: bigint | TransactionArgument
  fixedPoint32: TransactionObjectInput
}

export function divideU64(tx: Transaction, args: DivideU64Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::divide_u64`,
    arguments: [pure(tx, args.u64, `u64`), obj(tx, args.fixedPoint32)],
  })
}

export function getRawValue(tx: Transaction, fixedPoint32: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::get_raw_value`,
    arguments: [obj(tx, fixedPoint32)],
  })
}

export function isZero(tx: Transaction, fixedPoint32: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::is_zero`,
    arguments: [obj(tx, fixedPoint32)],
  })
}

export interface MultiplyU64Args {
  u64: bigint | TransactionArgument
  fixedPoint32: TransactionObjectInput
}

export function multiplyU64(tx: Transaction, args: MultiplyU64Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixed_point32::multiply_u64`,
    arguments: [pure(tx, args.u64, `u64`), obj(tx, args.fixedPoint32)],
  })
}
