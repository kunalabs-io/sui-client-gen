import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface BorrowArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.uid), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function borrowMut(tx: Transaction, typeArgs: [string, string], args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.uid), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.uid), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface AddArgs {
  uid: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
}

export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.uid),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface Exists_Args {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function exists_(tx: Transaction, typeArg: string, args: Exists_Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::exists_`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.uid), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface RemoveIfExistsArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function removeIfExists(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveIfExistsArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove_if_exists`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.uid), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface ExistsWithTypeArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function existsWithType(
  tx: Transaction,
  typeArgs: [string, string],
  args: ExistsWithTypeArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.uid), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface FieldInfoArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function fieldInfo(tx: Transaction, typeArg: string, args: FieldInfoArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::field_info`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.uid), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface FieldInfoMutArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function fieldInfoMut(tx: Transaction, typeArg: string, args: FieldInfoMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::field_info_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.uid), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface HashTypeAndKeyArgs {
  address: string | TransactionArgument
  t0: GenericArg
}

export function hashTypeAndKey(tx: Transaction, typeArg: string, args: HashTypeAndKeyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::hash_type_and_key`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.address, `address`), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface AddChildObjectArgs {
  address: string | TransactionArgument
  t0: GenericArg
}

export function addChildObject(tx: Transaction, typeArg: string, args: AddChildObjectArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::add_child_object`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.address, `address`), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface BorrowChildObjectArgs {
  uid: TransactionObjectInput
  address: string | TransactionArgument
}

export function borrowChildObject(tx: Transaction, typeArg: string, args: BorrowChildObjectArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_child_object`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.uid), pure(tx, args.address, `address`)],
  })
}

export interface BorrowChildObjectMutArgs {
  uid: TransactionObjectInput
  address: string | TransactionArgument
}

export function borrowChildObjectMut(
  tx: Transaction,
  typeArg: string,
  args: BorrowChildObjectMutArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::borrow_child_object_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.uid), pure(tx, args.address, `address`)],
  })
}

export interface RemoveChildObjectArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
}

export function removeChildObject(tx: Transaction, typeArg: string, args: RemoveChildObjectArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::remove_child_object`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.address1, `address`), pure(tx, args.address2, `address`)],
  })
}

export interface HasChildObjectArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
}

export function hasChildObject(tx: Transaction, args: HasChildObjectArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::has_child_object`,
    arguments: [pure(tx, args.address1, `address`), pure(tx, args.address2, `address`)],
  })
}

export interface HasChildObjectWithTyArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
}

export function hasChildObjectWithTy(
  tx: Transaction,
  typeArg: string,
  args: HasChildObjectWithTyArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_field::has_child_object_with_ty`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.address1, `address`), pure(tx, args.address2, `address`)],
  })
}
