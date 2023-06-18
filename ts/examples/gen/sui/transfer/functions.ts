import { PUBLISHED_AT } from '..'
import { GenericArg, Type, generic, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface TransferArgs {
  obj: GenericArg
  recipient: string | TransactionArgument
}

export function transfer(txb: TransactionBlock, typeArg: Type, args: TransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::transfer`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, args.obj), pure(txb, args.recipient, `address`)],
  })
}

export function freezeObject(txb: TransactionBlock, typeArg: Type, obj: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::freeze_object`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, obj)],
  })
}

export function freezeObjectImpl(txb: TransactionBlock, typeArg: Type, obj: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::freeze_object_impl`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, obj)],
  })
}

export function publicFreezeObject(txb: TransactionBlock, typeArg: Type, obj: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_freeze_object`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, obj)],
  })
}

export function publicShareObject(txb: TransactionBlock, typeArg: Type, obj: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_share_object`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, obj)],
  })
}

export interface PublicTransferArgs {
  obj: GenericArg
  recipient: string | TransactionArgument
}

export function publicTransfer(txb: TransactionBlock, typeArg: Type, args: PublicTransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_transfer`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, args.obj), pure(txb, args.recipient, `address`)],
  })
}

export function shareObject(txb: TransactionBlock, typeArg: Type, obj: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::share_object`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, obj)],
  })
}

export function shareObjectImpl(txb: TransactionBlock, typeArg: Type, obj: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::share_object_impl`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, obj)],
  })
}

export interface TransferImplArgs {
  obj: GenericArg
  recipient: string | TransactionArgument
}

export function transferImpl(txb: TransactionBlock, typeArg: Type, args: TransferImplArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::transfer_impl`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, args.obj), pure(txb, args.recipient, `address`)],
  })
}
