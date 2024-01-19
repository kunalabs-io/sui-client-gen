import { PUBLISHED_AT } from '..'
import { GenericArg, generic, option, option as option_ } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function borrow(
  txb: TransactionBlock,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::borrow`,
    typeArguments: [typeArg],
    arguments: [option_(txb, `${typeArg}`, option)],
  })
}

export function borrowMut(
  txb: TransactionBlock,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [option_(txb, `${typeArg}`, option)],
  })
}

export interface SwapArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function swap(txb: TransactionBlock, typeArg: string, args: SwapArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::swap`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.option), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface ContainsArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function contains(txb: TransactionBlock, typeArg: string, args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::contains`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.option), generic(txb, `${typeArg}`, args.t0)],
  })
}

export function none(txb: TransactionBlock, typeArg: string) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::none`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function some(txb: TransactionBlock, typeArg: string, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::some`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function isNone(
  txb: TransactionBlock,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::is_none`,
    typeArguments: [typeArg],
    arguments: [option_(txb, `${typeArg}`, option)],
  })
}

export function isSome(
  txb: TransactionBlock,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::is_some`,
    typeArguments: [typeArg],
    arguments: [option_(txb, `${typeArg}`, option)],
  })
}

export interface BorrowWithDefaultArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function borrowWithDefault(
  txb: TransactionBlock,
  typeArg: string,
  args: BorrowWithDefaultArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::borrow_with_default`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.option), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface GetWithDefaultArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function getWithDefault(txb: TransactionBlock, typeArg: string, args: GetWithDefaultArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::get_with_default`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.option), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface FillArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function fill(txb: TransactionBlock, typeArg: string, args: FillArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::fill`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.option), generic(txb, `${typeArg}`, args.t0)],
  })
}

export function extract(
  txb: TransactionBlock,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::extract`,
    typeArguments: [typeArg],
    arguments: [option_(txb, `${typeArg}`, option)],
  })
}

export interface SwapOrFillArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function swapOrFill(txb: TransactionBlock, typeArg: string, args: SwapOrFillArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::swap_or_fill`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.option), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface DestroyWithDefaultArgs {
  option: GenericArg | TransactionArgument | null
  t0: GenericArg
}

export function destroyWithDefault(
  txb: TransactionBlock,
  typeArg: string,
  args: DestroyWithDefaultArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::destroy_with_default`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.option), generic(txb, `${typeArg}`, args.t0)],
  })
}

export function destroySome(
  txb: TransactionBlock,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::destroy_some`,
    typeArguments: [typeArg],
    arguments: [option_(txb, `${typeArg}`, option)],
  })
}

export function destroyNone(
  txb: TransactionBlock,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::destroy_none`,
    typeArguments: [typeArg],
    arguments: [option_(txb, `${typeArg}`, option)],
  })
}

export function toVec(
  txb: TransactionBlock,
  typeArg: string,
  option: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::to_vec`,
    typeArguments: [typeArg],
    arguments: [option_(txb, `${typeArg}`, option)],
  })
}
