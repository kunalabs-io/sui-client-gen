import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction, u64: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::new`,
    arguments: [pure(tx, u64, `u64`)],
  })
}

export interface SetArgs {
  bitVector: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function set(tx: Transaction, args: SetArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::set`,
    arguments: [obj(tx, args.bitVector), pure(tx, args.u64, `u64`)],
  })
}

export interface UnsetArgs {
  bitVector: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function unset(tx: Transaction, args: UnsetArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::unset`,
    arguments: [obj(tx, args.bitVector), pure(tx, args.u64, `u64`)],
  })
}

export interface ShiftLeftArgs {
  bitVector: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function shiftLeft(tx: Transaction, args: ShiftLeftArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::shift_left`,
    arguments: [obj(tx, args.bitVector), pure(tx, args.u64, `u64`)],
  })
}

export interface IsIndexSetArgs {
  bitVector: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function isIndexSet(tx: Transaction, args: IsIndexSetArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::is_index_set`,
    arguments: [obj(tx, args.bitVector), pure(tx, args.u64, `u64`)],
  })
}

export function length(tx: Transaction, bitVector: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::length`,
    arguments: [obj(tx, bitVector)],
  })
}

export interface LongestSetSequenceStartingAtArgs {
  bitVector: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function longestSetSequenceStartingAt(
  tx: Transaction,
  args: LongestSetSequenceStartingAtArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bit_vector::longest_set_sequence_starting_at`,
    arguments: [obj(tx, args.bitVector), pure(tx, args.u64, `u64`)],
  })
}
