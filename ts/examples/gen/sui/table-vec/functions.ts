import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface BorrowArgs {
  t: ObjectArg
  i: bigint | TransactionArgument
}

export function borrow(txb: TransactionBlock, typeArg: Type, args: BorrowArgs) {
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

export function borrowMut(txb: TransactionBlock, typeArg: Type, args: BorrowMutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.t), pure(txb, args.i, `u64`)],
  })
}

export function destroyEmpty(txb: TransactionBlock, typeArg: Type, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}

export function empty(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function isEmpty(txb: TransactionBlock, typeArg: Type, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::is_empty`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}

export function length(txb: TransactionBlock, typeArg: Type, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::length`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}

export function popBack(txb: TransactionBlock, typeArg: Type, t: ObjectArg) {
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

export function pushBack(txb: TransactionBlock, typeArg: Type, args: PushBackArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::push_back`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.t), generic(txb, `${typeArg}`, args.e)],
  })
}

export function singleton(txb: TransactionBlock, typeArg: Type, e: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::table_vec::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, e)],
  })
}
