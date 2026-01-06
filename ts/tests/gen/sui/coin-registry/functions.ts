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

export function makeSupplyBurnOnly(tx: Transaction, typeArg: string, args: MakeSupplyBurnOnlyArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::make_supply_burn_only`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.currency), obj(tx, args.cap)],
  })
}

export function finalize(tx: Transaction, typeArg: string, builder: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::finalize`,
    typeArguments: [typeArg],
    arguments: [obj(tx, builder)],
  })
}

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

export function decimals(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::decimals`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

export function name(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::name`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

export function symbol(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::symbol`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

export function description(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::description`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

export function iconUrl(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::icon_url`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

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

export function metadataCapId(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::metadata_cap_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

export function treasuryCapId(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::treasury_cap_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

export function denyCapId(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::deny_cap_id`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

export function isSupplyFixed(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::is_supply_fixed`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

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

export function isRegulated(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::is_regulated`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

export function totalSupply(tx: Transaction, typeArg: string, currency: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::total_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, currency)],
  })
}

export function exists(tx: Transaction, typeArg: string, registry: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::exists`,
    typeArguments: [typeArg],
    arguments: [obj(tx, registry)],
  })
}

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

export function create(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::coin_registry::create`,
    arguments: [],
  })
}
