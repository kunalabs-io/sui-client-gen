import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function empty(txb: TransactionBlock, typeArg: string) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function singleton(txb: TransactionBlock, typeArg: string, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function isEmpty(txb: TransactionBlock, typeArg: string, vecSet: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(txb, vecSet)],
  })
}

export interface ContainsArgs {
  vecSet: ObjectArg
  t0: GenericArg
}

export function contains(txb: TransactionBlock, typeArg: string, args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::contains`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.vecSet), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface RemoveArgs {
  vecSet: ObjectArg
  t0: GenericArg
}

export function remove(txb: TransactionBlock, typeArg: string, args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::remove`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.vecSet), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface InsertArgs {
  vecSet: ObjectArg
  t0: GenericArg
}

export function insert(txb: TransactionBlock, typeArg: string, args: InsertArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::insert`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.vecSet), generic(txb, `${typeArg}`, args.t0)],
  })
}

export function size(txb: TransactionBlock, typeArg: string, vecSet: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::size`,
    typeArguments: [typeArg],
    arguments: [obj(txb, vecSet)],
  })
}

export function keys(txb: TransactionBlock, typeArg: string, vecSet: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::keys`,
    typeArguments: [typeArg],
    arguments: [obj(txb, vecSet)],
  })
}

export interface GetIdxOptArgs {
  vecSet: ObjectArg
  t0: GenericArg
}

export function getIdxOpt(txb: TransactionBlock, typeArg: string, args: GetIdxOptArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::get_idx_opt`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.vecSet), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface GetIdxArgs {
  vecSet: ObjectArg
  t0: GenericArg
}

export function getIdx(txb: TransactionBlock, typeArg: string, args: GetIdxArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::get_idx`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.vecSet), generic(txb, `${typeArg}`, args.t0)],
  })
}

export function intoKeys(txb: TransactionBlock, typeArg: string, vecSet: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vec_set::into_keys`,
    typeArguments: [typeArg],
    arguments: [obj(txb, vecSet)],
  })
}
