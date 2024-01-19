import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(
  txb: TransactionBlock,
  typeArg: Type,
  vecEntry: Array<ObjectArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::new`,
    typeArguments: [typeArg],
    arguments: [vector(txb, `0x2::priority_queue::Entry<${typeArg}>`, vecEntry)],
  })
}

export interface InsertArgs {
  priorityQueue: ObjectArg
  u64: bigint | TransactionArgument
  t0: GenericArg
}

export function insert(txb: TransactionBlock, typeArg: Type, args: InsertArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::insert`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.priorityQueue),
      pure(txb, args.u64, `u64`),
      generic(txb, `${typeArg}`, args.t0),
    ],
  })
}

export function popMax(txb: TransactionBlock, typeArg: Type, priorityQueue: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::pop_max`,
    typeArguments: [typeArg],
    arguments: [obj(txb, priorityQueue)],
  })
}

export interface NewEntryArgs {
  u64: bigint | TransactionArgument
  t0: GenericArg
}

export function newEntry(txb: TransactionBlock, typeArg: Type, args: NewEntryArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::new_entry`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.u64, `u64`), generic(txb, `${typeArg}`, args.t0)],
  })
}

export interface CreateEntriesArgs {
  vecU64: Array<bigint | TransactionArgument> | TransactionArgument
  vecT0: Array<GenericArg> | TransactionArgument
}

export function createEntries(txb: TransactionBlock, typeArg: Type, args: CreateEntriesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::create_entries`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.vecU64, `vector<u64>`), vector(txb, `${typeArg}`, args.vecT0)],
  })
}

export interface RestoreHeapRecursiveArgs {
  vecEntry: Array<ObjectArg> | TransactionArgument
  u64: bigint | TransactionArgument
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
      vector(txb, `0x2::priority_queue::Entry<${typeArg}>`, args.vecEntry),
      pure(txb, args.u64, `u64`),
    ],
  })
}

export interface MaxHeapifyRecursiveArgs {
  vecEntry: Array<ObjectArg> | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
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
      vector(txb, `0x2::priority_queue::Entry<${typeArg}>`, args.vecEntry),
      pure(txb, args.u641, `u64`),
      pure(txb, args.u642, `u64`),
    ],
  })
}

export function priorities(txb: TransactionBlock, typeArg: Type, priorityQueue: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::priority_queue::priorities`,
    typeArguments: [typeArg],
    arguments: [obj(txb, priorityQueue)],
  })
}
