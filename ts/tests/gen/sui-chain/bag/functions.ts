import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bag::new`, arguments: [] })
}

export function length(txb: TransactionBlock, bag: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bag::length`, arguments: [obj(txb, bag)] })
}

export interface BorrowArgs {
  bag: ObjectArg
  t0: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [Type, Type], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bag::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.bag), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  bag: ObjectArg
  t0: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [Type, Type], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bag::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.bag), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export function destroyEmpty(txb: TransactionBlock, bag: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bag::destroy_empty`, arguments: [obj(txb, bag)] })
}

export function isEmpty(txb: TransactionBlock, bag: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bag::is_empty`, arguments: [obj(txb, bag)] })
}

export interface ContainsArgs {
  bag: ObjectArg
  t0: GenericArg
}

export function contains(txb: TransactionBlock, typeArg: Type, args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bag::contains`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.bag), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface RemoveArgs {
  bag: ObjectArg
  t0: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [Type, Type], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bag::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.bag), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface AddArgs {
  bag: ObjectArg
  t0: GenericArg
  t1: GenericArg
}

export function add(txb: TransactionBlock, typeArgs: [Type, Type], args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bag::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.bag),
      generic(txb, `${typeArgs[0]}`, args.t0),
      generic(txb, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface ContainsWithTypeArgs {
  bag: ObjectArg
  t0: GenericArg
}

export function containsWithType(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: ContainsWithTypeArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bag::contains_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.bag), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}
