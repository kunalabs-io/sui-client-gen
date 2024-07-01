import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Option } from '../../move-stdlib/option/structs'
import { ID } from '../object/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface BorrowArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
}

export function borrow(tx: Transaction, typeArg: string, args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface BorrowMutArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
}

export function borrowMut(tx: Transaction, typeArg: string, args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export function default_(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::default`, arguments: [] })
}

export function new_(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::new`, arguments: [] })
}

export function uid(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::uid`, arguments: [obj(tx, self)] })
}

export interface ListArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
  price: bigint | TransactionArgument
}

export function list(tx: Transaction, typeArg: string, args: ListArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::list`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.id, `${ID.$typeName}`),
      pure(tx, args.price, `u64`),
    ],
  })
}

export interface TakeArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
}

export function take(tx: Transaction, typeArg: string, args: TakeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::take`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface UidMutAsOwnerArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

export function uidMutAsOwner(tx: Transaction, args: UidMutAsOwnerArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::uid_mut_as_owner`,
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface WithdrawArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  amount: bigint | TransactionArgument | TransactionArgument | null
}

export function withdraw(tx: Transaction, args: WithdrawArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::withdraw`,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.amount, `${Option.$typeName}<u64>`),
    ],
  })
}

export interface BorrowValArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
}

export function borrowVal(tx: Transaction, typeArg: string, args: BorrowValArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow_val`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface CloseAndWithdrawArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

export function closeAndWithdraw(tx: Transaction, args: CloseAndWithdrawArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::close_and_withdraw`,
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface DelistArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
}

export function delist(tx: Transaction, typeArg: string, args: DelistArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::delist`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface HasAccessArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

export function hasAccess(tx: Transaction, args: HasAccessArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_access`,
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface HasItemArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
}

export function hasItem(tx: Transaction, args: HasItemArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_item`,
    arguments: [obj(tx, args.self), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface HasItemWithTypeArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
}

export function hasItemWithType(tx: Transaction, typeArg: string, args: HasItemWithTypeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_item_with_type`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface IsListedArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
}

export function isListed(tx: Transaction, args: IsListedArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_listed`,
    arguments: [obj(tx, args.self), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface IsListedExclusivelyArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
}

export function isListedExclusively(tx: Transaction, args: IsListedExclusivelyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_listed_exclusively`,
    arguments: [obj(tx, args.self), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface IsLockedArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
}

export function isLocked(tx: Transaction, args: IsLockedArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_locked`,
    arguments: [obj(tx, args.self), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export function itemCount(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::item_count`, arguments: [obj(tx, self)] })
}

export function kioskOwnerCapFor(tx: Transaction, cap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::kiosk_owner_cap_for`,
    arguments: [obj(tx, cap)],
  })
}

export interface ListWithPurchaseCapArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  id: string | TransactionArgument
  minPrice: bigint | TransactionArgument
}

export function listWithPurchaseCap(
  tx: Transaction,
  typeArg: string,
  args: ListWithPurchaseCapArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::list_with_purchase_cap`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.id, `${ID.$typeName}`),
      pure(tx, args.minPrice, `u64`),
    ],
  })
}

export interface LockArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  policy: TransactionObjectInput
  item: GenericArg
}

export function lock(tx: Transaction, typeArg: string, args: LockArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::lock`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      obj(tx, args.policy),
      generic(tx, `${typeArg}`, args.item),
    ],
  })
}

export interface LockInternalArgs {
  self: TransactionObjectInput
  item: GenericArg
}

export function lockInternal(tx: Transaction, typeArg: string, args: LockInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::lock_internal`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), generic(tx, `${typeArg}`, args.item)],
  })
}

export function owner(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::owner`, arguments: [obj(tx, self)] })
}

export interface PlaceArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  item: GenericArg
}

export function place(tx: Transaction, typeArg: string, args: PlaceArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap), generic(tx, `${typeArg}`, args.item)],
  })
}

export interface PlaceAndListArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  item: GenericArg
  price: bigint | TransactionArgument
}

export function placeAndList(tx: Transaction, typeArg: string, args: PlaceAndListArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place_and_list`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      generic(tx, `${typeArg}`, args.item),
      pure(tx, args.price, `u64`),
    ],
  })
}

export interface PlaceInternalArgs {
  self: TransactionObjectInput
  item: GenericArg
}

export function placeInternal(tx: Transaction, typeArg: string, args: PlaceInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place_internal`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), generic(tx, `${typeArg}`, args.item)],
  })
}

export function profitsAmount(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::profits_amount`,
    arguments: [obj(tx, self)],
  })
}

export interface ProfitsMutArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

export function profitsMut(tx: Transaction, args: ProfitsMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::profits_mut`,
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface PurchaseArgs {
  self: TransactionObjectInput
  id: string | TransactionArgument
  payment: TransactionObjectInput
}

export function purchase(tx: Transaction, typeArg: string, args: PurchaseArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.id, `${ID.$typeName}`), obj(tx, args.payment)],
  })
}

export function purchaseCapItem(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_item`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function purchaseCapKiosk(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_kiosk`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function purchaseCapMinPrice(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_min_price`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export interface PurchaseWithCapArgs {
  self: TransactionObjectInput
  purchaseCap: TransactionObjectInput
  payment: TransactionObjectInput
}

export function purchaseWithCap(tx: Transaction, typeArg: string, args: PurchaseWithCapArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_with_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.purchaseCap), obj(tx, args.payment)],
  })
}

export interface ReturnPurchaseCapArgs {
  self: TransactionObjectInput
  purchaseCap: TransactionObjectInput
}

export function returnPurchaseCap(tx: Transaction, typeArg: string, args: ReturnPurchaseCapArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::return_purchase_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.purchaseCap)],
  })
}

export interface ReturnValArgs {
  self: TransactionObjectInput
  item: GenericArg
  borrow: TransactionObjectInput
}

export function returnVal(tx: Transaction, typeArg: string, args: ReturnValArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::return_val`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), generic(tx, `${typeArg}`, args.item), obj(tx, args.borrow)],
  })
}

export interface SetAllowExtensionsArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  allowExtensions: boolean | TransactionArgument
}

export function setAllowExtensions(tx: Transaction, args: SetAllowExtensionsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_allow_extensions`,
    arguments: [obj(tx, args.self), obj(tx, args.cap), pure(tx, args.allowExtensions, `bool`)],
  })
}

export interface SetOwnerArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

export function setOwner(tx: Transaction, args: SetOwnerArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_owner`,
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface SetOwnerCustomArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  owner: string | TransactionArgument
}

export function setOwnerCustom(tx: Transaction, args: SetOwnerCustomArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_owner_custom`,
    arguments: [obj(tx, args.self), obj(tx, args.cap), pure(tx, args.owner, `address`)],
  })
}

export function uidMut(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::uid_mut`, arguments: [obj(tx, self)] })
}

export function uidMutInternal(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::uid_mut_internal`,
    arguments: [obj(tx, self)],
  })
}
