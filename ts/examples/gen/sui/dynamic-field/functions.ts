import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure } from '../../_framework/util'

export interface AddArgs {
  object: TransactionObjectInput
  name: GenericArg
  value: GenericArg
}

/**
 * Adds a dynamic field to the object `object: &mut UID` at field specified by `name: Name`.
 * Aborts with `EFieldAlreadyExists` if the object already has that field with that name.
 */
export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::add`,
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

/**
 * Immutably borrows the `object`s dynamic field with the name specified by `name: Name`.
 * Aborts with `EFieldDoesNotExist` if the object does not have a field with that name.
 * Aborts with `EFieldTypeMismatch` if the field exists, but the value does not have the specified
 * type.
 */
export function borrow(
  tx: Transaction,
  typeArgs: [string, string],
  args: BorrowArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::borrow`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.object),
      generic(tx, `${typeArgs[0]}`, args.name),
    ],
  })
}

export interface BorrowMutArgs {
  object: TransactionObjectInput
  name: GenericArg
}

/**
 * Mutably borrows the `object`s dynamic field with the name specified by `name: Name`.
 * Aborts with `EFieldDoesNotExist` if the object does not have a field with that name.
 * Aborts with `EFieldTypeMismatch` if the field exists, but the value does not have the specified
 * type.
 */
export function borrowMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: BorrowMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.object),
      generic(tx, `${typeArgs[0]}`, args.name),
    ],
  })
}

export interface RemoveArgs {
  object: TransactionObjectInput
  name: GenericArg
}

/**
 * Removes the `object`s dynamic field with the name specified by `name: Name` and returns the
 * bound value.
 * Aborts with `EFieldDoesNotExist` if the object does not have a field with that name.
 * Aborts with `EFieldTypeMismatch` if the field exists, but the value does not have the specified
 * type.
 */
export function remove(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::remove`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.object),
      generic(tx, `${typeArgs[0]}`, args.name),
    ],
  })
}

export interface Exists_Args {
  object: TransactionObjectInput
  name: GenericArg
}

/**
 * Returns true if and only if the `object` has a dynamic field with the name specified by
 * `name: Name` but without specifying the `Value` type
 */
export function exists_(tx: Transaction, typeArg: string, args: Exists_Args): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::exists_`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.object),
      generic(tx, `${typeArg}`, args.name),
    ],
  })
}

export interface RemoveIfExistsArgs {
  object: TransactionObjectInput
  name: GenericArg
}

/** Removes the dynamic field if it exists. Returns the `some(Value)` if it exists or none otherwise. */
export function removeIfExists(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveIfExistsArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::remove_if_exists`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.object),
      generic(tx, `${typeArgs[0]}`, args.name),
    ],
  })
}

export interface ExistsWithTypeArgs {
  object: TransactionObjectInput
  name: GenericArg
}

/**
 * Returns true if and only if the `object` has a dynamic field with the name specified by
 * `name: Name` with an assigned value of type `Value`.
 */
export function existsWithType(
  tx: Transaction,
  typeArgs: [string, string],
  args: ExistsWithTypeArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.object),
      generic(tx, `${typeArgs[0]}`, args.name),
    ],
  })
}

export interface FieldInfoArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function fieldInfo(
  tx: Transaction,
  typeArg: string,
  args: FieldInfoArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::field_info`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.object),
      generic(tx, `${typeArg}`, args.name),
    ],
  })
}

export interface FieldInfoMutArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function fieldInfoMut(
  tx: Transaction,
  typeArg: string,
  args: FieldInfoMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::field_info_mut`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.object),
      generic(tx, `${typeArg}`, args.name),
    ],
  })
}

export interface HashTypeAndKeyArgs {
  parent: string | TransactionArgument
  k: GenericArg
}

/** May abort with `EBCSSerializationFailure`. */
export function hashTypeAndKey(
  tx: Transaction,
  typeArg: string,
  args: HashTypeAndKeyArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::hash_type_and_key`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.parent, `address`),
      generic(tx, `${typeArg}`, args.k),
    ],
  })
}

export interface AddChildObjectArgs {
  parent: string | TransactionArgument
  child: GenericArg
}

export function addChildObject(
  tx: Transaction,
  typeArg: string,
  args: AddChildObjectArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::add_child_object`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.parent, `address`),
      generic(tx, `${typeArg}`, args.child),
    ],
  })
}

export interface BorrowChildObjectArgs {
  object: TransactionObjectInput
  id: string | TransactionArgument
}

/**
 * throws `EFieldDoesNotExist` if a child does not exist with that ID
 * or throws `EFieldTypeMismatch` if the type does not match,
 * and may also abort with `EBCSSerializationFailure`
 * we need two versions to return a reference or a mutable reference
 */
export function borrowChildObject(
  tx: Transaction,
  typeArg: string,
  args: BorrowChildObjectArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::borrow_child_object`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.object),
      pure(tx, args.id, `address`),
    ],
  })
}

export interface BorrowChildObjectMutArgs {
  object: TransactionObjectInput
  id: string | TransactionArgument
}

export function borrowChildObjectMut(
  tx: Transaction,
  typeArg: string,
  args: BorrowChildObjectMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::borrow_child_object_mut`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.object),
      pure(tx, args.id, `address`),
    ],
  })
}

export interface RemoveChildObjectArgs {
  parent: string | TransactionArgument
  id: string | TransactionArgument
}

/**
 * throws `EFieldDoesNotExist` if a child does not exist with that ID
 * or throws `EFieldTypeMismatch` if the type does not match,
 * and may also abort with `EBCSSerializationFailure`.
 */
export function removeChildObject(
  tx: Transaction,
  typeArg: string,
  args: RemoveChildObjectArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::remove_child_object`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.parent, `address`),
      pure(tx, args.id, `address`),
    ],
  })
}

export interface HasChildObjectArgs {
  parent: string | TransactionArgument
  id: string | TransactionArgument
}

export function hasChildObject(tx: Transaction, args: HasChildObjectArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::has_child_object`,
    arguments: [
      pure(tx, args.parent, `address`),
      pure(tx, args.id, `address`),
    ],
  })
}

export interface HasChildObjectWithTyArgs {
  parent: string | TransactionArgument
  id: string | TransactionArgument
}

export function hasChildObjectWithTy(
  tx: Transaction,
  typeArg: string,
  args: HasChildObjectWithTyArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_field::has_child_object_with_ty`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.parent, `address`),
      pure(tx, args.id, `address`),
    ],
  })
}
