import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface BorrowArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function borrow(txb: TransactionBlock, typeArgs: [Type, Type], args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.uid), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function borrowMut(txb: TransactionBlock, typeArgs: [Type, Type], args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.uid), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [Type, Type], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.uid), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface AddArgs {
  uid: ObjectArg
  t0: GenericArg
  t1: GenericArg
}

export function add(txb: TransactionBlock, typeArgs: [Type, Type], args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::add`,
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

export function exists_(txb: TransactionBlock, typeArg: Type, args: Exists_Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::exists_`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.uid), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface RemoveIfExistsArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function removeIfExists(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: RemoveIfExistsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove_if_exists`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.uid), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface ExistsWithTypeArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function existsWithType(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: ExistsWithTypeArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.uid), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface FieldInfoArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function fieldInfo(txb: TransactionBlock, typeArg: Type, args: FieldInfoArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::field_info`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.uid), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface FieldInfoMutArgs {
  uid: ObjectArg
  t0: GenericArg
}

export function fieldInfoMut(txb: TransactionBlock, typeArg: Type, args: FieldInfoMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::field_info_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.uid), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface HashTypeAndKeyArgs {
  address: string | TransactionArgument
  t0: GenericArg
}

export function hashTypeAndKey(txb: TransactionBlock, typeArg: Type, args: HashTypeAndKeyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::hash_type_and_key`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.address, `address`), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface AddChildObjectArgs {
  address: string | TransactionArgument
  t0: GenericArg
}

export function addChildObject(txb: TransactionBlock, typeArg: Type, args: AddChildObjectArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::add_child_object`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.address, `address`), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface BorrowChildObjectArgs {
  uid: ObjectArg
  address: string | TransactionArgument
}

export function borrowChildObject(
  txb: TransactionBlock,
  typeArg: Type,
  args: BorrowChildObjectArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_child_object`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.uid), pure(txb, args.address, `address`)],
  })
}

export interface BorrowChildObjectMutArgs {
  uid: ObjectArg
  address: string | TransactionArgument
}

export function borrowChildObjectMut(
  txb: TransactionBlock,
  typeArg: Type,
  args: BorrowChildObjectMutArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_child_object_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.uid), pure(txb, args.address, `address`)],
  })
}

export interface RemoveChildObjectArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
}

export function removeChildObject(
  txb: TransactionBlock,
  typeArg: Type,
  args: RemoveChildObjectArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove_child_object`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.address1, `address`), pure(txb, args.address2, `address`)],
  })
}

export interface HasChildObjectArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
}

export function hasChildObject(txb: TransactionBlock, args: HasChildObjectArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::has_child_object`,
    arguments: [pure(txb, args.address1, `address`), pure(txb, args.address2, `address`)],
  })
}

export interface HasChildObjectWithTyArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
}

export function hasChildObjectWithTy(
  txb: TransactionBlock,
  typeArg: Type,
  args: HasChildObjectWithTyArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::has_child_object_with_ty`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.address1, `address`), pure(txb, args.address2, `address`)],
  })
}
