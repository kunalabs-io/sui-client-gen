import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface BorrowArgs {
  t: ObjectArg
  i: bigint | TransactionArgument
}

export function borrow(txb: TransactionBlock, typeArg: string, args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.t), pure(txb, args.i, `u64`)],
  })
}

export interface BorrowMutArgs {
  t: ObjectArg
  i: bigint | TransactionArgument
}

export function borrowMut(txb: TransactionBlock, typeArg: string, args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.t), pure(txb, args.i, `u64`)],
  })
}

export function destroyEmpty(txb: TransactionBlock, typeArg: string, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}

export function empty(txb: TransactionBlock, typeArg: string) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function isEmpty(txb: TransactionBlock, typeArg: string, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}

export function length(txb: TransactionBlock, typeArg: string, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::length`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}

export function popBack(txb: TransactionBlock, typeArg: string, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::pop_back`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}

export interface PushBackArgs {
  t: ObjectArg
  e: GenericArg
}

export function pushBack(txb: TransactionBlock, typeArg: string, args: PushBackArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::push_back`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.t), generic(txb, `${typeArg}`, args.e)],
  })
}

export function singleton(txb: TransactionBlock, typeArg: string, e: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, e)],
  })
}

export interface SwapArgs {
  t: ObjectArg
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function swap(txb: TransactionBlock, typeArg: string, args: SwapArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::swap`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.t), pure(txb, args.i, `u64`), pure(txb, args.j, `u64`)],
  })
}

export interface SwapRemoveArgs {
  t: ObjectArg
  i: bigint | TransactionArgument
}

export function swapRemove(txb: TransactionBlock, typeArg: string, args: SwapRemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::swap_remove`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.t), pure(txb, args.i, `u64`)],
  })
}

export function drop(txb: TransactionBlock, typeArg: string, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::drop`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}
