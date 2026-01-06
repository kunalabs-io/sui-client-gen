import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, pure, vector } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function empty(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function length(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::length`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export interface BorrowArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function borrow(tx: Transaction, typeArg: string, args: BorrowArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::borrow`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.i, `u64`)],
  })
}

export interface PushBackArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

export function pushBack(tx: Transaction, typeArg: string, args: PushBackArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::push_back`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), generic(tx, `${typeArg}`, args.e)],
  })
}

export interface BorrowMutArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function borrowMut(tx: Transaction, typeArg: string, args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.i, `u64`)],
  })
}

export function popBack(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::pop_back`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export function destroyEmpty(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export interface SwapArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function swap(tx: Transaction, typeArg: string, args: SwapArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::swap`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.i, `u64`), pure(tx, args.j, `u64`)],
  })
}

export function singleton(tx: Transaction, typeArg: string, e: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, e)],
  })
}

export function reverse(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::reverse`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export interface AppendArgs {
  lhs: Array<GenericArg> | TransactionArgument
  other: Array<GenericArg> | TransactionArgument
}

export function append(tx: Transaction, typeArg: string, args: AppendArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::append`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.lhs), vector(tx, `${typeArg}`, args.other)],
  })
}

export function isEmpty(
  tx: Transaction,
  typeArg: string,
  v: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::is_empty`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, v)],
  })
}

export interface ContainsArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::contains`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), generic(tx, `${typeArg}`, args.e)],
  })
}

export interface IndexOfArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
}

export function indexOf(tx: Transaction, typeArg: string, args: IndexOfArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::index_of`,
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
    target: `${getPublishedAt('std')}::vector::remove`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.i, `u64`)],
  })
}

export interface InsertArgs {
  v: Array<GenericArg> | TransactionArgument
  e: GenericArg
  i: bigint | TransactionArgument
}

export function insert(tx: Transaction, typeArg: string, args: InsertArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::insert`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.v),
      generic(tx, `${typeArg}`, args.e),
      pure(tx, args.i, `u64`),
    ],
  })
}

export interface SwapRemoveArgs {
  v: Array<GenericArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function swapRemove(tx: Transaction, typeArg: string, args: SwapRemoveArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::swap_remove`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.i, `u64`)],
  })
}

export interface SkipArgs {
  v: Array<GenericArg> | TransactionArgument
  n: bigint | TransactionArgument
}

export function skip(tx: Transaction, typeArg: string, args: SkipArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::skip`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.n, `u64`)],
  })
}

export interface TakeArgs {
  v: Array<GenericArg> | TransactionArgument
  n: bigint | TransactionArgument
}

export function take(tx: Transaction, typeArg: string, args: TakeArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::take`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.v), pure(tx, args.n, `u64`)],
  })
}

export function flatten(
  tx: Transaction,
  typeArg: string,
  v: Array<Array<GenericArg> | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::vector::flatten`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `vector<${typeArg}>`, v)],
  })
}
