import { PUBLISHED_AT } from '..'
import { GenericArg, generic, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function empty(txb: TransactionBlock, typeArg: string) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function length(
  txb: TransactionBlock,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::length`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, vecT0)],
  })
}

export interface BorrowArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function borrow(txb: TransactionBlock, typeArg: string, args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::borrow`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.vecT0), pure(txb, args.u64, `u64`)],
  })
}

export interface PushBackArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  t0: GenericArg
}

export function pushBack(txb: TransactionBlock, typeArg: string, args: PushBackArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::push_back`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.vecT0), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function borrowMut(txb: TransactionBlock, typeArg: string, args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.vecT0), pure(txb, args.u64, `u64`)],
  })
}

export function popBack(
  txb: TransactionBlock,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::pop_back`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, vecT0)],
  })
}

export function destroyEmpty(
  txb: TransactionBlock,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, vecT0)],
  })
}

export interface SwapArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function swap(txb: TransactionBlock, typeArg: string, args: SwapArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::swap`,
    typeArguments: [typeArg],
    arguments: [
      vector(txb, `${typeArg}`, args.vecT0),
      pure(txb, args.u641, `u64`),
      pure(txb, args.u642, `u64`),
    ],
  })
}

export function singleton(txb: TransactionBlock, typeArg: string, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function reverse(
  txb: TransactionBlock,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::reverse`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, vecT0)],
  })
}

export interface AppendArgs {
  vecT01: Array<GenericArg> | TransactionArgument
  vecT02: Array<GenericArg> | TransactionArgument
}

export function append(txb: TransactionBlock, typeArg: string, args: AppendArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::append`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.vecT01), vector(txb, `${typeArg}`, args.vecT02)],
  })
}

export function isEmpty(
  txb: TransactionBlock,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::is_empty`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, vecT0)],
  })
}

export interface ContainsArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  t0: GenericArg
}

export function contains(txb: TransactionBlock, typeArg: string, args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::contains`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.vecT0), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface IndexOfArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  t0: GenericArg
}

export function indexOf(txb: TransactionBlock, typeArg: string, args: IndexOfArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::index_of`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.vecT0), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface RemoveArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function remove(txb: TransactionBlock, typeArg: string, args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::remove`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.vecT0), pure(txb, args.u64, `u64`)],
  })
}

export interface InsertArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  t0: GenericArg
  u64: bigint | TransactionArgument
}

export function insert(txb: TransactionBlock, typeArg: string, args: InsertArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::insert`,
    typeArguments: [typeArg],
    arguments: [
      vector(txb, `${typeArg}`, args.vecT0),
      generic(txb, `${typeArg}`, args.t0),
      pure(txb, args.u64, `u64`),
    ],
  })
}

export interface SwapRemoveArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function swapRemove(txb: TransactionBlock, typeArg: string, args: SwapRemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::vector::swap_remove`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `${typeArg}`, args.vecT0), pure(txb, args.u64, `u64`)],
  })
}
