import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { ID } from '../object/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface ClaimArgs {
  parent: TransactionObjectInput
  key: GenericArg
}

/** Claim a deterministic UID, using the parent's UID & any key. */
export function claim(tx: Transaction, typeArg: string, args: ClaimArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::derived_object::claim`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.parent), generic(tx, `${typeArg}`, args.key)],
  })
}

export interface ExistsArgs {
  parent: TransactionObjectInput
  key: GenericArg
}

/**
 * Checks if a provided `key` has been claimed for the given parent.
 * Note: If the UID has been deleted through `object::delete`, this will always return true.
 */
export function exists(tx: Transaction, typeArg: string, args: ExistsArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::derived_object::exists`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.parent), generic(tx, `${typeArg}`, args.key)],
  })
}

export interface DeriveAddressArgs {
  parent: string | TransactionArgument
  key: GenericArg
}

/** Given an ID and a Key, it calculates the derived address. */
export function deriveAddress(tx: Transaction, typeArg: string, args: DeriveAddressArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::derived_object::derive_address`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.parent, `${ID.$typeName}`), generic(tx, `${typeArg}`, args.key)],
  })
}
