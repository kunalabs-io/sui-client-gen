import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, pure, vector } from '../../_framework/util'

/** Create an empty vector. */
export function empty(tx: Transaction, typeArg: string): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

/** Return the length of the vector. */
export function length(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::length`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export interface BorrowArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

/**
 * Acquire an immutable reference to the `i`th element of the vector `v`.
 * Aborts if `i` is out of bounds.
 */
export function borrow(tx: Transaction, typeArg: string, args: BorrowArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::borrow`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      pure(tx, args.i, `u64`),
    ],
  })
}

export interface PushBackArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

/** Add element `e` to the end of the vector `v`. */
export function pushBack(tx: Transaction, typeArg: string, args: PushBackArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::push_back`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      generic(tx, `${typeArg}`, args.e),
    ],
  })
}

export interface BorrowMutArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

/**
 * Return a mutable reference to the `i`th element in the vector `v`.
 * Aborts if `i` is out of bounds.
 */
export function borrowMut(
  tx: Transaction,
  typeArg: string,
  args: BorrowMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      pure(tx, args.i, `u64`),
    ],
  })
}

/**
 * Pop an element from the end of vector `v`.
 * Aborts if `v` is empty.
 */
export function popBack(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::pop_back`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

/**
 * Destroy the vector `v`.
 * Aborts if `v` is not empty.
 */
export function destroyEmpty(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export interface SwapArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

/**
 * Swaps the elements at the `i`th and `j`th indices in the vector `v`.
 * Aborts if `i` or `j` is out of bounds.
 */
export function swap(tx: Transaction, typeArg: string, args: SwapArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::swap`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      pure(tx, args.i, `u64`),
      pure(tx, args.j, `u64`),
    ],
  })
}

/** Return an vector of size one containing element `e`. */
export function singleton(tx: Transaction, typeArg: string, e: GenericArg): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, e)],
  })
}

/** Reverses the order of the elements in the vector `v` in place. */
export function reverse(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::reverse`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export interface AppendArgs {
  lhs: Array<GenericArg> | TransactionArgument
  other: Array<GenericArg> | TransactionArgument
}

/** Pushes all of the elements of the `other` vector into the `lhs` vector. */
export function append(tx: Transaction, typeArg: string, args: AppendArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::append`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.lhs),
      vector(tx, `${typeArg}`, args.other),
    ],
  })
}

/** Return `true` if the vector `v` has no elements and `false` otherwise. */
export function isEmpty(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::is_empty`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export interface ContainsArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

/**
 * Return true if `e` is in the vector `v`.
 * Otherwise, returns false.
 */
export function contains(tx: Transaction, typeArg: string, args: ContainsArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::contains`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      generic(tx, `${typeArg}`, args.e),
    ],
  })
}

export interface IndexOfArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

/**
 * Return `(true, i)` if `e` is in the vector `v` at index `i`.
 * Otherwise, returns `(false, 0)`.
 */
export function indexOf(tx: Transaction, typeArg: string, args: IndexOfArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::index_of`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      generic(tx, `${typeArg}`, args.e),
    ],
  })
}

export interface RemoveArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

/**
 * Remove the `i`th element of the vector `v`, shifting all subsequent elements.
 * This is O(n) and preserves ordering of elements in the vector.
 * Aborts if `i` is out of bounds.
 */
export function remove(tx: Transaction, typeArg: string, args: RemoveArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::remove`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      pure(tx, args.i, `u64`),
    ],
  })
}

export interface InsertArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
  i: bigint | TransactionArgument
}

/**
 * Insert `e` at position `i` in the vector `v`.
 * If `i` is in bounds, this shifts the old `v[i]` and all subsequent elements to the right.
 * If `i == v.length()`, this adds `e` to the end of the vector.
 * This is O(n) and preserves ordering of elements in the vector.
 * Aborts if `i > v.length()`
 */
export function insert(tx: Transaction, typeArg: string, args: InsertArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::insert`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      generic(tx, `${typeArg}`, args.e),
      pure(tx, args.i, `u64`),
    ],
  })
}

export interface SwapRemoveArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

/**
 * Swap the `i`th element of the vector `v` with the last element and then pop the vector.
 * This is O(1), but does not preserve ordering of elements in the vector.
 * Aborts if `i` is out of bounds.
 */
export function swapRemove(
  tx: Transaction,
  typeArg: string,
  args: SwapRemoveArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::swap_remove`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      pure(tx, args.i, `u64`),
    ],
  })
}

export interface SkipArgs {
  v: Array<GenericArg> | TransactionArgument
  n: bigint | TransactionArgument
}

/**
 * Return a new vector containing the elements of `v` except the first `n` elements.
 * If `n > length`, returns an empty vector.
 */
export function skip(tx: Transaction, typeArg: string, args: SkipArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::skip`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      pure(tx, args.n, `u64`),
    ],
  })
}

export interface TakeArgs {
  v: Array<GenericArg> | TransactionArgument
  n: bigint | TransactionArgument
}

/**
 * Take the first `n` elements of the vector `v` and drop the rest.
 * Aborts if `n` is greater than the length of `v`.
 */
export function take(tx: Transaction, typeArg: string, args: TakeArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::take`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      pure(tx, args.n, `u64`),
    ],
  })
}

/** Concatenate the vectors of `v` into a single vector, keeping the order of the elements. */
export function flatten(
  tx: Transaction,
  typeArg: string,
  v: Array<Array<GenericArg> | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::flatten`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `vector<${typeArg}>`, v)],
  })
}
