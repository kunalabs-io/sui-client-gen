import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function value(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::value`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function createStakingRewards(
  txb: TransactionBlock,
  typeArg: Type,
  value: bigint | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::create_staking_rewards`,
    typeArguments: [typeArg],
    arguments: [pure(txb, value, `u64`)],
  })
}

export function createSupply(txb: TransactionBlock, typeArg: Type, t: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::create_supply`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t)],
  })
}

export interface DecreaseSupplyArgs {
  self: ObjectArg
  balance: ObjectArg
}

export function decreaseSupply(txb: TransactionBlock, typeArg: Type, args: DecreaseSupplyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::decrease_supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.balance)],
  })
}

export function destroyStorageRebates(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::destroy_storage_rebates`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function destroySupply(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::destroy_supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function destroyZero(txb: TransactionBlock, typeArg: Type, balance: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(txb, balance)],
  })
}

export interface IncreaseSupplyArgs {
  self: ObjectArg
  value: bigint | TransactionArgument
}

export function increaseSupply(txb: TransactionBlock, typeArg: Type, args: IncreaseSupplyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::increase_supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.value, `u64`)],
  })
}

export interface JoinArgs {
  self: ObjectArg
  balance: ObjectArg
}

export function join(txb: TransactionBlock, typeArg: Type, args: JoinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::join`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.balance)],
  })
}

export interface SplitArgs {
  self: ObjectArg
  value: bigint | TransactionArgument
}

export function split(txb: TransactionBlock, typeArg: Type, args: SplitArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::split`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.value, `u64`)],
  })
}

export function supplyValue(txb: TransactionBlock, typeArg: Type, supply: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::supply_value`,
    typeArguments: [typeArg],
    arguments: [obj(txb, supply)],
  })
}

export function withdrawAll(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::withdraw_all`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function zero(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::balance::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}
