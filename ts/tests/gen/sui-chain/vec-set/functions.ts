import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, vector } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function empty(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function singleton(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export interface InsertArgs {
  vecSet: TransactionObjectInput
  t0: GenericArg
}

export function insert(tx: Transaction, typeArg: string, args: InsertArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::insert`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.vecSet), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface RemoveArgs {
  vecSet: TransactionObjectInput
  t0: GenericArg
}

export function remove(tx: Transaction, typeArg: string, args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.vecSet), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface ContainsArgs {
  vecSet: TransactionObjectInput
  t0: GenericArg
}

export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::contains`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.vecSet), generic(tx, `${typeArg}`, args.t0)],
  })
}

export function size(tx: Transaction, typeArg: string, vecSet: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::size`,
    typeArguments: [typeArg],
    arguments: [obj(tx, vecSet)],
  })
}

export function isEmpty(tx: Transaction, typeArg: string, vecSet: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(tx, vecSet)],
  })
}

export function intoKeys(tx: Transaction, typeArg: string, vecSet: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::into_keys`,
    typeArguments: [typeArg],
    arguments: [obj(tx, vecSet)],
  })
}

export function fromKeys(
  tx: Transaction,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::from_keys`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, vecT0)],
  })
}

export function keys(tx: Transaction, typeArg: string, vecSet: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::keys`,
    typeArguments: [typeArg],
    arguments: [obj(tx, vecSet)],
  })
}

export interface GetIdxOptArgs {
  vecSet: TransactionObjectInput
  t0: GenericArg
}

export function getIdxOpt(tx: Transaction, typeArg: string, args: GetIdxOptArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::get_idx_opt`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.vecSet), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface GetIdxArgs {
  vecSet: TransactionObjectInput
  t0: GenericArg
}

export function getIdx(tx: Transaction, typeArg: string, args: GetIdxArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vec_set::get_idx`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.vecSet), generic(tx, `${typeArg}`, args.t0)],
  })
}
