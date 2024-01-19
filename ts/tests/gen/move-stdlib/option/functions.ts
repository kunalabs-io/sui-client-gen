import { PUBLISHED_AT } from '..'
import { GenericArg, generic, option } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function borrow(
  txb: TransactionBlock,
  typeArg: string,
  t: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::borrow`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, t)],
  })
}

export function borrowMut(
  txb: TransactionBlock,
  typeArg: string,
  t: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, t)],
  })
}

export interface ContainsArgs {
  t: GenericArg | TransactionArgument | null
  eRef: GenericArg
}

export function contains(txb: TransactionBlock, typeArg: string, args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::contains`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.t), generic(txb, `${typeArg}`, args.eRef)],
  })
}

export interface SwapArgs {
  t: GenericArg | TransactionArgument | null
  e: GenericArg
}

export function swap(txb: TransactionBlock, typeArg: string, args: SwapArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::swap`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.t), generic(txb, `${typeArg}`, args.e)],
  })
}

export interface BorrowWithDefaultArgs {
  t: GenericArg | TransactionArgument | null
  defaultRef: GenericArg
}

export function borrowWithDefault(
  txb: TransactionBlock,
  typeArg: string,
  args: BorrowWithDefaultArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::borrow_with_default`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.t), generic(txb, `${typeArg}`, args.defaultRef)],
  })
}

export function destroyNone(
  txb: TransactionBlock,
  typeArg: string,
  t: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::destroy_none`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, t)],
  })
}

export function destroySome(
  txb: TransactionBlock,
  typeArg: string,
  t: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::destroy_some`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, t)],
  })
}

export interface DestroyWithDefaultArgs {
  t: GenericArg | TransactionArgument | null
  default: GenericArg
}

export function destroyWithDefault(
  txb: TransactionBlock,
  typeArg: string,
  args: DestroyWithDefaultArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::destroy_with_default`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.t), generic(txb, `${typeArg}`, args.default)],
  })
}

export function extract(
  txb: TransactionBlock,
  typeArg: string,
  t: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::extract`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, t)],
  })
}

export interface FillArgs {
  t: GenericArg | TransactionArgument | null
  e: GenericArg
}

export function fill(txb: TransactionBlock, typeArg: string, args: FillArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::fill`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.t), generic(txb, `${typeArg}`, args.e)],
  })
}

export interface GetWithDefaultArgs {
  t: GenericArg | TransactionArgument | null
  default: GenericArg
}

export function getWithDefault(txb: TransactionBlock, typeArg: string, args: GetWithDefaultArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::get_with_default`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.t), generic(txb, `${typeArg}`, args.default)],
  })
}

export function isNone(
  txb: TransactionBlock,
  typeArg: string,
  t: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::is_none`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, t)],
  })
}

export function isSome(
  txb: TransactionBlock,
  typeArg: string,
  t: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::is_some`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, t)],
  })
}

export function none(txb: TransactionBlock, typeArg: string) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::none`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function some(txb: TransactionBlock, typeArg: string, e: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::some`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, e)],
  })
}

export interface SwapOrFillArgs {
  t: GenericArg | TransactionArgument | null
  e: GenericArg
}

export function swapOrFill(txb: TransactionBlock, typeArg: string, args: SwapOrFillArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::swap_or_fill`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, args.t), generic(txb, `${typeArg}`, args.e)],
  })
}

export function toVec(
  txb: TransactionBlock,
  typeArg: string,
  t: GenericArg | TransactionArgument | null
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::option::to_vec`,
    typeArguments: [typeArg],
    arguments: [option(txb, `${typeArg}`, t)],
  })
}
