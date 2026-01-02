import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function create(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::create`,
    arguments: [],
  })
}

export function rootId(tx: Transaction, accumulatorRoot: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::root_id`,
    arguments: [obj(tx, accumulatorRoot)],
  })
}

export function rootIdMut(tx: Transaction, accumulatorRoot: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::root_id_mut`,
    arguments: [obj(tx, accumulatorRoot)],
  })
}

export function createU128(tx: Transaction, u128: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::create_u128`,
    arguments: [pure(tx, u128, `u128`)],
  })
}

export function destroyU128(tx: Transaction, u128: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::destroy_u128`,
    arguments: [obj(tx, u128)],
  })
}

export interface UpdateU128Args {
  u1281: TransactionObjectInput
  u1282: bigint | TransactionArgument
  u1283: bigint | TransactionArgument
}

export function updateU128(tx: Transaction, args: UpdateU128Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::update_u128`,
    arguments: [obj(tx, args.u1281), pure(tx, args.u1282, `u128`), pure(tx, args.u1283, `u128`)],
  })
}

export function isZeroU128(tx: Transaction, u128: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::is_zero_u128`,
    arguments: [obj(tx, u128)],
  })
}

export function accumulatorKey(
  tx: Transaction,
  typeArg: string,
  address: string | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::accumulator_key`,
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
    target: `${PUBLISHED_AT}::accumulator::accumulator_address`,
    typeArguments: [typeArg],
    arguments: [pure(tx, address, `address`)],
  })
}

export interface RootHasAccumulatorArgs {
  accumulatorRoot: TransactionObjectInput
  key: TransactionObjectInput
}

export function rootHasAccumulator(
  tx: Transaction,
  typeArgs: [string, string],
  args: RootHasAccumulatorArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::root_has_accumulator`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.accumulatorRoot), obj(tx, args.key)],
  })
}

export interface RootAddAccumulatorArgs {
  accumulatorRoot: TransactionObjectInput
  key: TransactionObjectInput
  t1: GenericArg
}

export function rootAddAccumulator(
  tx: Transaction,
  typeArgs: [string, string],
  args: RootAddAccumulatorArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::root_add_accumulator`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.accumulatorRoot),
      obj(tx, args.key),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}

export interface RootBorrowAccumulatorMutArgs {
  accumulatorRoot: TransactionObjectInput
  key: TransactionObjectInput
}

export function rootBorrowAccumulatorMut(
  tx: Transaction,
  typeArgs: [string, string],
  args: RootBorrowAccumulatorMutArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::root_borrow_accumulator_mut`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.accumulatorRoot), obj(tx, args.key)],
  })
}

export interface RootRemoveAccumulatorArgs {
  accumulatorRoot: TransactionObjectInput
  key: TransactionObjectInput
}

export function rootRemoveAccumulator(
  tx: Transaction,
  typeArgs: [string, string],
  args: RootRemoveAccumulatorArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::root_remove_accumulator`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.accumulatorRoot), obj(tx, args.key)],
  })
}

export interface EmitDepositEventArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
  u64: bigint | TransactionArgument
}

export function emitDepositEvent(tx: Transaction, typeArg: string, args: EmitDepositEventArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::emit_deposit_event`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.address1, `address`),
      pure(tx, args.address2, `address`),
      pure(tx, args.u64, `u64`),
    ],
  })
}

export interface EmitWithdrawEventArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
  u64: bigint | TransactionArgument
}

export function emitWithdrawEvent(tx: Transaction, typeArg: string, args: EmitWithdrawEventArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator::emit_withdraw_event`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.address1, `address`),
      pure(tx, args.address2, `address`),
      pure(tx, args.u64, `u64`),
    ],
  })
}
