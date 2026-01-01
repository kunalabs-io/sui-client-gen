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

export interface InsertArgs {
  self: TransactionObjectInput
  key: GenericArg
  value: GenericArg
}

export function insert(tx: Transaction, typeArgs: [string, string], args: InsertArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::insert`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArgs[0]}`, args.key),
      generic(tx, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface RemoveArgs {
  self: TransactionObjectInput
  key: GenericArg
}

export function remove(tx: Transaction, typeArgs: [string, string], args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::remove`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), generic(tx, `${typeArgs[0]}`, args.key)],
  })
}

export function pop(tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::pop`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export interface GetMutArgs {
  self: TransactionObjectInput
  key: GenericArg
}

export function getMut(tx: Transaction, typeArgs: [string, string], args: GetMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), generic(tx, `${typeArgs[0]}`, args.key)],
  })
}

export interface GetArgs {
  self: TransactionObjectInput
  key: GenericArg
}

export function get(tx: Transaction, typeArgs: [string, string], args: GetArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), generic(tx, `${typeArgs[0]}`, args.key)],
  })
}

export interface TryGetArgs {
  self: TransactionObjectInput
  key: GenericArg
}

export function tryGet(tx: Transaction, typeArgs: [string, string], args: TryGetArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::try_get`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), generic(tx, `${typeArgs[0]}`, args.key)],
  })
}

export interface ContainsArgs {
  self: TransactionObjectInput
  key: GenericArg
}

export function contains(tx: Transaction, typeArgs: [string, string], args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::contains`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), generic(tx, `${typeArgs[0]}`, args.key)],
  })
}

export function length(tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::length`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export function isEmpty(tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export function destroyEmpty(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export function intoKeysValues(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::into_keys_values`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export interface FromKeysValuesArgs {
  keys: Array<GenericArg> | TransactionArgument
  values: Array<GenericArg> | TransactionArgument
}

export function fromKeysValues(
  tx: Transaction,
  typeArgs: [string, string],
  args: FromKeysValuesArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::from_keys_values`,
    typeArguments: typeArgs,
    arguments: [vector(tx, `${typeArgs[0]}`, args.keys), vector(tx, `${typeArgs[1]}`, args.values)],
  })
}

export function keys(tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::keys`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export interface GetIdxOptArgs {
  self: TransactionObjectInput
  key: GenericArg
}

export function getIdxOpt(tx: Transaction, typeArgs: [string, string], args: GetIdxOptArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_idx_opt`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), generic(tx, `${typeArgs[0]}`, args.key)],
  })
}

export interface GetIdxArgs {
  self: TransactionObjectInput
  key: GenericArg
}

export function getIdx(tx: Transaction, typeArgs: [string, string], args: GetIdxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_idx`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), generic(tx, `${typeArgs[0]}`, args.key)],
  })
}

export interface GetEntryByIdxArgs {
  self: TransactionObjectInput
  idx: bigint | TransactionArgument
}

export function getEntryByIdx(
  tx: Transaction,
  typeArgs: [string, string],
  args: GetEntryByIdxArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_entry_by_idx`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), pure(tx, args.idx, `u64`)],
  })
}

export interface GetEntryByIdxMutArgs {
  self: TransactionObjectInput
  idx: bigint | TransactionArgument
}

export function getEntryByIdxMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: GetEntryByIdxMutArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_entry_by_idx_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), pure(tx, args.idx, `u64`)],
  })
}

export interface RemoveEntryByIdxArgs {
  self: TransactionObjectInput
  idx: bigint | TransactionArgument
}

export function removeEntryByIdx(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveEntryByIdxArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::remove_entry_by_idx`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), pure(tx, args.idx, `u64`)],
  })
}

export function size(tx: Transaction, typeArgs: [string, string], self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_map::size`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}
