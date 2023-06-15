import { PUBLISHED_AT } from '..'
import { ObjectArg, Type, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface JoinArgs {
  self: ObjectArg
  coin: ObjectArg
}

export function join(txb: TransactionBlock, typeArg: Type, args: JoinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::join`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.coin)],
  })
}

export interface SplitArgs {
  self: ObjectArg
  splitAmount: bigint | TransactionArgument
}

export function split(txb: TransactionBlock, typeArg: Type, args: SplitArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::split`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.splitAmount, `u64`)],
  })
}

export interface DivideAndKeepArgs {
  self: ObjectArg
  n: bigint | TransactionArgument
}

export function divideAndKeep(txb: TransactionBlock, typeArg: Type, args: DivideAndKeepArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::divide_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.n, `u64`)],
  })
}

export interface JoinVecArgs {
  self: ObjectArg
  coins: Array<ObjectArg>
}

export function joinVec(txb: TransactionBlock, typeArg: Type, args: JoinVecArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::join_vec`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), vector(txb, `0x2::coin::Coin<${typeArg}>`, args.coins)],
  })
}

export interface JoinVecAndTransferArgs {
  coins: Array<ObjectArg>
  receiver: string | TransactionArgument
}

export function joinVecAndTransfer(
  txb: TransactionBlock,
  typeArg: Type,
  args: JoinVecAndTransferArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::join_vec_and_transfer`,
    typeArguments: [typeArg],
    arguments: [
      vector(txb, `0x2::coin::Coin<${typeArg}>`, args.coins),
      pure(txb, args.receiver, `address`),
    ],
  })
}

export function keep(txb: TransactionBlock, typeArg: Type, c: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::keep`,
    typeArguments: [typeArg],
    arguments: [obj(txb, c)],
  })
}

export interface SplitAndTransferArgs {
  c: ObjectArg
  amount: bigint | TransactionArgument
  recipient: string | TransactionArgument
}

export function splitAndTransfer(txb: TransactionBlock, typeArg: Type, args: SplitAndTransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::split_and_transfer`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.c),
      pure(txb, args.amount, `u64`),
      pure(txb, args.recipient, `address`),
    ],
  })
}

export interface SplitVecArgs {
  self: ObjectArg
  splitAmounts: Array<bigint | TransactionArgument>
}

export function splitVec(txb: TransactionBlock, typeArg: Type, args: SplitVecArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::split_vec`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.splitAmounts, `vector<u64>`)],
  })
}
