import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure, vector } from '../../_framework/util'

/** Create an empty `VecMap` */
export function empty(tx: Transaction, typeArgs: [string, string]): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::empty`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export interface InsertArgs {
  self: TransactionObjectInput
  key: GenericArg
  value: GenericArg
}

/**
 * Insert the entry `key` |-> `value` into `self`.
 * Aborts if `key` is already bound in `self`.
 */
export function insert(
  tx: Transaction,
  typeArgs: [string, string],
  args: InsertArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::insert`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArgs[0]}`, args.key),
      generic(tx, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface RemoveArgs {
  self: TransactionObjectInput
  key: GenericArg
}

/** Remove the entry `key` |-> `value` from self. Aborts if `key` is not bound in `self`. */
export function remove(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::remove`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArgs[0]}`, args.key),
    ],
  })
}

/** Pop the most recently inserted entry from the map. Aborts if the map is empty. */
export function pop(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::pop`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export interface GetMutArgs {
  self: TransactionObjectInput
  key: GenericArg
}

/**
 * Get a mutable reference to the value bound to `key` in `self`.
 * Aborts if `key` is not bound in `self`.
 */
export function getMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: GetMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::get_mut`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArgs[0]}`, args.key),
    ],
  })
}

export interface GetArgs {
  self: TransactionObjectInput
  key: GenericArg
}

/**
 * Get a reference to the value bound to `key` in `self`.
 * Aborts if `key` is not bound in `self`.
 */
export function get(tx: Transaction, typeArgs: [string, string], args: GetArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::get`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArgs[0]}`, args.key),
    ],
  })
}

export interface TryGetArgs {
  self: TransactionObjectInput
  key: GenericArg
}

/**
 * Safely try borrow a value bound to `key` in `self`.
 * Return Some(V) if the value exists, None otherwise.
 * Only works for a "copyable" value as references cannot be stored in `vector`.
 */
export function tryGet(
  tx: Transaction,
  typeArgs: [string, string],
  args: TryGetArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::try_get`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArgs[0]}`, args.key),
    ],
  })
}

export interface ContainsArgs {
  self: TransactionObjectInput
  key: GenericArg
}

/** Return true if `self` contains an entry for `key`, false otherwise */
export function contains(
  tx: Transaction,
  typeArgs: [string, string],
  args: ContainsArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::contains`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArgs[0]}`, args.key),
    ],
  })
}

/** Return the number of entries in `self` */
export function length(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::length`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

/** Return true if `self` has 0 elements, false otherwise */
export function isEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

/** Destroy an empty map. Aborts if `self` is not empty */
export function destroyEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

/**
 * Unpack `self` into vectors of its keys and values.
 * The output keys and values are stored in insertion order, *not* sorted by key.
 */
export function intoKeysValues(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::into_keys_values`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export interface FromKeysValuesArgs {
  keys: Array<GenericArg> | TransactionArgument
  values: Array<GenericArg> | TransactionArgument
}

/**
 * Construct a new `VecMap` from two vectors, one for keys and one for values.
 * The key value pairs are associated via their indices in the vectors, e.g. the key at index i
 * in `keys` is associated with the value at index i in `values`.
 * The key value pairs are stored in insertion order (the original vectors ordering)
 * and are *not* sorted.
 */
export function fromKeysValues(
  tx: Transaction,
  typeArgs: [string, string],
  args: FromKeysValuesArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::from_keys_values`,
    typeArguments: typeArgs,
    arguments: [
      vector(tx, `${typeArgs[0]}`, args.keys),
      vector(tx, `${typeArgs[1]}`, args.values),
    ],
  })
}

/**
 * Returns a list of keys in the map.
 * Do not assume any particular ordering.
 */
export function keys(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::keys`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export interface GetIdxOptArgs {
  self: TransactionObjectInput
  key: GenericArg
}

/**
 * Find the index of `key` in `self`. Return `None` if `key` is not in `self`.
 * Note that map entries are stored in insertion order, *not* sorted by key.
 */
export function getIdxOpt(
  tx: Transaction,
  typeArgs: [string, string],
  args: GetIdxOptArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::get_idx_opt`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArgs[0]}`, args.key),
    ],
  })
}

export interface GetIdxArgs {
  self: TransactionObjectInput
  key: GenericArg
}

/**
 * Find the index of `key` in `self`. Aborts if `key` is not in `self`.
 * Note that map entries are stored in insertion order, *not* sorted by key.
 */
export function getIdx(
  tx: Transaction,
  typeArgs: [string, string],
  args: GetIdxArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::get_idx`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArgs[0]}`, args.key),
    ],
  })
}

export interface GetEntryByIdxArgs {
  self: TransactionObjectInput
  idx: bigint | TransactionArgument
}

/**
 * Return a reference to the `idx`th entry of `self`. This gives direct access into the backing array of the map--use with caution.
 * Note that map entries are stored in insertion order, *not* sorted by key.
 * Aborts if `idx` is greater than or equal to `self.length()`
 */
export function getEntryByIdx(
  tx: Transaction,
  typeArgs: [string, string],
  args: GetEntryByIdxArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::get_entry_by_idx`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.idx, `u64`),
    ],
  })
}

export interface GetEntryByIdxMutArgs {
  self: TransactionObjectInput
  idx: bigint | TransactionArgument
}

/**
 * Return a mutable reference to the `idx`th entry of `self`. This gives direct access into the backing array of the map--use with caution.
 * Note that map entries are stored in insertion order, *not* sorted by key.
 * Aborts if `idx` is greater than or equal to `self.length()`
 */
export function getEntryByIdxMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: GetEntryByIdxMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::get_entry_by_idx_mut`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.idx, `u64`),
    ],
  })
}

export interface RemoveEntryByIdxArgs {
  self: TransactionObjectInput
  idx: bigint | TransactionArgument
}

/**
 * Remove the entry at index `idx` from self.
 * Aborts if `idx` is greater than or equal to `self.length()`
 */
export function removeEntryByIdx(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveEntryByIdxArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::remove_entry_by_idx`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.idx, `u64`),
    ],
  })
}

/**
 * Return the number of entries in `self`
 *
 * @deprecated Renamed to `length` for consistency.
 */
export function size(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_map::size`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}
