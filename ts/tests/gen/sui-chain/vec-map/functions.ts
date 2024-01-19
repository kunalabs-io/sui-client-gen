import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function empty(txb: TransactionBlock, typeArgs: [string, string]) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::empty`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export function destroyEmpty(txb: TransactionBlock, typeArgs: [string, string], vecMap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, vecMap)],
  })
}

export function isEmpty(txb: TransactionBlock, typeArgs: [string, string], vecMap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, vecMap)],
  })
}

export interface ContainsArgs {
  vecMap: ObjectArg
  t0: GenericArg
}

export function contains(txb: TransactionBlock, typeArgs: [string, string], args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::contains`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.vecMap), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface RemoveArgs {
  vecMap: ObjectArg
  t0: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [string, string], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.vecMap), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface InsertArgs {
  vecMap: ObjectArg
  t0: GenericArg
  t1: GenericArg
}

export function insert(txb: TransactionBlock, typeArgs: [string, string], args: InsertArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::insert`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.vecMap),
      generic(txb, `${typeArgs[0]}`, args.t0),
      generic(txb, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export function size(txb: TransactionBlock, typeArgs: [string, string], vecMap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::size`,
    typeArguments: typeArgs,
    arguments: [obj(txb, vecMap)],
  })
}

export function pop(txb: TransactionBlock, typeArgs: [string, string], vecMap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::pop`,
    typeArguments: typeArgs,
    arguments: [obj(txb, vecMap)],
  })
}

export interface GetMutArgs {
  vecMap: ObjectArg
  t0: GenericArg
}

export function getMut(txb: TransactionBlock, typeArgs: [string, string], args: GetMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.vecMap), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface GetArgs {
  vecMap: ObjectArg
  t0: GenericArg
}

export function get(txb: TransactionBlock, typeArgs: [string, string], args: GetArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.vecMap), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface TryGetArgs {
  vecMap: ObjectArg
  t0: GenericArg
}

export function tryGet(txb: TransactionBlock, typeArgs: [string, string], args: TryGetArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::try_get`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.vecMap), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export function intoKeysValues(
  txb: TransactionBlock,
  typeArgs: [string, string],
  vecMap: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::into_keys_values`,
    typeArguments: typeArgs,
    arguments: [obj(txb, vecMap)],
  })
}

export function keys(txb: TransactionBlock, typeArgs: [string, string], vecMap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::keys`,
    typeArguments: typeArgs,
    arguments: [obj(txb, vecMap)],
  })
}

export interface GetIdxOptArgs {
  vecMap: ObjectArg
  t0: GenericArg
}

export function getIdxOpt(txb: TransactionBlock, typeArgs: [string, string], args: GetIdxOptArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_idx_opt`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.vecMap), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface GetIdxArgs {
  vecMap: ObjectArg
  t0: GenericArg
}

export function getIdx(txb: TransactionBlock, typeArgs: [string, string], args: GetIdxArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_idx`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.vecMap), generic(txb, `${typeArgs[0]}`, args.t0)],
  })
}

export interface GetEntryByIdxArgs {
  vecMap: ObjectArg
  u64: bigint | TransactionArgument
}

export function getEntryByIdx(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: GetEntryByIdxArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_entry_by_idx`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.vecMap), pure(txb, args.u64, `u64`)],
  })
}

export interface GetEntryByIdxMutArgs {
  vecMap: ObjectArg
  u64: bigint | TransactionArgument
}

export function getEntryByIdxMut(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: GetEntryByIdxMutArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_entry_by_idx_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.vecMap), pure(txb, args.u64, `u64`)],
  })
}

export interface RemoveEntryByIdxArgs {
  vecMap: ObjectArg
  u64: bigint | TransactionArgument
}

export function removeEntryByIdx(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: RemoveEntryByIdxArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::remove_entry_by_idx`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.vecMap), pure(txb, args.u64, `u64`)],
  })
}
