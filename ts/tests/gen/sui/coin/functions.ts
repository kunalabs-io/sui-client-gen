import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, option, pure } from '../../_framework/util'
import { String as String1 } from '../../std/ascii/structs'
import { String } from '../../std/string/structs'
import { Url } from '../url/structs'

/** Return the total number of `T`'s in circulation. */
export function totalSupply(
  tx: Transaction,
  typeArg: string,
  cap: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::total_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, cap)],
  })
}

/**
 * Unwrap `TreasuryCap` getting the `Supply`.
 *
 * Operation is irreversible. Supply cannot be converted into a `TreasuryCap` due
 * to different security guarantees (TreasuryCap can be created only once for a type)
 */
export function treasuryIntoSupply(
  tx: Transaction,
  typeArg: string,
  treasury: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::treasury_into_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasury)],
  })
}

/** Get immutable reference to the treasury's `Supply`. */
export function supplyImmut(
  tx: Transaction,
  typeArg: string,
  treasury: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::supply_immut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasury)],
  })
}

/** Get mutable reference to the treasury's `Supply`. */
export function supplyMut(
  tx: Transaction,
  typeArg: string,
  treasury: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::supply_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasury)],
  })
}

/** Public getter for the coin's value */
export function value(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Get immutable reference to the balance of a coin. */
export function balance(
  tx: Transaction,
  typeArg: string,
  coin: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

/** Get a mutable reference to the balance of a coin. */
export function balanceMut(
  tx: Transaction,
  typeArg: string,
  coin: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::balance_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

/** Wrap a balance into a Coin to make it transferable. */
export function fromBalance(
  tx: Transaction,
  typeArg: string,
  balance: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::from_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, balance)],
  })
}

/** Destruct a Coin wrapper and keep the balance. */
export function intoBalance(
  tx: Transaction,
  typeArg: string,
  coin: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::into_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export interface TakeArgs {
  balance: TransactionObjectInput
  value: bigint | TransactionArgument
}

/**
 * Take a `Coin` worth of `value` from `Balance`.
 * Aborts if `value > balance.value`
 */
export function take(tx: Transaction, typeArg: string, args: TakeArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::take`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.balance),
      pure(tx, args.value, `u64`),
    ],
  })
}

export interface PutArgs {
  balance: TransactionObjectInput
  coin: TransactionObjectInput
}

/** Put a `Coin<T>` to the `Balance<T>`. */
export function put(tx: Transaction, typeArg: string, args: PutArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::put`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.balance),
      obj(tx, args.coin),
    ],
  })
}

/** Redeem a `Withdrawal<Balance<T>>` and create a `Coin<T>` from the withdrawn Balance<T>. */
export function redeemFunds(
  tx: Transaction,
  typeArg: string,
  withdrawal: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::redeem_funds`,
    typeArguments: [typeArg],
    arguments: [obj(tx, withdrawal)],
  })
}

export interface SendFundsArgs {
  coin: TransactionObjectInput
  recipient: string | TransactionArgument
}

/** Send a coin to an address balance */
export function sendFunds(
  tx: Transaction,
  typeArg: string,
  args: SendFundsArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::send_funds`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.coin),
      pure(tx, args.recipient, `address`),
    ],
  })
}

export interface JoinArgs {
  self: TransactionObjectInput
  c: TransactionObjectInput
}

/**
 * Consume the coin `c` and add its value to `self`.
 * Aborts if `c.value + self.value > U64_MAX`
 */
export function join(tx: Transaction, typeArg: string, args: JoinArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::join`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.c),
    ],
  })
}

export interface SplitArgs {
  self: TransactionObjectInput
  splitAmount: bigint | TransactionArgument
}

/**
 * Split coin `self` to two coins, one with balance `split_amount`,
 * and the remaining balance is left is `self`.
 */
export function split(tx: Transaction, typeArg: string, args: SplitArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::split`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.splitAmount, `u64`),
    ],
  })
}

export interface DivideIntoNArgs {
  self: TransactionObjectInput
  n: bigint | TransactionArgument
}

/**
 * Split coin `self` into `n - 1` coins with equal balances. The remainder is left in
 * `self`. Return newly created coins.
 */
export function divideIntoN(
  tx: Transaction,
  typeArg: string,
  args: DivideIntoNArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::divide_into_n`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.n, `u64`),
    ],
  })
}

/**
 * Make any Coin with a zero value. Useful for placeholding
 * bids/payments or preemptively making empty balances.
 */
export function zero(tx: Transaction, typeArg: string): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

/** Destroy a coin with value zero */
export function destroyZero(
  tx: Transaction,
  typeArg: string,
  c: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(tx, c)],
  })
}

export interface CreateCurrencyArgs {
  witness: GenericArg
  decimals: number | TransactionArgument
  symbol: Array<number | TransactionArgument> | TransactionArgument
  name: Array<number | TransactionArgument> | TransactionArgument
  description: Array<number | TransactionArgument> | TransactionArgument
  iconUrl: TransactionObjectInput | null
}

/**
 * Create a new currency type `T` as and return the `TreasuryCap` for
 * `T` to the caller. Can only be called with a `one-time-witness`
 * type, ensuring that there's only one `TreasuryCap` per `T`.
 *
 * @deprecated Use `coin_registry::new_currency_with_otw` instead
 */
export function createCurrency(
  tx: Transaction,
  typeArg: string,
  args: CreateCurrencyArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::create_currency`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.witness),
      pure(tx, args.decimals, `u8`),
      pure(tx, args.symbol, `vector<u8>`),
      pure(tx, args.name, `vector<u8>`),
      pure(tx, args.description, `vector<u8>`),
      option(tx, `${Url.$typeName}`, args.iconUrl),
    ],
  })
}

export interface CreateRegulatedCurrencyV2Args {
  witness: GenericArg
  decimals: number | TransactionArgument
  symbol: Array<number | TransactionArgument> | TransactionArgument
  name: Array<number | TransactionArgument> | TransactionArgument
  description: Array<number | TransactionArgument> | TransactionArgument
  iconUrl: TransactionObjectInput | null
  allowGlobalPause: boolean | TransactionArgument
}

/**
 * This creates a new currency, via `create_currency`, but with an extra capability that
 * allows for specific addresses to have their coins frozen. When an address is added to the
 * deny list, it is immediately unable to interact with the currency's coin as input objects.
 * Additionally at the start of the next epoch, they will be unable to receive the currency's
 * coin.
 * The `allow_global_pause` flag enables an additional API that will cause all addresses to
 * be denied. Note however, that this doesn't affect per-address entries of the deny list and
 * will not change the result of the "contains" APIs.
 *
 * @deprecated Use `coin_registry::new_currency_with_otw` with `make_regulated` instead
 */
export function createRegulatedCurrencyV2(
  tx: Transaction,
  typeArg: string,
  args: CreateRegulatedCurrencyV2Args,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::create_regulated_currency_v2`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.witness),
      pure(tx, args.decimals, `u8`),
      pure(tx, args.symbol, `vector<u8>`),
      pure(tx, args.name, `vector<u8>`),
      pure(tx, args.description, `vector<u8>`),
      option(tx, `${Url.$typeName}`, args.iconUrl),
      pure(tx, args.allowGlobalPause, `bool`),
    ],
  })
}

export interface MigrateRegulatedCurrencyToV2Args {
  denyList: TransactionObjectInput
  cap: TransactionObjectInput
  allowGlobalPause: boolean | TransactionArgument
}

/**
 * Given the `DenyCap` for a regulated currency, migrate it to the new `DenyCapV2` type.
 * All entries in the deny list will be migrated to the new format.
 * See `create_regulated_currency_v2` for details on the new v2 of the deny list.
 */
export function migrateRegulatedCurrencyToV2(
  tx: Transaction,
  typeArg: string,
  args: MigrateRegulatedCurrencyToV2Args,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::migrate_regulated_currency_to_v2`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.denyList),
      obj(tx, args.cap),
      pure(tx, args.allowGlobalPause, `bool`),
    ],
  })
}

export interface MintArgs {
  cap: TransactionObjectInput
  value: bigint | TransactionArgument
}

/**
 * Create a coin worth `value` and increase the total supply
 * in `cap` accordingly.
 */
export function mint(tx: Transaction, typeArg: string, args: MintArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::mint`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.cap),
      pure(tx, args.value, `u64`),
    ],
  })
}

export interface MintBalanceArgs {
  cap: TransactionObjectInput
  value: bigint | TransactionArgument
}

/**
 * Mint some amount of T as a `Balance` and increase the total
 * supply in `cap` accordingly.
 * Aborts if `value` + `cap.total_supply` >= U64_MAX
 */
export function mintBalance(
  tx: Transaction,
  typeArg: string,
  args: MintBalanceArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::mint_balance`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.cap),
      pure(tx, args.value, `u64`),
    ],
  })
}

export interface BurnArgs {
  cap: TransactionObjectInput
  c: TransactionObjectInput
}

/**
 * Destroy the coin `c` and decrease the total supply in `cap`
 * accordingly.
 */
export function burn(tx: Transaction, typeArg: string, args: BurnArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::burn`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.cap),
      obj(tx, args.c),
    ],
  })
}

export interface DenyListV2AddArgs {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
  addr: string | TransactionArgument
}

/**
 * Adds the given address to the deny list, preventing it from interacting with the specified
 * coin type as an input to a transaction. Additionally at the start of the next epoch, the
 * address will be unable to receive objects of this coin type.
 */
export function denyListV2Add(
  tx: Transaction,
  typeArg: string,
  args: DenyListV2AddArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_v2_add`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.denyList),
      obj(tx, args.denyCap),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface DenyListV2RemoveArgs {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
  addr: string | TransactionArgument
}

/**
 * Removes an address from the deny list. Similar to `deny_list_v2_add`, the effect for input
 * objects will be immediate, but the effect for receiving objects will be delayed until the
 * next epoch.
 */
export function denyListV2Remove(
  tx: Transaction,
  typeArg: string,
  args: DenyListV2RemoveArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_v2_remove`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.denyList),
      obj(tx, args.denyCap),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface DenyListV2ContainsCurrentEpochArgs {
  denyList: TransactionObjectInput
  addr: string | TransactionArgument
}

/**
 * Check if the deny list contains the given address for the current epoch. Denied addresses
 * in the current epoch will be unable to receive objects of this coin type.
 */
export function denyListV2ContainsCurrentEpoch(
  tx: Transaction,
  typeArg: string,
  args: DenyListV2ContainsCurrentEpochArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_v2_contains_current_epoch`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface DenyListV2ContainsNextEpochArgs {
  denyList: TransactionObjectInput
  addr: string | TransactionArgument
}

/**
 * Check if the deny list contains the given address for the next epoch. Denied addresses in
 * the next epoch will immediately be unable to use objects of this coin type as inputs. At the
 * start of the next epoch, the address will be unable to receive objects of this coin type.
 */
export function denyListV2ContainsNextEpoch(
  tx: Transaction,
  typeArg: string,
  args: DenyListV2ContainsNextEpochArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_v2_contains_next_epoch`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface DenyListV2EnableGlobalPauseArgs {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
}

/**
 * Enable the global pause for the given coin type. This will immediately prevent all addresses
 * from using objects of this coin type as inputs. At the start of the next epoch, all
 * addresses will be unable to receive objects of this coin type.
 */
export function denyListV2EnableGlobalPause(
  tx: Transaction,
  typeArg: string,
  args: DenyListV2EnableGlobalPauseArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_v2_enable_global_pause`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.denyList),
      obj(tx, args.denyCap),
    ],
  })
}

export interface DenyListV2DisableGlobalPauseArgs {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
}

/**
 * Disable the global pause for the given coin type. This will immediately allow all addresses
 * to resume using objects of this coin type as inputs. However, receiving objects of this coin
 * type will still be paused until the start of the next epoch.
 */
export function denyListV2DisableGlobalPause(
  tx: Transaction,
  typeArg: string,
  args: DenyListV2DisableGlobalPauseArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_v2_disable_global_pause`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.denyList),
      obj(tx, args.denyCap),
    ],
  })
}

/** Check if the global pause is enabled for the given coin type in the current epoch. */
export function denyListV2IsGlobalPauseEnabledCurrentEpoch(
  tx: Transaction,
  typeArg: string,
  denyList: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_v2_is_global_pause_enabled_current_epoch`,
    typeArguments: [typeArg],
    arguments: [obj(tx, denyList)],
  })
}

/** Check if the global pause is enabled for the given coin type in the next epoch. */
export function denyListV2IsGlobalPauseEnabledNextEpoch(
  tx: Transaction,
  typeArg: string,
  denyList: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_v2_is_global_pause_enabled_next_epoch`,
    typeArguments: [typeArg],
    arguments: [obj(tx, denyList)],
  })
}

export interface MintAndTransferArgs {
  c: TransactionObjectInput
  amount: bigint | TransactionArgument
  recipient: string | TransactionArgument
}

/** Mint `amount` of `Coin` and send it to `recipient`. Invokes `mint()`. */
export function mintAndTransfer(
  tx: Transaction,
  typeArg: string,
  args: MintAndTransferArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::mint_and_transfer`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.c),
      pure(tx, args.amount, `u64`),
      pure(tx, args.recipient, `address`),
    ],
  })
}

export interface UpdateNameArgs {
  treasury: TransactionObjectInput
  metadata: TransactionObjectInput
  name: string | TransactionArgument
}

/** Update name of the coin in `CoinMetadata` */
export function updateName(
  tx: Transaction,
  typeArg: string,
  args: UpdateNameArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::update_name`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasury),
      obj(tx, args.metadata),
      pure(tx, args.name, `${String.$typeName}`),
    ],
  })
}

export interface UpdateSymbolArgs {
  treasury: TransactionObjectInput
  metadata: TransactionObjectInput
  symbol: string | TransactionArgument
}

/** Update the symbol of the coin in `CoinMetadata` */
export function updateSymbol(
  tx: Transaction,
  typeArg: string,
  args: UpdateSymbolArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::update_symbol`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasury),
      obj(tx, args.metadata),
      pure(tx, args.symbol, `${String1.$typeName}`),
    ],
  })
}

export interface UpdateDescriptionArgs {
  treasury: TransactionObjectInput
  metadata: TransactionObjectInput
  description: string | TransactionArgument
}

/** Update the description of the coin in `CoinMetadata` */
export function updateDescription(
  tx: Transaction,
  typeArg: string,
  args: UpdateDescriptionArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::update_description`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasury),
      obj(tx, args.metadata),
      pure(tx, args.description, `${String.$typeName}`),
    ],
  })
}

export interface UpdateIconUrlArgs {
  treasury: TransactionObjectInput
  metadata: TransactionObjectInput
  url: string | TransactionArgument
}

/** Update the url of the coin in `CoinMetadata` */
export function updateIconUrl(
  tx: Transaction,
  typeArg: string,
  args: UpdateIconUrlArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::update_icon_url`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasury),
      obj(tx, args.metadata),
      pure(tx, args.url, `${String1.$typeName}`),
    ],
  })
}

export function getDecimals(
  tx: Transaction,
  typeArg: string,
  metadata: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::get_decimals`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function getName(
  tx: Transaction,
  typeArg: string,
  metadata: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::get_name`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function getSymbol(
  tx: Transaction,
  typeArg: string,
  metadata: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::get_symbol`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function getDescription(
  tx: Transaction,
  typeArg: string,
  metadata: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::get_description`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function getIconUrl(
  tx: Transaction,
  typeArg: string,
  metadata: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::get_icon_url`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

/** Destroy legacy `CoinMetadata` object */
export function destroyMetadata(
  tx: Transaction,
  typeArg: string,
  metadata: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::destroy_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function denyCapId(
  tx: Transaction,
  typeArg: string,
  metadata: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_cap_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function newDenyCapV2(
  tx: Transaction,
  typeArg: string,
  allowGlobalPause: boolean | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::new_deny_cap_v2`,
    typeArguments: [typeArg],
    arguments: [pure(tx, allowGlobalPause, `bool`)],
  })
}

export function newTreasuryCap(tx: Transaction, typeArg: string): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::new_treasury_cap`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function allowGlobalPause(
  tx: Transaction,
  typeArg: string,
  cap: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::allow_global_pause`,
    typeArguments: [typeArg],
    arguments: [obj(tx, cap)],
  })
}

export interface NewCoinMetadataArgs {
  decimals: number | TransactionArgument
  name: string | TransactionArgument
  symbol: string | TransactionArgument
  description: string | TransactionArgument
  iconUrl: string | TransactionArgument
}

export function newCoinMetadata(
  tx: Transaction,
  typeArg: string,
  args: NewCoinMetadataArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::new_coin_metadata`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.decimals, `u8`),
      pure(tx, args.name, `${String.$typeName}`),
      pure(tx, args.symbol, `${String1.$typeName}`),
      pure(tx, args.description, `${String.$typeName}`),
      pure(tx, args.iconUrl, `${String1.$typeName}`),
    ],
  })
}

export interface UpdateCoinMetadataArgs {
  metadata: TransactionObjectInput
  name: string | TransactionArgument
  symbol: string | TransactionArgument
  description: string | TransactionArgument
  iconUrl: string | TransactionArgument
}

/**
 * Internal function to refresh the `CoinMetadata` with new values in
 * `CoinRegistry` borrowing.
 */
export function updateCoinMetadata(
  tx: Transaction,
  typeArg: string,
  args: UpdateCoinMetadataArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::update_coin_metadata`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.metadata),
      pure(tx, args.name, `${String.$typeName}`),
      pure(tx, args.symbol, `${String1.$typeName}`),
      pure(tx, args.description, `${String.$typeName}`),
      pure(tx, args.iconUrl, `${String1.$typeName}`),
    ],
  })
}

export function supply(
  tx: Transaction,
  typeArg: string,
  treasury: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasury)],
  })
}

export interface CreateRegulatedCurrencyArgs {
  witness: GenericArg
  decimals: number | TransactionArgument
  symbol: Array<number | TransactionArgument> | TransactionArgument
  name: Array<number | TransactionArgument> | TransactionArgument
  description: Array<number | TransactionArgument> | TransactionArgument
  iconUrl: TransactionObjectInput | null
}

/**
 * This creates a new currency, via `create_currency`, but with an extra capability that
 * allows for specific addresses to have their coins frozen. Those addresses cannot interact
 * with the coin as input objects.
 *
 * @deprecated For new coins, use `new_currency_with_otw` and use `make_regulated`. To migrate existing regulated currencies, migrate with `migrate_regulated_currency_to_v2` and then use migration functions in `coin_registry`
 */
export function createRegulatedCurrency(
  tx: Transaction,
  typeArg: string,
  args: CreateRegulatedCurrencyArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::create_regulated_currency`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.witness),
      pure(tx, args.decimals, `u8`),
      pure(tx, args.symbol, `vector<u8>`),
      pure(tx, args.name, `vector<u8>`),
      pure(tx, args.description, `vector<u8>`),
      option(tx, `${Url.$typeName}`, args.iconUrl),
    ],
  })
}

export interface DenyListAddArgs {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
  addr: string | TransactionArgument
}

/**
 * Adds the given address to the deny list, preventing it
 * from interacting with the specified coin type as an input to a transaction.
 *
 * @deprecated Use `migrate_regulated_currency_to_v2` to migrate to v2 and then use `deny_list_v2_add`
 */
export function denyListAdd(
  tx: Transaction,
  typeArg: string,
  args: DenyListAddArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_add`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.denyList),
      obj(tx, args.denyCap),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface DenyListRemoveArgs {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
  addr: string | TransactionArgument
}

/**
 * Removes an address from the deny list.
 * Aborts with `ENotFrozen` if the address is not already in the list.
 *
 * @deprecated Use `migrate_regulated_currency_to_v2` to migrate to v2 and then use `deny_list_v2_remove`
 */
export function denyListRemove(
  tx: Transaction,
  typeArg: string,
  args: DenyListRemoveArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_remove`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.denyList),
      obj(tx, args.denyCap),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface DenyListContainsArgs {
  denyList: TransactionObjectInput
  addr: string | TransactionArgument
}

/**
 * Returns true iff the given address is denied for the given coin type. It will
 * return false if given a non-coin type.
 *
 * @deprecated Use `migrate_regulated_currency_to_v2` to migrate to v2 and then use `deny_list_v2_contains_next_epoch` or `deny_list_v2_contains_current_epoch`
 */
export function denyListContains(
  tx: Transaction,
  typeArg: string,
  args: DenyListContainsArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin::deny_list_contains`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.addr, `address`),
    ],
  })
}
