import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface TransferArgs {
  t0: GenericArg
  address: string | TransactionArgument
}

export function transfer(txb: TransactionBlock, typeArg: Type, args: TransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::transfer`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, args.t0), pure(txb, args.address, `address`)],
  })
}

export interface PublicTransferArgs {
  t0: GenericArg
  address: string | TransactionArgument
}

export function publicTransfer(txb: TransactionBlock, typeArg: Type, args: PublicTransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_transfer`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, args.t0), pure(txb, args.address, `address`)],
  })
}

export function freezeObject(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::freeze_object`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function publicFreezeObject(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_freeze_object`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function shareObject(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::share_object`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function publicShareObject(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_share_object`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export interface ReceiveArgs {
  uid: ObjectArg
  receiving: ObjectArg
}

export function receive(txb: TransactionBlock, typeArg: Type, args: ReceiveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::receive`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.uid), obj(txb, args.receiving)],
  })
}

export interface PublicReceiveArgs {
  uid: ObjectArg
  receiving: ObjectArg
}

export function publicReceive(txb: TransactionBlock, typeArg: Type, args: PublicReceiveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_receive`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.uid), obj(txb, args.receiving)],
  })
}

export function receivingObjectId(txb: TransactionBlock, typeArg: Type, receiving: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::receiving_object_id`,
    typeArguments: [typeArg],
    arguments: [obj(txb, receiving)],
  })
}

export function freezeObjectImpl(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::freeze_object_impl`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function shareObjectImpl(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::share_object_impl`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export interface TransferImplArgs {
  t0: GenericArg
  address: string | TransactionArgument
}

export function transferImpl(txb: TransactionBlock, typeArg: Type, args: TransferImplArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::transfer_impl`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, args.t0), pure(txb, args.address, `address`)],
  })
}

export interface ReceiveImplArgs {
  address: string | TransactionArgument
  id: string | TransactionArgument
  u64: bigint | TransactionArgument
}

export function receiveImpl(txb: TransactionBlock, typeArg: Type, args: ReceiveImplArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer::receive_impl`,
    typeArguments: [typeArg],
    arguments: [
      pure(txb, args.address, `address`),
      pure(txb, args.id, `0x2::object::ID`),
      pure(txb, args.u64, `u64`),
    ],
  })
}
