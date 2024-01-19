import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export interface IdArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function id(txb: TransactionBlock, typeArg: string, args: IdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::id`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.uid), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface BorrowArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [string, string], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.uid), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [string, string], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.uid), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [string, string], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.uid), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface AddArgs {
  uid: ObjectArg
  t0: GenericArg
  t1: GenericArg
}

export function add(txb: TransactionBlock, typeArgs: [string, string], args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.uid),
      generic(txb, `${typeArgs[0]}`, args.t0),
      generic(txb, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface Exists_Args {
  uid: ObjectArg
  t0: GenericArg
}

export function exists_(txb: TransactionBlock, typeArg: string, args: Exists_Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::exists_`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.uid), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface ExistsWithTypeArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function existsWithType(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: ExistsWithTypeArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.uid), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}
