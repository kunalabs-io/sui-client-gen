import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface RemoveArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function remove(txb: TransactionBlock, typeArg: string, args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::remove`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export interface AddArgs {
  ext: GenericArg
  self: ObjectArg
  cap: ObjectArg
  permissions: bigint | TransactionArgument
}

export function add(txb: TransactionBlock, typeArg: string, args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::add`,
    typeArguments: [typeArg],
    arguments: [
      generic(txb, `${typeArg}`, args.ext),
      obj(txb, args.self),
      obj(txb, args.cap),
      pure(txb, args.permissions, `u128`),
    ],
  })
}

export interface LockArgs {
  ext: GenericArg
  self: ObjectArg
  item: GenericArg
  policy: ObjectArg
}

export function lock(txb: TransactionBlock, typeArgs: [string, string], args: LockArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::lock`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[0]}`, args.ext),
      obj(txb, args.self),
      generic(txb, `${typeArgs[1]}`, args.item),
      obj(txb, args.policy),
    ],
  })
}

export interface PlaceArgs {
  ext: GenericArg
  self: ObjectArg
  item: GenericArg
  policy: ObjectArg
}

export function place(txb: TransactionBlock, typeArgs: [string, string], args: PlaceArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::place`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[0]}`, args.ext),
      obj(txb, args.self),
      generic(txb, `${typeArgs[1]}`, args.item),
      obj(txb, args.policy),
    ],
  })
}

export function canLock(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::can_lock`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function canPlace(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::can_place`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface DisableArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function disable(txb: TransactionBlock, typeArg: string, args: DisableArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::disable`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export interface EnableArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function enable(txb: TransactionBlock, typeArg: string, args: EnableArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::enable`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export function extension(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::extension`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function extensionMut(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::extension_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function isEnabled(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::is_enabled`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function isInstalled(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::is_installed`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface StorageArgs {
  ext: GenericArg
  self: ObjectArg
}

export function storage(txb: TransactionBlock, typeArg: string, args: StorageArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::storage`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, args.ext), obj(txb, args.self)],
  })
}

export interface StorageMutArgs {
  ext: GenericArg
  self: ObjectArg
}

export function storageMut(txb: TransactionBlock, typeArg: string, args: StorageMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::storage_mut`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, args.ext), obj(txb, args.self)],
  })
}
