import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

/** Creates a new, empty bag */
export function new_(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bag::new`,
    arguments: [],
  })
}

export interface AddArgs {
  bag: TransactionObjectInput
  k: GenericArg
  v: GenericArg
}

/**
 * Adds a key-value pair to the bag `bag: &mut Bag`
 * Aborts with `sui::dynamic_field::EFieldAlreadyExists` if the bag already has an entry with
 * that key `k: K`.
 */
export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bag::add`,
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

/**
 * Immutable borrows the value associated with the key in the bag `bag: &Bag`.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the bag does not have an entry with
 * that key `k: K`.
 * Aborts with `sui::dynamic_field::EFieldTypeMismatch` if the bag has an entry for the key, but
 * the value does not have the specified type.
 */
export function borrow(tx: Transaction, typeArgs: [string, string], args: BorrowArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bag::borrow`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export interface BorrowMutArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

/**
 * Mutably borrows the value associated with the key in the bag `bag: &mut Bag`.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the bag does not have an entry with
 * that key `k: K`.
 * Aborts with `sui::dynamic_field::EFieldTypeMismatch` if the bag has an entry for the key, but
 * the value does not have the specified type.
 */
export function borrowMut(tx: Transaction, typeArgs: [string, string], args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bag::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export interface RemoveArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

/**
 * Mutably borrows the key-value pair in the bag `bag: &mut Bag` and returns the value.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the bag does not have an entry with
 * that key `k: K`.
 * Aborts with `sui::dynamic_field::EFieldTypeMismatch` if the bag has an entry for the key, but
 * the value does not have the specified type.
 */
export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bag::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

export interface ContainsArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

/** Returns true iff there is an value associated with the key `k: K` in the bag `bag: &Bag` */
export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bag::contains`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.bag), generic(tx, `${typeArg}`, args.k)],
  })
}

export interface ContainsWithTypeArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

/**
 * Returns true iff there is an value associated with the key `k: K` in the bag `bag: &Bag`
 * with an assigned value of type `V`
 */
export function containsWithType(
  tx: Transaction,
  typeArgs: [string, string],
  args: ContainsWithTypeArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bag::contains_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.bag), generic(tx, `${typeArgs[0]}`, args.k)],
  })
}

/** Returns the size of the bag, the number of key-value pairs */
export function length(tx: Transaction, bag: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bag::length`,
    arguments: [obj(tx, bag)],
  })
}

/** Returns true iff the bag is empty (if `length` returns `0`) */
export function isEmpty(tx: Transaction, bag: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bag::is_empty`,
    arguments: [obj(tx, bag)],
  })
}

/**
 * Destroys an empty bag
 * Aborts with `EBagNotEmpty` if the bag still contains values
 */
export function destroyEmpty(tx: Transaction, bag: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bag::destroy_empty`,
    arguments: [obj(tx, bag)],
  })
}
