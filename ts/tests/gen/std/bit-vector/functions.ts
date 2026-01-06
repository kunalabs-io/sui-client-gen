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

export function isIndexSet(tx: Transaction, args: IsIndexSetArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::bit_vector::is_index_set`,
    arguments: [obj(tx, args.bitvector), pure(tx, args.bitIndex, `u64`)],
  })
}

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

export function longestSetSequenceStartingAt(
  tx: Transaction,
  args: LongestSetSequenceStartingAtArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::bit_vector::longest_set_sequence_starting_at`,
    arguments: [obj(tx, args.bitvector), pure(tx, args.startIndex, `u64`)],
  })
}
