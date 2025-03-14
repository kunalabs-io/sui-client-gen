import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface AddArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function add(tx: Transaction, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::add`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface ContainsArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function contains(tx: Transaction, args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::contains`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export function create(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::deny_list::create`, arguments: [] })
}

export function perTypeList(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::deny_list::per_type_list`, arguments: [] })
}

export interface PerTypeListAddArgs {
  list: TransactionObjectInput
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function perTypeListAdd(tx: Transaction, args: PerTypeListAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::per_type_list_add`,
    arguments: [
      obj(tx, args.list),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface PerTypeListContainsArgs {
  list: TransactionObjectInput
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function perTypeListContains(tx: Transaction, args: PerTypeListContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::per_type_list_contains`,
    arguments: [
      obj(tx, args.list),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface PerTypeListRemoveArgs {
  list: TransactionObjectInput
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function perTypeListRemove(tx: Transaction, args: PerTypeListRemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::per_type_list_remove`,
    arguments: [
      obj(tx, args.list),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}

export interface RemoveArgs {
  denyList: TransactionObjectInput
  perTypeIndex: bigint | TransactionArgument
  type: Array<number | TransactionArgument> | TransactionArgument
  addr: string | TransactionArgument
}

export function remove(tx: Transaction, args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::deny_list::remove`,
    arguments: [
      obj(tx, args.denyList),
      pure(tx, args.perTypeIndex, `u64`),
      pure(tx, args.type, `vector<u8>`),
      pure(tx, args.addr, `address`),
    ],
  })
}
