import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface ContainsArgs {
  denyList: ObjectArg
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function contains(txb: TransactionBlock, args: ContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::deny_list::contains`,
    arguments: [
      obj(txb, args.denyList),
      pure(txb, args.u64, `u64`),
      pure(txb, args.vecU8, `vector<u8>`),
      pure(txb, args.address, `address`),
    ],
  })
}

export interface RemoveArgs {
  denyList: ObjectArg
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function remove(txb: TransactionBlock, args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::deny_list::remove`,
    arguments: [
      obj(txb, args.denyList),
      pure(txb, args.u64, `u64`),
      pure(txb, args.vecU8, `vector<u8>`),
      pure(txb, args.address, `address`),
    ],
  })
}

export function create(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::deny_list::create`, arguments: [] })
}

export interface AddArgs {
  denyList: ObjectArg
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function add(txb: TransactionBlock, args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::deny_list::add`,
    arguments: [
      obj(txb, args.denyList),
      pure(txb, args.u64, `u64`),
      pure(txb, args.vecU8, `vector<u8>`),
      pure(txb, args.address, `address`),
    ],
  })
}

export interface PerTypeListAddArgs {
  perTypeList: ObjectArg
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function perTypeListAdd(txb: TransactionBlock, args: PerTypeListAddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::deny_list::per_type_list_add`,
    arguments: [
      obj(txb, args.perTypeList),
      pure(txb, args.vecU8, `vector<u8>`),
      pure(txb, args.address, `address`),
    ],
  })
}

export interface PerTypeListRemoveArgs {
  perTypeList: ObjectArg
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function perTypeListRemove(txb: TransactionBlock, args: PerTypeListRemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::deny_list::per_type_list_remove`,
    arguments: [
      obj(txb, args.perTypeList),
      pure(txb, args.vecU8, `vector<u8>`),
      pure(txb, args.address, `address`),
    ],
  })
}

export interface PerTypeListContainsArgs {
  perTypeList: ObjectArg
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function perTypeListContains(txb: TransactionBlock, args: PerTypeListContainsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::deny_list::per_type_list_contains`,
    arguments: [
      obj(txb, args.perTypeList),
      pure(txb, args.vecU8, `vector<u8>`),
      pure(txb, args.address, `address`),
    ],
  })
}

export function perTypeList(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::deny_list::per_type_list`, arguments: [] })
}
