import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface CreateArgs {
  initVersion: bigint | TransactionArgument
  initValue: GenericArg
}

export function create(tx: Transaction, typeArg: string, args: CreateArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::create`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.initVersion, `u64`), generic(tx, `${typeArg}`, args.initValue)],
  })
}

export function version(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::version`,
    arguments: [obj(tx, self)],
  })
}

export function loadValue(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::load_value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function loadValueMut(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::load_value_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function removeValueForUpgrade(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput
) {
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

export function upgrade(tx: Transaction, typeArg: string, args: UpgradeArgs) {
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

export function destroy(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::versioned::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
