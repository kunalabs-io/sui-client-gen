import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::new`,
    arguments: [],
  })
}

export interface AddArgs {
  bag: TransactionObjectInput
  k: GenericArg
  v: GenericArg
}

export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.bag),
      generic(tx, `${typeArgs[0]}`, args.k),
      generic(tx, `${typeArgs[1]}`, args.v),
    ],
  })
}

export interface BorrowArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export interface BorrowMutArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

export function borrowMut(tx: Transaction, typeArgs: [string, string], args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export interface RemoveArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export interface ContainsArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::contains`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.bag), generic(tx, `${typeArg}`, args.k)],
  })
}

export interface ContainsWithTypeArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

export function containsWithType(
  tx: Transaction,
  typeArgs: [string, string],
  args: ContainsWithTypeArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::contains_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export function length(tx: Transaction, bag: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::length`,
    arguments: [obj(tx, bag)],
  })
}

export function isEmpty(tx: Transaction, bag: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::is_empty`,
    arguments: [obj(tx, bag)],
  })
}

export function destroyEmpty(tx: Transaction, bag: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::destroy_empty`,
    arguments: [obj(tx, bag)],
  })
}

export interface ValueIdArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

export function valueId(tx: Transaction, typeArg: string, args: ValueIdArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object_bag::value_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.bag), generic(tx, `${typeArg}`, args.k)],
  })
}
