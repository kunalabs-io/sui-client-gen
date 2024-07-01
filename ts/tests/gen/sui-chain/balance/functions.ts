import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function value(tx: Transaction, typeArg: string, balance: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, balance)],
  })
}

export function supplyValue(tx: Transaction, typeArg: string, supply: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::supply_value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, supply)],
  })
}

export function createSupply(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::create_supply`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export interface IncreaseSupplyArgs {
  supply: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function increaseSupply(tx: Transaction, typeArg: string, args: IncreaseSupplyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::increase_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.supply), pure(tx, args.u64, `u64`)],
  })
}

export interface DecreaseSupplyArgs {
  supply: TransactionObjectInput
  balance: TransactionObjectInput
}

export function decreaseSupply(tx: Transaction, typeArg: string, args: DecreaseSupplyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::decrease_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.supply), obj(tx, args.balance)],
  })
}

export function zero(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface JoinArgs {
  balance1: TransactionObjectInput
  balance2: TransactionObjectInput
}

export function join(tx: Transaction, typeArg: string, args: JoinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::join`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.balance1), obj(tx, args.balance2)],
  })
}

export interface SplitArgs {
  balance: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function split(tx: Transaction, typeArg: string, args: SplitArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.balance), pure(tx, args.u64, `u64`)],
  })
}

export function withdrawAll(tx: Transaction, typeArg: string, balance: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::withdraw_all`,
    typeArguments: [typeArg],
    arguments: [obj(tx, balance)],
  })
}

export function destroyZero(tx: Transaction, typeArg: string, balance: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(tx, balance)],
  })
}

export function createStakingRewards(
  tx: Transaction,
  typeArg: string,
  u64: bigint | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::create_staking_rewards`,
    typeArguments: [typeArg],
    arguments: [pure(tx, u64, `u64`)],
  })
}

export function destroyStorageRebates(
  tx: Transaction,
  typeArg: string,
  balance: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::destroy_storage_rebates`,
    typeArguments: [typeArg],
    arguments: [obj(tx, balance)],
  })
}

export function destroySupply(tx: Transaction, typeArg: string, supply: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::balance::destroy_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, supply)],
  })
}
