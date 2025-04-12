import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction, typeArgs: [string, string]) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export function front(
  tx: Transaction,
  typeArgs: [string, string],
  linkedTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::front`,
    typeArguments: typeArgs,
    arguments: [obj(tx, linkedTable)],
  })
}

export function back(
  tx: Transaction,
  typeArgs: [string, string],
  linkedTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::back`,
    typeArguments: typeArgs,
    arguments: [obj(tx, linkedTable)],
  })
}

export interface PushFrontArgs {
  linkedTable: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
}

export function pushFront(tx: Transaction, typeArgs: [string, string], args: PushFrontArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::push_front`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.linkedTable),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface PushBackArgs {
  linkedTable: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
}

export function pushBack(tx: Transaction, typeArgs: [string, string], args: PushBackArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::push_back`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.linkedTable),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface BorrowArgs {
  linkedTable: TransactionObjectInput
  t0: GenericArg
}

export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.linkedTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  linkedTable: TransactionObjectInput
  t0: GenericArg
}

export function borrowMut(tx: Transaction, typeArgs: [string, string], args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.linkedTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface PrevArgs {
  linkedTable: TransactionObjectInput
  t0: GenericArg
}

export function prev(tx: Transaction, typeArgs: [string, string], args: PrevArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::prev`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.linkedTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface NextArgs {
  linkedTable: TransactionObjectInput
  t0: GenericArg
}

export function next(tx: Transaction, typeArgs: [string, string], args: NextArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::next`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.linkedTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  linkedTable: TransactionObjectInput
  t0: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.linkedTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export function popFront(
  tx: Transaction,
  typeArgs: [string, string],
  linkedTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::pop_front`,
    typeArguments: typeArgs,
    arguments: [obj(tx, linkedTable)],
  })
}

export function popBack(
  tx: Transaction,
  typeArgs: [string, string],
  linkedTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::pop_back`,
    typeArguments: typeArgs,
    arguments: [obj(tx, linkedTable)],
  })
}

export interface ContainsArgs {
  linkedTable: TransactionObjectInput
  t0: GenericArg
}

export function contains(tx: Transaction, typeArgs: [string, string], args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::contains`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.linkedTable), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export function length(
  tx: Transaction,
  typeArgs: [string, string],
  linkedTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::length`,
    typeArguments: typeArgs,
    arguments: [obj(tx, linkedTable)],
  })
}

export function isEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  linkedTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, linkedTable)],
  })
}

export function destroyEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  linkedTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, linkedTable)],
  })
}

export function drop(
  tx: Transaction,
  typeArgs: [string, string],
  linkedTable: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::linked_table::drop`,
    typeArguments: typeArgs,
    arguments: [obj(tx, linkedTable)],
  })
}
