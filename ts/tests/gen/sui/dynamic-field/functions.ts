import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AddArgs {
  object: TransactionObjectInput
  name: GenericArg
  value: GenericArg
}

export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.object),
      generic(tx, `${typeArgs[0]}`, args.name),
      generic(tx, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface BorrowArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface BorrowMutArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function borrowMut(tx: Transaction, typeArgs: [string, string], args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface RemoveArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface Exists_Args {
  object: TransactionObjectInput
  name: GenericArg
}

export function exists_(tx: Transaction, typeArg: string, args: Exists_Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::exists_`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.object), generic(tx, `${typeArg}`, args.name)],
  })
}

export interface RemoveIfExistsArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function removeIfExists(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveIfExistsArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove_if_exists`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface ExistsWithTypeArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function existsWithType(
  tx: Transaction,
  typeArgs: [string, string],
  args: ExistsWithTypeArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface FieldInfoArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function fieldInfo(tx: Transaction, typeArg: string, args: FieldInfoArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::field_info`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.object), generic(tx, `${typeArg}`, args.name)],
  })
}

export interface FieldInfoMutArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function fieldInfoMut(tx: Transaction, typeArg: string, args: FieldInfoMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::field_info_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.object), generic(tx, `${typeArg}`, args.name)],
  })
}

export interface HashTypeAndKeyArgs {
  parent: string | TransactionArgument
  k: GenericArg
}

export function hashTypeAndKey(tx: Transaction, typeArg: string, args: HashTypeAndKeyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::hash_type_and_key`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.parent, `address`), generic(tx, `${typeArg}`, args.k)],
  })
}

export interface AddChildObjectArgs {
  parent: string | TransactionArgument
  child: GenericArg
}

export function addChildObject(tx: Transaction, typeArg: string, args: AddChildObjectArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::add_child_object`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.parent, `address`), generic(tx, `${typeArg}`, args.child)],
  })
}

export interface BorrowChildObjectArgs {
  object: TransactionObjectInput
  id: string | TransactionArgument
}

export function borrowChildObject(tx: Transaction, typeArg: string, args: BorrowChildObjectArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_child_object`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.object), pure(tx, args.id, `address`)],
  })
}

export interface BorrowChildObjectMutArgs {
  object: TransactionObjectInput
  id: string | TransactionArgument
}

export function borrowChildObjectMut(
  tx: Transaction,
  typeArg: string,
  args: BorrowChildObjectMutArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_child_object_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.object), pure(tx, args.id, `address`)],
  })
}

export interface RemoveChildObjectArgs {
  parent: string | TransactionArgument
  id: string | TransactionArgument
}

export function removeChildObject(tx: Transaction, typeArg: string, args: RemoveChildObjectArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove_child_object`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.parent, `address`), pure(tx, args.id, `address`)],
  })
}

export interface HasChildObjectArgs {
  parent: string | TransactionArgument
  id: string | TransactionArgument
}

export function hasChildObject(tx: Transaction, args: HasChildObjectArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::has_child_object`,
    arguments: [pure(tx, args.parent, `address`), pure(tx, args.id, `address`)],
  })
}

export interface HasChildObjectWithTyArgs {
  parent: string | TransactionArgument
  id: string | TransactionArgument
}

export function hasChildObjectWithTy(
  tx: Transaction,
  typeArg: string,
  args: HasChildObjectWithTyArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::has_child_object_with_ty`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.parent, `address`), pure(tx, args.id, `address`)],
  })
}
