import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AccumulatorRootOwnerExistsArgs {
  accumulatorRoot: TransactionObjectInput
  owner: string | TransactionArgument
}

/**
 * === Owner functions ===
 * Check if there is an owner field attached to the accumulator root.
 */
export function accumulatorRootOwnerExists(tx: Transaction, args: AccumulatorRootOwnerExistsArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_metadata::accumulator_root_owner_exists`,
    arguments: [obj(tx, args.accumulatorRoot), pure(tx, args.owner, `address`)],
  })
}

export interface AccumulatorRootBorrowOwnerMutArgs {
  accumulatorRoot: TransactionObjectInput
  owner: string | TransactionArgument
}

/** Borrow an owner field mutably. */
export function accumulatorRootBorrowOwnerMut(
  tx: Transaction,
  args: AccumulatorRootBorrowOwnerMutArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_metadata::accumulator_root_borrow_owner_mut`,
    arguments: [obj(tx, args.accumulatorRoot), pure(tx, args.owner, `address`)],
  })
}

export interface AccumulatorRootAttachOwnerArgs {
  accumulatorRoot: TransactionObjectInput
  owner: TransactionObjectInput
}

/** Attach an owner field to the accumulator root. */
export function accumulatorRootAttachOwner(tx: Transaction, args: AccumulatorRootAttachOwnerArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_metadata::accumulator_root_attach_owner`,
    arguments: [obj(tx, args.accumulatorRoot), obj(tx, args.owner)],
  })
}

export interface AccumulatorRootDetachOwnerArgs {
  accumulatorRoot: TransactionObjectInput
  owner: string | TransactionArgument
}

/** Detach an owner field from the accumulator root. */
export function accumulatorRootDetachOwner(tx: Transaction, args: AccumulatorRootDetachOwnerArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_metadata::accumulator_root_detach_owner`,
    arguments: [obj(tx, args.accumulatorRoot), pure(tx, args.owner, `address`)],
  })
}

export interface CreateAccumulatorMetadataArgs {
  accumulatorRoot: TransactionObjectInput
  owner: string | TransactionArgument
}

/**
 * === Metadata functions ===
 * Create a metadata field for a new balance field with type T.
 * The metadata will be attached to the owner field `owner`.
 * If the owner field does not exist, it will be created.
 */
export function createAccumulatorMetadata(
  tx: Transaction,
  typeArg: string,
  args: CreateAccumulatorMetadataArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_metadata::create_accumulator_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.accumulatorRoot), pure(tx, args.owner, `address`)],
  })
}

export interface RemoveAccumulatorMetadataArgs {
  accumulatorRoot: TransactionObjectInput
  owner: string | TransactionArgument
}

/**
 * Remove the metadata field for a balance field with type T.
 * The metadata will be detached from the owner field `owner`.
 * If there are no more balance fields attached to the owner field,
 * the owner field will be destroyed.
 */
export function removeAccumulatorMetadata(
  tx: Transaction,
  typeArg: string,
  args: RemoveAccumulatorMetadataArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_metadata::remove_accumulator_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.accumulatorRoot), pure(tx, args.owner, `address`)],
  })
}

export interface AccumulatorOwnerAttachMetadataArgs {
  self: TransactionObjectInput
  metadata: TransactionObjectInput
}

/** Attach a metadata field for type T to the owner field. */
export function accumulatorOwnerAttachMetadata(
  tx: Transaction,
  typeArg: string,
  args: AccumulatorOwnerAttachMetadataArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_metadata::accumulator_owner_attach_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.metadata)],
  })
}

/** Detach a metadata field for type T from the owner field. */
export function accumulatorOwnerDetachMetadata(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_metadata::accumulator_owner_detach_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Destroy an owner field. */
export function accumulatorOwnerDestroy(tx: Transaction, this_: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_metadata::accumulator_owner_destroy`,
    arguments: [obj(tx, this_)],
  })
}
