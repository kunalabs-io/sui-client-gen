import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function create(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::create`,
    arguments: [],
  })
}

export function rootId(tx: Transaction, accumulatorRoot: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::root_id`,
    arguments: [obj(tx, accumulatorRoot)],
  })
}

export function rootIdMut(tx: Transaction, accumulatorRoot: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::root_id_mut`,
    arguments: [obj(tx, accumulatorRoot)],
  })
}

export function createU128(tx: Transaction, value: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::create_u128`,
    arguments: [pure(tx, value, `u128`)],
  })
}

export function destroyU128(tx: Transaction, u128: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::destroy_u128`,
    arguments: [obj(tx, u128)],
  })
}

export interface UpdateU128Args {
  u128: TransactionObjectInput
  merge: bigint | TransactionArgument
  split: bigint | TransactionArgument
}

export function updateU128(tx: Transaction, args: UpdateU128Args) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::update_u128`,
    arguments: [obj(tx, args.u128), pure(tx, args.merge, `u128`), pure(tx, args.split, `u128`)],
  })
}

export function isZeroU128(tx: Transaction, u128: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::is_zero_u128`,
    arguments: [obj(tx, u128)],
  })
}

export function accumulatorKey(
  tx: Transaction,
  typeArg: string,
  address: string | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::accumulator_key`,
    typeArguments: [typeArg],
    arguments: [pure(tx, address, `address`)],
  })
}

export function accumulatorAddress(
  tx: Transaction,
  typeArg: string,
  address: string | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::accumulator_address`,
    typeArguments: [typeArg],
    arguments: [pure(tx, address, `address`)],
  })
}

export interface RootHasAccumulatorArgs {
  accumulatorRoot: TransactionObjectInput
  name: TransactionObjectInput
}

/** Balance object methods */
export function rootHasAccumulator(
  tx: Transaction,
  typeArgs: [string, string],
  args: RootHasAccumulatorArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::root_has_accumulator`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.accumulatorRoot), obj(tx, args.name)],
  })
}

export interface RootAddAccumulatorArgs {
  accumulatorRoot: TransactionObjectInput
  name: TransactionObjectInput
  value: GenericArg
}

export function rootAddAccumulator(
  tx: Transaction,
  typeArgs: [string, string],
  args: RootAddAccumulatorArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::root_add_accumulator`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.accumulatorRoot),
      obj(tx, args.name),
      generic(tx, `${typeArgs[1]}`, args.value),
    ],
  })
}

export interface RootBorrowAccumulatorMutArgs {
  accumulatorRoot: TransactionObjectInput
  name: TransactionObjectInput
}

export function rootBorrowAccumulatorMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: RootBorrowAccumulatorMutArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::root_borrow_accumulator_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.accumulatorRoot), obj(tx, args.name)],
  })
}

export interface RootRemoveAccumulatorArgs {
  accumulatorRoot: TransactionObjectInput
  name: TransactionObjectInput
}

export function rootRemoveAccumulator(
  tx: Transaction,
  typeArgs: [string, string],
  args: RootRemoveAccumulatorArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::root_remove_accumulator`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.accumulatorRoot), obj(tx, args.name)],
  })
}

export interface EmitDepositEventArgs {
  accumulator: string | TransactionArgument
  recipient: string | TransactionArgument
  amount: bigint | TransactionArgument
}

export function emitDepositEvent(tx: Transaction, typeArg: string, args: EmitDepositEventArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::emit_deposit_event`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.accumulator, `address`),
      pure(tx, args.recipient, `address`),
      pure(tx, args.amount, `u64`),
    ],
  })
}

export interface EmitWithdrawEventArgs {
  accumulator: string | TransactionArgument
  owner: string | TransactionArgument
  amount: bigint | TransactionArgument
}

export function emitWithdrawEvent(tx: Transaction, typeArg: string, args: EmitWithdrawEventArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator::emit_withdraw_event`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.accumulator, `address`),
      pure(tx, args.owner, `address`),
      pure(tx, args.amount, `u64`),
    ],
  })
}
