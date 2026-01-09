import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure } from '../../_framework/util'

export interface CreateArgs {
  initVersion: bigint | TransactionArgument
  initValue: GenericArg
}

/** Create a new Versioned object that contains a initial value of type `T` with an initial version. */
export function create(tx: Transaction, typeArg: string, args: CreateArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::create`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.initVersion, `u64`),
      generic(tx, `${typeArg}`, args.initValue),
    ],
  })
}

/** Get the current version of the inner type. */
export function version(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::version`,
    arguments: [obj(tx, self)],
  })
}

/**
 * Load the inner value based on the current version. Caller specifies an expected type T.
 * If the type mismatch, the load will fail.
 */
export function loadValue(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::load_value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Similar to load_value, but return a mutable reference. */
export function loadValueMut(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::load_value_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/**
 * Take the inner object out for upgrade. To ensure we always upgrade properly, a capability object is returned
 * and must be used when we upgrade.
 */
export function removeValueForUpgrade(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::remove_value_for_upgrade`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export interface UpgradeArgs {
  self: TransactionObjectInput
  newVersion: bigint | TransactionArgument
  newValue: GenericArg
  cap: TransactionObjectInput
}

/**
 * Upgrade the inner object with a new version and new value. Must use the capability returned
 * by calling remove_value_for_upgrade.
 */
export function upgrade(tx: Transaction, typeArg: string, args: UpgradeArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::upgrade`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.newVersion, `u64`),
      generic(tx, `${typeArg}`, args.newValue),
      obj(tx, args.cap),
    ],
  })
}

/** Destroy this Versioned container, and return the inner object. */
export function destroy(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
