import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface BorrowArgs {
  object: ObjectArg
  name: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [Type, Type], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.object), generic(txb, `${typeArgs[0]}`, args.name)],
  })
}

export interface BorrowMutArgs {
  object: ObjectArg
  name: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [Type, Type], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.object), generic(txb, `${typeArgs[0]}`, args.name)],
  })
}

export interface RemoveArgs {
  object: ObjectArg
  name: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [Type, Type], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.object), generic(txb, `${typeArgs[0]}`, args.name)],
  })
}

export interface AddArgs {
  object: ObjectArg
  name: GenericArg
  value: GenericArg
}

export function add(txb: TransactionBlock, typeArgs: [Type, Type], args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.object),
      generic(txb, `${typeArgs[0]}`, args.name),
      generic(txb, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface AddChildObjectArgs {
  parent: string | TransactionArgument
  child: GenericArg
}

export function addChildObject(txb: TransactionBlock, typeArg: Type, args: AddChildObjectArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::add_child_object`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.parent, `address`), generic(txb, `${typeArg}`, args.child)],
  })
}

export interface BorrowChildObjectArgs {
  object: ObjectArg
  id: string | TransactionArgument
}

export function borrowChildObject(
  txb: TransactionBlock,
  typeArg: Type,
  args: BorrowChildObjectArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_child_object`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.object), pure(txb, args.id, `address`)],
  })
}

export interface BorrowChildObjectMutArgs {
  object: ObjectArg
  id: string | TransactionArgument
}

export function borrowChildObjectMut(
  txb: TransactionBlock,
  typeArg: Type,
  args: BorrowChildObjectMutArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_child_object_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.object), pure(txb, args.id, `address`)],
  })
}

export interface Exists_Args {
  object: ObjectArg
  name: GenericArg
}

export function exists_(txb: TransactionBlock, typeArg: Type, args: Exists_Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::exists_`,
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
  typeArgs: [Type, Type],
  args: ExistsWithTypeArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.object), generic(txb, `${typeArgs[0]}`, args.name)],
  })
}

export interface FieldInfoArgs {
  object: ObjectArg
  name: GenericArg
}

export function fieldInfo(txb: TransactionBlock, typeArg: Type, args: FieldInfoArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::field_info`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.object), generic(txb, `${typeArg}`, args.name)],
  })
}

export interface FieldInfoMutArgs {
  object: ObjectArg
  name: GenericArg
}

export function fieldInfoMut(txb: TransactionBlock, typeArg: Type, args: FieldInfoMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::field_info_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.object), generic(txb, `${typeArg}`, args.name)],
  })
}

export interface HasChildObjectArgs {
  parent: string | TransactionArgument
  id: string | TransactionArgument
}

export function hasChildObject(txb: TransactionBlock, args: HasChildObjectArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::has_child_object`,
    arguments: [pure(txb, args.parent, `address`), pure(txb, args.id, `address`)],
  })
}

export interface HasChildObjectWithTyArgs {
  parent: string | TransactionArgument
  id: string | TransactionArgument
}

export function hasChildObjectWithTy(
  txb: TransactionBlock,
  typeArg: Type,
  args: HasChildObjectWithTyArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::has_child_object_with_ty`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.parent, `address`), pure(txb, args.id, `address`)],
  })
}

export interface HashTypeAndKeyArgs {
  parent: string | TransactionArgument
  k: GenericArg
}

export function hashTypeAndKey(txb: TransactionBlock, typeArg: Type, args: HashTypeAndKeyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::hash_type_and_key`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.parent, `address`), generic(txb, `${typeArg}`, args.k)],
  })
}

export interface RemoveChildObjectArgs {
  parent: string | TransactionArgument
  id: string | TransactionArgument
}

export function removeChildObject(
  txb: TransactionBlock,
  typeArg: Type,
  args: RemoveChildObjectArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove_child_object`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.parent, `address`), pure(txb, args.id, `address`)],
  })
}

export interface RemoveIfExistsArgs {
  object: ObjectArg
  name: GenericArg
}

export function removeIfExists(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: RemoveIfExistsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove_if_exists`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.object), generic(txb, `${typeArgs[0]}`, args.name)],
  })
}
