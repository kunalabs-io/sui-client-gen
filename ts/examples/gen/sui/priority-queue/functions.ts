import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface InsertArgs {
  pq: ObjectArg
  priority: bigint | TransactionArgument
  value: GenericArg
}

export function insert(txb: TransactionBlock, typeArg: Type, args: InsertArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::insert`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.pq),
      pure(txb, args.priority, `u64`),
      generic(txb, `${typeArg}`, args.value),
    ],
  })
}

export function new_(
  txb: TransactionBlock,
  typeArg: Type,
  entries: Array<ObjectArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::new`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `0x2::priority_queue::Entry<${typeArg}>`, entries)],
  })
}

export interface CreateEntriesArgs {
  p: Array<bigint | TransactionArgument> | TransactionArgument
  v: Array<GenericArg> | TransactionArgument
}

export function createEntries(txb: TransactionBlock, typeArg: Type, args: CreateEntriesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::create_entries`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.p, `vector<u64>`), vector(txb, `${typeArg}`, args.v)],
  })
}

export interface MaxHeapifyRecursiveArgs {
  v: Array<ObjectArg> | TransactionArgument
  len: bigint | TransactionArgument
  i: bigint | TransactionArgument
}

export function maxHeapifyRecursive(
  txb: TransactionBlock,
  typeArg: Type,
  args: MaxHeapifyRecursiveArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::max_heapify_recursive`,
    typeArguments: [typeArg],
    arguments: [
      vector(txb, `0x2::priority_queue::Entry<${typeArg}>`, args.v),
      pure(txb, args.len, `u64`),
      pure(txb, args.i, `u64`),
    ],
  })
}

export interface NewEntryArgs {
  priority: bigint | TransactionArgument
  value: GenericArg
}

export function newEntry(txb: TransactionBlock, typeArg: Type, args: NewEntryArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::new_entry`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.priority, `u64`), generic(txb, `${typeArg}`, args.value)],
  })
}

export function popMax(txb: TransactionBlock, typeArg: Type, pq: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::pop_max`,
    typeArguments: [typeArg],
    arguments: [obj(txb, pq)],
  })
}

export function priorities(txb: TransactionBlock, typeArg: Type, pq: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::priorities`,
    typeArguments: [typeArg],
    arguments: [obj(txb, pq)],
  })
}

export interface RestoreHeapRecursiveArgs {
  v: Array<ObjectArg> | TransactionArgument
  i: bigint | TransactionArgument
}

export function restoreHeapRecursive(
  txb: TransactionBlock,
  typeArg: Type,
  args: RestoreHeapRecursiveArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::restore_heap_recursive`,
    typeArguments: [typeArg],
    arguments: [
      vector(txb, `0x2::priority_queue::Entry<${typeArg}>`, args.v),
      pure(txb, args.i, `u64`),
    ],
  })
}
