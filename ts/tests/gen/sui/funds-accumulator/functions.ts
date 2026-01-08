import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

/** Returns the owner, either a sender's address or an object, of the withdrawal. */
export function withdrawalOwner(
  tx: Transaction,
  typeArg: string,
  withdrawal: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::withdrawal_owner`,
    typeArguments: [typeArg],
    arguments: [obj(tx, withdrawal)],
  })
}

/** Returns the remaining limit of the withdrawal. */
export function withdrawalLimit(
  tx: Transaction,
  typeArg: string,
  withdrawal: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::withdrawal_limit`,
    typeArguments: [typeArg],
    arguments: [obj(tx, withdrawal)],
  })
}

export interface WithdrawalSplitArgs {
  withdrawal: TransactionObjectInput
  subLimit: bigint | TransactionArgument
}

/** Split a `Withdrawal` and take a sub-withdrawal from it with the specified sub-limit. */
export function withdrawalSplit(tx: Transaction, typeArg: string, args: WithdrawalSplitArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::withdrawal_split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.withdrawal), pure(tx, args.subLimit, `u256`)],
  })
}

export interface WithdrawalJoinArgs {
  withdrawal: TransactionObjectInput
  other: TransactionObjectInput
}

/**
 * Join two withdrawals together, increasing the limit of `self` by the limit of `other`.
 * Aborts with `EOwnerMismatch` if the owners are not equal.
 * Aborts with `EOverflow` if the resulting limit would overflow `u256`.
 */
export function withdrawalJoin(tx: Transaction, typeArg: string, args: WithdrawalJoinArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::withdrawal_join`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.withdrawal), obj(tx, args.other)],
  })
}

export function redeem(tx: Transaction, typeArg: string, withdrawal: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::redeem`,
    typeArguments: [typeArg],
    arguments: [obj(tx, withdrawal)],
  })
}

export interface WithdrawFromObjectArgs {
  obj: TransactionObjectInput
  limit: bigint | TransactionArgument
}

export function withdrawFromObject(tx: Transaction, typeArg: string, args: WithdrawFromObjectArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::withdraw_from_object`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.obj), pure(tx, args.limit, `u256`)],
  })
}

export interface AddImplArgs {
  value: GenericArg
  recipient: string | TransactionArgument
}

export function addImpl(tx: Transaction, typeArg: string, args: AddImplArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::add_impl`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, args.value), pure(tx, args.recipient, `address`)],
  })
}

export interface WithdrawImplArgs {
  owner: string | TransactionArgument
  value: bigint | TransactionArgument
}

export function withdrawImpl(tx: Transaction, typeArg: string, args: WithdrawImplArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::withdraw_impl`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.owner, `address`), pure(tx, args.value, `u256`)],
  })
}

export interface AddToAccumulatorAddressArgs {
  accumulator: string | TransactionArgument
  recipient: string | TransactionArgument
  value: GenericArg
}

export function addToAccumulatorAddress(
  tx: Transaction,
  typeArg: string,
  args: AddToAccumulatorAddressArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::add_to_accumulator_address`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.accumulator, `address`),
      pure(tx, args.recipient, `address`),
      generic(tx, `${typeArg}`, args.value),
    ],
  })
}

export interface WithdrawFromAccumulatorAddressArgs {
  accumulator: string | TransactionArgument
  owner: string | TransactionArgument
  value: bigint | TransactionArgument
}

export function withdrawFromAccumulatorAddress(
  tx: Transaction,
  typeArg: string,
  args: WithdrawFromAccumulatorAddressArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::withdraw_from_accumulator_address`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.accumulator, `address`),
      pure(tx, args.owner, `address`),
      pure(tx, args.value, `u256`),
    ],
  })
}

export interface CreateWithdrawalArgs {
  owner: string | TransactionArgument
  limit: bigint | TransactionArgument
}

export function createWithdrawal(tx: Transaction, typeArg: string, args: CreateWithdrawalArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::funds_accumulator::create_withdrawal`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.owner, `address`), pure(tx, args.limit, `u256`)],
  })
}
