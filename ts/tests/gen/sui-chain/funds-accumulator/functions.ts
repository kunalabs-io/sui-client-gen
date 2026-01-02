import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function withdrawalOwner(
  tx: Transaction,
  typeArg: string,
  withdrawal: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::withdrawal_owner`,
    typeArguments: [typeArg],
    arguments: [obj(tx, withdrawal)],
  })
}

export function withdrawalLimit(
  tx: Transaction,
  typeArg: string,
  withdrawal: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::withdrawal_limit`,
    typeArguments: [typeArg],
    arguments: [obj(tx, withdrawal)],
  })
}

export interface WithdrawalSplitArgs {
  withdrawal: TransactionObjectInput
  u256: bigint | TransactionArgument
}

export function withdrawalSplit(tx: Transaction, typeArg: string, args: WithdrawalSplitArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::withdrawal_split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.withdrawal), pure(tx, args.u256, `u256`)],
  })
}

export interface WithdrawalJoinArgs {
  withdrawal1: TransactionObjectInput
  withdrawal2: TransactionObjectInput
}

export function withdrawalJoin(tx: Transaction, typeArg: string, args: WithdrawalJoinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::withdrawal_join`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.withdrawal1), obj(tx, args.withdrawal2)],
  })
}

export function redeem(tx: Transaction, typeArg: string, withdrawal: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::redeem`,
    typeArguments: [typeArg],
    arguments: [obj(tx, withdrawal)],
  })
}

export interface WithdrawFromObjectArgs {
  uid: TransactionObjectInput
  u256: bigint | TransactionArgument
}

export function withdrawFromObject(tx: Transaction, typeArg: string, args: WithdrawFromObjectArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::withdraw_from_object`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.uid), pure(tx, args.u256, `u256`)],
  })
}

export interface AddImplArgs {
  t0: GenericArg
  address: string | TransactionArgument
}

export function addImpl(tx: Transaction, typeArg: string, args: AddImplArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::add_impl`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.t0), pure(tx, args.address, `address`)],
  })
}

export interface WithdrawImplArgs {
  address: string | TransactionArgument
  u256: bigint | TransactionArgument
}

export function withdrawImpl(tx: Transaction, typeArg: string, args: WithdrawImplArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::withdraw_impl`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.address, `address`), pure(tx, args.u256, `u256`)],
  })
}

export interface AddToAccumulatorAddressArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
  t0: GenericArg
}

export function addToAccumulatorAddress(
  tx: Transaction,
  typeArg: string,
  args: AddToAccumulatorAddressArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::add_to_accumulator_address`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.address1, `address`),
      pure(tx, args.address2, `address`),
      generic(tx, `${typeArg}`, args.t0),
    ],
  })
}

export interface WithdrawFromAccumulatorAddressArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
  u256: bigint | TransactionArgument
}

export function withdrawFromAccumulatorAddress(
  tx: Transaction,
  typeArg: string,
  args: WithdrawFromAccumulatorAddressArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::withdraw_from_accumulator_address`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.address1, `address`),
      pure(tx, args.address2, `address`),
      pure(tx, args.u256, `u256`),
    ],
  })
}

export interface CreateWithdrawalArgs {
  address: string | TransactionArgument
  u256: bigint | TransactionArgument
}

export function createWithdrawal(tx: Transaction, typeArg: string, args: CreateWithdrawalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::funds_accumulator::create_withdrawal`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.address, `address`), pure(tx, args.u256, `u256`)],
  })
}
