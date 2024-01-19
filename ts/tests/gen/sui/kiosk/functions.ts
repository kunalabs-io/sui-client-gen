import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface BorrowArgs {
  self: ObjectArg
  cap: ObjectArg
  id: string | TransactionArgument
}

export function borrow(txb: TransactionBlock, typeArg: Type, args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface BorrowMutArgs {
  self: ObjectArg
  cap: ObjectArg
  id: string | TransactionArgument
}

export function borrowMut(txb: TransactionBlock, typeArg: Type, args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export function default_(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::default`, arguments: [] })
}

export function new_(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::new`, arguments: [] })
}

export function uid(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::uid`, arguments: [obj(txb, self)] })
}

export function owner(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::owner`, arguments: [obj(txb, self)] })
}

export interface TakeArgs {
  self: ObjectArg
  cap: ObjectArg
  id: string | TransactionArgument
}

export function take(txb: TransactionBlock, typeArg: Type, args: TakeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::take`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface UidMutAsOwnerArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function uidMutAsOwner(txb: TransactionBlock, args: UidMutAsOwnerArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::uid_mut_as_owner`,
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export interface WithdrawArgs {
  self: ObjectArg
  cap: ObjectArg
  amount: bigint | TransactionArgument | TransactionArgument | null
}

export function withdraw(txb: TransactionBlock, args: WithdrawArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::withdraw`,
    arguments: [
      obj(txb, args.self),
      obj(txb, args.cap),
      pure(txb, args.amount, `0x1::option::Option<u64>`),
    ],
  })
}

export interface BorrowValArgs {
  self: ObjectArg
  cap: ObjectArg
  id: string | TransactionArgument
}

export function borrowVal(txb: TransactionBlock, typeArg: Type, args: BorrowValArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow_val`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface CloseAndWithdrawArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function closeAndWithdraw(txb: TransactionBlock, args: CloseAndWithdrawArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::close_and_withdraw`,
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export interface DelistArgs {
  self: ObjectArg
  cap: ObjectArg
  id: string | TransactionArgument
}

export function delist(txb: TransactionBlock, typeArg: Type, args: DelistArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::delist`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface HasAccessArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function hasAccess(txb: TransactionBlock, args: HasAccessArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_access`,
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export interface HasItemArgs {
  self: ObjectArg
  id: string | TransactionArgument
}

export function hasItem(txb: TransactionBlock, args: HasItemArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_item`,
    arguments: [obj(txb, args.self), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface HasItemWithTypeArgs {
  self: ObjectArg
  id: string | TransactionArgument
}

export function hasItemWithType(txb: TransactionBlock, typeArg: Type, args: HasItemWithTypeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_item_with_type`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface IsListedArgs {
  self: ObjectArg
  id: string | TransactionArgument
}

export function isListed(txb: TransactionBlock, args: IsListedArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_listed`,
    arguments: [obj(txb, args.self), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface IsListedExclusivelyArgs {
  self: ObjectArg
  id: string | TransactionArgument
}

export function isListedExclusively(txb: TransactionBlock, args: IsListedExclusivelyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_listed_exclusively`,
    arguments: [obj(txb, args.self), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface IsLockedArgs {
  self: ObjectArg
  id: string | TransactionArgument
}

export function isLocked(txb: TransactionBlock, args: IsLockedArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_locked`,
    arguments: [obj(txb, args.self), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export function itemCount(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::item_count`, arguments: [obj(txb, self)] })
}

export function kioskOwnerCapFor(txb: TransactionBlock, cap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::kiosk_owner_cap_for`,
    arguments: [obj(txb, cap)],
  })
}

export interface ListArgs {
  self: ObjectArg
  cap: ObjectArg
  id: string | TransactionArgument
  price: bigint | TransactionArgument
}

export function list(txb: TransactionBlock, typeArg: Type, args: ListArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::list`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      obj(txb, args.cap),
      pure(txb, args.id, `0x2::object::ID`),
      pure(txb, args.price, `u64`),
    ],
  })
}

export interface ListWithPurchaseCapArgs {
  self: ObjectArg
  cap: ObjectArg
  id: string | TransactionArgument
  minPrice: bigint | TransactionArgument
}

export function listWithPurchaseCap(
  txb: TransactionBlock,
  typeArg: Type,
  args: ListWithPurchaseCapArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::list_with_purchase_cap`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      obj(txb, args.cap),
      pure(txb, args.id, `0x2::object::ID`),
      pure(txb, args.minPrice, `u64`),
    ],
  })
}

export interface LockArgs {
  self: ObjectArg
  cap: ObjectArg
  policy: ObjectArg
  item: GenericArg
}

export function lock(txb: TransactionBlock, typeArg: Type, args: LockArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::lock`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      obj(txb, args.cap),
      obj(txb, args.policy),
      generic(txb, `${typeArg}`, args.item),
    ],
  })
}

export interface LockInternalArgs {
  self: ObjectArg
  item: GenericArg
}

export function lockInternal(txb: TransactionBlock, typeArg: Type, args: LockInternalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::lock_internal`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), generic(txb, `${typeArg}`, args.item)],
  })
}

export interface PlaceArgs {
  self: ObjectArg
  cap: ObjectArg
  item: GenericArg
}

export function place(txb: TransactionBlock, typeArg: Type, args: PlaceArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap), generic(txb, `${typeArg}`, args.item)],
  })
}

export interface PlaceAndListArgs {
  self: ObjectArg
  cap: ObjectArg
  item: GenericArg
  price: bigint | TransactionArgument
}

export function placeAndList(txb: TransactionBlock, typeArg: Type, args: PlaceAndListArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place_and_list`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      obj(txb, args.cap),
      generic(txb, `${typeArg}`, args.item),
      pure(txb, args.price, `u64`),
    ],
  })
}

export interface PlaceInternalArgs {
  self: ObjectArg
  item: GenericArg
}

export function placeInternal(txb: TransactionBlock, typeArg: Type, args: PlaceInternalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place_internal`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), generic(txb, `${typeArg}`, args.item)],
  })
}

export function profitsAmount(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::profits_amount`,
    arguments: [obj(txb, self)],
  })
}

export interface ProfitsMutArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function profitsMut(txb: TransactionBlock, args: ProfitsMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::profits_mut`,
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export interface PurchaseArgs {
  self: ObjectArg
  id: string | TransactionArgument
  payment: ObjectArg
}

export function purchase(txb: TransactionBlock, typeArg: Type, args: PurchaseArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.id, `0x2::object::ID`), obj(txb, args.payment)],
  })
}

export function purchaseCapItem(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_item`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function purchaseCapKiosk(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_kiosk`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function purchaseCapMinPrice(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_min_price`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface PurchaseWithCapArgs {
  self: ObjectArg
  purchaseCap: ObjectArg
  payment: ObjectArg
}

export function purchaseWithCap(txb: TransactionBlock, typeArg: Type, args: PurchaseWithCapArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_with_cap`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.purchaseCap), obj(txb, args.payment)],
  })
}

export interface ReturnPurchaseCapArgs {
  self: ObjectArg
  purchaseCap: ObjectArg
}

export function returnPurchaseCap(
  txb: TransactionBlock,
  typeArg: Type,
  args: ReturnPurchaseCapArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::return_purchase_cap`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.purchaseCap)],
  })
}

export interface ReturnValArgs {
  self: ObjectArg
  item: GenericArg
  borrow: ObjectArg
}

export function returnVal(txb: TransactionBlock, typeArg: Type, args: ReturnValArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::return_val`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), generic(txb, `${typeArg}`, args.item), obj(txb, args.borrow)],
  })
}

export interface SetAllowExtensionsArgs {
  self: ObjectArg
  cap: ObjectArg
  allowExtensions: boolean | TransactionArgument
}

export function setAllowExtensions(txb: TransactionBlock, args: SetAllowExtensionsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_allow_extensions`,
    arguments: [obj(txb, args.self), obj(txb, args.cap), pure(txb, args.allowExtensions, `bool`)],
  })
}

export interface SetOwnerArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function setOwner(txb: TransactionBlock, args: SetOwnerArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_owner`,
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export interface SetOwnerCustomArgs {
  self: ObjectArg
  cap: ObjectArg
  owner: string | TransactionArgument
}

export function setOwnerCustom(txb: TransactionBlock, args: SetOwnerCustomArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_owner_custom`,
    arguments: [obj(txb, args.self), obj(txb, args.cap), pure(txb, args.owner, `address`)],
  })
}

export function uidMut(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::uid_mut`, arguments: [obj(txb, self)] })
}

export function uidMutInternal(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::uid_mut_internal`,
    arguments: [obj(txb, self)],
  })
}
