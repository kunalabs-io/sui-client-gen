import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock, typeArgs: [string, string]) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export function length(txb: TransactionBlock, typeArgs: [string, string], objectTable: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_table::length`,
    typeArguments: typeArgs,
    arguments: [obj(txb, objectTable)],
  })
}

export interface BorrowArgs {
  objectTable: ObjectArg
  t0: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [string, string], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_table::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.objectTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  objectTable: ObjectArg
  t0: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [string, string], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.objectTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export function destroyEmpty(
  txb: TransactionBlock,
  typeArgs: [string, string],
  objectTable: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, objectTable)],
  })
}

export function isEmpty(txb: TransactionBlock, typeArgs: [string, string], objectTable: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, objectTable)],
  })
}

export interface ContainsArgs {
  objectTable: ObjectArg
  t0: GenericArg
}

export function contains(txb: TransactionBlock, typeArgs: [string, string], args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_table::contains`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.objectTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  objectTable: ObjectArg
  t0: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [string, string], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_table::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.objectTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface AddArgs {
  objectTable: ObjectArg
  t0: GenericArg
  t1: GenericArg
}

export function add(txb: TransactionBlock, typeArgs: [string, string], args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_table::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.objectTable),
      generic(txb, `${typeArgs[0]}`, args.t0),
      generic(txb, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface ValueIdArgs {
  objectTable: ObjectArg
  t0: GenericArg
}

export function valueId(txb: TransactionBlock, typeArgs: [string, string], args: ValueIdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_table::value_id`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.objectTable), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}
