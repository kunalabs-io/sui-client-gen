import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export interface BorrowArgs {
  bag: ObjectArg
  k: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [Type, Type], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.bag), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export interface BorrowMutArgs {
  bag: ObjectArg
  k: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [Type, Type], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.bag), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export interface ContainsArgs {
  bag: ObjectArg
  k: GenericArg
}

export function contains(txb: TransactionBlock, typeArg: Type, args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::contains`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.bag), generic(txb, `${typeArg}`, args.k)],
  })
}

export function destroyEmpty(txb: TransactionBlock, bag: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::destroy_empty`,
    arguments: [obj(txb, bag)],
  })
}

export function isEmpty(txb: TransactionBlock, bag: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::is_empty`,
    arguments: [obj(txb, bag)],
  })
}

export function length(txb: TransactionBlock, bag: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::object_bag::length`, arguments: [obj(txb, bag)] })
}

export interface RemoveArgs {
  bag: ObjectArg
  k: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [Type, Type], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.bag), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export function new_(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::object_bag::new`, arguments: [] })
}

export interface AddArgs {
  bag: ObjectArg
  k: GenericArg
  v: GenericArg
}

export function add(txb: TransactionBlock, typeArgs: [Type, Type], args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.bag),
      generic(txb, `${typeArgs[0]}`, args.k),
      generic(txb, `${typeArgs[1]}`, args.v),
    ],
  })
}

export interface ContainsWithTypeArgs {
  bag: ObjectArg
  k: GenericArg
}

export function containsWithType(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: ContainsWithTypeArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::contains_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.bag), generic(txb, `${typeArgs[0]}`, args.k)],
  })
}

export interface ValueIdArgs {
  bag: ObjectArg
  k: GenericArg
}

export function valueId(txb: TransactionBlock, typeArg: Type, args: ValueIdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object_bag::value_id`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.bag), generic(txb, `${typeArg}`, args.k)],
  })
}
