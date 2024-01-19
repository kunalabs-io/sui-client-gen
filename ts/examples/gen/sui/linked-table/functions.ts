import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export interface BorrowArgs {
  table: ObjectArg
  k: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [string, string], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export interface BorrowMutArgs {
  table: ObjectArg
  k: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [string, string], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export interface ContainsArgs {
  table: ObjectArg
  k: GenericArg
}

export function contains(txb: TransactionBlock, typeArgs: [string, string], args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::contains`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export function destroyEmpty(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export function isEmpty(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export function length(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::length`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export function popBack(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::pop_back`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export interface PushBackArgs {
  table: ObjectArg
  k: GenericArg
  value: GenericArg
}

export function pushBack(txb: TransactionBlock, typeArgs: [string, string], args: PushBackArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::push_back`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.table),
      generic(txb, `${typeArgs[0]}`, args.k),
      generic(txb, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface RemoveArgs {
  table: ObjectArg
  k: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [string, string], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export function new_(txb: TransactionBlock, typeArgs: [string, string]) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export function back(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::back`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export function drop(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::drop`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export function front(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::front`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export interface NextArgs {
  table: ObjectArg
  k: GenericArg
}

export function next(txb: TransactionBlock, typeArgs: [string, string], args: NextArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::next`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export function popFront(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::pop_front`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export interface PrevArgs {
  table: ObjectArg
  k: GenericArg
}

export function prev(txb: TransactionBlock, typeArgs: [string, string], args: PrevArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::prev`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export interface PushFrontArgs {
  table: ObjectArg
  k: GenericArg
  value: GenericArg
}

export function pushFront(txb: TransactionBlock, typeArgs: [string, string], args: PushFrontArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::push_front`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.table),
      generic(txb, `${typeArgs[0]}`, args.k),
      generic(txb, `${typeArgs[1]}`, args.value),
    ],
  })
}
