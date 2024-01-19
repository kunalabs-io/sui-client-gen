import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface RemoveArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
}

export function remove(txb: TransactionBlock, typeArg: Type, args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::remove`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.kiosk), obj(txb, args.kioskOwnerCap)],
  })
}

export interface AddArgs {
  t0: GenericArg
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  u128: bigint | TransactionArgument
}

export function add(txb: TransactionBlock, typeArg: Type, args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::add`,
    typeArguments: [typeArg],
    arguments: [
      generic(txb, `${typeArg}`, args.t0),
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      pure(txb, args.u128, `u128`),
    ],
  })
}

export interface PlaceArgs {
  t0: GenericArg
  kiosk: ObjectArg
  t1: GenericArg
  transferPolicy: ObjectArg
}

export function place(txb: TransactionBlock, typeArgs: [Type, Type], args: PlaceArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::place`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[0]}`, args.t0),
      obj(txb, args.kiosk),
      generic(txb, `${typeArgs[1]}`, args.t1),
      obj(txb, args.transferPolicy),
    ],
  })
}

export interface LockArgs {
  t0: GenericArg
  kiosk: ObjectArg
  t1: GenericArg
  transferPolicy: ObjectArg
}

export function lock(txb: TransactionBlock, typeArgs: [Type, Type], args: LockArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::lock`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[0]}`, args.t0),
      obj(txb, args.kiosk),
      generic(txb, `${typeArgs[1]}`, args.t1),
      obj(txb, args.transferPolicy),
    ],
  })
}

export interface DisableArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
}

export function disable(txb: TransactionBlock, typeArg: Type, args: DisableArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::disable`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.kiosk), obj(txb, args.kioskOwnerCap)],
  })
}

export interface EnableArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
}

export function enable(txb: TransactionBlock, typeArg: Type, args: EnableArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::enable`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.kiosk), obj(txb, args.kioskOwnerCap)],
  })
}

export interface StorageArgs {
  t0: GenericArg
  kiosk: ObjectArg
}

export function storage(txb: TransactionBlock, typeArg: Type, args: StorageArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::storage`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, args.t0), obj(txb, args.kiosk)],
  })
}

export interface StorageMutArgs {
  t0: GenericArg
  kiosk: ObjectArg
}

export function storageMut(txb: TransactionBlock, typeArg: Type, args: StorageMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::storage_mut`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, args.t0), obj(txb, args.kiosk)],
  })
}

export function isInstalled(txb: TransactionBlock, typeArg: Type, kiosk: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::is_installed`,
    typeArguments: [typeArg],
    arguments: [obj(txb, kiosk)],
  })
}

export function isEnabled(txb: TransactionBlock, typeArg: Type, kiosk: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::is_enabled`,
    typeArguments: [typeArg],
    arguments: [obj(txb, kiosk)],
  })
}

export function canPlace(txb: TransactionBlock, typeArg: Type, kiosk: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::can_place`,
    typeArguments: [typeArg],
    arguments: [obj(txb, kiosk)],
  })
}

export function canLock(txb: TransactionBlock, typeArg: Type, kiosk: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::can_lock`,
    typeArguments: [typeArg],
    arguments: [obj(txb, kiosk)],
  })
}

export function extension(txb: TransactionBlock, typeArg: Type, kiosk: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::extension`,
    typeArguments: [typeArg],
    arguments: [obj(txb, kiosk)],
  })
}

export function extensionMut(txb: TransactionBlock, typeArg: Type, kiosk: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk_extension::extension_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, kiosk)],
  })
}
