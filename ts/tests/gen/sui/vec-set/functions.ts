import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, vector } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function empty(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function singleton(tx: Transaction, typeArg: string, key: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, key)],
  })
}

export interface InsertArgs {
  self: TransactionObjectInput
  key: GenericArg
}

export function insert(tx: Transaction, typeArg: string, args: InsertArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::insert`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), generic(tx, `${typeArg}`, args.key)],
  })
}

export interface RemoveArgs {
  self: TransactionObjectInput
  key: GenericArg
}

export function remove(tx: Transaction, typeArg: string, args: RemoveArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), generic(tx, `${typeArg}`, args.key)],
  })
}

export interface ContainsArgs {
  self: TransactionObjectInput
  key: GenericArg
}

export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::contains`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), generic(tx, `${typeArg}`, args.key)],
  })
}

export function length(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::length`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function isEmpty(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function intoKeys(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::into_keys`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function fromKeys(
  tx: Transaction,
  typeArg: string,
  keys: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::from_keys`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, keys)],
  })
}

export function keys(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::keys`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function size(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vec_set::size`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
