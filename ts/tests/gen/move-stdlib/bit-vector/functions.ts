import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export function length(txb: TransactionBlock, bitvector: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::length`,
    arguments: [obj(txb, bitvector)],
  })
}

export interface IsIndexSetArgs {
  bitvector: ObjectArg
  bitIndex: bigint | TransactionArgument
}

export function isIndexSet(txb: TransactionBlock, args: IsIndexSetArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::is_index_set`,
    arguments: [obj(txb, args.bitvector), pure(txb, args.bitIndex, `u64`)],
  })
}

export interface LongestSetSequenceStartingAtArgs {
  bitvector: ObjectArg
  startIndex: bigint | TransactionArgument
}

export function longestSetSequenceStartingAt(
  txb: TransactionBlock,
  args: LongestSetSequenceStartingAtArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::longest_set_sequence_starting_at`,
    arguments: [obj(txb, args.bitvector), pure(txb, args.startIndex, `u64`)],
  })
}

export function new_(txb: TransactionBlock, length: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::new`,
    arguments: [pure(txb, length, `u64`)],
  })
}

export interface SetArgs {
  bitvector: ObjectArg
  bitIndex: bigint | TransactionArgument
}

export function set(txb: TransactionBlock, args: SetArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::set`,
    arguments: [obj(txb, args.bitvector), pure(txb, args.bitIndex, `u64`)],
  })
}

export interface ShiftLeftArgs {
  bitvector: ObjectArg
  amount: bigint | TransactionArgument
}

export function shiftLeft(txb: TransactionBlock, args: ShiftLeftArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::shift_left`,
    arguments: [obj(txb, args.bitvector), pure(txb, args.amount, `u64`)],
  })
}

export interface UnsetArgs {
  bitvector: ObjectArg
  bitIndex: bigint | TransactionArgument
}

export function unset(txb: TransactionBlock, args: UnsetArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::unset`,
    arguments: [obj(txb, args.bitvector), pure(txb, args.bitIndex, `u64`)],
  })
}
