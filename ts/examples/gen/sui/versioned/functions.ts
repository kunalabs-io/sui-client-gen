import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function version(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::version`,
    arguments: [obj(txb, self)],
  })
}

export interface CreateArgs {
  initVersion: bigint | TransactionArgument
  initValue: GenericArg
}

export function create(txb: TransactionBlock, typeArg: string, args: CreateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::create`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.initVersion, `u64`), generic(txb, `${typeArg}`, args.initValue)],
  })
}

export function destroy(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function loadValue(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::load_value`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function loadValueMut(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::load_value_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function removeValueForUpgrade(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::remove_value_for_upgrade`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface UpgradeArgs {
  self: ObjectArg
  newVersion: bigint | TransactionArgument
  newValue: GenericArg
  cap: ObjectArg
}

export function upgrade(txb: TransactionBlock, typeArg: string, args: UpgradeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::upgrade`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      pure(txb, args.newVersion, `u64`),
      generic(txb, `${typeArg}`, args.newValue),
      obj(txb, args.cap),
    ],
  })
}
