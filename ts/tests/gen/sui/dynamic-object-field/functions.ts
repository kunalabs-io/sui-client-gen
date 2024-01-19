import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export interface BorrowArgs {
  object: ObjectArg
  name: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [string, string], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.object), generic(txb, `${typeArgs[0]}`, args.name)],
  })
}

export interface BorrowMutArgs {
  object: ObjectArg
  name: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [string, string], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.object), generic(txb, `${typeArgs[0]}`, args.name)],
  })
}

export interface RemoveArgs {
  object: ObjectArg
  name: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [string, string], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.object), generic(txb, `${typeArgs[0]}`, args.name)],
  })
}

export interface IdArgs {
  object: ObjectArg
  name: GenericArg
}

export function id(txb: TransactionBlock, typeArg: string, args: IdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::id`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.object), generic(txb, `${typeArg}`, args.name)],
  })
}

export interface AddArgs {
  object: ObjectArg
  name: GenericArg
  value: GenericArg
}

export function add(txb: TransactionBlock, typeArgs: [string, string], args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.object),
      generic(txb, `${typeArgs[0]}`, args.name),
      generic(txb, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface Exists_Args {
  object: ObjectArg
  name: GenericArg
}

export function exists_(txb: TransactionBlock, typeArg: string, args: Exists_Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::exists_`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.object), generic(txb, `${typeArg}`, args.name)],
  })
}

export interface ExistsWithTypeArgs {
  object: ObjectArg
  name: GenericArg
}

export function existsWithType(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: ExistsWithTypeArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.object), generic(txb, `${typeArgs[0]}`, args.name)],
  })
}
