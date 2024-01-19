import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock, typeArgs: [string, string]) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export function length(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::length`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export interface BorrowArgs {
  table: ObjectArg
  t0: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [string, string], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  table: ObjectArg
  t0: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [string, string], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export function destroyEmpty(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export function isEmpty(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export interface ContainsArgs {
  table: ObjectArg
  t0: GenericArg
}

export function contains(txb: TransactionBlock, typeArgs: [string, string], args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::contains`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  table: ObjectArg
  t0: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [string, string], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface AddArgs {
  table: ObjectArg
  t0: GenericArg
  t1: GenericArg
}

export function add(txb: TransactionBlock, typeArgs: [string, string], args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.table),
      generic(txb, `${typeArgs[0]}`, args.t0),
      generic(txb, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export function drop(txb: TransactionBlock, typeArgs: [string, string], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::drop`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}
