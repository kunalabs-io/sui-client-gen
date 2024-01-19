import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock, typeArgs: [string, string]) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export function length(txb: TransactionBlock, typeArgs: [string, string], linkedTable: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::length`,
    typeArguments: typeArgs,
    arguments: [obj(txb, linkedTable)],
  })
}

export interface BorrowArgs {
  linkedTable: ObjectArg
  t0: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [string, string], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.linkedTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface PushBackArgs {
  linkedTable: ObjectArg
  t0: GenericArg
  t1: GenericArg
}

export function pushBack(txb: TransactionBlock, typeArgs: [string, string], args: PushBackArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::push_back`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.linkedTable),
      generic(txb, `${typeArgs[0]}`, args.t0),
      generic(txb, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface BorrowMutArgs {
  linkedTable: ObjectArg
  t0: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [string, string], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.linkedTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export function popBack(txb: TransactionBlock, typeArgs: [string, string], linkedTable: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::pop_back`,
    typeArguments: typeArgs,
    arguments: [obj(txb, linkedTable)],
  })
}

export function destroyEmpty(
  txb: TransactionBlock,
  typeArgs: [string, string],
  linkedTable: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, linkedTable)],
  })
}

export function isEmpty(txb: TransactionBlock, typeArgs: [string, string], linkedTable: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, linkedTable)],
  })
}

export interface ContainsArgs {
  linkedTable: ObjectArg
  t0: GenericArg
}

export function contains(txb: TransactionBlock, typeArgs: [string, string], args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::contains`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.linkedTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  linkedTable: ObjectArg
  t0: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [string, string], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.linkedTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export function drop(txb: TransactionBlock, typeArgs: [string, string], linkedTable: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::drop`,
    typeArguments: typeArgs,
    arguments: [obj(txb, linkedTable)],
  })
}

export function front(txb: TransactionBlock, typeArgs: [string, string], linkedTable: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::front`,
    typeArguments: typeArgs,
    arguments: [obj(txb, linkedTable)],
  })
}

export function back(txb: TransactionBlock, typeArgs: [string, string], linkedTable: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::back`,
    typeArguments: typeArgs,
    arguments: [obj(txb, linkedTable)],
  })
}

export interface PushFrontArgs {
  linkedTable: ObjectArg
  t0: GenericArg
  t1: GenericArg
}

export function pushFront(txb: TransactionBlock, typeArgs: [string, string], args: PushFrontArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::push_front`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.linkedTable),
      generic(txb, `${typeArgs[0]}`, args.t0),
      generic(txb, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface PrevArgs {
  linkedTable: ObjectArg
  t0: GenericArg
}

export function prev(txb: TransactionBlock, typeArgs: [string, string], args: PrevArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::prev`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.linkedTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface NextArgs {
  linkedTable: ObjectArg
  t0: GenericArg
}

export function next(txb: TransactionBlock, typeArgs: [string, string], args: NextArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::next`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.linkedTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export function popFront(
  txb: TransactionBlock,
  typeArgs: [string, string],
  linkedTable: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::linked_table::pop_front`,
    typeArguments: typeArgs,
    arguments: [obj(txb, linkedTable)],
  })
}
