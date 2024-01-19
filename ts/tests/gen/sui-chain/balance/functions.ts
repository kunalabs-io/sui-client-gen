import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function value(txb: TransactionBlock, typeArg: Type, balance: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::value`,
    typeArguments: [typeArg],
    arguments: [obj(txb, balance)],
  })
}

export function supplyValue(txb: TransactionBlock, typeArg: Type, supply: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::supply_value`,
    typeArguments: [typeArg],
    arguments: [obj(txb, supply)],
  })
}

export function createSupply(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::create_supply`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export interface IncreaseSupplyArgs {
  supply: ObjectArg
  u64: bigint | TransactionArgument
}

export function increaseSupply(txb: TransactionBlock, typeArg: Type, args: IncreaseSupplyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::increase_supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.supply), pure(txb, args.u64, `u64`)],
  })
}

export interface DecreaseSupplyArgs {
  supply: ObjectArg
  balance: ObjectArg
}

export function decreaseSupply(txb: TransactionBlock, typeArg: Type, args: DecreaseSupplyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::decrease_supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.supply), obj(txb, args.balance)],
  })
}

export function zero(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface JoinArgs {
  balance1: ObjectArg
  balance2: ObjectArg
}

export function join(txb: TransactionBlock, typeArg: Type, args: JoinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::join`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.balance1), obj(txb, args.balance2)],
  })
}

export interface SplitArgs {
  balance: ObjectArg
  u64: bigint | TransactionArgument
}

export function split(txb: TransactionBlock, typeArg: Type, args: SplitArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::split`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.balance), pure(txb, args.u64, `u64`)],
  })
}

export function withdrawAll(txb: TransactionBlock, typeArg: Type, balance: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::withdraw_all`,
    typeArguments: [typeArg],
    arguments: [obj(txb, balance)],
  })
}

export function destroyZero(txb: TransactionBlock, typeArg: Type, balance: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(txb, balance)],
  })
}

export function createStakingRewards(
  txb: TransactionBlock,
  typeArg: Type,
  u64: bigint | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::create_staking_rewards`,
    typeArguments: [typeArg],
    arguments: [pure(txb, u64, `u64`)],
  })
}

export function destroyStorageRebates(txb: TransactionBlock, typeArg: Type, balance: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::destroy_storage_rebates`,
    typeArguments: [typeArg],
    arguments: [obj(txb, balance)],
  })
}

export function destroySupply(txb: TransactionBlock, typeArg: Type, supply: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::destroy_supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, supply)],
  })
}
