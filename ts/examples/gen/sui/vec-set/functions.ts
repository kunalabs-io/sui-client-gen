import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, vector } from '../../_framework/util'

/** Create an empty `VecSet` */
export function empty(
  tx: Transaction,
  typeArg: string,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

/** Create a singleton `VecSet` that only contains one element. */
export function singleton(
  tx: Transaction,
  typeArg: string,
  key: GenericArg,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, key)],
  })
}

export interface InsertArgs {
  self: TransactionObjectInput
  key: GenericArg
}

/**
 * Insert a `key` into self.
 * Aborts if `key` is already present in `self`.
 */
export function insert(
  tx: Transaction,
  typeArg: string,
  args: InsertArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::insert`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArg}`, args.key),
    ],
  })
}

export interface RemoveArgs {
  self: TransactionObjectInput
  key: GenericArg
}

/** Remove the entry `key` from self. Aborts if `key` is not present in `self`. */
export function remove(
  tx: Transaction,
  typeArg: string,
  args: RemoveArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::remove`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArg}`, args.key),
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
  typeArg: string,
  args: ContainsArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::contains`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArg}`, args.key),
    ],
  })
}

/** Return the number of entries in `self` */
export function length(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::length`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Return true if `self` has 0 elements, false otherwise */
export function isEmpty(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/**
 * Unpack `self` into vectors of keys.
 * The output keys are stored in insertion order, *not* sorted.
 */
export function intoKeys(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::into_keys`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/**
 * Construct a new `VecSet` from a vector of keys.
 * The keys are stored in insertion order (the original `keys` ordering)
 * and are *not* sorted.
 */
export function fromKeys(
  tx: Transaction,
  typeArg: string,
  keys: Array<GenericArg> | TransactionArgument,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::from_keys`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, keys)],
  })
}

/**
 * Borrow the `contents` of the `VecSet` to access content by index
 * without unpacking. The contents are stored in insertion order,
 * *not* sorted.
 */
export function keys(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::keys`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/**
 * Return the number of entries in `self`
 *
 * @deprecated Renamed to `length` for consistency.
 */
export function size(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::vec_set::size`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
