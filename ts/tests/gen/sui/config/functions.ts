import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { ID } from '../object/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction, typeArg: string, cap: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::new`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, cap)],
  })
}

export function share(tx: Transaction, typeArg: string, config: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::share`,
    typeArguments: [typeArg],
    arguments: [obj(tx, config)],
  })
}

export interface TransferArgs {
  config: TransactionObjectInput
  owner: string | TransactionArgument
}

export function transfer(tx: Transaction, typeArg: string, args: TransferArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::transfer`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.config), pure(tx, args.owner, `address`)],
  })
}

export interface AddForNextEpochArgs {
  config: TransactionObjectInput
  cap: GenericArg
  name: GenericArg
  value: GenericArg
}

export function addForNextEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: AddForNextEpochArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::add_for_next_epoch`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.config),
      generic(tx, `${typeArgs[0]}`, args.cap),
      generic(tx, `${typeArgs[1]}`, args.name),
      generic(tx, `${typeArgs[2]}`, args.value),
    ],
  })
}

export interface RemoveForNextEpochArgs {
  config: TransactionObjectInput
  cap: GenericArg
  name: GenericArg
}

export function removeForNextEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RemoveForNextEpochArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::remove_for_next_epoch`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.config),
      generic(tx, `${typeArgs[0]}`, args.cap),
      generic(tx, `${typeArgs[1]}`, args.name),
    ],
  })
}

export interface ExistsWithTypeArgs {
  config: TransactionObjectInput
  name: GenericArg
}

export function existsWithType(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: ExistsWithTypeArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.config), generic(tx, `${typeArgs[1]}`, args.name)],
  })
}

export interface ExistsWithTypeForNextEpochArgs {
  config: TransactionObjectInput
  name: GenericArg
}

export function existsWithTypeForNextEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: ExistsWithTypeForNextEpochArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::exists_with_type_for_next_epoch`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.config), generic(tx, `${typeArgs[1]}`, args.name)],
  })
}

export interface BorrowForNextEpochMutArgs {
  config: TransactionObjectInput
  cap: GenericArg
  name: GenericArg
}

export function borrowForNextEpochMut(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: BorrowForNextEpochMutArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::borrow_for_next_epoch_mut`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.config),
      generic(tx, `${typeArgs[0]}`, args.cap),
      generic(tx, `${typeArgs[1]}`, args.name),
    ],
  })
}

export interface ReadSettingForNextEpochArgs {
  config: TransactionObjectInput
  name: GenericArg
}

export function readSettingForNextEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: ReadSettingForNextEpochArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::read_setting_for_next_epoch`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.config), generic(tx, `${typeArgs[1]}`, args.name)],
  })
}

export interface ReadSettingArgs {
  config: string | TransactionArgument
  name: GenericArg
}

export function readSetting(tx: Transaction, typeArgs: [string, string], args: ReadSettingArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::read_setting`,
    typeArguments: typeArgs,
    arguments: [pure(tx, args.config, `${ID.$typeName}`), generic(tx, `${typeArgs[0]}`, args.name)],
  })
}

export interface ReadSettingImplArgs {
  config: string | TransactionArgument
  name: string | TransactionArgument
  currentEpoch: bigint | TransactionArgument
}

export function readSettingImpl(
  tx: Transaction,
  typeArgs: [string, string, string, string],
  args: ReadSettingImplArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::config::read_setting_impl`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.config, `address`),
      pure(tx, args.name, `address`),
      pure(tx, args.currentEpoch, `u64`),
    ],
  })
}
