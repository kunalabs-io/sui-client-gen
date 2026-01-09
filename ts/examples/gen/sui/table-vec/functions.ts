import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure } from '../../_framework/util'

/** Create an empty TableVec. */
export function empty(tx: Transaction, typeArg: string): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

/** Return a TableVec of size one containing element `e`. */
export function singleton(tx: Transaction, typeArg: string, e: GenericArg): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, e)],
  })
}

/** Return the length of the TableVec. */
export function length(
  tx: Transaction,
  typeArg: string,
  t: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::length`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

/** Return if the TableVec is empty or not. */
export function isEmpty(
  tx: Transaction,
  typeArg: string,
  t: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

export interface BorrowArgs {
  t: TransactionObjectInput
  i: bigint | TransactionArgument
}

/**
 * Acquire an immutable reference to the `i`th element of the TableVec `t`.
 * Aborts if `i` is out of bounds.
 */
export function borrow(tx: Transaction, typeArg: string, args: BorrowArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::borrow`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.t),
      pure(tx, args.i, `u64`),
    ],
  })
}

export interface PushBackArgs {
  t: TransactionObjectInput
  e: GenericArg
}

/** Add element `e` to the end of the TableVec `t`. */
export function pushBack(tx: Transaction, typeArg: string, args: PushBackArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::push_back`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.t),
      generic(tx, `${typeArg}`, args.e),
    ],
  })
}

export interface BorrowMutArgs {
  t: TransactionObjectInput
  i: bigint | TransactionArgument
}

/**
 * Return a mutable reference to the `i`th element in the TableVec `t`.
 * Aborts if `i` is out of bounds.
 */
export function borrowMut(
  tx: Transaction,
  typeArg: string,
  args: BorrowMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.t),
      pure(tx, args.i, `u64`),
    ],
  })
}

/**
 * Pop an element from the end of TableVec `t`.
 * Aborts if `t` is empty.
 */
export function popBack(
  tx: Transaction,
  typeArg: string,
  t: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::pop_back`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

/**
 * Destroy the TableVec `t`.
 * Aborts if `t` is not empty.
 */
export function destroyEmpty(
  tx: Transaction,
  typeArg: string,
  t: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

/**
 * Drop a possibly non-empty TableVec `t`.
 * Usable only if the value type `Element` has the `drop` ability
 */
export function drop(
  tx: Transaction,
  typeArg: string,
  t: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::drop`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

export interface SwapArgs {
  t: TransactionObjectInput
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

/**
 * Swaps the elements at the `i`th and `j`th indices in the TableVec `t`.
 * Aborts if `i` or `j` is out of bounds.
 */
export function swap(tx: Transaction, typeArg: string, args: SwapArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::swap`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.t),
      pure(tx, args.i, `u64`),
      pure(tx, args.j, `u64`),
    ],
  })
}

export interface SwapRemoveArgs {
  t: TransactionObjectInput
  i: bigint | TransactionArgument
}

/**
 * Swap the `i`th element of the TableVec `t` with the last element and then pop the TableVec.
 * This is O(1), but does not preserve ordering of elements in the TableVec.
 * Aborts if `i` is out of bounds.
 */
export function swapRemove(
  tx: Transaction,
  typeArg: string,
  args: SwapRemoveArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::table_vec::swap_remove`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.t),
      pure(tx, args.i, `u64`),
    ],
  })
}
