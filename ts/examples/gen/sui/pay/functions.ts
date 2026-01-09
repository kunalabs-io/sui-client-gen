import { getPublishedAt } from '../../_envs'
import { obj, pure, vector } from '../../_framework/util'
import { Coin } from '../coin/structs'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

/** Transfer `c` to the sender of the current transaction */
export function keep(
  tx: Transaction,
  typeArg: string,
  c: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::pay::keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, c)],
  })
}

export interface SplitArgs {
  coin: TransactionObjectInput
  splitAmount: bigint | TransactionArgument
}

/**
 * Split `coin` to two coins, one with balance `split_amount`,
 * and the remaining balance is left in `coin`.
 */
export function split(tx: Transaction, typeArg: string, args: SplitArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::pay::split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin), pure(tx, args.splitAmount, `u64`)],
  })
}

export interface SplitVecArgs {
  self: TransactionObjectInput
  splitAmounts: Array<bigint | TransactionArgument> | TransactionArgument
}

/**
 * Split coin `self` into multiple coins, each with balance specified
 * in `split_amounts`. Remaining balance is left in `self`.
 */
export function splitVec(tx: Transaction, typeArg: string, args: SplitVecArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::pay::split_vec`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.splitAmounts, `vector<u64>`)],
  })
}

export interface SplitAndTransferArgs {
  c: TransactionObjectInput
  amount: bigint | TransactionArgument
  recipient: string | TransactionArgument
}

/**
 * Send `amount` units of `c` to `recipient`
 * Aborts with `sui::balance::ENotEnough` if `amount` is greater than the balance in `c`
 */
export function splitAndTransfer(
  tx: Transaction,
  typeArg: string,
  args: SplitAndTransferArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::pay::split_and_transfer`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.c), pure(tx, args.amount, `u64`), pure(tx, args.recipient, `address`)],
  })
}

export interface DivideAndKeepArgs {
  self: TransactionObjectInput
  n: bigint | TransactionArgument
}

/**
 * Divide coin `self` into `n - 1` coins with equal balances. If the balance is
 * not evenly divisible by `n`, the remainder is left in `self`.
 */
export function divideAndKeep(
  tx: Transaction,
  typeArg: string,
  args: DivideAndKeepArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::pay::divide_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.n, `u64`)],
  })
}

export interface JoinArgs {
  self: TransactionObjectInput
  coin: TransactionObjectInput
}

/**
 * Join `coin` into `self`. Re-exports `coin::join` function.
 * Deprecated: you should call `coin.join(other)` directly.
 */
export function join(tx: Transaction, typeArg: string, args: JoinArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::pay::join`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.coin)],
  })
}

export interface JoinVecArgs {
  self: TransactionObjectInput
  coins: Array<TransactionObjectInput> | TransactionArgument
}

/** Join everything in `coins` with `self` */
export function joinVec(tx: Transaction, typeArg: string, args: JoinVecArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::pay::join_vec`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), vector(tx, `${Coin.$typeName}<${typeArg}>`, args.coins)],
  })
}

export interface JoinVecAndTransferArgs {
  coins: Array<TransactionObjectInput> | TransactionArgument
  receiver: string | TransactionArgument
}

/** Join a vector of `Coin` into a single object and transfer it to `receiver`. */
export function joinVecAndTransfer(
  tx: Transaction,
  typeArg: string,
  args: JoinVecAndTransferArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::pay::join_vec_and_transfer`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${Coin.$typeName}<${typeArg}>`, args.coins),
      pure(tx, args.receiver, `address`),
    ],
  })
}
