import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Option } from '../../move-stdlib-chain/option/structs'
import { ID } from '../object/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function default_(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::default`, arguments: [] })
}

export function new_(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::new`, arguments: [] })
}

export interface CloseAndWithdrawArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
}

export function closeAndWithdraw(tx: Transaction, args: CloseAndWithdrawArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::close_and_withdraw`,
    arguments: [obj(tx, args.kiosk), obj(tx, args.kioskOwnerCap)],
  })
}

export interface SetOwnerArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
}

export function setOwner(tx: Transaction, args: SetOwnerArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_owner`,
    arguments: [obj(tx, args.kiosk), obj(tx, args.kioskOwnerCap)],
  })
}

export interface SetOwnerCustomArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  address: string | TransactionArgument
}

export function setOwnerCustom(tx: Transaction, args: SetOwnerCustomArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_owner_custom`,
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface PlaceArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  t0: GenericArg
}

export function place(tx: Transaction, typeArg: string, args: PlaceArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      generic(tx, `${typeArg}`, args.t0),
    ],
  })
}

export interface LockArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  transferPolicy: TransactionObjectInput
  t0: GenericArg
}

export function lock(tx: Transaction, typeArg: string, args: LockArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::lock`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      obj(tx, args.transferPolicy),
      generic(tx, `${typeArg}`, args.t0),
    ],
  })
}

export interface TakeArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  id: string | TransactionArgument
}

export function take(tx: Transaction, typeArg: string, args: TakeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::take`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface ListArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  id: string | TransactionArgument
  u64: bigint | TransactionArgument
}

export function list(tx: Transaction, typeArg: string, args: ListArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::list`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      pure(tx, args.id, `${ID.$typeName}`),
      pure(tx, args.u64, `u64`),
    ],
  })
}

export interface PlaceAndListArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  t0: GenericArg
  u64: bigint | TransactionArgument
}

export function placeAndList(tx: Transaction, typeArg: string, args: PlaceAndListArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place_and_list`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      generic(tx, `${typeArg}`, args.t0),
      pure(tx, args.u64, `u64`),
    ],
  })
}

export interface DelistArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  id: string | TransactionArgument
}

export function delist(tx: Transaction, typeArg: string, args: DelistArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::delist`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface PurchaseArgs {
  kiosk: TransactionObjectInput
  id: string | TransactionArgument
  coin: TransactionObjectInput
}

export function purchase(tx: Transaction, typeArg: string, args: PurchaseArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.kiosk), pure(tx, args.id, `${ID.$typeName}`), obj(tx, args.coin)],
  })
}

export interface ListWithPurchaseCapArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  id: string | TransactionArgument
  u64: bigint | TransactionArgument
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
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      pure(tx, args.id, `${ID.$typeName}`),
      pure(tx, args.u64, `u64`),
    ],
  })
}

export interface PurchaseWithCapArgs {
  kiosk: TransactionObjectInput
  purchaseCap: TransactionObjectInput
  coin: TransactionObjectInput
}

export function purchaseWithCap(tx: Transaction, typeArg: string, args: PurchaseWithCapArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_with_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.kiosk), obj(tx, args.purchaseCap), obj(tx, args.coin)],
  })
}

export interface ReturnPurchaseCapArgs {
  kiosk: TransactionObjectInput
  purchaseCap: TransactionObjectInput
}

export function returnPurchaseCap(tx: Transaction, typeArg: string, args: ReturnPurchaseCapArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::return_purchase_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.kiosk), obj(tx, args.purchaseCap)],
  })
}

export interface WithdrawArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  option: bigint | TransactionArgument | TransactionArgument | null
}

export function withdraw(tx: Transaction, args: WithdrawArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::withdraw`,
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      pure(tx, args.option, `${Option.$typeName}<u64>`),
    ],
  })
}

export interface LockInternalArgs {
  kiosk: TransactionObjectInput
  t0: GenericArg
}

export function lockInternal(tx: Transaction, typeArg: string, args: LockInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::lock_internal`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.kiosk), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface PlaceInternalArgs {
  kiosk: TransactionObjectInput
  t0: GenericArg
}

export function placeInternal(tx: Transaction, typeArg: string, args: PlaceInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::place_internal`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.kiosk), generic(tx, `${typeArg}`, args.t0)],
  })
}

export function uidMutInternal(tx: Transaction, kiosk: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::uid_mut_internal`,
    arguments: [obj(tx, kiosk)],
  })
}

export interface HasItemArgs {
  kiosk: TransactionObjectInput
  id: string | TransactionArgument
}

export function hasItem(tx: Transaction, args: HasItemArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_item`,
    arguments: [obj(tx, args.kiosk), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface HasItemWithTypeArgs {
  kiosk: TransactionObjectInput
  id: string | TransactionArgument
}

export function hasItemWithType(tx: Transaction, typeArg: string, args: HasItemWithTypeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_item_with_type`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.kiosk), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface IsLockedArgs {
  kiosk: TransactionObjectInput
  id: string | TransactionArgument
}

export function isLocked(tx: Transaction, args: IsLockedArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_locked`,
    arguments: [obj(tx, args.kiosk), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface IsListedArgs {
  kiosk: TransactionObjectInput
  id: string | TransactionArgument
}

export function isListed(tx: Transaction, args: IsListedArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_listed`,
    arguments: [obj(tx, args.kiosk), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface IsListedExclusivelyArgs {
  kiosk: TransactionObjectInput
  id: string | TransactionArgument
}

export function isListedExclusively(tx: Transaction, args: IsListedExclusivelyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::is_listed_exclusively`,
    arguments: [obj(tx, args.kiosk), pure(tx, args.id, `${ID.$typeName}`)],
  })
}

export interface HasAccessArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
}

export function hasAccess(tx: Transaction, args: HasAccessArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::has_access`,
    arguments: [obj(tx, args.kiosk), obj(tx, args.kioskOwnerCap)],
  })
}

export interface UidMutAsOwnerArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
}

export function uidMutAsOwner(tx: Transaction, args: UidMutAsOwnerArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::uid_mut_as_owner`,
    arguments: [obj(tx, args.kiosk), obj(tx, args.kioskOwnerCap)],
  })
}

export interface SetAllowExtensionsArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  bool: boolean | TransactionArgument
}

export function setAllowExtensions(tx: Transaction, args: SetAllowExtensionsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::set_allow_extensions`,
    arguments: [obj(tx, args.kiosk), obj(tx, args.kioskOwnerCap), pure(tx, args.bool, `bool`)],
  })
}

export function uid(tx: Transaction, kiosk: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::uid`, arguments: [obj(tx, kiosk)] })
}

export function uidMut(tx: Transaction, kiosk: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::uid_mut`, arguments: [obj(tx, kiosk)] })
}

export function owner(tx: Transaction, kiosk: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::owner`, arguments: [obj(tx, kiosk)] })
}

export function itemCount(tx: Transaction, kiosk: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::kiosk::item_count`, arguments: [obj(tx, kiosk)] })
}

export function profitsAmount(tx: Transaction, kiosk: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::profits_amount`,
    arguments: [obj(tx, kiosk)],
  })
}

export interface ProfitsMutArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
}

export function profitsMut(tx: Transaction, args: ProfitsMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::profits_mut`,
    arguments: [obj(tx, args.kiosk), obj(tx, args.kioskOwnerCap)],
  })
}

export interface BorrowArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  id: string | TransactionArgument
}

export function borrow(tx: Transaction, typeArg: string, args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface BorrowMutArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  id: string | TransactionArgument
}

export function borrowMut(tx: Transaction, typeArg: string, args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface BorrowValArgs {
  kiosk: TransactionObjectInput
  kioskOwnerCap: TransactionObjectInput
  id: string | TransactionArgument
}

export function borrowVal(tx: Transaction, typeArg: string, args: BorrowValArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::borrow_val`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.kiosk),
      obj(tx, args.kioskOwnerCap),
      pure(tx, args.id, `${ID.$typeName}`),
    ],
  })
}

export interface ReturnValArgs {
  kiosk: TransactionObjectInput
  t0: GenericArg
  borrow: TransactionObjectInput
}

export function returnVal(tx: Transaction, typeArg: string, args: ReturnValArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::return_val`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.kiosk), generic(tx, `${typeArg}`, args.t0), obj(tx, args.borrow)],
  })
}

export function kioskOwnerCapFor(tx: Transaction, kioskOwnerCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::kiosk_owner_cap_for`,
    arguments: [obj(tx, kioskOwnerCap)],
  })
}

export function purchaseCapKiosk(
  tx: Transaction,
  typeArg: string,
  purchaseCap: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_kiosk`,
    typeArguments: [typeArg],
    arguments: [obj(tx, purchaseCap)],
  })
}

export function purchaseCapItem(
  tx: Transaction,
  typeArg: string,
  purchaseCap: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_item`,
    typeArguments: [typeArg],
    arguments: [obj(tx, purchaseCap)],
  })
}

export function purchaseCapMinPrice(
  tx: Transaction,
  typeArg: string,
  purchaseCap: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::kiosk::purchase_cap_min_price`,
    typeArguments: [typeArg],
    arguments: [obj(tx, purchaseCap)],
  })
}
