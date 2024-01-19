import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock, u64: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::new`,
    arguments: [pure(txb, u64, `u64`)],
  })
}

export function length(txb: TransactionBlock, bitVector: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::length`,
    arguments: [obj(txb, bitVector)],
  })
}

export interface SetArgs {
  bitVector: ObjectArg
  u64: bigint | TransactionArgument
}

export function set(txb: TransactionBlock, args: SetArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::set`,
    arguments: [obj(txb, args.bitVector), pure(txb, args.u64, `u64`)],
  })
}

export interface UnsetArgs {
  bitVector: ObjectArg
  u64: bigint | TransactionArgument
}

export function unset(txb: TransactionBlock, args: UnsetArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::unset`,
    arguments: [obj(txb, args.bitVector), pure(txb, args.u64, `u64`)],
  })
}

export interface ShiftLeftArgs {
  bitVector: ObjectArg
  u64: bigint | TransactionArgument
}

export function shiftLeft(txb: TransactionBlock, args: ShiftLeftArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::shift_left`,
    arguments: [obj(txb, args.bitVector), pure(txb, args.u64, `u64`)],
  })
}

export interface IsIndexSetArgs {
  bitVector: ObjectArg
  u64: bigint | TransactionArgument
}

export function isIndexSet(txb: TransactionBlock, args: IsIndexSetArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::is_index_set`,
    arguments: [obj(txb, args.bitVector), pure(txb, args.u64, `u64`)],
  })
}

export interface LongestSetSequenceStartingAtArgs {
  bitVector: ObjectArg
  u64: bigint | TransactionArgument
}

export function longestSetSequenceStartingAt(
  txb: TransactionBlock,
  args: LongestSetSequenceStartingAtArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::longest_set_sequence_starting_at`,
    arguments: [obj(txb, args.bitVector), pure(txb, args.u64, `u64`)],
  })
}
