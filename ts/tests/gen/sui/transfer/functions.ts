import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

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

export interface PublicReceiveArgs {
  parent: ObjectArg
  toReceive: ObjectArg
}

export function publicReceive(txb: TransactionBlock, typeArg: Type, args: PublicReceiveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_receive`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.parent), obj(txb, args.toReceive)],
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

export interface ReceiveArgs {
  parent: ObjectArg
  toReceive: ObjectArg
}

export function receive(txb: TransactionBlock, typeArg: Type, args: ReceiveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::receive`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.parent), obj(txb, args.toReceive)],
  })
}

export interface ReceiveImplArgs {
  parent: string | TransactionArgument
  toReceive: string | TransactionArgument
  version: bigint | TransactionArgument
}

export function receiveImpl(txb: TransactionBlock, typeArg: Type, args: ReceiveImplArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::receive_impl`,
    typeArguments: [typeArg],
    arguments: [
      pure(txb, args.parent, `address`),
      pure(txb, args.toReceive, `0x2::object::ID`),
      pure(txb, args.version, `u64`),
    ],
  })
}

export function receivingObjectId(txb: TransactionBlock, typeArg: Type, receiving: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::receiving_object_id`,
    typeArguments: [typeArg],
    arguments: [obj(txb, receiving)],
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
