import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface BorrowArgs {
  t: TransactionObjectInput
  i: bigint | TransactionArgument
}

export function borrow(tx: Transaction, typeArg: string, args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.t), pure(tx, args.i, `u64`)],
  })
}

export interface BorrowMutArgs {
  t: TransactionObjectInput
  i: bigint | TransactionArgument
}

export function borrowMut(tx: Transaction, typeArg: string, args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.t), pure(tx, args.i, `u64`)],
  })
}

export function destroyEmpty(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

export function drop(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::drop`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

export function empty(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function isEmpty(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

export function length(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::length`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

export function popBack(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::pop_back`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

export interface PushBackArgs {
  t: TransactionObjectInput
  e: GenericArg
}

export function pushBack(tx: Transaction, typeArg: string, args: PushBackArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::push_back`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.t), generic(tx, `${typeArg}`, args.e)],
  })
}

export function singleton(tx: Transaction, typeArg: string, e: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, e)],
  })
}

export interface SwapArgs {
  t: TransactionObjectInput
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function swap(tx: Transaction, typeArg: string, args: SwapArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::swap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.t), pure(tx, args.i, `u64`), pure(tx, args.j, `u64`)],
  })
}

export interface SwapRemoveArgs {
  t: TransactionObjectInput
  i: bigint | TransactionArgument
}

export function swapRemove(tx: Transaction, typeArg: string, args: SwapRemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table_vec::swap_remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.t), pure(tx, args.i, `u64`)],
  })
}
