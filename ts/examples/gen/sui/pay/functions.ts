import { PUBLISHED_AT } from '..'
import { obj, pure, vector } from '../../_framework/util'
import { Coin } from '../coin/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface DivideAndKeepArgs {
  self: TransactionObjectInput
  n: bigint | TransactionArgument
}

export function divideAndKeep(tx: Transaction, typeArg: string, args: DivideAndKeepArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::divide_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.n, `u64`)],
  })
}

export interface JoinArgs {
  self: TransactionObjectInput
  coin: TransactionObjectInput
}

export function join(tx: Transaction, typeArg: string, args: JoinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::join`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.coin)],
  })
}

export interface JoinVecArgs {
  self: TransactionObjectInput
  coins: Array<TransactionObjectInput> | TransactionArgument
}

export function joinVec(tx: Transaction, typeArg: string, args: JoinVecArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::join_vec`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), vector(tx, `${Coin.$typeName}<${typeArg}>`, args.coins)],
  })
}

export interface JoinVecAndTransferArgs {
  coins: Array<TransactionObjectInput> | TransactionArgument
  receiver: string | TransactionArgument
}

export function joinVecAndTransfer(tx: Transaction, typeArg: string, args: JoinVecAndTransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::join_vec_and_transfer`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${Coin.$typeName}<${typeArg}>`, args.coins),
      pure(tx, args.receiver, `address`),
    ],
  })
}

export function keep(tx: Transaction, typeArg: string, c: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, c)],
  })
}

export interface SplitArgs {
  coin: TransactionObjectInput
  splitAmount: bigint | TransactionArgument
}

export function split(tx: Transaction, typeArg: string, args: SplitArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin), pure(tx, args.splitAmount, `u64`)],
  })
}

export interface SplitAndTransferArgs {
  c: TransactionObjectInput
  amount: bigint | TransactionArgument
  recipient: string | TransactionArgument
}

export function splitAndTransfer(tx: Transaction, typeArg: string, args: SplitAndTransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::split_and_transfer`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.c), pure(tx, args.amount, `u64`), pure(tx, args.recipient, `address`)],
  })
}

export interface SplitVecArgs {
  self: TransactionObjectInput
  splitAmounts: Array<bigint | TransactionArgument> | TransactionArgument
}

export function splitVec(tx: Transaction, typeArg: string, args: SplitVecArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::split_vec`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.splitAmounts, `vector<u64>`)],
  })
}
