import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { ID } from '../object/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface TransferArgs {
  t0: GenericArg
  address: string | TransactionArgument
}

export function transfer(tx: Transaction, typeArg: string, args: TransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::transfer`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.t0), pure(tx, args.address, `address`)],
  })
}

export interface PublicTransferArgs {
  t0: GenericArg
  address: string | TransactionArgument
}

export function publicTransfer(tx: Transaction, typeArg: string, args: PublicTransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_transfer`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.t0), pure(tx, args.address, `address`)],
  })
}

export interface PartyTransferArgs {
  t0: GenericArg
  party: TransactionObjectInput
}

export function partyTransfer(tx: Transaction, typeArg: string, args: PartyTransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::party_transfer`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.t0), obj(tx, args.party)],
  })
}

export interface PublicPartyTransferArgs {
  t0: GenericArg
  party: TransactionObjectInput
}

export function publicPartyTransfer(
  tx: Transaction,
  typeArg: string,
  args: PublicPartyTransferArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_party_transfer`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.t0), obj(tx, args.party)],
  })
}

export function freezeObject(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::freeze_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function publicFreezeObject(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_freeze_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function shareObject(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::share_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function publicShareObject(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_share_object`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export interface ReceiveArgs {
  uid: TransactionObjectInput
  receiving: TransactionObjectInput
}

export function receive(tx: Transaction, typeArg: string, args: ReceiveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::receive`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.uid), obj(tx, args.receiving)],
  })
}

export interface PublicReceiveArgs {
  uid: TransactionObjectInput
  receiving: TransactionObjectInput
}

export function publicReceive(tx: Transaction, typeArg: string, args: PublicReceiveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::public_receive`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.uid), obj(tx, args.receiving)],
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

export function freezeObjectImpl(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::freeze_object_impl`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function shareObjectImpl(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::share_object_impl`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export interface PartyTransferImplArgs {
  t0: GenericArg
  u64: bigint | TransactionArgument
  vecAddress: Array<string | TransactionArgument> | TransactionArgument
  vecU64: Array<bigint | TransactionArgument> | TransactionArgument
}

export function partyTransferImpl(tx: Transaction, typeArg: string, args: PartyTransferImplArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::party_transfer_impl`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.t0),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecAddress, `vector<address>`),
      pure(tx, args.vecU64, `vector<u64>`),
    ],
  })
}

export interface TransferImplArgs {
  t0: GenericArg
  address: string | TransactionArgument
}

export function transferImpl(tx: Transaction, typeArg: string, args: TransferImplArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::transfer_impl`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.t0), pure(tx, args.address, `address`)],
  })
}

export interface ReceiveImplArgs {
  address: string | TransactionArgument
  id: string | TransactionArgument
  u64: bigint | TransactionArgument
}

export function receiveImpl(tx: Transaction, typeArg: string, args: ReceiveImplArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer::receive_impl`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.address, `address`),
      pure(tx, args.id, `${ID.$typeName}`),
      pure(tx, args.u64, `u64`),
    ],
  })
}
