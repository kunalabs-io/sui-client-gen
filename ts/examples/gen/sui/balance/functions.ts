import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure } from '../../_framework/util'

/** Get the amount stored in a `Balance`. */
export function value(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Get the `Supply` value. */
export function supplyValue(
  tx: Transaction,
  typeArg: string,
  supply: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::supply_value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, supply)],
  })
}

/** Create a new supply for type T. */
export function createSupply(
  tx: Transaction,
  typeArg: string,
  t: GenericArg,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::create_supply`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t)],
  })
}

export interface IncreaseSupplyArgs {
  self: TransactionObjectInput
  value: bigint | TransactionArgument
}

/** Increase supply by `value` and create a new `Balance<T>` with this value. */
export function increaseSupply(
  tx: Transaction,
  typeArg: string,
  args: IncreaseSupplyArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::increase_supply`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.value, `u64`),
    ],
  })
}

export interface DecreaseSupplyArgs {
  self: TransactionObjectInput
  balance: TransactionObjectInput
}

/** Burn a Balance<T> and decrease Supply<T>. */
export function decreaseSupply(
  tx: Transaction,
  typeArg: string,
  args: DecreaseSupplyArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::decrease_supply`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.balance),
    ],
  })
}

/** Create a zero `Balance` for type `T`. */
export function zero(
  tx: Transaction,
  typeArg: string,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface JoinArgs {
  self: TransactionObjectInput
  balance: TransactionObjectInput
}

/** Join two balances together. */
export function join(
  tx: Transaction,
  typeArg: string,
  args: JoinArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::join`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.balance),
    ],
  })
}

export interface SplitArgs {
  self: TransactionObjectInput
  value: bigint | TransactionArgument
}

/** Split a `Balance` and take a sub balance from it. */
export function split(
  tx: Transaction,
  typeArg: string,
  args: SplitArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::split`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.value, `u64`),
    ],
  })
}

/** Withdraw all balance. After this the remaining balance must be 0. */
export function withdrawAll(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::withdraw_all`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Destroy a zero `Balance`. */
export function destroyZero(
  tx: Transaction,
  typeArg: string,
  balance: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(tx, balance)],
  })
}

export interface SendFundsArgs {
  balance: TransactionObjectInput
  recipient: string | TransactionArgument
}

/** Send a `Balance` to an address's funds accumulator. */
export function sendFunds(
  tx: Transaction,
  typeArg: string,
  args: SendFundsArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::send_funds`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.balance),
      pure(tx, args.recipient, `address`),
    ],
  })
}

/**
 * Redeem a `Withdrawal<Balance<T>>` to get the underlying `Balance<T>` from an address's funds
 * accumulator.
 */
export function redeemFunds(
  tx: Transaction,
  typeArg: string,
  withdrawal: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::redeem_funds`,
    typeArguments: [typeArg],
    arguments: [obj(tx, withdrawal)],
  })
}

export interface WithdrawFundsFromObjectArgs {
  obj: TransactionObjectInput
  value: bigint | TransactionArgument
}

/** Create a `Withdrawal<Balance<T>>` from an object to withdraw funds from it. */
export function withdrawFundsFromObject(
  tx: Transaction,
  typeArg: string,
  args: WithdrawFundsFromObjectArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::withdraw_funds_from_object`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.obj),
      pure(tx, args.value, `u64`),
    ],
  })
}

export function createSupplyInternal(
  tx: Transaction,
  typeArg: string,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::create_supply_internal`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

/**
 * CAUTION: this function creates a `Balance` without increasing the supply.
 * It should only be called by the epoch change system txn to create staking rewards,
 * and nowhere else.
 */
export function createStakingRewards(
  tx: Transaction,
  typeArg: string,
  value: bigint | TransactionArgument,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::create_staking_rewards`,
    typeArguments: [typeArg],
    arguments: [pure(tx, value, `u64`)],
  })
}

/**
 * CAUTION: this function destroys a `Balance` without decreasing the supply.
 * It should only be called by the epoch change system txn to destroy storage rebates,
 * and nowhere else.
 */
export function destroyStorageRebates(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::destroy_storage_rebates`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Destroy a `Supply` preventing any further minting and burning. */
export function destroySupply(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::balance::destroy_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
