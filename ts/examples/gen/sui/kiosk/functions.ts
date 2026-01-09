import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { Option } from '../../_dependencies/std/option/structs'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure } from '../../_framework/util'
import { ID } from '../object/structs'

/**
 * Creates a new Kiosk in a default configuration: sender receives the
 * `KioskOwnerCap` and becomes the Owner, the `Kiosk` is shared.
 */
export function default_(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::default`,
    arguments: [],
  })
}

/** Creates a new `Kiosk` with a matching `KioskOwnerCap`. */
export function new_(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::new`,
    arguments: [],
  })
}

export interface CloseAndWithdrawArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Unpacks and destroys a Kiosk returning the profits (even if "0").
 * Can only be performed by the bearer of the `KioskOwnerCap` in the
 * case where there's no items inside and a `Kiosk` is not shared.
 */
export function closeAndWithdraw(tx: Transaction, args: CloseAndWithdrawArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::close_and_withdraw`,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
    ],
  })
}

export interface SetOwnerArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Change the `owner` field to the transaction sender.
 * The change is purely cosmetical and does not affect any of the
 * basic kiosk functions unless some logic for this is implemented
 * in a third party module.
 */
export function setOwner(tx: Transaction, args: SetOwnerArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::set_owner`,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
    ],
  })
}

export interface SetOwnerCustomArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  owner: string | TransactionArgument
}

/**
 * Update the `owner` field with a custom address. Can be used for
 * implementing a custom logic that relies on the `Kiosk` owner.
 */
export function setOwnerCustom(tx: Transaction, args: SetOwnerCustomArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::set_owner_custom`,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.owner, `address`),
    ],
  })
}

export interface PlaceArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  item: GenericArg
}

/**
 * Place any object into a Kiosk.
 * Performs an authorization check to make sure only owner can do that.
 */
export function place(tx: Transaction, typeArg: string, args: PlaceArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::place`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      generic(tx, `${typeArg}`, args.item),
    ],
  })
}

export interface LockArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  policy: TransactionObjectInput
  item: GenericArg
}

/**
 * Place an item to the `Kiosk` and issue a `Lock` for it. Once placed this
 * way, an item can only be listed either with a `list` function or with a
 * `list_with_purchase_cap`.
 *
 * Requires policy for `T` to make sure that there's an issued `TransferPolicy`
 * and the item can be sold, otherwise the asset might be locked forever.
 */
export function lock(tx: Transaction, typeArg: string, args: LockArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::lock`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      obj(tx, args.policy),
      generic(tx, `${typeArg}`, args.item),
    ],
  })
}

export interface TakeArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
}

/**
 * Take any object from the Kiosk.
 * Performs an authorization check to make sure only owner can do that.
 */
export function take(tx: Transaction, typeArg: string, args: TakeArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::take`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface ListArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
  price: bigint | TransactionArgument
}

/**
 * List the item by setting a price and making it available for purchase.
 * Performs an authorization check to make sure only owner can sell.
 */
export function list(tx: Transaction, typeArg: string, args: ListArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::list`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.id, `${ID.$typeName}`),
      pure(tx, args.price, `u64`),
    ],
  })
}

export interface PlaceAndListArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  item: GenericArg
  price: bigint | TransactionArgument
}

/** Calls `place` and `list` together - simplifies the flow. */
export function placeAndList(
  tx: Transaction,
  typeArg: string,
  args: PlaceAndListArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::place_and_list`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      generic(tx, `${typeArg}`, args.item),
      pure(tx, args.price, `u64`),
    ],
  })
}

export interface DelistArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
}

/**
 * Remove an existing listing from the `Kiosk` and keep the item in the
 * user Kiosk. Can only be performed by the owner of the `Kiosk`.
 */
export function delist(tx: Transaction, typeArg: string, args: DelistArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::delist`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface PurchaseArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
  payment: TransactionObjectInput
}

/**
 * Make a trade: pay the owner of the item and request a Transfer to the `target`
 * kiosk (to prevent item being taken by the approving party).
 *
 * Received `TransferRequest` needs to be handled by the publisher of the T,
 * if they have a method implemented that allows a trade, it is possible to
 * request their approval (by calling some function) so that the trade can be
 * finalized.
 */
export function purchase(tx: Transaction, typeArg: string, args: PurchaseArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::purchase`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.id, `${ID.$typeName}`),
      obj(tx, args.payment),
    ],
  })
}

export interface ListWithPurchaseCapArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
  minPrice: bigint | TransactionArgument
}

/**
 * Creates a `PurchaseCap` which gives the right to purchase an item
 * for any price equal or higher than the `min_price`.
 */
export function listWithPurchaseCap(
  tx: Transaction,
  typeArg: string,
  args: ListWithPurchaseCapArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::list_with_purchase_cap`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.id, `${ID.$typeName}`),
      pure(tx, args.minPrice, `u64`),
    ],
  })
}

export interface PurchaseWithCapArgs {
  self: TransactionObjectInput
  purchaseCap: TransactionObjectInput
  payment: TransactionObjectInput
}

/**
 * Unpack the `PurchaseCap` and call `purchase`. Sets the payment amount
 * as the price for the listing making sure it's no less than `min_amount`.
 */
export function purchaseWithCap(
  tx: Transaction,
  typeArg: string,
  args: PurchaseWithCapArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::purchase_with_cap`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.purchaseCap),
      obj(tx, args.payment),
    ],
  })
}

export interface ReturnPurchaseCapArgs {
  self: TransactionObjectInput
  purchaseCap: TransactionObjectInput
}

/**
 * Return the `PurchaseCap` without making a purchase; remove an active offer and
 * allow the item for taking. Can only be returned to its `Kiosk`, aborts otherwise.
 */
export function returnPurchaseCap(
  tx: Transaction,
  typeArg: string,
  args: ReturnPurchaseCapArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::return_purchase_cap`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.purchaseCap),
    ],
  })
}

export interface WithdrawArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  amount: bigint | TransactionArgument | null
}

/** Withdraw profits from the Kiosk. */
export function withdraw(tx: Transaction, args: WithdrawArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::withdraw`,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.amount, `${Option.$typeName}<u64>`),
    ],
  })
}

export interface LockInternalArgs {
  self: TransactionObjectInput
  item: GenericArg
}

/** Internal: "lock" an item disabling the `take` action. */
export function lockInternal(
  tx: Transaction,
  typeArg: string,
  args: LockInternalArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::lock_internal`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArg}`, args.item),
    ],
  })
}

export interface PlaceInternalArgs {
  self: TransactionObjectInput
  item: GenericArg
}

/** Internal: "place" an item to the Kiosk and increment the item count. */
export function placeInternal(
  tx: Transaction,
  typeArg: string,
  args: PlaceInternalArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::place_internal`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArg}`, args.item),
    ],
  })
}

/** Internal: get a mutable access to the UID. */
export function uidMutInternal(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::uid_mut_internal`,
    arguments: [obj(tx, self)],
  })
}

export interface HasItemArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
}

/** Check whether the `item` is present in the `Kiosk`. */
export function hasItem(tx: Transaction, args: HasItemArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::has_item`,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface HasItemWithTypeArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
}

/** Check whether the `item` is present in the `Kiosk` and has type T. */
export function hasItemWithType(
  tx: Transaction,
  typeArg: string,
  args: HasItemWithTypeArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::has_item_with_type`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface IsLockedArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
}

/**
 * Check whether an item with the `id` is locked in the `Kiosk`. Meaning
 * that the only two actions that can be performed on it are `list` and
 * `list_with_purchase_cap`, it cannot be `take`n out of the `Kiosk`.
 */
export function isLocked(tx: Transaction, args: IsLockedArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::is_locked`,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface IsListedArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
}

/** Check whether an `item` is listed (exclusively or non exclusively). */
export function isListed(tx: Transaction, args: IsListedArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::is_listed`,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface IsListedExclusivelyArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
}

/** Check whether there's a `PurchaseCap` issued for an item. */
export function isListedExclusively(
  tx: Transaction,
  args: IsListedExclusivelyArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::is_listed_exclusively`,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface HasAccessArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/** Check whether the `KioskOwnerCap` matches the `Kiosk`. */
export function hasAccess(tx: Transaction, args: HasAccessArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::has_access`,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
    ],
  })
}

export interface UidMutAsOwnerArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/** Access the `UID` using the `KioskOwnerCap`. */
export function uidMutAsOwner(tx: Transaction, args: UidMutAsOwnerArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::uid_mut_as_owner`,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
    ],
  })
}

export interface SetAllowExtensionsArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  allowExtensions: boolean | TransactionArgument
}

/**
 * [DEPRECATED]
 * Allow or disallow `uid` and `uid_mut` access via the `allow_extensions`
 * setting.
 */
export function setAllowExtensions(
  tx: Transaction,
  args: SetAllowExtensionsArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::set_allow_extensions`,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.allowExtensions, `bool`),
    ],
  })
}

/**
 * Get the immutable `UID` for dynamic field access.
 * Always enabled.
 *
 * Given the &UID can be used for reading keys and authorization,
 * its access
 */
export function uid(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::uid`,
    arguments: [obj(tx, self)],
  })
}

/**
 * Get the mutable `UID` for dynamic field access and extensions.
 * Aborts if `allow_extensions` set to `false`.
 */
export function uidMut(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::uid_mut`,
    arguments: [obj(tx, self)],
  })
}

/** Get the owner of the Kiosk. */
export function owner(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::owner`,
    arguments: [obj(tx, self)],
  })
}

/** Get the number of items stored in a Kiosk. */
export function itemCount(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::item_count`,
    arguments: [obj(tx, self)],
  })
}

/** Get the amount of profits collected by selling items. */
export function profitsAmount(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::profits_amount`,
    arguments: [obj(tx, self)],
  })
}

export interface ProfitsMutArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/** Get mutable access to `profits` - owner only action. */
export function profitsMut(tx: Transaction, args: ProfitsMutArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::profits_mut`,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
    ],
  })
}

export interface BorrowArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
}

/**
 * Immutably borrow an item from the `Kiosk`. Any item can be `borrow`ed
 * at any time.
 */
export function borrow(tx: Transaction, typeArg: string, args: BorrowArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::borrow`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface BorrowMutArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
}

/**
 * Mutably borrow an item from the `Kiosk`.
 * Item can be `borrow_mut`ed only if it's not `is_listed`.
 */
export function borrowMut(
  tx: Transaction,
  typeArg: string,
  args: BorrowMutArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface BorrowValArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
}

/**
 * Take the item from the `Kiosk` with a guarantee that it will be returned.
 * Item can be `borrow_val`-ed only if it's not `is_listed`.
 */
export function borrowVal(
  tx: Transaction,
  typeArg: string,
  args: BorrowValArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::borrow_val`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface ReturnValArgs {
  self: TransactionObjectInput
  item: GenericArg
  borrow: TransactionObjectInput
}

/**
 * Return the borrowed item to the `Kiosk`. This method cannot be avoided
 * if `borrow_val` is used.
 */
export function returnVal(
  tx: Transaction,
  typeArg: string,
  args: ReturnValArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::return_val`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArg}`, args.item),
      obj(tx, args.borrow),
    ],
  })
}

/** Get the `for` field of the `KioskOwnerCap`. */
export function kioskOwnerCapFor(tx: Transaction, cap: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::kiosk_owner_cap_for`,
    arguments: [obj(tx, cap)],
  })
}

/** Get the `kiosk_id` from the `PurchaseCap`. */
export function purchaseCapKiosk(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::purchase_cap_kiosk`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Get the `Item_id` from the `PurchaseCap`. */
export function purchaseCapItem(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::purchase_cap_item`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Get the `min_price` from the `PurchaseCap`. */
export function purchaseCapMinPrice(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::kiosk::purchase_cap_min_price`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
