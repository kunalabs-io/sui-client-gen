import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'

export function length(tx: Transaction, bag: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bag::length`, arguments: [obj(tx, bag)] })
}

export interface BorrowArgs {
  bag: TransactionObjectInput
  t0: GenericArg
}

export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bag::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  bag: TransactionObjectInput
  t0: GenericArg
}

export function borrowMut(tx: Transaction, typeArgs: [string, string], args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bag::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export function destroyEmpty(tx: Transaction, bag: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bag::destroy_empty`, arguments: [obj(tx, bag)] })
}

export function isEmpty(tx: Transaction, bag: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bag::is_empty`, arguments: [obj(tx, bag)] })
}

export interface ContainsArgs {
  bag: TransactionObjectInput
  t0: GenericArg
}

export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bag::contains`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.bag), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface RemoveArgs {
  bag: TransactionObjectInput
  t0: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bag::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export function new_(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bag::new`, arguments: [] })
}

export interface AddArgs {
  bag: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
}

export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bag::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.bag),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface ContainsWithTypeArgs {
  bag: TransactionObjectInput
  t0: GenericArg
}

export function containsWithType(
  tx: Transaction,
  typeArgs: [string, string],
  args: ContainsWithTypeArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bag::contains_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}
