import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface ContainsArgs {
  self: ObjectArg
  key: GenericArg
}

export function contains(txb: TransactionBlock, typeArgs: [Type, Type], args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::contains`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), generic(txb, `${typeArgs[0]}`, args.key)],
  })
}

export function destroyEmpty(txb: TransactionBlock, typeArgs: [Type, Type], self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::destroy_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, self)],
  })
}

export function empty(txb: TransactionBlock, typeArgs: [Type, Type]) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::empty`,
    typeArguments: typeArgs,
    arguments: [],
  })
}

export interface InsertArgs {
  self: ObjectArg
  key: GenericArg
  value: GenericArg
}

export function insert(txb: TransactionBlock, typeArgs: [Type, Type], args: InsertArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::insert`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.self),
      generic(txb, `${typeArgs[0]}`, args.key),
      generic(txb, `${typeArgs[1]}`, args.value),
    ],
  })
}

export function isEmpty(txb: TransactionBlock, typeArgs: [Type, Type], self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::is_empty`,
    typeArguments: typeArgs,
    arguments: [obj(txb, self)],
  })
}

export interface RemoveArgs {
  self: ObjectArg
  key: GenericArg
}

export function remove(txb: TransactionBlock, typeArgs: [Type, Type], args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::remove`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), generic(txb, `${typeArgs[0]}`, args.key)],
  })
}

export interface GetArgs {
  self: ObjectArg
  key: GenericArg
}

export function get(txb: TransactionBlock, typeArgs: [Type, Type], args: GetArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), generic(txb, `${typeArgs[0]}`, args.key)],
  })
}

export function size(txb: TransactionBlock, typeArgs: [Type, Type], self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::size`,
    typeArguments: typeArgs,
    arguments: [obj(txb, self)],
  })
}

export interface GetEntryByIdxArgs {
  self: ObjectArg
  idx: bigint | TransactionArgument
}

export function getEntryByIdx(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: GetEntryByIdxArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_entry_by_idx`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), pure(txb, args.idx, `u64`)],
  })
}

export interface GetEntryByIdxMutArgs {
  self: ObjectArg
  idx: bigint | TransactionArgument
}

export function getEntryByIdxMut(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: GetEntryByIdxMutArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_entry_by_idx_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), pure(txb, args.idx, `u64`)],
  })
}

export interface GetIdxArgs {
  self: ObjectArg
  key: GenericArg
}

export function getIdx(txb: TransactionBlock, typeArgs: [Type, Type], args: GetIdxArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_idx`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), generic(txb, `${typeArgs[0]}`, args.key)],
  })
}

export interface GetIdxOptArgs {
  self: ObjectArg
  key: GenericArg
}

export function getIdxOpt(txb: TransactionBlock, typeArgs: [Type, Type], args: GetIdxOptArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_idx_opt`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), generic(txb, `${typeArgs[0]}`, args.key)],
  })
}

export interface GetMutArgs {
  self: ObjectArg
  key: GenericArg
}

export function getMut(txb: TransactionBlock, typeArgs: [Type, Type], args: GetMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::get_mut`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), generic(txb, `${typeArgs[0]}`, args.key)],
  })
}

export function intoKeysValues(txb: TransactionBlock, typeArgs: [Type, Type], self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::into_keys_values`,
    typeArguments: typeArgs,
    arguments: [obj(txb, self)],
  })
}

export function keys(txb: TransactionBlock, typeArgs: [Type, Type], self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::keys`,
    typeArguments: typeArgs,
    arguments: [obj(txb, self)],
  })
}

export function pop(txb: TransactionBlock, typeArgs: [Type, Type], self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::pop`,
    typeArguments: typeArgs,
    arguments: [obj(txb, self)],
  })
}

export interface RemoveEntryByIdxArgs {
  self: ObjectArg
  idx: bigint | TransactionArgument
}

export function removeEntryByIdx(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: RemoveEntryByIdxArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::remove_entry_by_idx`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), pure(txb, args.idx, `u64`)],
  })
}

export interface TryGetArgs {
  self: ObjectArg
  key: GenericArg
}

export function tryGet(txb: TransactionBlock, typeArgs: [Type, Type], args: TryGetArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_map::try_get`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), generic(txb, `${typeArgs[0]}`, args.key)],
  })
}
