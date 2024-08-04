import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, option, pure } from '../../_framework/util'
import { String as String1 } from '../../move-stdlib-chain/ascii/structs'
import { String } from '../../move-stdlib-chain/string/structs'
import { Url } from '../url/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function balance(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export function value(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export function zero(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface JoinArgs {
  coin1: TransactionObjectInput
  coin2: TransactionObjectInput
}

export function join(tx: Transaction, typeArg: string, args: JoinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::join`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin1), obj(tx, args.coin2)],
  })
}

export interface SplitArgs {
  coin: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function split(tx: Transaction, typeArg: string, args: SplitArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin), pure(tx, args.u64, `u64`)],
  })
}

export function destroyZero(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export function totalSupply(tx: Transaction, typeArg: string, treasuryCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::total_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasuryCap)],
  })
}

export function treasuryIntoSupply(
  tx: Transaction,
  typeArg: string,
  treasuryCap: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::treasury_into_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasuryCap)],
  })
}

export function supplyImmut(tx: Transaction, typeArg: string, treasuryCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::supply_immut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasuryCap)],
  })
}

export function supplyMut(tx: Transaction, typeArg: string, treasuryCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::supply_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasuryCap)],
  })
}

export function balanceMut(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::balance_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export function fromBalance(tx: Transaction, typeArg: string, balance: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::from_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, balance)],
  })
}

export function intoBalance(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::into_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export interface TakeArgs {
  balance: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function take(tx: Transaction, typeArg: string, args: TakeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::take`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.balance), pure(tx, args.u64, `u64`)],
  })
}

export interface PutArgs {
  balance: TransactionObjectInput
  coin: TransactionObjectInput
}

export function put(tx: Transaction, typeArg: string, args: PutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::put`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.balance), obj(tx, args.coin)],
  })
}

export interface DivideIntoNArgs {
  coin: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function divideIntoN(tx: Transaction, typeArg: string, args: DivideIntoNArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::divide_into_n`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin), pure(tx, args.u64, `u64`)],
  })
}

export interface CreateCurrencyArgs {
  t0: GenericArg
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  option: TransactionObjectInput | TransactionArgument | null
}

export function createCurrency(tx: Transaction, typeArg: string, args: CreateCurrencyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::create_currency`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.t0),
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      option(tx, `${Url.$typeName}`, args.option),
    ],
  })
}

export interface CreateRegulatedCurrencyV2Args {
  t0: GenericArg
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  option: TransactionObjectInput | TransactionArgument | null
  bool: boolean | TransactionArgument
}

export function createRegulatedCurrencyV2(
  tx: Transaction,
  typeArg: string,
  args: CreateRegulatedCurrencyV2Args
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::create_regulated_currency_v2`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.t0),
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      option(tx, `${Url.$typeName}`, args.option),
      pure(tx, args.bool, `bool`),
    ],
  })
}

export interface MigrateRegulatedCurrencyToV2Args {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
  bool: boolean | TransactionArgument
}

export function migrateRegulatedCurrencyToV2(
  tx: Transaction,
  typeArg: string,
  args: MigrateRegulatedCurrencyToV2Args
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::migrate_regulated_currency_to_v2`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), obj(tx, args.denyCap), pure(tx, args.bool, `bool`)],
  })
}

export interface MintArgs {
  treasuryCap: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function mint(tx: Transaction, typeArg: string, args: MintArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::mint`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.treasuryCap), pure(tx, args.u64, `u64`)],
  })
}

export interface MintBalanceArgs {
  treasuryCap: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function mintBalance(tx: Transaction, typeArg: string, args: MintBalanceArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::mint_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.treasuryCap), pure(tx, args.u64, `u64`)],
  })
}

export interface BurnArgs {
  treasuryCap: TransactionObjectInput
  coin: TransactionObjectInput
}

export function burn(tx: Transaction, typeArg: string, args: BurnArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::burn`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.treasuryCap), obj(tx, args.coin)],
  })
}

export interface DenyListV2AddArgs {
  denyList: TransactionObjectInput
  denyCapV2: TransactionObjectInput
  address: string | TransactionArgument
}

export function denyListV2Add(tx: Transaction, typeArg: string, args: DenyListV2AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_v2_add`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), obj(tx, args.denyCapV2), pure(tx, args.address, `address`)],
  })
}

export interface DenyListV2RemoveArgs {
  denyList: TransactionObjectInput
  denyCapV2: TransactionObjectInput
  address: string | TransactionArgument
}

export function denyListV2Remove(tx: Transaction, typeArg: string, args: DenyListV2RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_v2_remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), obj(tx, args.denyCapV2), pure(tx, args.address, `address`)],
  })
}

export interface DenyListV2ContainsCurrentEpochArgs {
  denyList: TransactionObjectInput
  address: string | TransactionArgument
}

export function denyListV2ContainsCurrentEpoch(
  tx: Transaction,
  typeArg: string,
  args: DenyListV2ContainsCurrentEpochArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_v2_contains_current_epoch`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), pure(tx, args.address, `address`)],
  })
}

export interface DenyListV2ContainsNextEpochArgs {
  denyList: TransactionObjectInput
  address: string | TransactionArgument
}

export function denyListV2ContainsNextEpoch(
  tx: Transaction,
  typeArg: string,
  args: DenyListV2ContainsNextEpochArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_v2_contains_next_epoch`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), pure(tx, args.address, `address`)],
  })
}

export interface DenyListV2EnableGlobalPauseArgs {
  denyList: TransactionObjectInput
  denyCapV2: TransactionObjectInput
}

export function denyListV2EnableGlobalPause(
  tx: Transaction,
  typeArg: string,
  args: DenyListV2EnableGlobalPauseArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_v2_enable_global_pause`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), obj(tx, args.denyCapV2)],
  })
}

export interface DenyListV2DisableGlobalPauseArgs {
  denyList: TransactionObjectInput
  denyCapV2: TransactionObjectInput
}

export function denyListV2DisableGlobalPause(
  tx: Transaction,
  typeArg: string,
  args: DenyListV2DisableGlobalPauseArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_v2_disable_global_pause`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), obj(tx, args.denyCapV2)],
  })
}

export function denyListV2IsGlobalPauseEnabledCurrentEpoch(
  tx: Transaction,
  typeArg: string,
  denyList: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_v2_is_global_pause_enabled_current_epoch`,
    typeArguments: [typeArg],
    arguments: [obj(tx, denyList)],
  })
}

export function denyListV2IsGlobalPauseEnabledNextEpoch(
  tx: Transaction,
  typeArg: string,
  denyList: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_v2_is_global_pause_enabled_next_epoch`,
    typeArguments: [typeArg],
    arguments: [obj(tx, denyList)],
  })
}

export interface MintAndTransferArgs {
  treasuryCap: TransactionObjectInput
  u64: bigint | TransactionArgument
  address: string | TransactionArgument
}

export function mintAndTransfer(tx: Transaction, typeArg: string, args: MintAndTransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::mint_and_transfer`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasuryCap),
      pure(tx, args.u64, `u64`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface UpdateNameArgs {
  treasuryCap: TransactionObjectInput
  coinMetadata: TransactionObjectInput
  string: string | TransactionArgument
}

export function updateName(tx: Transaction, typeArg: string, args: UpdateNameArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::update_name`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasuryCap),
      obj(tx, args.coinMetadata),
      pure(tx, args.string, `${String.$typeName}`),
    ],
  })
}

export interface UpdateSymbolArgs {
  treasuryCap: TransactionObjectInput
  coinMetadata: TransactionObjectInput
  string: string | TransactionArgument
}

export function updateSymbol(tx: Transaction, typeArg: string, args: UpdateSymbolArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::update_symbol`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasuryCap),
      obj(tx, args.coinMetadata),
      pure(tx, args.string, `${String1.$typeName}`),
    ],
  })
}

export interface UpdateDescriptionArgs {
  treasuryCap: TransactionObjectInput
  coinMetadata: TransactionObjectInput
  string: string | TransactionArgument
}

export function updateDescription(tx: Transaction, typeArg: string, args: UpdateDescriptionArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::update_description`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasuryCap),
      obj(tx, args.coinMetadata),
      pure(tx, args.string, `${String.$typeName}`),
    ],
  })
}

export interface UpdateIconUrlArgs {
  treasuryCap: TransactionObjectInput
  coinMetadata: TransactionObjectInput
  string: string | TransactionArgument
}

export function updateIconUrl(tx: Transaction, typeArg: string, args: UpdateIconUrlArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::update_icon_url`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasuryCap),
      obj(tx, args.coinMetadata),
      pure(tx, args.string, `${String1.$typeName}`),
    ],
  })
}

export function getDecimals(
  tx: Transaction,
  typeArg: string,
  coinMetadata: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::get_decimals`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coinMetadata)],
  })
}

export function getName(tx: Transaction, typeArg: string, coinMetadata: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::get_name`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coinMetadata)],
  })
}

export function getSymbol(tx: Transaction, typeArg: string, coinMetadata: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::get_symbol`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coinMetadata)],
  })
}

export function getDescription(
  tx: Transaction,
  typeArg: string,
  coinMetadata: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::get_description`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coinMetadata)],
  })
}

export function getIconUrl(tx: Transaction, typeArg: string, coinMetadata: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::get_icon_url`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coinMetadata)],
  })
}

export function supply(tx: Transaction, typeArg: string, treasuryCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasuryCap)],
  })
}

export interface CreateRegulatedCurrencyArgs {
  t0: GenericArg
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  option: TransactionObjectInput | TransactionArgument | null
}

export function createRegulatedCurrency(
  tx: Transaction,
  typeArg: string,
  args: CreateRegulatedCurrencyArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::create_regulated_currency`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.t0),
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      option(tx, `${Url.$typeName}`, args.option),
    ],
  })
}

export interface DenyListAddArgs {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
  address: string | TransactionArgument
}

export function denyListAdd(tx: Transaction, typeArg: string, args: DenyListAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_add`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), obj(tx, args.denyCap), pure(tx, args.address, `address`)],
  })
}

export interface DenyListRemoveArgs {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
  address: string | TransactionArgument
}

export function denyListRemove(tx: Transaction, typeArg: string, args: DenyListRemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), obj(tx, args.denyCap), pure(tx, args.address, `address`)],
  })
}

export interface DenyListContainsArgs {
  denyList: TransactionObjectInput
  address: string | TransactionArgument
}

export function denyListContains(tx: Transaction, typeArg: string, args: DenyListContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_contains`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), pure(tx, args.address, `address`)],
  })
}
