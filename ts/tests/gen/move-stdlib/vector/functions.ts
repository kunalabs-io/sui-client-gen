import { PUBLISHED_AT } from '..'
import { GenericArg, generic, pure, vector } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export interface AppendArgs {
  lhs: Array<GenericArg> | TransactionArgument
  other: Array<GenericArg> | TransactionArgument
}

export function append(tx: Transaction, typeArg: string, args: AppendArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::append`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.lhs), vector(tx, `${typeArg}`, args.other)],
  })
}

export interface BorrowArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function borrow(tx: Transaction, typeArg: string, args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::borrow`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.i, `u64`)],
  })
}

export interface BorrowMutArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function borrowMut(tx: Transaction, typeArg: string, args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.i, `u64`)],
  })
}

export interface ContainsArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::contains`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), generic(tx, `${typeArg}`, args.e)],
  })
}

export function destroyEmpty(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export function empty(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface IndexOfArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

export function indexOf(tx: Transaction, typeArg: string, args: IndexOfArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::index_of`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), generic(tx, `${typeArg}`, args.e)],
  })
}

export interface InsertArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
  i: bigint | TransactionArgument
}

export function insert(tx: Transaction, typeArg: string, args: InsertArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::insert`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      generic(tx, `${typeArg}`, args.e),
      pure(tx, args.i, `u64`),
    ],
  })
}

export function isEmpty(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::is_empty`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export function length(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::length`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export function popBack(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::pop_back`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export interface PushBackArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

export function pushBack(tx: Transaction, typeArg: string, args: PushBackArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::push_back`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), generic(tx, `${typeArg}`, args.e)],
  })
}

export interface RemoveArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function remove(tx: Transaction, typeArg: string, args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::remove`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.i, `u64`)],
  })
}

export function reverse(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::reverse`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export function singleton(tx: Transaction, typeArg: string, e: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, e)],
  })
}

export interface SwapArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function swap(tx: Transaction, typeArg: string, args: SwapArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::swap`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.i, `u64`), pure(tx, args.j, `u64`)],
  })
}

export interface SwapRemoveArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function swapRemove(tx: Transaction, typeArg: string, args: SwapRemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::swap_remove`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.i, `u64`)],
  })
}
