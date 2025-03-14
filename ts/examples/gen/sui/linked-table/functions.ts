import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'

export function back(tx: Transaction, typeArgs: [string, string], table: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::back`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export interface BorrowArgs {
  table: TransactionObjectInput
  k: GenericArg
}

export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::borrow`,
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
    target: `${PUBLISHED_AT}::linked_table::borrow_mut`,
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
    target: `${PUBLISHED_AT}::linked_table::contains`,
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
    target: `${PUBLISHED_AT}::linked_table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export function drop(tx: Transaction, typeArgs: [string, string], table: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::drop`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export function front(tx: Transaction, typeArgs: [string, string], table: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::front`,
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
    target: `${PUBLISHED_AT}::linked_table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export function length(tx: Transaction, typeArgs: [string, string], table: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::length`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export function new_(tx: Transaction, typeArgs: [string, string]) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export interface NextArgs {
  table: TransactionObjectInput
  k: GenericArg
}

export function next(tx: Transaction, typeArgs: [string, string], args: NextArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::next`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.table), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export function popBack(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::pop_back`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export function popFront(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::pop_front`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export interface PrevArgs {
  table: TransactionObjectInput
  k: GenericArg
}

export function prev(tx: Transaction, typeArgs: [string, string], args: PrevArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::prev`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.table), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export interface PushBackArgs {
  table: TransactionObjectInput
  k: GenericArg
  value: GenericArg
}

export function pushBack(tx: Transaction, typeArgs: [string, string], args: PushBackArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::push_back`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
      generic(tx, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface PushFrontArgs {
  table: TransactionObjectInput
  k: GenericArg
  value: GenericArg
}

export function pushFront(tx: Transaction, typeArgs: [string, string], args: PushFrontArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::push_front`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
      generic(tx, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface RemoveArgs {
  table: TransactionObjectInput
  k: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.table), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}
