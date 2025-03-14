import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AddArgs {
  t0: GenericArg
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  u128: bigint | TransactionArgument
}

export function add(tx: Transaction, typeArg: string, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::add`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.t0),
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      pure(tx, args.u128, `u128`),
    ],
  })
}

export function canLock(tx: Transaction, typeArg: string, kiosk: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::can_lock`,
    typeArguments: [typeArg],
    arguments: [obj(tx, kiosk)],
  })
}

export function canPlace(tx: Transaction, typeArg: string, kiosk: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::can_place`,
    typeArguments: [typeArg],
    arguments: [obj(tx, kiosk)],
  })
}

export interface DisableArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
}

export function disable(tx: Transaction, typeArg: string, args: DisableArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::disable`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.kiosk), obj(tx, args.kioskOwnerCap)],
  })
}

export interface EnableArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
}

export function enable(tx: Transaction, typeArg: string, args: EnableArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::enable`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.kiosk), obj(tx, args.kioskOwnerCap)],
  })
}

export function extension(tx: Transaction, typeArg: string, kiosk: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::extension`,
    typeArguments: [typeArg],
    arguments: [obj(tx, kiosk)],
  })
}

export function extensionMut(tx: Transaction, typeArg: string, kiosk: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::extension_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, kiosk)],
  })
}

export function isEnabled(tx: Transaction, typeArg: string, kiosk: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::is_enabled`,
    typeArguments: [typeArg],
    arguments: [obj(tx, kiosk)],
  })
}

export function isInstalled(tx: Transaction, typeArg: string, kiosk: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::is_installed`,
    typeArguments: [typeArg],
    arguments: [obj(tx, kiosk)],
  })
}

export interface LockArgs {
  t0: GenericArg
  kiosk: TransactionObjectInput
  t1: GenericArg
  transferPolicy: TransactionObjectInput
}

export function lock(tx: Transaction, typeArgs: [string, string], args: LockArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::lock`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[0]}`, args.t0),
      obj(tx, args.kiosk),
      generic(tx, `${typeArgs[1]}`, args.t1),
      obj(tx, args.transferPolicy),
    ],
  })
}

export interface PlaceArgs {
  t0: GenericArg
  kiosk: TransactionObjectInput
  t1: GenericArg
  transferPolicy: TransactionObjectInput
}

export function place(tx: Transaction, typeArgs: [string, string], args: PlaceArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::place`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[0]}`, args.t0),
      obj(tx, args.kiosk),
      generic(tx, `${typeArgs[1]}`, args.t1),
      obj(tx, args.transferPolicy),
    ],
  })
}

export interface RemoveArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
}

export function remove(tx: Transaction, typeArg: string, args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.kiosk), obj(tx, args.kioskOwnerCap)],
  })
}

export interface StorageArgs {
  t0: GenericArg
  kiosk: TransactionObjectInput
}

export function storage(tx: Transaction, typeArg: string, args: StorageArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::storage`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.t0), obj(tx, args.kiosk)],
  })
}

export interface StorageMutArgs {
  t0: GenericArg
  kiosk: TransactionObjectInput
}

export function storageMut(tx: Transaction, typeArg: string, args: StorageMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::storage_mut`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.t0), obj(tx, args.kiosk)],
  })
}
