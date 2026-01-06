import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, option } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function none(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::none`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function some(tx: Transaction, typeArg: string, e: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::some`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, e)],
  })
}

export function isNone(tx: Transaction, typeArg: string, t: GenericArg | null) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::is_none`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

export function isSome(tx: Transaction, typeArg: string, t: GenericArg | null) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::is_some`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

export interface ContainsArgs {
  t: GenericArg | null
  eRef: GenericArg
}

export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::contains`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.eRef)],
  })
}

export function borrow(tx: Transaction, typeArg: string, t: GenericArg | null) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::borrow`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

export interface BorrowWithDefaultArgs {
  t: GenericArg | null
  defaultRef: GenericArg
}

export function borrowWithDefault(tx: Transaction, typeArg: string, args: BorrowWithDefaultArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::borrow_with_default`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.defaultRef)],
  })
}

export interface GetWithDefaultArgs {
  t: GenericArg | null
  default: GenericArg
}

export function getWithDefault(tx: Transaction, typeArg: string, args: GetWithDefaultArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::get_with_default`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.default)],
  })
}

export interface FillArgs {
  t: GenericArg | null
  e: GenericArg
}

export function fill(tx: Transaction, typeArg: string, args: FillArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::fill`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.e)],
  })
}

export function extract(tx: Transaction, typeArg: string, t: GenericArg | null) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::extract`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

export function borrowMut(tx: Transaction, typeArg: string, t: GenericArg | null) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

export interface SwapArgs {
  t: GenericArg | null
  e: GenericArg
}

export function swap(tx: Transaction, typeArg: string, args: SwapArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::swap`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.e)],
  })
}

export interface SwapOrFillArgs {
  t: GenericArg | null
  e: GenericArg
}

export function swapOrFill(tx: Transaction, typeArg: string, args: SwapOrFillArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::swap_or_fill`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.e)],
  })
}

export interface DestroyWithDefaultArgs {
  t: GenericArg | null
  default: GenericArg
}

export function destroyWithDefault(tx: Transaction, typeArg: string, args: DestroyWithDefaultArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::destroy_with_default`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.t), generic(tx, `${typeArg}`, args.default)],
  })
}

export function destroySome(tx: Transaction, typeArg: string, t: GenericArg | null) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::destroy_some`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

export function destroyNone(tx: Transaction, typeArg: string, t: GenericArg | null) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::destroy_none`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}

export function toVec(tx: Transaction, typeArg: string, t: GenericArg | null) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::option::to_vec`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, t)],
  })
}
