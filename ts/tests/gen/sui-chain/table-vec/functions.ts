import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function length(tx: Transaction, typeArg: string, tableVec: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::length`,
    typeArguments: [typeArg],
    arguments: [obj(tx, tableVec)],
  })
}

export function empty(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface BorrowArgs {
  tableVec: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function borrow(tx: Transaction, typeArg: string, args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tableVec), pure(tx, args.u64, `u64`)],
  })
}

export interface PushBackArgs {
  tableVec: TransactionObjectInput
  t0: GenericArg
}

export function pushBack(tx: Transaction, typeArg: string, args: PushBackArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::push_back`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tableVec), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  tableVec: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function borrowMut(tx: Transaction, typeArg: string, args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tableVec), pure(tx, args.u64, `u64`)],
  })
}

export function popBack(tx: Transaction, typeArg: string, tableVec: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::pop_back`,
    typeArguments: [typeArg],
    arguments: [obj(tx, tableVec)],
  })
}

export function destroyEmpty(tx: Transaction, typeArg: string, tableVec: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [obj(tx, tableVec)],
  })
}

export interface SwapArgs {
  tableVec: TransactionObjectInput
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function swap(tx: Transaction, typeArg: string, args: SwapArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::swap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tableVec), pure(tx, args.u641, `u64`), pure(tx, args.u642, `u64`)],
  })
}

export function singleton(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function isEmpty(tx: Transaction, typeArg: string, tableVec: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(tx, tableVec)],
  })
}

export interface SwapRemoveArgs {
  tableVec: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function swapRemove(tx: Transaction, typeArg: string, args: SwapRemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::swap_remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tableVec), pure(tx, args.u64, `u64`)],
  })
}

export function drop(tx: Transaction, typeArg: string, tableVec: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::drop`,
    typeArguments: [typeArg],
    arguments: [obj(tx, tableVec)],
  })
}
