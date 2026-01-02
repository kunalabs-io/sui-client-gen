import { PUBLISHED_AT } from '..'
import { GenericArg, generic, option, option as option_ } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function none(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::none`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function some(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::some`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function isNone(
  tx: Transaction,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::is_none`,
    typeArguments: [typeArg],
    arguments: [option_(tx, `${typeArg}`, option)],
  })
}

export function isSome(
  tx: Transaction,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::is_some`,
    typeArguments: [typeArg],
    arguments: [option_(tx, `${typeArg}`, option)],
  })
}

export interface ContainsArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::contains`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.option), generic(tx, `${typeArg}`, args.t0)],
  })
}

export function borrow(
  tx: Transaction,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::borrow`,
    typeArguments: [typeArg],
    arguments: [option_(tx, `${typeArg}`, option)],
  })
}

export interface BorrowWithDefaultArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function borrowWithDefault(tx: Transaction, typeArg: string, args: BorrowWithDefaultArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::borrow_with_default`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.option), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface GetWithDefaultArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function getWithDefault(tx: Transaction, typeArg: string, args: GetWithDefaultArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::get_with_default`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.option), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface FillArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function fill(tx: Transaction, typeArg: string, args: FillArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::fill`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.option), generic(tx, `${typeArg}`, args.t0)],
  })
}

export function extract(
  tx: Transaction,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::extract`,
    typeArguments: [typeArg],
    arguments: [option_(tx, `${typeArg}`, option)],
  })
}

export function borrowMut(
  tx: Transaction,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [option_(tx, `${typeArg}`, option)],
  })
}

export interface SwapArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function swap(tx: Transaction, typeArg: string, args: SwapArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::swap`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.option), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface SwapOrFillArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function swapOrFill(tx: Transaction, typeArg: string, args: SwapOrFillArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::swap_or_fill`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.option), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface DestroyWithDefaultArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function destroyWithDefault(tx: Transaction, typeArg: string, args: DestroyWithDefaultArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::destroy_with_default`,
    typeArguments: [typeArg],
    arguments: [option(tx, `${typeArg}`, args.option), generic(tx, `${typeArg}`, args.t0)],
  })
}

export function destroySome(
  tx: Transaction,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::destroy_some`,
    typeArguments: [typeArg],
    arguments: [option_(tx, `${typeArg}`, option)],
  })
}

export function destroyNone(
  tx: Transaction,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::destroy_none`,
    typeArguments: [typeArg],
    arguments: [option_(tx, `${typeArg}`, option)],
  })
}

export function toVec(
  tx: Transaction,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::option::to_vec`,
    typeArguments: [typeArg],
    arguments: [option_(tx, `${typeArg}`, option)],
  })
}
