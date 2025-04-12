import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AddArgs {
  ext: GenericArg
  self: TransactionObjectInput
  cap: TransactionObjectInput
  permissions: bigint | TransactionArgument
}

export function add(tx: Transaction, typeArg: string, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::add`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.ext),
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.permissions, `u128`),
    ],
  })
}

export interface DisableArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

export function disable(tx: Transaction, typeArg: string, args: DisableArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::disable`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface EnableArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

export function enable(tx: Transaction, typeArg: string, args: EnableArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::enable`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface RemoveArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

export function remove(tx: Transaction, typeArg: string, args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface StorageArgs {
  ext: GenericArg
  self: TransactionObjectInput
}

export function storage(tx: Transaction, typeArg: string, args: StorageArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::storage`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.ext), obj(tx, args.self)],
  })
}

export interface StorageMutArgs {
  ext: GenericArg
  self: TransactionObjectInput
}

export function storageMut(tx: Transaction, typeArg: string, args: StorageMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::storage_mut`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.ext), obj(tx, args.self)],
  })
}

export interface PlaceArgs {
  ext: GenericArg
  self: TransactionObjectInput
  item: GenericArg
  policy: TransactionObjectInput
}

export function place(tx: Transaction, typeArgs: [string, string], args: PlaceArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::place`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[0]}`, args.ext),
      obj(tx, args.self),
      generic(tx, `${typeArgs[1]}`, args.item),
      obj(tx, args.policy),
    ],
  })
}

export interface LockArgs {
  ext: GenericArg
  self: TransactionObjectInput
  item: GenericArg
  policy: TransactionObjectInput
}

export function lock(tx: Transaction, typeArgs: [string, string], args: LockArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::lock`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[0]}`, args.ext),
      obj(tx, args.self),
      generic(tx, `${typeArgs[1]}`, args.item),
      obj(tx, args.policy),
    ],
  })
}

export function isInstalled(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::is_installed`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function isEnabled(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::is_enabled`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function canPlace(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::can_place`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function canLock(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::can_lock`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function extension(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::extension`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function extensionMut(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::extension_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
