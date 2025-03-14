import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AddArgs {
  uq32321: TransactionObjectInput
  uq32322: TransactionObjectInput
}

export function add(tx: Transaction, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::add`,
    arguments: [obj(tx, args.uq32321), obj(tx, args.uq32322)],
  })
}

export interface DivArgs {
  uq32321: TransactionObjectInput
  uq32322: TransactionObjectInput
}

export function div(tx: Transaction, args: DivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::div`,
    arguments: [obj(tx, args.uq32321), obj(tx, args.uq32322)],
  })
}

export function fromInt(tx: Transaction, u32: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::from_int`,
    arguments: [pure(tx, u32, `u32`)],
  })
}

export interface FromQuotientArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function fromQuotient(tx: Transaction, args: FromQuotientArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::from_quotient`,
    arguments: [pure(tx, args.u641, `u64`), pure(tx, args.u642, `u64`)],
  })
}

export function fromRaw(tx: Transaction, u64: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::from_raw`,
    arguments: [pure(tx, u64, `u64`)],
  })
}

export interface GeArgs {
  uq32321: TransactionObjectInput
  uq32322: TransactionObjectInput
}

export function ge(tx: Transaction, args: GeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::ge`,
    arguments: [obj(tx, args.uq32321), obj(tx, args.uq32322)],
  })
}

export interface GtArgs {
  uq32321: TransactionObjectInput
  uq32322: TransactionObjectInput
}

export function gt(tx: Transaction, args: GtArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::gt`,
    arguments: [obj(tx, args.uq32321), obj(tx, args.uq32322)],
  })
}

export interface IntDivArgs {
  u64: bigint | TransactionArgument
  uq3232: TransactionObjectInput
}

export function intDiv(tx: Transaction, args: IntDivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::int_div`,
    arguments: [pure(tx, args.u64, `u64`), obj(tx, args.uq3232)],
  })
}

export interface IntMulArgs {
  u64: bigint | TransactionArgument
  uq3232: TransactionObjectInput
}

export function intMul(tx: Transaction, args: IntMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::int_mul`,
    arguments: [pure(tx, args.u64, `u64`), obj(tx, args.uq3232)],
  })
}

export interface LeArgs {
  uq32321: TransactionObjectInput
  uq32322: TransactionObjectInput
}

export function le(tx: Transaction, args: LeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::le`,
    arguments: [obj(tx, args.uq32321), obj(tx, args.uq32322)],
  })
}

export interface LtArgs {
  uq32321: TransactionObjectInput
  uq32322: TransactionObjectInput
}

export function lt(tx: Transaction, args: LtArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::lt`,
    arguments: [obj(tx, args.uq32321), obj(tx, args.uq32322)],
  })
}

export interface MulArgs {
  uq32321: TransactionObjectInput
  uq32322: TransactionObjectInput
}

export function mul(tx: Transaction, args: MulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::mul`,
    arguments: [obj(tx, args.uq32321), obj(tx, args.uq32322)],
  })
}

export interface SubArgs {
  uq32321: TransactionObjectInput
  uq32322: TransactionObjectInput
}

export function sub(tx: Transaction, args: SubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::uq32_32::sub`,
    arguments: [obj(tx, args.uq32321), obj(tx, args.uq32322)],
  })
}

export function toInt(tx: Transaction, uq3232: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::uq32_32::to_int`, arguments: [obj(tx, uq3232)] })
}

export function toRaw(tx: Transaction, uq3232: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::uq32_32::to_raw`, arguments: [obj(tx, uq3232)] })
}
