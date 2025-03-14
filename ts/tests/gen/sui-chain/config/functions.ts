import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { ID } from '../object/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AddForNextEpochArgs {
  config: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
  t2: GenericArg
}

export function addForNextEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: AddForNextEpochArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::add_for_next_epoch`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.config),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
      generic(tx, `${typeArgs[2]}`, args.t2),
    ],
  })
}

export interface BorrowForNextEpochMutArgs {
  config: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
}

export function borrowForNextEpochMut(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: BorrowForNextEpochMutArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::borrow_for_next_epoch_mut`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.config),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface ExistsWithTypeArgs {
  config: TransactionObjectInput
  t1: GenericArg
}

export function existsWithType(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: ExistsWithTypeArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::exists_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.config), generic(tx, `${typeArgs[1]}`, args.t1)],
  })
}

export interface ExistsWithTypeForNextEpochArgs {
  config: TransactionObjectInput
  t1: GenericArg
}

export function existsWithTypeForNextEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: ExistsWithTypeForNextEpochArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::exists_with_type_for_next_epoch`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.config), generic(tx, `${typeArgs[1]}`, args.t1)],
  })
}

export function new_(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::new`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export interface ReadSettingArgs {
  id: string | TransactionArgument
  t0: GenericArg
}

export function readSetting(tx: Transaction, typeArgs: [string, string], args: ReadSettingArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::read_setting`,
    typeArguments: typeArgs,
    arguments: [pure(tx, args.id, `${ID.$typeName}`), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface ReadSettingForNextEpochArgs {
  config: TransactionObjectInput
  t1: GenericArg
}

export function readSettingForNextEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: ReadSettingForNextEpochArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::read_setting_for_next_epoch`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.config), generic(tx, `${typeArgs[1]}`, args.t1)],
  })
}

export interface ReadSettingImplArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
  u64: bigint | TransactionArgument
}

export function readSettingImpl(
  tx: Transaction,
  typeArgs: [string, string, string, string],
  args: ReadSettingImplArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::read_setting_impl`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.address1, `address`),
      pure(tx, args.address2, `address`),
      pure(tx, args.u64, `u64`),
    ],
  })
}

export interface RemoveForNextEpochArgs {
  config: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
}

export function removeForNextEpoch(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RemoveForNextEpochArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::remove_for_next_epoch`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.config),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export function share(tx: Transaction, typeArg: string, config: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::share`,
    typeArguments: [typeArg],
    arguments: [obj(tx, config)],
  })
}

export interface TransferArgs {
  config: TransactionObjectInput
  address: string | TransactionArgument
}

export function transfer(tx: Transaction, typeArg: string, args: TransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::config::transfer`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.config), pure(tx, args.address, `address`)],
  })
}
