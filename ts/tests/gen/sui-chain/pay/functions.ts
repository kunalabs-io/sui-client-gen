import { PUBLISHED_AT } from '..'
import { obj, pure, vector } from '../../_framework/util'
import { Coin } from '../coin/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function keep(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export interface SplitArgs {
  coin: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function split(tx: Transaction, typeArg: string, args: SplitArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin), pure(tx, args.u64, `u64`)],
  })
}

export interface SplitVecArgs {
  coin: TransactionObjectInput
  vecU64: Array<bigint | TransactionArgument> | TransactionArgument
}

export function splitVec(tx: Transaction, typeArg: string, args: SplitVecArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::split_vec`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin), pure(tx, args.vecU64, `vector<u64>`)],
  })
}

export interface SplitAndTransferArgs {
  coin: TransactionObjectInput
  u64: bigint | TransactionArgument
  address: string | TransactionArgument
}

export function splitAndTransfer(tx: Transaction, typeArg: string, args: SplitAndTransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::split_and_transfer`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin), pure(tx, args.u64, `u64`), pure(tx, args.address, `address`)],
  })
}

export interface DivideAndKeepArgs {
  coin: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function divideAndKeep(tx: Transaction, typeArg: string, args: DivideAndKeepArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::divide_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin), pure(tx, args.u64, `u64`)],
  })
}

export interface JoinArgs {
  coin1: TransactionObjectInput
  coin2: TransactionObjectInput
}

export function join(tx: Transaction, typeArg: string, args: JoinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::join`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin1), obj(tx, args.coin2)],
  })
}

export interface JoinVecArgs {
  coin: TransactionObjectInput
  vecCoin: Array<TransactionObjectInput> | TransactionArgument
}

export function joinVec(tx: Transaction, typeArg: string, args: JoinVecArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::join_vec`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin), vector(tx, `${Coin.$typeName}<${typeArg}>`, args.vecCoin)],
  })
}

export interface JoinVecAndTransferArgs {
  vecCoin: Array<TransactionObjectInput> | TransactionArgument
  address: string | TransactionArgument
}

export function joinVecAndTransfer(tx: Transaction, typeArg: string, args: JoinVecAndTransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pay::join_vec_and_transfer`,
    typeArguments: [typeArg],
    arguments: [
      vector(tx, `${Coin.$typeName}<${typeArg}>`, args.vecCoin),
      pure(tx, args.address, `address`),
    ],
  })
}
