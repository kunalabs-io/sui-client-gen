import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::object_bag::new`, arguments: [] })
}

export function length(txb: TransactionBlock, objectBag: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::length`,
    arguments: [obj(txb, objectBag)],
  })
}

export interface BorrowArgs {
  objectBag: ObjectArg
  t0: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [string, string], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.objectBag), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  objectBag: ObjectArg
  t0: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [string, string], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.objectBag), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export function destroyEmpty(txb: TransactionBlock, objectBag: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::destroy_empty`,
    arguments: [obj(txb, objectBag)],
  })
}

export function isEmpty(txb: TransactionBlock, objectBag: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::is_empty`,
    arguments: [obj(txb, objectBag)],
  })
}

export interface ContainsArgs {
  objectBag: ObjectArg
  t0: GenericArg
}

export function contains(txb: TransactionBlock, typeArg: string, args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::contains`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.objectBag), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface RemoveArgs {
  objectBag: ObjectArg
  t0: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [string, string], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.objectBag), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface AddArgs {
  objectBag: ObjectArg
  t0: GenericArg
  t1: GenericArg
}

export function add(txb: TransactionBlock, typeArgs: [string, string], args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.objectBag),
      generic(txb, `${typeArgs[0]}`, args.t0),
      generic(txb, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface ContainsWithTypeArgs {
  objectBag: ObjectArg
  t0: GenericArg
}

export function containsWithType(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: ContainsWithTypeArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::contains_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.objectBag), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface ValueIdArgs {
  objectBag: ObjectArg
  t0: GenericArg
}

export function valueId(txb: TransactionBlock, typeArg: string, args: ValueIdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::value_id`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.objectBag), generic(txb, `${typeArg}`, args.t0)],
  })
}
