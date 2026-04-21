import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure } from '../../_framework/util'
import { ID } from '../object/structs'

export function new_(
  tx: Transaction,
  typeArg: string,
  cap: GenericArg,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::new`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, cap)],
  })
}

export function share(
  tx: Transaction,
  typeArg: string,
  config: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::share`,
    typeArguments: [typeArg],
    arguments: [obj(tx, config)],
  })
}

export interface TransferArgs {
  config: TransactionObjectInput
  owner: string | TransactionArgument
}

export function transfer(
  tx: Transaction,
  typeArg: string,
  args: TransferArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::transfer`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.config),
      pure(tx, args.owner, `address`),
    ],
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
  args: AddForNextEpochArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::add_for_next_epoch`,
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
  args: RemoveForNextEpochArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::remove_for_next_epoch`,
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
  args: ExistsWithTypeArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.config),
      generic(tx, `${typeArgs[1]}`, args.name),
    ],
  })
}

export interface ExistsWithTypeForNextEpochArgs {
  config: TransactionObjectInput
  name: GenericArg
}

export function existsWithTypeForNextEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: ExistsWithTypeForNextEpochArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::exists_with_type_for_next_epoch`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.config),
      generic(tx, `${typeArgs[1]}`, args.name),
    ],
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
  args: BorrowForNextEpochMutArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::borrow_for_next_epoch_mut`,
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
  args: ReadSettingForNextEpochArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::read_setting_for_next_epoch`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.config),
      generic(tx, `${typeArgs[1]}`, args.name),
    ],
  })
}

export interface ReadSettingArgs {
  config: string | TransactionArgument
  name: GenericArg
}

export function readSetting(
  tx: Transaction,
  typeArgs: [string, string],
  args: ReadSettingArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::read_setting`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.config, `${ID.$typeName}`),
      generic(tx, `${typeArgs[0]}`, args.name),
    ],
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
  args: ReadSettingImplArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::config::read_setting_impl`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.config, `address`),
      pure(tx, args.name, `address`),
      pure(tx, args.currentEpoch, `u64`),
    ],
  })
}
