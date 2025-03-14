import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AddArgs {
  table: TransactionObjectInput
  k: GenericArg
  v: GenericArg
}

export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
      generic(tx, `${typeArgs[1]}`, args.v),
    ],
  })
}

export interface BorrowArgs {
  table: TransactionObjectInput
  k: GenericArg
}

export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.table), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export interface BorrowMutArgs {
  table: TransactionObjectInput
  k: GenericArg
}

export function borrowMut(tx: Transaction, typeArgs: [string, string], args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.table), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export interface ContainsArgs {
  table: TransactionObjectInput
  k: GenericArg
}

export function contains(tx: Transaction, typeArgs: [string, string], args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table::contains`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.table), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export function destroyEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export function drop(tx: Transaction, typeArgs: [string, string], table: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table::drop`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export function isEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export function length(tx: Transaction, typeArgs: [string, string], table: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table::length`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export function new_(tx: Transaction, typeArgs: [string, string]) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export interface RemoveArgs {
  table: TransactionObjectInput
  k: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::table::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.table), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}
