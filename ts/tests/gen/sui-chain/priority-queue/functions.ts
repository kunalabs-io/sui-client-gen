import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure, vector } from '../../_framework/util'
import { Entry } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(
  tx: Transaction,
  typeArg: string,
  vecEntry: Array<TransactionObjectInput> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::new`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${Entry.$typeName}<${typeArg}>`, vecEntry)],
  })
}

export function popMax(tx: Transaction, typeArg: string, priorityQueue: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::pop_max`,
    typeArguments: [typeArg],
    arguments: [obj(tx, priorityQueue)],
  })
}

export interface InsertArgs {
  priorityQueue: TransactionObjectInput
  u64: bigint | TransactionArgument
  t0: GenericArg
}

export function insert(tx: Transaction, typeArg: string, args: InsertArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::insert`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.priorityQueue),
      pure(tx, args.u64, `u64`),
      generic(tx, `${typeArg}`, args.t0),
    ],
  })
}

export interface NewEntryArgs {
  u64: bigint | TransactionArgument
  t0: GenericArg
}

export function newEntry(tx: Transaction, typeArg: string, args: NewEntryArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::new_entry`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.u64, `u64`), generic(tx, `${typeArg}`, args.t0)],
  })
}

export interface CreateEntriesArgs {
  vecU64: Array<bigint | TransactionArgument> | TransactionArgument
  vecT0: Array<GenericArg> | TransactionArgument
}

export function createEntries(tx: Transaction, typeArg: string, args: CreateEntriesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::create_entries`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.vecU64, `vector<u64>`), vector(tx, `${typeArg}`, args.vecT0)],
  })
}

export interface RestoreHeapRecursiveArgs {
  vecEntry: Array<TransactionObjectInput> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function restoreHeapRecursive(
  tx: Transaction,
  typeArg: string,
  args: RestoreHeapRecursiveArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::restore_heap_recursive`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${Entry.$typeName}<${typeArg}>`, args.vecEntry),
      pure(tx, args.u64, `u64`),
    ],
  })
}

export interface MaxHeapifyRecursiveArgs {
  vecEntry: Array<TransactionObjectInput> | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function maxHeapifyRecursive(
  tx: Transaction,
  typeArg: string,
  args: MaxHeapifyRecursiveArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::max_heapify_recursive`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${Entry.$typeName}<${typeArg}>`, args.vecEntry),
      pure(tx, args.u641, `u64`),
      pure(tx, args.u642, `u64`),
    ],
  })
}

export function priorities(
  tx: Transaction,
  typeArg: string,
  priorityQueue: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::priorities`,
    typeArguments: [typeArg],
    arguments: [obj(tx, priorityQueue)],
  })
}
