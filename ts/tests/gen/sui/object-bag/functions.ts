import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj } from '../../_framework/util'

/** Creates a new, empty bag */
export function new_(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::new`,
    arguments: [],
  })
}

export interface AddArgs {
  bag: TransactionObjectInput
  k: GenericArg
  v: GenericArg
}

/**
 * Adds a key-value pair to the bag `bag: &mut ObjectBag`
 * Aborts with `sui::dynamic_field::EFieldAlreadyExists` if the bag already has an entry with
 * that key `k: K`.
 */
export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::add`,
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
 * Immutably borrows the value associated with the key in the bag `bag: &ObjectBag`.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the bag does not have an entry with
 * that key `k: K`.
 * Aborts with `sui::dynamic_field::EFieldTypeMismatch` if the bag has an entry for the key, but
 * the value does not have the specified type.
 */
export function borrow(
  tx: Transaction,
  typeArgs: [string, string],
  args: BorrowArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::borrow`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.bag),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

export interface BorrowMutArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

/**
 * Mutably borrows the value associated with the key in the bag `bag: &mut ObjectBag`.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the bag does not have an entry with
 * that key `k: K`.
 * Aborts with `sui::dynamic_field::EFieldTypeMismatch` if the bag has an entry for the key, but
 * the value does not have the specified type.
 */
export function borrowMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: BorrowMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.bag),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

export interface RemoveArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

/**
 * Mutably borrows the key-value pair in the bag `bag: &mut ObjectBag` and returns the value.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the bag does not have an entry with
 * that key `k: K`.
 * Aborts with `sui::dynamic_field::EFieldTypeMismatch` if the bag has an entry for the key, but
 * the value does not have the specified type.
 */
export function remove(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::remove`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.bag),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

export interface ContainsArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

/** Returns true iff there is an value associated with the key `k: K` in the bag `bag: &ObjectBag` */
export function contains(tx: Transaction, typeArg: string, args: ContainsArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::contains`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.bag),
      generic(tx, `${typeArg}`, args.k),
    ],
  })
}

export interface ContainsWithTypeArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

/**
 * Returns true iff there is an value associated with the key `k: K` in the bag `bag: &ObjectBag`
 * with an assigned value of type `V`
 */
export function containsWithType(
  tx: Transaction,
  typeArgs: [string, string],
  args: ContainsWithTypeArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::contains_with_type`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.bag),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

/** Returns the size of the bag, the number of key-value pairs */
export function length(tx: Transaction, bag: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::length`,
    arguments: [obj(tx, bag)],
  })
}

/** Returns true iff the bag is empty (if `length` returns `0`) */
export function isEmpty(tx: Transaction, bag: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::is_empty`,
    arguments: [obj(tx, bag)],
  })
}

/**
 * Destroys an empty bag
 * Aborts with `EBagNotEmpty` if the bag still contains values
 */
export function destroyEmpty(tx: Transaction, bag: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::destroy_empty`,
    arguments: [obj(tx, bag)],
  })
}

export interface ValueIdArgs {
  bag: TransactionObjectInput
  k: GenericArg
}

/**
 * Returns the ID of the object associated with the key if the bag has an entry with key `k: K`
 * Returns none otherwise
 */
export function valueId(tx: Transaction, typeArg: string, args: ValueIdArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_bag::value_id`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.bag),
      generic(tx, `${typeArg}`, args.k),
    ],
  })
}
