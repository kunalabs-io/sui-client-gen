import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AccumulatorRootOwnerExistsArgs {
  accumulatorRoot: TransactionObjectInput
  address: string | TransactionArgument
}

export function accumulatorRootOwnerExists(tx: Transaction, args: AccumulatorRootOwnerExistsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_metadata::accumulator_root_owner_exists`,
    arguments: [obj(tx, args.accumulatorRoot), pure(tx, args.address, `address`)],
  })
}

export interface AccumulatorRootBorrowOwnerMutArgs {
  accumulatorRoot: TransactionObjectInput
  address: string | TransactionArgument
}

export function accumulatorRootBorrowOwnerMut(
  tx: Transaction,
  args: AccumulatorRootBorrowOwnerMutArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_metadata::accumulator_root_borrow_owner_mut`,
    arguments: [obj(tx, args.accumulatorRoot), pure(tx, args.address, `address`)],
  })
}

export interface AccumulatorRootAttachOwnerArgs {
  accumulatorRoot: TransactionObjectInput
  owner: TransactionObjectInput
}

export function accumulatorRootAttachOwner(tx: Transaction, args: AccumulatorRootAttachOwnerArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_metadata::accumulator_root_attach_owner`,
    arguments: [obj(tx, args.accumulatorRoot), obj(tx, args.owner)],
  })
}

export interface AccumulatorRootDetachOwnerArgs {
  accumulatorRoot: TransactionObjectInput
  address: string | TransactionArgument
}

export function accumulatorRootDetachOwner(tx: Transaction, args: AccumulatorRootDetachOwnerArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_metadata::accumulator_root_detach_owner`,
    arguments: [obj(tx, args.accumulatorRoot), pure(tx, args.address, `address`)],
  })
}

export interface CreateAccumulatorMetadataArgs {
  accumulatorRoot: TransactionObjectInput
  address: string | TransactionArgument
}

export function createAccumulatorMetadata(
  tx: Transaction,
  typeArg: string,
  args: CreateAccumulatorMetadataArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_metadata::create_accumulator_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.accumulatorRoot), pure(tx, args.address, `address`)],
  })
}

export interface RemoveAccumulatorMetadataArgs {
  accumulatorRoot: TransactionObjectInput
  address: string | TransactionArgument
}

export function removeAccumulatorMetadata(
  tx: Transaction,
  typeArg: string,
  args: RemoveAccumulatorMetadataArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_metadata::remove_accumulator_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.accumulatorRoot), pure(tx, args.address, `address`)],
  })
}

export interface AccumulatorOwnerAttachMetadataArgs {
  owner: TransactionObjectInput
  metadata: TransactionObjectInput
}

export function accumulatorOwnerAttachMetadata(
  tx: Transaction,
  typeArg: string,
  args: AccumulatorOwnerAttachMetadataArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_metadata::accumulator_owner_attach_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.owner), obj(tx, args.metadata)],
  })
}

export function accumulatorOwnerDetachMetadata(
  tx: Transaction,
  typeArg: string,
  owner: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_metadata::accumulator_owner_detach_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, owner)],
  })
}

export function accumulatorOwnerDestroy(tx: Transaction, owner: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_metadata::accumulator_owner_destroy`,
    arguments: [obj(tx, owner)],
  })
}
