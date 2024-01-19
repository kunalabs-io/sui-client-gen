import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function version(txb: TransactionBlock, versioned: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::version`,
    arguments: [obj(txb, versioned)],
  })
}

export interface CreateArgs {
  u64: bigint | TransactionArgument
  t0: GenericArg
}

export function create(txb: TransactionBlock, typeArg: string, args: CreateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::create`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.u64, `u64`), generic(txb, `${typeArg}`, args.t0)],
  })
}

export function destroy(txb: TransactionBlock, typeArg: string, versioned: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(txb, versioned)],
  })
}

export function loadValue(txb: TransactionBlock, typeArg: string, versioned: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::load_value`,
    typeArguments: [typeArg],
    arguments: [obj(txb, versioned)],
  })
}

export function loadValueMut(txb: TransactionBlock, typeArg: string, versioned: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::load_value_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, versioned)],
  })
}

export function removeValueForUpgrade(
  txb: TransactionBlock,
  typeArg: string,
  versioned: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::remove_value_for_upgrade`,
    typeArguments: [typeArg],
    arguments: [obj(txb, versioned)],
  })
}

export interface UpgradeArgs {
  versioned: ObjectArg
  u64: bigint | TransactionArgument
  t0: GenericArg
  versionChangeCap: ObjectArg
}

export function upgrade(txb: TransactionBlock, typeArg: string, args: UpgradeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::versioned::upgrade`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.versioned),
      pure(txb, args.u64, `u64`),
      generic(txb, `${typeArg}`, args.t0),
      obj(txb, args.versionChangeCap),
    ],
  })
}
