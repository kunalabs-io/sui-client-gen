import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'

export function length(
  tx: Transaction,
  typeArgs: [string, string],
  objectTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_table::length`,
    typeArguments: typeArgs,
    arguments: [obj(tx, objectTable)],
  })
}

export interface BorrowArgs {
  objectTable: TransactionObjectInput
  t0: GenericArg
}

export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_table::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.objectTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  objectTable: TransactionObjectInput
  t0: GenericArg
}

export function borrowMut(tx: Transaction, typeArgs: [string, string], args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.objectTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export function destroyEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  objectTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, objectTable)],
  })
}

export function isEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  objectTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, objectTable)],
  })
}

export interface ContainsArgs {
  objectTable: TransactionObjectInput
  t0: GenericArg
}

export function contains(tx: Transaction, typeArgs: [string, string], args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_table::contains`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.objectTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  objectTable: TransactionObjectInput
  t0: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_table::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.objectTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export function new_(tx: Transaction, typeArgs: [string, string]) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export interface AddArgs {
  objectTable: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
}

export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_table::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.objectTable),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface ValueIdArgs {
  objectTable: TransactionObjectInput
  t0: GenericArg
}

export function valueId(tx: Transaction, typeArgs: [string, string], args: ValueIdArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_table::value_id`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.objectTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}
