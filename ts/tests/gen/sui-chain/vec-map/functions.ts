import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure, vector } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function empty(tx: Transaction, typeArgs: [string, string]) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::empty`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export function destroyEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  vecMap: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, vecMap)],
  })
}

export function isEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  vecMap: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, vecMap)],
  })
}

export interface ContainsArgs {
  vecMap: TransactionObjectInput
  t0: GenericArg
}

export function contains(tx: Transaction, typeArgs: [string, string], args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::contains`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.vecMap), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  vecMap: TransactionObjectInput
  t0: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.vecMap), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface InsertArgs {
  vecMap: TransactionObjectInput
  t0: GenericArg
  t1: GenericArg
}

export function insert(tx: Transaction, typeArgs: [string, string], args: InsertArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::insert`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.vecMap),
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export function size(tx: Transaction, typeArgs: [string, string], vecMap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::size`,
    typeArguments: typeArgs,
    arguments: [obj(tx, vecMap)],
  })
}

export function pop(tx: Transaction, typeArgs: [string, string], vecMap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::pop`,
    typeArguments: typeArgs,
    arguments: [obj(tx, vecMap)],
  })
}

export interface GetMutArgs {
  vecMap: TransactionObjectInput
  t0: GenericArg
}

export function getMut(tx: Transaction, typeArgs: [string, string], args: GetMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.vecMap), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface GetArgs {
  vecMap: TransactionObjectInput
  t0: GenericArg
}

export function get(tx: Transaction, typeArgs: [string, string], args: GetArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.vecMap), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface TryGetArgs {
  vecMap: TransactionObjectInput
  t0: GenericArg
}

export function tryGet(tx: Transaction, typeArgs: [string, string], args: TryGetArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::try_get`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.vecMap), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export function intoKeysValues(
  tx: Transaction,
  typeArgs: [string, string],
  vecMap: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::into_keys_values`,
    typeArguments: typeArgs,
    arguments: [obj(tx, vecMap)],
  })
}

export interface FromKeysValuesArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  vecT1: Array<GenericArg> | TransactionArgument
}

export function fromKeysValues(
  tx: Transaction,
  typeArgs: [string, string],
  args: FromKeysValuesArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::from_keys_values`,
    typeArguments: typeArgs,
    arguments: [vector(tx, `${typeArgs[0]}`, args.vecT0), vector(tx, `${typeArgs[1]}`, args.vecT1)],
  })
}

export function keys(tx: Transaction, typeArgs: [string, string], vecMap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::keys`,
    typeArguments: typeArgs,
    arguments: [obj(tx, vecMap)],
  })
}

export interface GetIdxOptArgs {
  vecMap: TransactionObjectInput
  t0: GenericArg
}

export function getIdxOpt(tx: Transaction, typeArgs: [string, string], args: GetIdxOptArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_idx_opt`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.vecMap), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface GetIdxArgs {
  vecMap: TransactionObjectInput
  t0: GenericArg
}

export function getIdx(tx: Transaction, typeArgs: [string, string], args: GetIdxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_idx`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.vecMap), generic(tx, `${typeArgs[0]}`, args.t0)],
  })
}

export interface GetEntryByIdxArgs {
  vecMap: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function getEntryByIdx(
  tx: Transaction,
  typeArgs: [string, string],
  args: GetEntryByIdxArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_entry_by_idx`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.vecMap), pure(tx, args.u64, `u64`)],
  })
}

export interface GetEntryByIdxMutArgs {
  vecMap: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function getEntryByIdxMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: GetEntryByIdxMutArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_entry_by_idx_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.vecMap), pure(tx, args.u64, `u64`)],
  })
}

export interface RemoveEntryByIdxArgs {
  vecMap: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function removeEntryByIdx(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveEntryByIdxArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::remove_entry_by_idx`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.vecMap), pure(tx, args.u64, `u64`)],
  })
}
