import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export interface ContainsArgs {
  self: ObjectArg
  key: GenericArg
}

export function contains(txb: TransactionBlock, typeArg: Type, args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::contains`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), generic(txb, `${typeArg}`, args.key)],
  })
}

export function empty(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface InsertArgs {
  self: ObjectArg
  key: GenericArg
}

export function insert(txb: TransactionBlock, typeArg: Type, args: InsertArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::insert`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), generic(txb, `${typeArg}`, args.key)],
  })
}

export function isEmpty(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface RemoveArgs {
  self: ObjectArg
  key: GenericArg
}

export function remove(txb: TransactionBlock, typeArg: Type, args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::remove`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), generic(txb, `${typeArg}`, args.key)],
  })
}

export function singleton(txb: TransactionBlock, typeArg: Type, key: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, key)],
  })
}

export function size(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::size`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface GetIdxArgs {
  self: ObjectArg
  key: GenericArg
}

export function getIdx(txb: TransactionBlock, typeArg: Type, args: GetIdxArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::get_idx`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), generic(txb, `${typeArg}`, args.key)],
  })
}

export interface GetIdxOptArgs {
  self: ObjectArg
  key: GenericArg
}

export function getIdxOpt(txb: TransactionBlock, typeArg: Type, args: GetIdxOptArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::get_idx_opt`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), generic(txb, `${typeArg}`, args.key)],
  })
}

export function keys(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::keys`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function intoKeys(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::into_keys`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}
