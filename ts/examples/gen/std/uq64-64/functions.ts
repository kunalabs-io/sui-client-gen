import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface FromQuotientArgs {
  numerator: bigint | TransactionArgument
  denominator: bigint | TransactionArgument
}

export function fromQuotient(tx: Transaction, args: FromQuotientArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::from_quotient`,
    arguments: [pure(tx, args.numerator, `u128`), pure(tx, args.denominator, `u128`)],
  })
}

export function fromInt(tx: Transaction, integer: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::from_int`,
    arguments: [pure(tx, integer, `u64`)],
  })
}

export interface AddArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function add(tx: Transaction, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::add`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface SubArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function sub(tx: Transaction, args: SubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::sub`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface MulArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function mul(tx: Transaction, args: MulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::mul`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface DivArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function div(tx: Transaction, args: DivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::div`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export function toInt(tx: Transaction, a: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::to_int`,
    arguments: [obj(tx, a)],
  })
}

export interface IntMulArgs {
  val: bigint | TransactionArgument
  multiplier: TransactionObjectInput
}

export function intMul(tx: Transaction, args: IntMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::int_mul`,
    arguments: [pure(tx, args.val, `u128`), obj(tx, args.multiplier)],
  })
}

export interface IntDivArgs {
  val: bigint | TransactionArgument
  divisor: TransactionObjectInput
}

export function intDiv(tx: Transaction, args: IntDivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::int_div`,
    arguments: [pure(tx, args.val, `u128`), obj(tx, args.divisor)],
  })
}

export interface LeArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function le(tx: Transaction, args: LeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::le`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface LtArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function lt(tx: Transaction, args: LtArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::lt`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface GeArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function ge(tx: Transaction, args: GeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::ge`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface GtArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function gt(tx: Transaction, args: GtArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::gt`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export function toRaw(tx: Transaction, a: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::to_raw`,
    arguments: [obj(tx, a)],
  })
}

export function fromRaw(tx: Transaction, rawValue: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::from_raw`,
    arguments: [pure(tx, rawValue, `u128`)],
  })
}
