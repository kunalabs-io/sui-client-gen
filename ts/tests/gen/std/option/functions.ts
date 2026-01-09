import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, option } from '../../_framework/util'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

/** Return an empty `Option` */
export function none(tx: Transaction, typeArg: string): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::none`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

/** Return an `Option` containing `e` */
export function some(tx: Transaction, typeArg: string, e: GenericArg): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::some`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, e)],
  })
}

/** Return true if `t` does not hold a value */
export function isNone(tx: Transaction, typeArg: string, t: GenericArg | null): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::is_none`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

/** Return true if `t` holds a value */
export function isSome(tx: Transaction, typeArg: string, t: GenericArg | null): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::is_some`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

export interface ContainsArgs {
  t: GenericArg | null
  eRef: GenericArg
}

/**
 * Return true if the value in `t` is equal to `e_ref`
 * Always returns `false` if `t` does not hold a value
 */
export function contains(tx: Transaction, typeArg: string, args: ContainsArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::contains`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.eRef)],
  })
}

/**
 * Return an immutable reference to the value inside `t`
 * Aborts if `t` does not hold a value
 */
export function borrow(tx: Transaction, typeArg: string, t: GenericArg | null): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::borrow`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

export interface BorrowWithDefaultArgs {
  t: GenericArg | null
  defaultRef: GenericArg
}

/**
 * Return a reference to the value inside `t` if it holds one
 * Return `default_ref` if `t` does not hold a value
 */
export function borrowWithDefault(
  tx: Transaction,
  typeArg: string,
  args: BorrowWithDefaultArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::borrow_with_default`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.defaultRef)],
  })
}

export interface GetWithDefaultArgs {
  t: GenericArg | null
  default: GenericArg
}

/**
 * Return the value inside `t` if it holds one
 * Return `default` if `t` does not hold a value
 */
export function getWithDefault(
  tx: Transaction,
  typeArg: string,
  args: GetWithDefaultArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::get_with_default`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.default)],
  })
}

export interface FillArgs {
  t: GenericArg | null
  e: GenericArg
}

/**
 * Convert the none option `t` to a some option by adding `e`.
 * Aborts if `t` already holds a value
 */
export function fill(tx: Transaction, typeArg: string, args: FillArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::fill`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.e)],
  })
}

/**
 * Convert a `some` option to a `none` by removing and returning the value stored inside `t`
 * Aborts if `t` does not hold a value
 */
export function extract(tx: Transaction, typeArg: string, t: GenericArg | null): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::extract`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

/**
 * Return a mutable reference to the value inside `t`
 * Aborts if `t` does not hold a value
 */
export function borrowMut(
  tx: Transaction,
  typeArg: string,
  t: GenericArg | null
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

export interface SwapArgs {
  t: GenericArg | null
  e: GenericArg
}

/**
 * Swap the old value inside `t` with `e` and return the old value
 * Aborts if `t` does not hold a value
 */
export function swap(tx: Transaction, typeArg: string, args: SwapArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::swap`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.e)],
  })
}

export interface SwapOrFillArgs {
  t: GenericArg | null
  e: GenericArg
}

/**
 * Swap the old value inside `t` with `e` and return the old value;
 * or if there is no old value, fill it with `e`.
 * Different from swap(), swap_or_fill() allows for `t` not holding a value.
 */
export function swapOrFill(
  tx: Transaction,
  typeArg: string,
  args: SwapOrFillArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::swap_or_fill`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.e)],
  })
}

export interface DestroyWithDefaultArgs {
  t: GenericArg | null
  default: GenericArg
}

/** Destroys `t.` If `t` holds a value, return it. Returns `default` otherwise */
export function destroyWithDefault(
  tx: Transaction,
  typeArg: string,
  args: DestroyWithDefaultArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::destroy_with_default`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.default)],
  })
}

/**
 * Unpack `t` and return its contents
 * Aborts if `t` does not hold a value
 */
export function destroySome(
  tx: Transaction,
  typeArg: string,
  t: GenericArg | null
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::destroy_some`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

/**
 * Unpack `t`
 * Aborts if `t` holds a value
 */
export function destroyNone(
  tx: Transaction,
  typeArg: string,
  t: GenericArg | null
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::destroy_none`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

/**
 * Convert `t` into a vector of length 1 if it is `Some`,
 * and an empty vector otherwise
 */
export function toVec(tx: Transaction, typeArg: string, t: GenericArg | null): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::to_vec`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}
