import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::new`, arguments: [] })
}

export interface BorrowArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  id: string | TransactionArgument
}

export function borrow(txb: TransactionBlock, typeArg: string, args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      pure(txb, args.id, `0x2::object::ID`),
    ],
  })
}

export interface BorrowMutArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  id: string | TransactionArgument
}

export function borrowMut(txb: TransactionBlock, typeArg: string, args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      pure(txb, args.id, `0x2::object::ID`),
    ],
  })
}

export function owner(txb: TransactionBlock, kiosk: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::owner`, arguments: [obj(txb, kiosk)] })
}

export interface TakeArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  id: string | TransactionArgument
}

export function take(txb: TransactionBlock, typeArg: string, args: TakeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::take`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      pure(txb, args.id, `0x2::object::ID`),
    ],
  })
}

export function uid(txb: TransactionBlock, kiosk: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::uid`, arguments: [obj(txb, kiosk)] })
}

export function default_(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::default`, arguments: [] })
}

export interface WithdrawArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  option: bigint | TransactionArgument | TransactionArgument | null
}

export function withdraw(txb: TransactionBlock, args: WithdrawArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::withdraw`,
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      pure(txb, args.option, `0x1::option::Option<u64>`),
    ],
  })
}

export interface UidMutAsOwnerArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
}

export function uidMutAsOwner(txb: TransactionBlock, args: UidMutAsOwnerArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::uid_mut_as_owner`,
    arguments: [obj(txb, args.kiosk), obj(txb, args.kioskOwnerCap)],
  })
}

export interface CloseAndWithdrawArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
}

export function closeAndWithdraw(txb: TransactionBlock, args: CloseAndWithdrawArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::close_and_withdraw`,
    arguments: [obj(txb, args.kiosk), obj(txb, args.kioskOwnerCap)],
  })
}

export interface SetOwnerArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
}

export function setOwner(txb: TransactionBlock, args: SetOwnerArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_owner`,
    arguments: [obj(txb, args.kiosk), obj(txb, args.kioskOwnerCap)],
  })
}

export interface SetOwnerCustomArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  address: string | TransactionArgument
}

export function setOwnerCustom(txb: TransactionBlock, args: SetOwnerCustomArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_owner_custom`,
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      pure(txb, args.address, `address`),
    ],
  })
}

export interface PlaceArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  t0: GenericArg
}

export function place(txb: TransactionBlock, typeArg: string, args: PlaceArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      generic(txb, `${typeArg}`, args.t0),
    ],
  })
}

export interface LockArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  transferPolicy: ObjectArg
  t0: GenericArg
}

export function lock(txb: TransactionBlock, typeArg: string, args: LockArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::lock`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      obj(txb, args.transferPolicy),
      generic(txb, `${typeArg}`, args.t0),
    ],
  })
}

export interface ListArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  id: string | TransactionArgument
  u64: bigint | TransactionArgument
}

export function list(txb: TransactionBlock, typeArg: string, args: ListArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::list`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      pure(txb, args.id, `0x2::object::ID`),
      pure(txb, args.u64, `u64`),
    ],
  })
}

export interface PlaceAndListArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  t0: GenericArg
  u64: bigint | TransactionArgument
}

export function placeAndList(txb: TransactionBlock, typeArg: string, args: PlaceAndListArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place_and_list`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      generic(txb, `${typeArg}`, args.t0),
      pure(txb, args.u64, `u64`),
    ],
  })
}

export interface DelistArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  id: string | TransactionArgument
}

export function delist(txb: TransactionBlock, typeArg: string, args: DelistArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::delist`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      pure(txb, args.id, `0x2::object::ID`),
    ],
  })
}

export interface PurchaseArgs {
  kiosk: ObjectArg
  id: string | TransactionArgument
  coin: ObjectArg
}

export function purchase(txb: TransactionBlock, typeArg: string, args: PurchaseArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.kiosk), pure(txb, args.id, `0x2::object::ID`), obj(txb, args.coin)],
  })
}

export interface ListWithPurchaseCapArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  id: string | TransactionArgument
  u64: bigint | TransactionArgument
}

export function listWithPurchaseCap(
  txb: TransactionBlock,
  typeArg: string,
  args: ListWithPurchaseCapArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::list_with_purchase_cap`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      pure(txb, args.id, `0x2::object::ID`),
      pure(txb, args.u64, `u64`),
    ],
  })
}

export interface PurchaseWithCapArgs {
  kiosk: ObjectArg
  purchaseCap: ObjectArg
  coin: ObjectArg
}

export function purchaseWithCap(txb: TransactionBlock, typeArg: string, args: PurchaseWithCapArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_with_cap`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.kiosk), obj(txb, args.purchaseCap), obj(txb, args.coin)],
  })
}

export interface ReturnPurchaseCapArgs {
  kiosk: ObjectArg
  purchaseCap: ObjectArg
}

export function returnPurchaseCap(
  txb: TransactionBlock,
  typeArg: string,
  args: ReturnPurchaseCapArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::return_purchase_cap`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.kiosk), obj(txb, args.purchaseCap)],
  })
}

export interface LockInternalArgs {
  kiosk: ObjectArg
  t0: GenericArg
}

export function lockInternal(txb: TransactionBlock, typeArg: string, args: LockInternalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::lock_internal`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.kiosk), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface PlaceInternalArgs {
  kiosk: ObjectArg
  t0: GenericArg
}

export function placeInternal(txb: TransactionBlock, typeArg: string, args: PlaceInternalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place_internal`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.kiosk), generic(txb, `${typeArg}`, args.t0)],
  })
}

export function uidMutInternal(txb: TransactionBlock, kiosk: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::uid_mut_internal`,
    arguments: [obj(txb, kiosk)],
  })
}

export interface HasItemArgs {
  kiosk: ObjectArg
  id: string | TransactionArgument
}

export function hasItem(txb: TransactionBlock, args: HasItemArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_item`,
    arguments: [obj(txb, args.kiosk), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface HasItemWithTypeArgs {
  kiosk: ObjectArg
  id: string | TransactionArgument
}

export function hasItemWithType(txb: TransactionBlock, typeArg: string, args: HasItemWithTypeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_item_with_type`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.kiosk), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface IsLockedArgs {
  kiosk: ObjectArg
  id: string | TransactionArgument
}

export function isLocked(txb: TransactionBlock, args: IsLockedArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_locked`,
    arguments: [obj(txb, args.kiosk), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface IsListedArgs {
  kiosk: ObjectArg
  id: string | TransactionArgument
}

export function isListed(txb: TransactionBlock, args: IsListedArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_listed`,
    arguments: [obj(txb, args.kiosk), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface IsListedExclusivelyArgs {
  kiosk: ObjectArg
  id: string | TransactionArgument
}

export function isListedExclusively(txb: TransactionBlock, args: IsListedExclusivelyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_listed_exclusively`,
    arguments: [obj(txb, args.kiosk), pure(txb, args.id, `0x2::object::ID`)],
  })
}

export interface HasAccessArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
}

export function hasAccess(txb: TransactionBlock, args: HasAccessArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_access`,
    arguments: [obj(txb, args.kiosk), obj(txb, args.kioskOwnerCap)],
  })
}

export interface SetAllowExtensionsArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  bool: boolean | TransactionArgument
}

export function setAllowExtensions(txb: TransactionBlock, args: SetAllowExtensionsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_allow_extensions`,
    arguments: [obj(txb, args.kiosk), obj(txb, args.kioskOwnerCap), pure(txb, args.bool, `bool`)],
  })
}

export function uidMut(txb: TransactionBlock, kiosk: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::kiosk::uid_mut`, arguments: [obj(txb, kiosk)] })
}

export function itemCount(txb: TransactionBlock, kiosk: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::item_count`,
    arguments: [obj(txb, kiosk)],
  })
}

export function profitsAmount(txb: TransactionBlock, kiosk: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::profits_amount`,
    arguments: [obj(txb, kiosk)],
  })
}

export interface ProfitsMutArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
}

export function profitsMut(txb: TransactionBlock, args: ProfitsMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::profits_mut`,
    arguments: [obj(txb, args.kiosk), obj(txb, args.kioskOwnerCap)],
  })
}

export interface BorrowValArgs {
  kiosk: ObjectArg
  kioskOwnerCap: ObjectArg
  id: string | TransactionArgument
}

export function borrowVal(txb: TransactionBlock, typeArg: string, args: BorrowValArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow_val`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.kiosk),
      obj(txb, args.kioskOwnerCap),
      pure(txb, args.id, `0x2::object::ID`),
    ],
  })
}

export interface ReturnValArgs {
  kiosk: ObjectArg
  t0: GenericArg
  borrow: ObjectArg
}

export function returnVal(txb: TransactionBlock, typeArg: string, args: ReturnValArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::return_val`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.kiosk), generic(txb, `${typeArg}`, args.t0), obj(txb, args.borrow)],
  })
}

export function kioskOwnerCapFor(txb: TransactionBlock, kioskOwnerCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::kiosk_owner_cap_for`,
    arguments: [obj(txb, kioskOwnerCap)],
  })
}

export function purchaseCapKiosk(txb: TransactionBlock, typeArg: string, purchaseCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_kiosk`,
    typeArguments: [typeArg],
    arguments: [obj(txb, purchaseCap)],
  })
}

export function purchaseCapItem(txb: TransactionBlock, typeArg: string, purchaseCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_item`,
    typeArguments: [typeArg],
    arguments: [obj(txb, purchaseCap)],
  })
}

export function purchaseCapMinPrice(
  txb: TransactionBlock,
  typeArg: string,
  purchaseCap: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_min_price`,
    typeArguments: [typeArg],
    arguments: [obj(txb, purchaseCap)],
  })
}
