import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function empty(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function length(txb: TransactionBlock, typeArg: Type, tableVec: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::length`,
    typeArguments: [typeArg],
    arguments: [obj(txb, tableVec)],
  })
}

export interface BorrowArgs {
  tableVec: ObjectArg
  u64: bigint | TransactionArgument
}

export function borrow(txb: TransactionBlock, typeArg: Type, args: BorrowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tableVec), pure(txb, args.u64, `u64`)],
  })
}

export interface PushBackArgs {
  tableVec: ObjectArg
  t0: GenericArg
}

export function pushBack(txb: TransactionBlock, typeArg: Type, args: PushBackArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::push_back`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tableVec), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  tableVec: ObjectArg
  u64: bigint | TransactionArgument
}

export function borrowMut(txb: TransactionBlock, typeArg: Type, args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tableVec), pure(txb, args.u64, `u64`)],
  })
}

export function popBack(txb: TransactionBlock, typeArg: Type, tableVec: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::pop_back`,
    typeArguments: [typeArg],
    arguments: [obj(txb, tableVec)],
  })
}

export function destroyEmpty(txb: TransactionBlock, typeArg: Type, tableVec: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [obj(txb, tableVec)],
  })
}

export interface SwapArgs {
  tableVec: ObjectArg
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function swap(txb: TransactionBlock, typeArg: Type, args: SwapArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::swap`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tableVec), pure(txb, args.u641, `u64`), pure(txb, args.u642, `u64`)],
  })
}

export function singleton(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function isEmpty(txb: TransactionBlock, typeArg: Type, tableVec: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(txb, tableVec)],
  })
}

export interface SwapRemoveArgs {
  tableVec: ObjectArg
  u64: bigint | TransactionArgument
}

export function swapRemove(txb: TransactionBlock, typeArg: Type, args: SwapRemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::swap_remove`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tableVec), pure(txb, args.u64, `u64`)],
  })
}

export function drop(txb: TransactionBlock, typeArg: Type, tableVec: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::drop`,
    typeArguments: [typeArg],
    arguments: [obj(txb, tableVec)],
  })
}
