import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AddPerTypeConfigArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function addPerTypeConfig(tx: Transaction, args: AddPerTypeConfigArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::add_per_type_config`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export interface BorrowPerTypeConfigArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function borrowPerTypeConfig(tx: Transaction, args: BorrowPerTypeConfigArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::borrow_per_type_config`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export interface BorrowPerTypeConfigMutArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function borrowPerTypeConfigMut(tx: Transaction, args: BorrowPerTypeConfigMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::borrow_per_type_config_mut`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export function create(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::deny_list::create`, arguments: [] })
}

export interface MigrateV1ToV2Args {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function migrateV1ToV2(tx: Transaction, args: MigrateV1ToV2Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::migrate_v1_to_v2`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export interface PerTypeExistsArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function perTypeExists(tx: Transaction, args: PerTypeExistsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::per_type_exists`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export function perTypeList(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::deny_list::per_type_list`, arguments: [] })
}

export interface V1AddArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function v1Add(tx: Transaction, args: V1AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v1_add`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface V1ContainsArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function v1Contains(tx: Transaction, args: V1ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v1_contains`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface V1PerTypeListAddArgs {
  perTypeList: TransactionObjectInput
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function v1PerTypeListAdd(tx: Transaction, args: V1PerTypeListAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v1_per_type_list_add`,
    arguments: [
      obj(tx, args.perTypeList),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface V1PerTypeListContainsArgs {
  perTypeList: TransactionObjectInput
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function v1PerTypeListContains(tx: Transaction, args: V1PerTypeListContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v1_per_type_list_contains`,
    arguments: [
      obj(tx, args.perTypeList),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface V1PerTypeListRemoveArgs {
  perTypeList: TransactionObjectInput
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function v1PerTypeListRemove(tx: Transaction, args: V1PerTypeListRemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v1_per_type_list_remove`,
    arguments: [
      obj(tx, args.perTypeList),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface V1RemoveArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function v1Remove(tx: Transaction, args: V1RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v1_remove`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface V2AddArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function v2Add(tx: Transaction, args: V2AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v2_add`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface V2ContainsCurrentEpochArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function v2ContainsCurrentEpoch(tx: Transaction, args: V2ContainsCurrentEpochArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v2_contains_current_epoch`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface V2ContainsNextEpochArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function v2ContainsNextEpoch(tx: Transaction, args: V2ContainsNextEpochArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v2_contains_next_epoch`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface V2DisableGlobalPauseArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function v2DisableGlobalPause(tx: Transaction, args: V2DisableGlobalPauseArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v2_disable_global_pause`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export interface V2EnableGlobalPauseArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function v2EnableGlobalPause(tx: Transaction, args: V2EnableGlobalPauseArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v2_enable_global_pause`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export interface V2IsGlobalPauseEnabledCurrentEpochArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function v2IsGlobalPauseEnabledCurrentEpoch(
  tx: Transaction,
  args: V2IsGlobalPauseEnabledCurrentEpochArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v2_is_global_pause_enabled_current_epoch`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export interface V2IsGlobalPauseEnabledNextEpochArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function v2IsGlobalPauseEnabledNextEpoch(
  tx: Transaction,
  args: V2IsGlobalPauseEnabledNextEpochArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v2_is_global_pause_enabled_next_epoch`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export interface V2RemoveArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function v2Remove(tx: Transaction, args: V2RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::v2_remove`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}
