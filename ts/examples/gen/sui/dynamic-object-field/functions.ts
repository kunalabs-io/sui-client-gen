import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AddArgs {
  object: TransactionObjectInput
  name: GenericArg
  value: GenericArg
}

/**
 * Adds a dynamic object field to the object `object: &mut UID` at field specified by `name: Name`.
 * Aborts with `EFieldAlreadyExists` if the object already has that field with that name.
 */
export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::add`,
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
 * Immutably borrows the `object`s dynamic object field with the name specified by `name: Name`.
 * Aborts with `EFieldDoesNotExist` if the object does not have a field with that name.
 * Aborts with `EFieldTypeMismatch` if the field exists, but the value object does not have the
 * specified type.
 */
export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface BorrowMutArgs {
  object: TransactionObjectInput
  name: GenericArg
}

/**
 * Mutably borrows the `object`s dynamic object field with the name specified by `name: Name`.
 * Aborts with `EFieldDoesNotExist` if the object does not have a field with that name.
 * Aborts with `EFieldTypeMismatch` if the field exists, but the value object does not have the
 * specified type.
 */
export function borrowMut(tx: Transaction, typeArgs: [string, string], args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface RemoveArgs {
  object: TransactionObjectInput
  name: GenericArg
}

/**
 * Removes the `object`s dynamic object field with the name specified by `name: Name` and returns
 * the bound object.
 * Aborts with `EFieldDoesNotExist` if the object does not have a field with that name.
 * Aborts with `EFieldTypeMismatch` if the field exists, but the value object does not have the
 * specified type.
 */
export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface Exists_Args {
  object: TransactionObjectInput
  name: GenericArg
}

/**
 * Returns true if and only if the `object` has a dynamic object field with the name specified by
 * `name: Name`.
 */
export function exists_(tx: Transaction, typeArg: string, args: Exists_Args) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::exists_`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.object), generic(tx, `${typeArg}`, args.name)],
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
  args: ExistsWithTypeArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface IdArgs {
  object: TransactionObjectInput
  name: GenericArg
}

/**
 * Returns the ID of the object associated with the dynamic object field
 * Returns none otherwise
 */
export function id(tx: Transaction, typeArg: string, args: IdArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.object), generic(tx, `${typeArg}`, args.name)],
  })
}

export interface InternalAddArgs {
  object: TransactionObjectInput
  name: GenericArg
  value: GenericArg
}

export function internalAdd(tx: Transaction, typeArgs: [string, string], args: InternalAddArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::internal_add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.object),
      generic(tx, `${typeArgs[0]}`, args.name),
      generic(tx, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface InternalBorrowArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function internalBorrow(
  tx: Transaction,
  typeArgs: [string, string],
  args: InternalBorrowArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::internal_borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface InternalBorrowMutArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function internalBorrowMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: InternalBorrowMutArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::internal_borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface InternalRemoveArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function internalRemove(
  tx: Transaction,
  typeArgs: [string, string],
  args: InternalRemoveArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::internal_remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface InternalExistsWithTypeArgs {
  object: TransactionObjectInput
  name: GenericArg
}

export function internalExistsWithType(
  tx: Transaction,
  typeArgs: [string, string],
  args: InternalExistsWithTypeArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::dynamic_object_field::internal_exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.object), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}
