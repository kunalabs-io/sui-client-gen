import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { String } from '../../std/string/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface NewCurrencyArgs {
  registry: TransactionObjectInput
  decimals: number | TransactionArgument
  symbol: string | TransactionArgument
  name: string | TransactionArgument
  description: string | TransactionArgument
  iconUrl: string | TransactionArgument
}

/**
 * Creates a new currency.
 *
 * Note: This constructor has no long term difference from `new_currency_with_otw`.
 * This can be called from the module that defines `T` any time after it has been published.
 */
export function newCurrency(tx: Transaction, typeArg: string, args: NewCurrencyArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::new_currency`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.registry),
      pure(tx, args.decimals, `u8`),
      pure(tx, args.symbol, `${String.$typeName}`),
      pure(tx, args.name, `${String.$typeName}`),
      pure(tx, args.description, `${String.$typeName}`),
      pure(tx, args.iconUrl, `${String.$typeName}`),
    ],
  })
}

export interface NewCurrencyWithOtwArgs {
  otw: GenericArg
  decimals: number | TransactionArgument
  symbol: string | TransactionArgument
  name: string | TransactionArgument
  description: string | TransactionArgument
  iconUrl: string | TransactionArgument
}

/**
 * Creates a new currency with using an OTW as proof of uniqueness.
 *
 * This is a two-step operation:
 * 1. `Currency` is constructed in the `init` function and sent to the `CoinRegistry`;
 * 2. `Currency` is promoted to a shared object in the `finalize_registration` call;
 */
export function newCurrencyWithOtw(tx: Transaction, typeArg: string, args: NewCurrencyWithOtwArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::new_currency_with_otw`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.otw),
      pure(tx, args.decimals, `u8`),
      pure(tx, args.symbol, `${String.$typeName}`),
      pure(tx, args.name, `${String.$typeName}`),
      pure(tx, args.description, `${String.$typeName}`),
      pure(tx, args.iconUrl, `${String.$typeName}`),
    ],
  })
}

export interface ClaimMetadataCapArgs {
  currency: TransactionObjectInput
  treasuryCap: TransactionObjectInput
}

/**
 * Claim a `MetadataCap` for a coin type.
 * Only allowed from the owner of `TreasuryCap`, and only once.
 *
 * Aborts if the `MetadataCap` has already been claimed.
 * Deleted `MetadataCap` cannot be reclaimed.
 */
export function claimMetadataCap(tx: Transaction, typeArg: string, args: ClaimMetadataCapArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::claim_metadata_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.treasuryCap)],
  })
}

export interface MakeRegulatedArgs {
  init: TransactionObjectInput
  allowGlobalPause: boolean | TransactionArgument
}

/**
 * Allows converting a currency, on init, to regulated, which creates
 * a `DenyCapV2` object, and a denylist entry. Sets regulated state to
 * `Regulated`.
 *
 * This action is irreversible.
 */
export function makeRegulated(tx: Transaction, typeArg: string, args: MakeRegulatedArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::make_regulated`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.init), pure(tx, args.allowGlobalPause, `bool`)],
  })
}

export interface MakeSupplyFixedInitArgs {
  init: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Initializer function to make the supply fixed.
 * Aborts if Supply is `0` to enforce minting during initialization.
 */
export function makeSupplyFixedInit(
  tx: Transaction,
  typeArg: string,
  args: MakeSupplyFixedInitArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::make_supply_fixed_init`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.init), obj(tx, args.cap)],
  })
}

export interface MakeSupplyBurnOnlyInitArgs {
  init: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Initializer function to make the supply burn-only.
 * Aborts if Supply is `0` to enforce minting during initialization.
 */
export function makeSupplyBurnOnlyInit(
  tx: Transaction,
  typeArg: string,
  args: MakeSupplyBurnOnlyInitArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::make_supply_burn_only_init`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.init), obj(tx, args.cap)],
  })
}

export interface MakeSupplyFixedArgs {
  currency: TransactionObjectInput
  cap: TransactionObjectInput
}

/** Freeze the supply by destroying the `TreasuryCap` and storing it in the `Currency`. */
export function makeSupplyFixed(tx: Transaction, typeArg: string, args: MakeSupplyFixedArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::make_supply_fixed`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.cap)],
  })
}

export interface MakeSupplyBurnOnlyArgs {
  currency: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Make the supply `BurnOnly` by giving up the `TreasuryCap`, and allowing
 * burning of Coins through the `Currency`.
 */
export function makeSupplyBurnOnly(tx: Transaction, typeArg: string, args: MakeSupplyBurnOnlyArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::make_supply_burn_only`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.cap)],
  })
}

/** Finalize the coin initialization, returning `MetadataCap` */
export function finalize(tx: Transaction, typeArg: string, builder: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::finalize`,
    typeArguments: [typeArg],
    arguments: [obj(tx, builder)],
  })
}

/** Does the same as `finalize`, but also deletes the `MetadataCap` after finalization. */
export function finalizeAndDeleteMetadataCap(
  tx: Transaction,
  typeArg: string,
  builder: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::finalize_and_delete_metadata_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, builder)],
  })
}

export interface FinalizeRegistrationArgs {
  registry: TransactionObjectInput
  currency: TransactionObjectInput
}

/**
 * The second step in the "otw" initialization of coin metadata, that takes in
 * the `Currency<T>` that was transferred from init, and transforms it in to a
 * "derived address" shared object.
 *
 * Can be performed by anyone.
 */
export function finalizeRegistration(
  tx: Transaction,
  typeArg: string,
  args: FinalizeRegistrationArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::finalize_registration`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.registry), obj(tx, args.currency)],
  })
}

export interface DeleteMetadataCapArgs {
  currency: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Delete the metadata cap making further updates of `Currency` metadata impossible.
 * This action is IRREVERSIBLE, and the `MetadataCap` can no longer be claimed.
 */
export function deleteMetadataCap(tx: Transaction, typeArg: string, args: DeleteMetadataCapArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::delete_metadata_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.cap)],
  })
}

export interface BurnArgs {
  currency: TransactionObjectInput
  coin: TransactionObjectInput
}

/** Burn the `Coin` if the `Currency` has a `BurnOnly` supply state. */
export function burn(tx: Transaction, typeArg: string, args: BurnArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::burn`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.coin)],
  })
}

export interface BurnBalanceArgs {
  currency: TransactionObjectInput
  balance: TransactionObjectInput
}

/** Burn the `Balance` if the `Currency` has a `BurnOnly` supply state. */
export function burnBalance(tx: Transaction, typeArg: string, args: BurnBalanceArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::burn_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.balance)],
  })
}

export interface SetNameArgs {
  currency: TransactionObjectInput
  metadataCap: TransactionObjectInput
  name: string | TransactionArgument
}

/** Update the name of the `Currency`. */
export function setName(tx: Transaction, typeArg: string, args: SetNameArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::set_name`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.currency),
      obj(tx, args.metadataCap),
      pure(tx, args.name, `${String.$typeName}`),
    ],
  })
}

export interface SetDescriptionArgs {
  currency: TransactionObjectInput
  metadataCap: TransactionObjectInput
  description: string | TransactionArgument
}

/** Update the description of the `Currency`. */
export function setDescription(tx: Transaction, typeArg: string, args: SetDescriptionArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::set_description`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.currency),
      obj(tx, args.metadataCap),
      pure(tx, args.description, `${String.$typeName}`),
    ],
  })
}

export interface SetIconUrlArgs {
  currency: TransactionObjectInput
  metadataCap: TransactionObjectInput
  iconUrl: string | TransactionArgument
}

/** Update the icon URL of the `Currency`. */
export function setIconUrl(tx: Transaction, typeArg: string, args: SetIconUrlArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::set_icon_url`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.currency),
      obj(tx, args.metadataCap),
      pure(tx, args.iconUrl, `${String.$typeName}`),
    ],
  })
}

export interface SetTreasuryCapIdArgs {
  currency: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Register the treasury cap ID for a migrated `Currency`. All currencies created with
 * `new_currency` or `new_currency_with_otw` have their treasury cap ID set during
 * initialization.
 */
export function setTreasuryCapId(tx: Transaction, typeArg: string, args: SetTreasuryCapIdArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::set_treasury_cap_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.cap)],
  })
}

export interface MigrateLegacyMetadataArgs {
  registry: TransactionObjectInput
  legacy: TransactionObjectInput
}

/**
 * Register `CoinMetadata` in the `CoinRegistry`. This can happen only once, if the
 * `Currency` did not exist yet. Further updates are possible through
 * `update_from_legacy_metadata`.
 */
export function migrateLegacyMetadata(
  tx: Transaction,
  typeArg: string,
  args: MigrateLegacyMetadataArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::migrate_legacy_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.registry), obj(tx, args.legacy)],
  })
}

export interface UpdateFromLegacyMetadataArgs {
  currency: TransactionObjectInput
  legacy: TransactionObjectInput
}

/**
 * Update `Currency` from `CoinMetadata` if the `MetadataCap` is not claimed. After
 * the `MetadataCap` is claimed, updates can only be made through `set_*` functions.
 */
export function updateFromLegacyMetadata(
  tx: Transaction,
  typeArg: string,
  args: UpdateFromLegacyMetadataArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::update_from_legacy_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.legacy)],
  })
}

export interface DeleteMigratedLegacyMetadataArgs {
  currency: TransactionObjectInput
  coinMetadata: TransactionObjectInput
}

/** @deprecated Method disabled */
export function deleteMigratedLegacyMetadata(
  tx: Transaction,
  typeArg: string,
  args: DeleteMigratedLegacyMetadataArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::delete_migrated_legacy_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.coinMetadata)],
  })
}

export interface MigrateRegulatedStateByMetadataArgs {
  currency: TransactionObjectInput
  metadata: TransactionObjectInput
}

/**
 * Allow migrating the regulated state by access to `RegulatedCoinMetadata` frozen object.
 * This is a permissionless operation which can be performed only once.
 */
export function migrateRegulatedStateByMetadata(
  tx: Transaction,
  typeArg: string,
  args: MigrateRegulatedStateByMetadataArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::migrate_regulated_state_by_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.metadata)],
  })
}

export interface MigrateRegulatedStateByCapArgs {
  currency: TransactionObjectInput
  cap: TransactionObjectInput
}

/** Mark regulated state by showing the `DenyCapV2` object for the `Currency`. */
export function migrateRegulatedStateByCap(
  tx: Transaction,
  typeArg: string,
  args: MigrateRegulatedStateByCapArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::migrate_regulated_state_by_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.cap)],
  })
}

/**
 * Borrow the legacy `CoinMetadata` from a new `Currency`. To preserve the `ID`
 * of the legacy `CoinMetadata`, we create it on request and then store it as a
 * dynamic field for future borrows.
 *
 * `Borrow<T>` ensures that the `CoinMetadata` is returned in the same transaction.
 */
export function borrowLegacyMetadata(
  tx: Transaction,
  typeArg: string,
  currency: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::borrow_legacy_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

export interface ReturnBorrowedLegacyMetadataArgs {
  currency: TransactionObjectInput
  legacy: TransactionObjectInput
  borrow: TransactionObjectInput
}

/**
 * Return the borrowed `CoinMetadata` and the `Borrow` potato to the `Currency`.
 *
 * Note to self: Borrow requirement prevents deletion through this method.
 */
export function returnBorrowedLegacyMetadata(
  tx: Transaction,
  typeArg: string,
  args: ReturnBorrowedLegacyMetadataArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::return_borrowed_legacy_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.legacy), obj(tx, args.borrow)],
  })
}

/** Get the number of decimal places for the coin type. */
export function decimals(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::decimals`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Get the human-readable name of the coin. */
export function name(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::name`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Get the symbol/ticker of the coin. */
export function symbol(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::symbol`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Get the description of the coin. */
export function description(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::description`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Get the icon URL for the coin. */
export function iconUrl(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::icon_url`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Check if the metadata capability has been claimed for this `Currency` type. */
export function isMetadataCapClaimed(
  tx: Transaction,
  typeArg: string,
  currency: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::is_metadata_cap_claimed`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Check if the metadata capability has been deleted for this `Currency` type. */
export function isMetadataCapDeleted(
  tx: Transaction,
  typeArg: string,
  currency: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::is_metadata_cap_deleted`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Get the metadata cap ID, or none if it has not been claimed. */
export function metadataCapId(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::metadata_cap_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Get the treasury cap ID for this coin type, if registered. */
export function treasuryCapId(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::treasury_cap_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/**
 * Get the deny cap ID for this coin type, if it's a regulated coin.
 * Returns `None` if:
 * - The `Currency` is not regulated;
 * - The `Currency` is migrated from legacy, and its regulated state has not been set;
 */
export function denyCapId(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::deny_cap_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Check if the supply is fixed. */
export function isSupplyFixed(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::is_supply_fixed`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Check if the supply is burn-only. */
export function isSupplyBurnOnly(
  tx: Transaction,
  typeArg: string,
  currency: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::is_supply_burn_only`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Check if the currency is regulated. */
export function isRegulated(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::is_regulated`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/**
 * Get the total supply for the `Currency<T>` if the Supply is in fixed or
 * burn-only state. Returns `None` if the SupplyState is Unknown.
 */
export function totalSupply(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::total_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Check if coin data exists for the given type T in the registry. */
export function exists(tx: Transaction, typeArg: string, registry: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::exists`,
    typeArguments: [typeArg],
    arguments: [obj(tx, registry)],
  })
}

/** Whether the currency is migrated from legacy. */
export function isMigratedFromLegacy(
  tx: Transaction,
  typeArg: string,
  currency: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::is_migrated_from_legacy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/** Create a new legacy `CoinMetadata` from a `Currency`. */
export function toLegacyMetadata(
  tx: Transaction,
  typeArg: string,
  currency: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::to_legacy_metadata`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

/**
 * Create and share the singleton `CoinRegistry` -- this function is
 * called exactly once, during the upgrade epoch.
 * Only the system address (0x0) can create the registry.
 */
export function create(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::create`,
    arguments: [],
  })
}
