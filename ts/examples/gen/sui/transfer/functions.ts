import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { ID } from '../object/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function freezeObject(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::freeze_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

export function freezeObjectImpl(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::freeze_object_impl`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

export function publicFreezeObject(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_freeze_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

export interface PublicReceiveArgs {
  parent: TransactionObjectInput
  toReceive: TransactionObjectInput
}

export function publicReceive(tx: Transaction, typeArg: string, args: PublicReceiveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_receive`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.parent), obj(tx, args.toReceive)],
  })
}

export function publicShareObject(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_share_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

export interface PublicTransferArgs {
  obj: GenericArg
  recipient: string | TransactionArgument
}

export function publicTransfer(tx: Transaction, typeArg: string, args: PublicTransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_transfer`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.obj), pure(tx, args.recipient, `address`)],
  })
}

export interface ReceiveArgs {
  parent: TransactionObjectInput
  toReceive: TransactionObjectInput
}

export function receive(tx: Transaction, typeArg: string, args: ReceiveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::receive`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.parent), obj(tx, args.toReceive)],
  })
}

export interface ReceiveImplArgs {
  parent: string | TransactionArgument
  toReceive: string | TransactionArgument
  version: bigint | TransactionArgument
}

export function receiveImpl(tx: Transaction, typeArg: string, args: ReceiveImplArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::receive_impl`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.parent, `address`),
      pure(tx, args.toReceive, `${ID.$typeName}`),
      pure(tx, args.version, `u64`),
    ],
  })
}

export function receivingObjectId(
  tx: Transaction,
  typeArg: string,
  receiving: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::receiving_object_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, receiving)],
  })
}

export function shareObject(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::share_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

export function shareObjectImpl(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::share_object_impl`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

export interface TransferArgs {
  obj: GenericArg
  recipient: string | TransactionArgument
}

export function transfer(tx: Transaction, typeArg: string, args: TransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::transfer`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.obj), pure(tx, args.recipient, `address`)],
  })
}

export interface TransferImplArgs {
  obj: GenericArg
  recipient: string | TransactionArgument
}

export function transferImpl(tx: Transaction, typeArg: string, args: TransferImplArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::transfer_impl`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.obj), pure(tx, args.recipient, `address`)],
  })
}
