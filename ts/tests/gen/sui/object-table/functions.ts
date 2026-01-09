import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj } from '../../_framework/util'

/** Creates a new, empty table */
export function new_(tx: Transaction, typeArgs: [string, string]): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export interface AddArgs {
  table: TransactionObjectInput
  k: GenericArg
  v: GenericArg
}

/**
 * Adds a key-value pair to the table `table: &mut ObjectTable<K, V>`
 * Aborts with `sui::dynamic_field::EFieldAlreadyExists` if the table already has an entry with
 * that key `k: K`.
 */
export function add(tx: Transaction, typeArgs: [string, string], args: AddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::add`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
      generic(tx, `${typeArgs[1]}`, args.v),
    ],
  })
}

export interface BorrowArgs {
  table: TransactionObjectInput
  k: GenericArg
}

/**
 * Immutable borrows the value associated with the key in the table `table: &ObjectTable<K, V>`.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the table does not have an entry with
 * that key `k: K`.
 */
export function borrow(
  tx: Transaction,
  typeArgs: [string, string],
  args: BorrowArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::borrow`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

export interface BorrowMutArgs {
  table: TransactionObjectInput
  k: GenericArg
}

/**
 * Mutably borrows the value associated with the key in the table `table: &mut ObjectTable<K, V>`.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the table does not have an entry with
 * that key `k: K`.
 */
export function borrowMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: BorrowMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

export interface RemoveArgs {
  table: TransactionObjectInput
  k: GenericArg
}

/**
 * Removes the key-value pair in the table `table: &mut ObjectTable<K, V>` and returns the value.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the table does not have an entry with
 * that key `k: K`.
 */
export function remove(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::remove`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

export interface ContainsArgs {
  table: TransactionObjectInput
  k: GenericArg
}

/**
 * Returns true if there is a value associated with the key `k: K` in table
 * `table: &ObjectTable<K, V>`
 */
export function contains(
  tx: Transaction,
  typeArgs: [string, string],
  args: ContainsArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::contains`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

/** Returns the size of the table, the number of key-value pairs */
export function length(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::length`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

/** Returns true if the table is empty (if `length` returns `0`) */
export function isEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

/**
 * Destroys an empty table
 * Aborts with `ETableNotEmpty` if the table still contains values
 */
export function destroyEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export interface ValueIdArgs {
  table: TransactionObjectInput
  k: GenericArg
}

/**
 * Returns the ID of the object associated with the key if the table has an entry with key `k: K`
 * Returns none otherwise
 */
export function valueId(
  tx: Transaction,
  typeArgs: [string, string],
  args: ValueIdArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object_table::value_id`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}
