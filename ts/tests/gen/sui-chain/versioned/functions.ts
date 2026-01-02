import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface CreateArgs {
  u64: bigint | TransactionArgument
  t0: GenericArg
}

export function create(tx: Transaction, typeArg: string, args: CreateArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::versioned::create`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.u64, `u64`), generic(tx, `${typeArg}`, args.t0)],
  })
}

export function version(tx: Transaction, versioned: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::versioned::version`,
    arguments: [obj(tx, versioned)],
  })
}

export function loadValue(tx: Transaction, typeArg: string, versioned: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::versioned::load_value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, versioned)],
  })
}

export function loadValueMut(tx: Transaction, typeArg: string, versioned: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::versioned::load_value_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, versioned)],
  })
}

export function removeValueForUpgrade(
  tx: Transaction,
  typeArg: string,
  versioned: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::versioned::remove_value_for_upgrade`,
    typeArguments: [typeArg],
    arguments: [obj(tx, versioned)],
  })
}

export interface UpgradeArgs {
  versioned: TransactionObjectInput
  u64: bigint | TransactionArgument
  t0: GenericArg
  versionChangeCap: TransactionObjectInput
}

export function upgrade(tx: Transaction, typeArg: string, args: UpgradeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::versioned::upgrade`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.versioned),
      pure(tx, args.u64, `u64`),
      generic(tx, `${typeArg}`, args.t0),
      obj(tx, args.versionChangeCap),
    ],
  })
}

export function destroy(tx: Transaction, typeArg: string, versioned: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::versioned::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, versioned)],
  })
}
