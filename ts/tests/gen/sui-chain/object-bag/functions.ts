import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object_bag::new`, arguments: [] })
}

export interface AddArgs {
  objectBag: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
}

export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.objectBag),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface BorrowArgs {
  objectBag: TransactionObjectInput
  t0: GenericArg
}

export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.objectBag), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  objectBag: TransactionObjectInput
  t0: GenericArg
}

export function borrowMut(tx: Transaction, typeArgs: [string, string], args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.objectBag), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  objectBag: TransactionObjectInput
  t0: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.objectBag), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface ContainsArgs {
  objectBag: TransactionObjectInput
  t0: GenericArg
}

export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::contains`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.objectBag), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface ContainsWithTypeArgs {
  objectBag: TransactionObjectInput
  t0: GenericArg
}

export function containsWithType(
  tx: Transaction,
  typeArgs: [string, string],
  args: ContainsWithTypeArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::contains_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.objectBag), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export function length(tx: Transaction, objectBag: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::length`,
    arguments: [obj(tx, objectBag)],
  })
}

export function isEmpty(tx: Transaction, objectBag: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::is_empty`,
    arguments: [obj(tx, objectBag)],
  })
}

export function destroyEmpty(tx: Transaction, objectBag: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::destroy_empty`,
    arguments: [obj(tx, objectBag)],
  })
}

export interface ValueIdArgs {
  objectBag: TransactionObjectInput
  t0: GenericArg
}

export function valueId(tx: Transaction, typeArg: string, args: ValueIdArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::value_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.objectBag), generic(tx, `${typeArg}`, args.t0)],
  })
}
