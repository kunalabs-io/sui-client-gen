import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure } from '../../_framework/util'

export interface AddArgs {
  ext: GenericArg
  self: TransactionObjectInput
  cap: TransactionObjectInput
  permissions: bigint | TransactionArgument
}

/**
 * Add an extension to the Kiosk. Can only be performed by the owner. The
 * extension witness is required to allow extensions define their set of
 * permissions in the custom `add` call.
 */
export function add(tx: Transaction, typeArg: string, args: AddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::add`,
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

/**
 * Revoke permissions from the extension. While it does not remove the
 * extension completely, it keeps it from performing any protected actions.
 * The storage is still available to the extension (until it's removed).
 */
export function disable(tx: Transaction, typeArg: string, args: DisableArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::disable`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
    ],
  })
}

export interface EnableArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Re-enable the extension allowing it to call protected actions (eg
 * `place`, `lock`). By default, all added extensions are enabled. Kiosk
 * owner can disable them via `disable` call.
 */
export function enable(tx: Transaction, typeArg: string, args: EnableArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::enable`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
    ],
  })
}

export interface RemoveArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Remove an extension from the Kiosk. Can only be performed by the owner,
 * the extension storage must be empty for the transaction to succeed.
 */
export function remove(tx: Transaction, typeArg: string, args: RemoveArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::remove`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
    ],
  })
}

export interface StorageArgs {
  ext: GenericArg
  self: TransactionObjectInput
}

/**
 * Get immutable access to the extension storage. Can only be performed by
 * the extension as long as the extension is installed.
 */
export function storage(tx: Transaction, typeArg: string, args: StorageArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::storage`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.ext),
      obj(tx, args.self),
    ],
  })
}

export interface StorageMutArgs {
  ext: GenericArg
  self: TransactionObjectInput
}

/**
 * Get mutable access to the extension storage. Can only be performed by
 * the extension as long as the extension is installed. Disabling the
 * extension does not prevent it from accessing the storage.
 *
 * Potentially dangerous: extension developer can keep data in a Bag
 * therefore never really allowing the KioskOwner to remove the extension.
 * However, it is the case with any other solution (1) and this way we
 * prevent intentional extension freeze when the owner wants to ruin a
 * trade (2) - eg locking extension while an auction is in progress.
 *
 * Extensions should be crafted carefully, and the KioskOwner should be
 * aware of the risks.
 */
export function storageMut(
  tx: Transaction,
  typeArg: string,
  args: StorageMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::storage_mut`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.ext),
      obj(tx, args.self),
    ],
  })
}

export interface PlaceArgs {
  ext: GenericArg
  self: TransactionObjectInput
  item: GenericArg
  policy: TransactionObjectInput
}

/**
 * Protected action: place an item into the Kiosk. Can be performed by an
 * authorized extension. The extension must have the `place` permission or
 * a `lock` permission.
 *
 * To prevent non-tradable items from being placed into `Kiosk` the method
 * requires a `TransferPolicy` for the placed type to exist.
 */
export function place(
  tx: Transaction,
  typeArgs: [string, string],
  args: PlaceArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::place`,
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

/**
 * Protected action: lock an item in the Kiosk. Can be performed by an
 * authorized extension. The extension must have the `lock` permission.
 */
export function lock(
  tx: Transaction,
  typeArgs: [string, string],
  args: LockArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::lock`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[0]}`, args.ext),
      obj(tx, args.self),
      generic(tx, `${typeArgs[1]}`, args.item),
      obj(tx, args.policy),
    ],
  })
}

/** Check whether an extension of type `Ext` is installed. */
export function isInstalled(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::is_installed`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Check whether an extension of type `Ext` is enabled. */
export function isEnabled(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::is_enabled`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Check whether an extension of type `Ext` can `place` into Kiosk. */
export function canPlace(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::can_place`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/**
 * Check whether an extension of type `Ext` can `lock` items in Kiosk.
 * Locking also enables `place`.
 */
export function canLock(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::can_lock`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Internal: get a read-only access to the Extension. */
export function extension(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::extension`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Internal: get a mutable access to the Extension. */
export function extensionMut(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk_extension::extension_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
