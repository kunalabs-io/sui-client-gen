import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export interface ContainsArgs {
  table: ObjectArg
  k: GenericArg
}

export function contains(txb: TransactionBlock, typeArgs: [Type, Type], args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::contains`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export interface BorrowArgs {
  table: ObjectArg
  k: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [Type, Type], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export interface BorrowMutArgs {
  table: ObjectArg
  k: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [Type, Type], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export function destroyEmpty(txb: TransactionBlock, typeArgs: [Type, Type], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export function isEmpty(txb: TransactionBlock, typeArgs: [Type, Type], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export function length(txb: TransactionBlock, typeArgs: [Type, Type], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::length`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}

export interface RemoveArgs {
  table: ObjectArg
  k: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [Type, Type], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.table), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export function new_(txb: TransactionBlock, typeArgs: [Type, Type]) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export interface AddArgs {
  table: ObjectArg
  k: GenericArg
  v: GenericArg
}

export function add(txb: TransactionBlock, typeArgs: [Type, Type], args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.table),
      generic(txb, `${typeArgs[0]}`, args.k),
      generic(txb, `${typeArgs[1]}`, args.v),
    ],
  })
}

export function drop(txb: TransactionBlock, typeArgs: [Type, Type], table: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table::drop`,
    typeArguments: typeArgs,
    arguments: [obj(txb, table)],
  })
}
