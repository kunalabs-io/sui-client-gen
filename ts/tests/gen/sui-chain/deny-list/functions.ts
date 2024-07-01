import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface ContainsArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function contains(tx: Transaction, args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::contains`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface RemoveArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function remove(tx: Transaction, args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::remove`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export function create(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::deny_list::create`, arguments: [] })
}

export interface AddArgs {
  denyList: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function add(tx: Transaction, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::add`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface PerTypeListAddArgs {
  perTypeList: TransactionObjectInput
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function perTypeListAdd(tx: Transaction, args: PerTypeListAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::per_type_list_add`,
    arguments: [
      obj(tx, args.perTypeList),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface PerTypeListRemoveArgs {
  perTypeList: TransactionObjectInput
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function perTypeListRemove(tx: Transaction, args: PerTypeListRemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::per_type_list_remove`,
    arguments: [
      obj(tx, args.perTypeList),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export interface PerTypeListContainsArgs {
  perTypeList: TransactionObjectInput
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  address: string | TransactionArgument
}

export function perTypeListContains(tx: Transaction, args: PerTypeListContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::per_type_list_contains`,
    arguments: [
      obj(tx, args.perTypeList),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.address, `address`),
    ],
  })
}

export function perTypeList(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::deny_list::per_type_list`, arguments: [] })
}
