import { PUBLISHED_AT } from '..'
import { ObjectArg, Type, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface JoinArgs {
  coin1: ObjectArg
  coin2: ObjectArg
}

export function join(txb: TransactionBlock, typeArg: Type, args: JoinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::join`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.coin1), obj(txb, args.coin2)],
  })
}

export interface SplitArgs {
  coin: ObjectArg
  u64: bigint | TransactionArgument
}

export function split(txb: TransactionBlock, typeArg: Type, args: SplitArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::split`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.coin), pure(txb, args.u64, `u64`)],
  })
}

export function keep(txb: TransactionBlock, typeArg: Type, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::keep`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export interface SplitVecArgs {
  coin: ObjectArg
  vecU64: Array<bigint | TransactionArgument> | TransactionArgument
}

export function splitVec(txb: TransactionBlock, typeArg: Type, args: SplitVecArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::split_vec`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.coin), pure(txb, args.vecU64, `vector<u64>`)],
  })
}

export interface SplitAndTransferArgs {
  coin: ObjectArg
  u64: bigint | TransactionArgument
  address: string | TransactionArgument
}

export function splitAndTransfer(txb: TransactionBlock, typeArg: Type, args: SplitAndTransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::split_and_transfer`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.coin),
      pure(txb, args.u64, `u64`),
      pure(txb, args.address, `address`),
    ],
  })
}

export interface DivideAndKeepArgs {
  coin: ObjectArg
  u64: bigint | TransactionArgument
}

export function divideAndKeep(txb: TransactionBlock, typeArg: Type, args: DivideAndKeepArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::divide_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.coin), pure(txb, args.u64, `u64`)],
  })
}

export interface JoinVecArgs {
  coin: ObjectArg
  vecCoin: Array<ObjectArg> | TransactionArgument
}

export function joinVec(txb: TransactionBlock, typeArg: Type, args: JoinVecArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pay::join_vec`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.coin), vector(txb, `0x2::coin::Coin<${typeArg}>`, args.vecCoin)],
  })
}

export interface JoinVecAndTransferArgs {
  vecCoin: Array<ObjectArg> | TransactionArgument
  address: string | TransactionArgument
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
      vector(txb, `0x2::coin::Coin<${typeArg}>`, args.vecCoin),
      pure(txb, args.address, `address`),
    ],
  })
}
