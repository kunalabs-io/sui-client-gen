import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure, vector } from '../../_framework/util'
import { Entry } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface CreateEntriesArgs {
  p: Array<bigint | TransactionArgument> | TransactionArgument
  v: Array<GenericArg> | TransactionArgument
}

export function createEntries(tx: Transaction, typeArg: string, args: CreateEntriesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::create_entries`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.p, `vector<u64>`), vector(tx, `${typeArg}`, args.v)],
  })
}

export interface InsertArgs {
  pq: TransactionObjectInput
  priority: bigint | TransactionArgument
  value: GenericArg
}

export function insert(tx: Transaction, typeArg: string, args: InsertArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::insert`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.pq),
      pure(tx, args.priority, `u64`),
      generic(tx, `${typeArg}`, args.value),
    ],
  })
}

export interface MaxHeapifyRecursiveArgs {
  v: Array<TransactionObjectInput> | TransactionArgument
  len: bigint | TransactionArgument
  i: bigint | TransactionArgument
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
      vector(tx, `${Entry.$typeName}<${typeArg}>`, args.v),
      pure(tx, args.len, `u64`),
      pure(tx, args.i, `u64`),
    ],
  })
}

export function new_(
  tx: Transaction,
  typeArg: string,
  entries: Array<TransactionObjectInput> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::new`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${Entry.$typeName}<${typeArg}>`, entries)],
  })
}

export interface NewEntryArgs {
  priority: bigint | TransactionArgument
  value: GenericArg
}

export function newEntry(tx: Transaction, typeArg: string, args: NewEntryArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::new_entry`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.priority, `u64`), generic(tx, `${typeArg}`, args.value)],
  })
}

export function popMax(tx: Transaction, typeArg: string, pq: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::pop_max`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pq)],
  })
}

export function priorities(tx: Transaction, typeArg: string, pq: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::priorities`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pq)],
  })
}

export interface RestoreHeapRecursiveArgs {
  v: Array<TransactionObjectInput> | TransactionArgument
  i: bigint | TransactionArgument
}

export function restoreHeapRecursive(
  tx: Transaction,
  typeArg: string,
  args: RestoreHeapRecursiveArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::restore_heap_recursive`,
    typeArguments: [typeArg],
    arguments: [vector(tx, `${Entry.$typeName}<${typeArg}>`, args.v), pure(tx, args.i, `u64`)],
  })
}
