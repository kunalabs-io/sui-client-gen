import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction, length: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::bit_vector::new`,
    arguments: [pure(tx, length, `u64`)],
  })
}

export interface SetArgs {
  bitvector: TransactionObjectInput
  bitIndex: bigint | TransactionArgument
}

/** Set the bit at `bit_index` in the `bitvector` regardless of its previous state. */
export function set(tx: Transaction, args: SetArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::bit_vector::set`,
    arguments: [obj(tx, args.bitvector), pure(tx, args.bitIndex, `u64`)],
  })
}

export interface UnsetArgs {
  bitvector: TransactionObjectInput
  bitIndex: bigint | TransactionArgument
}

/** Unset the bit at `bit_index` in the `bitvector` regardless of its previous state. */
export function unset(tx: Transaction, args: UnsetArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::bit_vector::unset`,
    arguments: [obj(tx, args.bitvector), pure(tx, args.bitIndex, `u64`)],
  })
}

export interface ShiftLeftArgs {
  bitvector: TransactionObjectInput
  amount: bigint | TransactionArgument
}

/**
 * Shift the `bitvector` left by `amount`. If `amount` is greater than the
 * bitvector's length the bitvector will be zeroed out.
 */
export function shiftLeft(tx: Transaction, args: ShiftLeftArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::bit_vector::shift_left`,
    arguments: [obj(tx, args.bitvector), pure(tx, args.amount, `u64`)],
  })
}

export interface IsIndexSetArgs {
  bitvector: TransactionObjectInput
  bitIndex: bigint | TransactionArgument
}

/**
 * Return the value of the bit at `bit_index` in the `bitvector`. `true`
 * represents "1" and `false` represents a 0
 */
export function isIndexSet(tx: Transaction, args: IsIndexSetArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::bit_vector::is_index_set`,
    arguments: [obj(tx, args.bitvector), pure(tx, args.bitIndex, `u64`)],
  })
}

/** Return the length (number of usable bits) of this bitvector */
export function length(tx: Transaction, bitvector: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::bit_vector::length`,
    arguments: [obj(tx, bitvector)],
  })
}

export interface LongestSetSequenceStartingAtArgs {
  bitvector: TransactionObjectInput
  startIndex: bigint | TransactionArgument
}

/**
 * Returns the length of the longest sequence of set bits starting at (and
 * including) `start_index` in the `bitvector`. If there is no such
 * sequence, then `0` is returned.
 */
export function longestSetSequenceStartingAt(
  tx: Transaction,
  args: LongestSetSequenceStartingAtArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::bit_vector::longest_set_sequence_starting_at`,
    arguments: [obj(tx, args.bitvector), pure(tx, args.startIndex, `u64`)],
  })
}
