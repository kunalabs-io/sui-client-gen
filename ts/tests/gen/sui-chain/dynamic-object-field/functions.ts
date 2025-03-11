import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'

export interface BorrowArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::borrow`,
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
    target: `${PUBLISHED_AT}::dynamic_object_field::borrow_mut`,
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
    target: `${PUBLISHED_AT}::dynamic_object_field::remove`,
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
    target: `${PUBLISHED_AT}::dynamic_object_field::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.uid),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface IdArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function id(tx: Transaction, typeArg: string, args: IdArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.uid), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface Exists_Args {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function exists_(tx: Transaction, typeArg: string, args: Exists_Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::exists_`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.uid), generic(tx, `${typeArg}`, args.t0)],
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
    target: `${PUBLISHED_AT}::dynamic_object_field::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.uid), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface InternalAddArgs {
  uid: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
}

export function internalAdd(tx: Transaction, typeArgs: [string, string], args: InternalAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::internal_add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.uid),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface InternalBorrowArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function internalBorrow(
  tx: Transaction,
  typeArgs: [string, string],
  args: InternalBorrowArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::internal_borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.uid), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface InternalBorrowMutArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function internalBorrowMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: InternalBorrowMutArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::internal_borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.uid), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface InternalRemoveArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function internalRemove(
  tx: Transaction,
  typeArgs: [string, string],
  args: InternalRemoveArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::internal_remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.uid), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface InternalExistsWithTypeArgs {
  uid: TransactionObjectInput
  t0: GenericArg
}

export function internalExistsWithType(
  tx: Transaction,
  typeArgs: [string, string],
  args: InternalExistsWithTypeArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::dynamic_object_field::internal_exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.uid), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}
