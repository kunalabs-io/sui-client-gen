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
    target: `${getPublishedAt('sui')}::linked_table::new`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

/** Returns the key for the first element in the table, or None if the table is empty */
export function front(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::front`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

/** Returns the key for the last element in the table, or None if the table is empty */
export function back(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::back`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export interface PushFrontArgs {
  table: TransactionObjectInput
  k: GenericArg
  value: GenericArg
}

/**
 * Inserts a key-value pair at the front of the table, i.e. the newly inserted pair will be
 * the first element in the table
 * Aborts with `sui::dynamic_field::EFieldAlreadyExists` if the table already has an entry with
 * that key `k: K`.
 */
export function pushFront(
  tx: Transaction,
  typeArgs: [string, string],
  args: PushFrontArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::push_front`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
      generic(tx, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface PushBackArgs {
  table: TransactionObjectInput
  k: GenericArg
  value: GenericArg
}

/**
 * Inserts a key-value pair at the back of the table, i.e. the newly inserted pair will be
 * the last element in the table
 * Aborts with `sui::dynamic_field::EFieldAlreadyExists` if the table already has an entry with
 * that key `k: K`.
 */
export function pushBack(
  tx: Transaction,
  typeArgs: [string, string],
  args: PushBackArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::push_back`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
      generic(tx, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface BorrowArgs {
  table: TransactionObjectInput
  k: GenericArg
}

/**
 * Immutable borrows the value associated with the key in the table `table: &LinkedTable<K, V>`.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the table does not have an entry with
 * that key `k: K`.
 */
export function borrow(
  tx: Transaction,
  typeArgs: [string, string],
  args: BorrowArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::borrow`,
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
 * Mutably borrows the value associated with the key in the table `table: &mut LinkedTable<K, V>`.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the table does not have an entry with
 * that key `k: K`.
 */
export function borrowMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: BorrowMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::borrow_mut`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

export interface PrevArgs {
  table: TransactionObjectInput
  k: GenericArg
}

/**
 * Borrows the key for the previous entry of the specified key `k: K` in the table
 * `table: &LinkedTable<K, V>`. Returns None if the entry does not have a predecessor.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the table does not have an entry with
 * that key `k: K`
 */
export function prev(
  tx: Transaction,
  typeArgs: [string, string],
  args: PrevArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::prev`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

export interface NextArgs {
  table: TransactionObjectInput
  k: GenericArg
}

/**
 * Borrows the key for the next entry of the specified key `k: K` in the table
 * `table: &LinkedTable<K, V>`. Returns None if the entry does not have a predecessor.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the table does not have an entry with
 * that key `k: K`
 */
export function next(
  tx: Transaction,
  typeArgs: [string, string],
  args: NextArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::next`,
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
 * Removes the key-value pair in the table `table: &mut LinkedTable<K, V>` and returns the value.
 * This splices the element out of the ordering.
 * Aborts with `sui::dynamic_field::EFieldDoesNotExist` if the table does not have an entry with
 * that key `k: K`. Note: this is also what happens when the table is empty.
 */
export function remove(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::remove`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.table),
      generic(tx, `${typeArgs[0]}`, args.k),
    ],
  })
}

/**
 * Removes the front of the table `table: &mut LinkedTable<K, V>`, returns the key and value.
 * Aborts with `ETableIsEmpty` if the table is empty
 */
export function popFront(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::pop_front`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

/**
 * Removes the back of the table `table: &mut LinkedTable<K, V>`, returns the key and value.
 * Aborts with `ETableIsEmpty` if the table is empty
 */
export function popBack(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::pop_back`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

export interface ContainsArgs {
  table: TransactionObjectInput
  k: GenericArg
}

/**
 * Returns true iff there is a value associated with the key `k: K` in table
 * `table: &LinkedTable<K, V>`
 */
export function contains(
  tx: Transaction,
  typeArgs: [string, string],
  args: ContainsArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::contains`,
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
    target: `${getPublishedAt('sui')}::linked_table::length`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

/** Returns true iff the table is empty (if `length` returns `0`) */
export function isEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::is_empty`,
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
    target: `${getPublishedAt('sui')}::linked_table::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}

/**
 * Drop a possibly non-empty table.
 * Usable only if the value type `V` has the `drop` ability
 */
export function drop(
  tx: Transaction,
  typeArgs: [string, string],
  table: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::linked_table::drop`,
    typeArguments: typeArgs,
    arguments: [obj(tx, table)],
  })
}
