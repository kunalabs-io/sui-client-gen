import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction, typeArgs: [string, string]) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export interface AddArgs {
  table: TransactionObjectInput
  k: GenericArg
  v: GenericArg
}

export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::add`,
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
    target: `${getPublishedAt('sui')}::object_table::borrow`,
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
    target: `${getPublishedAt('sui')}::object_table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.table), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export interface RemoveArgs {
  table: TransactionObjectInput
  k: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::remove`,
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
    target: `${getPublishedAt('sui')}::object_table::contains`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.table), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export function length(tx: Transaction, typeArgs: [string, string], table: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::length`,
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
    target: `${getPublishedAt('sui')}::object_table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export function destroyEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export interface ValueIdArgs {
  table: TransactionObjectInput
  k: GenericArg
}

export function valueId(tx: Transaction, typeArgs: [string, string], args: ValueIdArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::value_id`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.table), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}
