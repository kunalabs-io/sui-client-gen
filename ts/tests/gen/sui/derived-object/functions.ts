import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { ID } from '../object/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface ClaimArgs {
  parent: TransactionObjectInput
  key: GenericArg
}

export function claim(tx: Transaction, typeArg: string, args: ClaimArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::derived_object::claim`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.parent), generic(tx, `${typeArg}`, args.key)],
  })
}

export interface ExistsArgs {
  parent: TransactionObjectInput
  key: GenericArg
}

export function exists(tx: Transaction, typeArg: string, args: ExistsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::derived_object::exists`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.parent), generic(tx, `${typeArg}`, args.key)],
  })
}

export interface DeriveAddressArgs {
  parent: string | TransactionArgument
  key: GenericArg
}

export function deriveAddress(tx: Transaction, typeArg: string, args: DeriveAddressArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::derived_object::derive_address`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.parent, `${ID.$typeName}`), generic(tx, `${typeArg}`, args.key)],
  })
}
