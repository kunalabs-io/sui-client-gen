import { PUBLISHED_AT } from '..'
import { GenericArg, generic, pure, vector } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function length(
  tx: Transaction,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::length`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, vecT0)],
  })
}

export function empty(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::empty`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface BorrowArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function borrow(tx: Transaction, typeArg: string, args: BorrowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::borrow`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.vecT0), pure(tx, args.u64, `u64`)],
  })
}

export interface PushBackArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  t0: GenericArg
}

export function pushBack(tx: Transaction, typeArg: string, args: PushBackArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::push_back`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.vecT0), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface BorrowMutArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function borrowMut(tx: Transaction, typeArg: string, args: BorrowMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::borrow_mut`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.vecT0), pure(tx, args.u64, `u64`)],
  })
}

export function popBack(
  tx: Transaction,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::pop_back`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, vecT0)],
  })
}

export function destroyEmpty(
  tx: Transaction,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::destroy_empty`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, vecT0)],
  })
}

export interface SwapArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function swap(tx: Transaction, typeArg: string, args: SwapArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::swap`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.vecT0),
      pure(tx, args.u641, `u64`),
      pure(tx, args.u642, `u64`),
    ],
  })
}

export function singleton(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::singleton`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function reverse(
  tx: Transaction,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::reverse`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, vecT0)],
  })
}

export interface AppendArgs {
  vecT01: Array<GenericArg> | TransactionArgument
  vecT02: Array<GenericArg> | TransactionArgument
}

export function append(tx: Transaction, typeArg: string, args: AppendArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::append`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.vecT01), vector(tx, `${typeArg}`, args.vecT02)],
  })
}

export function isEmpty(
  tx: Transaction,
  typeArg: string,
  vecT0: Array<GenericArg> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::is_empty`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, vecT0)],
  })
}

export interface ContainsArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  t0: GenericArg
}

export function contains(tx: Transaction, typeArg: string, args: ContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::contains`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.vecT0), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface IndexOfArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  t0: GenericArg
}

export function indexOf(tx: Transaction, typeArg: string, args: IndexOfArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::index_of`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.vecT0), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface RemoveArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function remove(tx: Transaction, typeArg: string, args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::remove`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.vecT0), pure(tx, args.u64, `u64`)],
  })
}

export interface InsertArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  t0: GenericArg
  u64: bigint | TransactionArgument
}

export function insert(tx: Transaction, typeArg: string, args: InsertArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::insert`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${typeArg}`, args.vecT0),
      generic(tx, `${typeArg}`, args.t0),
      pure(tx, args.u64, `u64`),
    ],
  })
}

export interface SwapRemoveArgs {
  vecT0: Array<GenericArg> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function swapRemove(tx: Transaction, typeArg: string, args: SwapRemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vector::swap_remove`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${typeArg}`, args.vecT0), pure(tx, args.u64, `u64`)],
  })
}
