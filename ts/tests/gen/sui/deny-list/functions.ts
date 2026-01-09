import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

export interface V2AddArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function v2Add(tx: Transaction, args: V2AddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v2_add`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface V2RemoveArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function v2Remove(tx: Transaction, args: V2RemoveArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v2_remove`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface V2ContainsCurrentEpochArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function v2ContainsCurrentEpoch(
  tx: Transaction,
  args: V2ContainsCurrentEpochArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v2_contains_current_epoch`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface V2ContainsNextEpochArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function v2ContainsNextEpoch(
  tx: Transaction,
  args: V2ContainsNextEpochArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v2_contains_next_epoch`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface V2EnableGlobalPauseArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
}

export function v2EnableGlobalPause(
  tx: Transaction,
  args: V2EnableGlobalPauseArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v2_enable_global_pause`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
    ],
  })
}

export interface V2DisableGlobalPauseArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
}

export function v2DisableGlobalPause(
  tx: Transaction,
  args: V2DisableGlobalPauseArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v2_disable_global_pause`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
    ],
  })
}

export interface V2IsGlobalPauseEnabledCurrentEpochArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
}

export function v2IsGlobalPauseEnabledCurrentEpoch(
  tx: Transaction,
  args: V2IsGlobalPauseEnabledCurrentEpochArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v2_is_global_pause_enabled_current_epoch`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
    ],
  })
}

export interface V2IsGlobalPauseEnabledNextEpochArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
}

export function v2IsGlobalPauseEnabledNextEpoch(
  tx: Transaction,
  args: V2IsGlobalPauseEnabledNextEpochArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v2_is_global_pause_enabled_next_epoch`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
    ],
  })
}

export interface MigrateV1ToV2Args {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
}

export function migrateV1ToV2(tx: Transaction, args: MigrateV1ToV2Args): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::migrate_v1_to_v2`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
    ],
  })
}

export interface AddPerTypeConfigArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
}

export function addPerTypeConfig(tx: Transaction, args: AddPerTypeConfigArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::add_per_type_config`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
    ],
  })
}

export interface BorrowPerTypeConfigMutArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
}

export function borrowPerTypeConfigMut(
  tx: Transaction,
  args: BorrowPerTypeConfigMutArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::borrow_per_type_config_mut`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
    ],
  })
}

export interface BorrowPerTypeConfigArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
}

export function borrowPerTypeConfig(
  tx: Transaction,
  args: BorrowPerTypeConfigArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::borrow_per_type_config`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
    ],
  })
}

export interface PerTypeExistsArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  perTypeKey: Array<number | TransactionArgument> | TransactionArgument
}

export function perTypeExists(tx: Transaction, args: PerTypeExistsArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::per_type_exists`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.perTypeKey, `vector<u8>`),
    ],
  })
}

export interface V1AddArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

/**
 * Adds the given address to the deny list of the specified type, preventing it
 * from interacting with instances of that type as an input to a transaction. For coins,
 * the type specified is the type of the coin, not the coin type itself. For example,
 * "00...0123::my_coin::MY_COIN" would be the type, not "00...02::coin::Coin".
 */
export function v1Add(tx: Transaction, args: V1AddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v1_add`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface V1PerTypeListAddArgs {
  list: TransactionObjectInput
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function v1PerTypeListAdd(tx: Transaction, args: V1PerTypeListAddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v1_per_type_list_add`,
    arguments: [
      obj(tx, args.list),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface V1RemoveArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

/**
 * Removes a previously denied address from the list.
 * Aborts with `ENotDenied` if the address is not on the list.
 */
export function v1Remove(tx: Transaction, args: V1RemoveArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v1_remove`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface V1PerTypeListRemoveArgs {
  list: TransactionObjectInput
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function v1PerTypeListRemove(
  tx: Transaction,
  args: V1PerTypeListRemoveArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v1_per_type_list_remove`,
    arguments: [
      obj(tx, args.list),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface V1ContainsArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

/** Returns true iff the given address is denied for the given type. */
export function v1Contains(tx: Transaction, args: V1ContainsArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v1_contains`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface V1PerTypeListContainsArgs {
  list: TransactionObjectInput
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function v1PerTypeListContains(
  tx: Transaction,
  args: V1PerTypeListContainsArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::v1_per_type_list_contains`,
    arguments: [
      obj(tx, args.list),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

/**
 * Creation of the deny list object is restricted to the system address
 * via a system transaction.
 */
export function create(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::create`,
    arguments: [],
  })
}

export function perTypeList(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::deny_list::per_type_list`,
    arguments: [],
  })
}
