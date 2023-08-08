import { PUBLISHED_AT } from '..'
import { GenericArg, Type, generic, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface ContainsArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

export function contains(txb: TransactionBlock, typeArg: Type, args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::contains`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.v), generic(txb, `${typeArg}`, args.e)],
  })
}

export interface IndexOfArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

export function indexOf(txb: TransactionBlock, typeArg: Type, args: IndexOfArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::index_of`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.v), generic(txb, `${typeArg}`, args.e)],
  })
}

export interface AppendArgs {
  lhs: Array<GenericArg> | TransactionArgument
  other: Array<GenericArg> | TransactionArgument
}

export function append(txb: TransactionBlock, typeArg: Type, args: AppendArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::append`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.lhs), vector(txb, `${typeArg}`, args.other)],
  })
}

export interface BorrowArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function borrow(txb: TransactionBlock, typeArg: Type, args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::borrow`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.v), pure(txb, args.i, `u64`)],
  })
}

export interface BorrowMutArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function borrowMut(txb: TransactionBlock, typeArg: Type, args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.v), pure(txb, args.i, `u64`)],
  })
}

export function destroyEmpty(
  txb: TransactionBlock,
  typeArg: Type,
  v: Array<GenericArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, v)],
  })
}

export function empty(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface InsertArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
  i: bigint | TransactionArgument
}

export function insert(txb: TransactionBlock, typeArg: Type, args: InsertArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::insert`,
    typeArguments: [typeArg],
    arguments: [
      vector(txb, `${typeArg}`, args.v),
      generic(txb, `${typeArg}`, args.e),
      pure(txb, args.i, `u64`),
    ],
  })
}

export function isEmpty(
  txb: TransactionBlock,
  typeArg: Type,
  v: Array<GenericArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::is_empty`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, v)],
  })
}

export function length(
  txb: TransactionBlock,
  typeArg: Type,
  v: Array<GenericArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::length`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, v)],
  })
}

export function popBack(
  txb: TransactionBlock,
  typeArg: Type,
  v: Array<GenericArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::pop_back`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, v)],
  })
}

export interface PushBackArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

export function pushBack(txb: TransactionBlock, typeArg: Type, args: PushBackArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::push_back`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.v), generic(txb, `${typeArg}`, args.e)],
  })
}

export interface RemoveArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function remove(txb: TransactionBlock, typeArg: Type, args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::remove`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.v), pure(txb, args.i, `u64`)],
  })
}

export function reverse(
  txb: TransactionBlock,
  typeArg: Type,
  v: Array<GenericArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::reverse`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, v)],
  })
}

export function singleton(txb: TransactionBlock, typeArg: Type, e: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, e)],
  })
}

export interface SwapArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function swap(txb: TransactionBlock, typeArg: Type, args: SwapArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::swap`,
    typeArguments: [typeArg],
    arguments: [
      vector(txb, `${typeArg}`, args.v),
      pure(txb, args.i, `u64`),
      pure(txb, args.j, `u64`),
    ],
  })
}

export interface SwapRemoveArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function swapRemove(txb: TransactionBlock, typeArg: Type, args: SwapRemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::swap_remove`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.v), pure(txb, args.i, `u64`)],
  })
}
