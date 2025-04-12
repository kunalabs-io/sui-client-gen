import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface FromQuotientArgs {
  u1281: bigint | TransactionArgument
  u1282: bigint | TransactionArgument
}

export function fromQuotient(tx: Transaction, args: FromQuotientArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::from_quotient`,
    arguments: [pure(tx, args.u1281, `u128`), pure(tx, args.u1282, `u128`)],
  })
}

export function fromInt(tx: Transaction, u64: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::from_int`,
    arguments: [pure(tx, u64, `u64`)],
  })
}

export interface AddArgs {
  uq64641: TransactionObjectInput
  uq64642: TransactionObjectInput
}

export function add(tx: Transaction, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::add`,
    arguments: [obj(tx, args.uq64641), obj(tx, args.uq64642)],
  })
}

export interface SubArgs {
  uq64641: TransactionObjectInput
  uq64642: TransactionObjectInput
}

export function sub(tx: Transaction, args: SubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::sub`,
    arguments: [obj(tx, args.uq64641), obj(tx, args.uq64642)],
  })
}

export interface MulArgs {
  uq64641: TransactionObjectInput
  uq64642: TransactionObjectInput
}

export function mul(tx: Transaction, args: MulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::mul`,
    arguments: [obj(tx, args.uq64641), obj(tx, args.uq64642)],
  })
}

export interface DivArgs {
  uq64641: TransactionObjectInput
  uq64642: TransactionObjectInput
}

export function div(tx: Transaction, args: DivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::div`,
    arguments: [obj(tx, args.uq64641), obj(tx, args.uq64642)],
  })
}

export function toInt(tx: Transaction, uq6464: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::uq64_64::to_int`, arguments: [obj(tx, uq6464)] })
}

export interface IntMulArgs {
  u128: bigint | TransactionArgument
  uq6464: TransactionObjectInput
}

export function intMul(tx: Transaction, args: IntMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::int_mul`,
    arguments: [pure(tx, args.u128, `u128`), obj(tx, args.uq6464)],
  })
}

export interface IntDivArgs {
  u128: bigint | TransactionArgument
  uq6464: TransactionObjectInput
}

export function intDiv(tx: Transaction, args: IntDivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::int_div`,
    arguments: [pure(tx, args.u128, `u128`), obj(tx, args.uq6464)],
  })
}

export interface LeArgs {
  uq64641: TransactionObjectInput
  uq64642: TransactionObjectInput
}

export function le(tx: Transaction, args: LeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::le`,
    arguments: [obj(tx, args.uq64641), obj(tx, args.uq64642)],
  })
}

export interface LtArgs {
  uq64641: TransactionObjectInput
  uq64642: TransactionObjectInput
}

export function lt(tx: Transaction, args: LtArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::lt`,
    arguments: [obj(tx, args.uq64641), obj(tx, args.uq64642)],
  })
}

export interface GeArgs {
  uq64641: TransactionObjectInput
  uq64642: TransactionObjectInput
}

export function ge(tx: Transaction, args: GeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::ge`,
    arguments: [obj(tx, args.uq64641), obj(tx, args.uq64642)],
  })
}

export interface GtArgs {
  uq64641: TransactionObjectInput
  uq64642: TransactionObjectInput
}

export function gt(tx: Transaction, args: GtArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::gt`,
    arguments: [obj(tx, args.uq64641), obj(tx, args.uq64642)],
  })
}

export function toRaw(tx: Transaction, uq6464: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::uq64_64::to_raw`, arguments: [obj(tx, uq6464)] })
}

export function fromRaw(tx: Transaction, u128: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq64_64::from_raw`,
    arguments: [pure(tx, u128, `u128`)],
  })
}
