import { PUBLISHED_AT } from '..'
import { ObjectArg, Type, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface AdminWithdrawFeesAndTransferToSenderArgs {
  pool: ObjectArg
  adminCap: ObjectArg
  amount: bigint | TransactionArgument
}

export function adminWithdrawFeesAndTransferToSender(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: AdminWithdrawFeesAndTransferToSenderArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::admin_withdraw_fees_and_transfer_to_sender`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.pool), obj(txb, args.adminCap), pure(txb, args.amount, `u64`)],
  })
}

export interface AdminWithdrawFeesCoinArgs {
  pool: ObjectArg
  adminCap: ObjectArg
  amount: bigint | TransactionArgument
}

export function adminWithdrawFeesCoin(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: AdminWithdrawFeesCoinArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::admin_withdraw_fees_coin`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.pool), obj(txb, args.adminCap), pure(txb, args.amount, `u64`)],
  })
}

export interface CreatePoolAndTransferLpToSenderArgs {
  registry: ObjectArg
  initA: ObjectArg
  initB: ObjectArg
  lpFeeBps: bigint | TransactionArgument
  adminFeePct: bigint | TransactionArgument
}

export function createPoolAndTransferLpToSender(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: CreatePoolAndTransferLpToSenderArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::create_pool_and_transfer_lp_to_sender`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.registry),
      obj(txb, args.initA),
      obj(txb, args.initB),
      pure(txb, args.lpFeeBps, `u64`),
      pure(txb, args.adminFeePct, `u64`),
    ],
  })
}

export interface CreatePoolWithCoinsArgs {
  registry: ObjectArg
  initA: ObjectArg
  initB: ObjectArg
  lpFeeBps: bigint | TransactionArgument
  adminFeePct: bigint | TransactionArgument
}

export function createPoolWithCoins(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: CreatePoolWithCoinsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::create_pool_with_coins`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.registry),
      obj(txb, args.initA),
      obj(txb, args.initB),
      pure(txb, args.lpFeeBps, `u64`),
      pure(txb, args.adminFeePct, `u64`),
    ],
  })
}

export interface DepositAndTransferToSenderArgs {
  pool: ObjectArg
  inputA: ObjectArg
  inputB: ObjectArg
  minLpOut: bigint | TransactionArgument
}

export function depositAndTransferToSender(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: DepositAndTransferToSenderArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::deposit_and_transfer_to_sender`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.pool),
      obj(txb, args.inputA),
      obj(txb, args.inputB),
      pure(txb, args.minLpOut, `u64`),
    ],
  })
}

export interface DepositCoinsArgs {
  pool: ObjectArg
  inputA: ObjectArg
  inputB: ObjectArg
  minLpOut: bigint | TransactionArgument
}

export function depositCoins(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: DepositCoinsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::deposit_coins`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.pool),
      obj(txb, args.inputA),
      obj(txb, args.inputB),
      pure(txb, args.minLpOut, `u64`),
    ],
  })
}

export interface DestroyOrTransferBalanceArgs {
  balance: ObjectArg
  recipient: string | TransactionArgument
}

export function destroyOrTransferBalance(
  txb: TransactionBlock,
  typeArg: Type,
  args: DestroyOrTransferBalanceArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::destroy_or_transfer_balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.balance), pure(txb, args.recipient, `address`)],
  })
}

export interface DestroyOrTransferCoinArgs {
  coin: ObjectArg
  recipient: string | TransactionArgument
}

export function destroyOrTransferCoin(
  txb: TransactionBlock,
  typeArg: Type,
  args: DestroyOrTransferCoinArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::destroy_or_transfer_coin`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.coin), pure(txb, args.recipient, `address`)],
  })
}

export interface SwapAAndTransferToSenderArgs {
  pool: ObjectArg
  input: ObjectArg
  minOut: bigint | TransactionArgument
}

export function swapAAndTransferToSender(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: SwapAAndTransferToSenderArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::swap_a_and_transfer_to_sender`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.pool), obj(txb, args.input), pure(txb, args.minOut, `u64`)],
  })
}

export interface SwapACoinArgs {
  pool: ObjectArg
  input: ObjectArg
  minOut: bigint | TransactionArgument
}

export function swapACoin(txb: TransactionBlock, typeArgs: [Type, Type], args: SwapACoinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::swap_a_coin`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.pool), obj(txb, args.input), pure(txb, args.minOut, `u64`)],
  })
}

export interface SwapBAndTransferToSenderArgs {
  pool: ObjectArg
  input: ObjectArg
  minOut: bigint | TransactionArgument
}

export function swapBAndTransferToSender(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: SwapBAndTransferToSenderArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::swap_b_and_transfer_to_sender`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.pool), obj(txb, args.input), pure(txb, args.minOut, `u64`)],
  })
}

export interface SwapBCoinArgs {
  pool: ObjectArg
  input: ObjectArg
  minOut: bigint | TransactionArgument
}

export function swapBCoin(txb: TransactionBlock, typeArgs: [Type, Type], args: SwapBCoinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::swap_b_coin`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.pool), obj(txb, args.input), pure(txb, args.minOut, `u64`)],
  })
}

export interface WithdrawAndTransferToSenderArgs {
  pool: ObjectArg
  lpIn: ObjectArg
  minAOut: bigint | TransactionArgument
  minBOut: bigint | TransactionArgument
}

export function withdrawAndTransferToSender(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: WithdrawAndTransferToSenderArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::withdraw_and_transfer_to_sender`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.pool),
      obj(txb, args.lpIn),
      pure(txb, args.minAOut, `u64`),
      pure(txb, args.minBOut, `u64`),
    ],
  })
}

export interface WithdrawCoinsArgs {
  pool: ObjectArg
  lpIn: ObjectArg
  minAOut: bigint | TransactionArgument
  minBOut: bigint | TransactionArgument
}

export function withdrawCoins(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: WithdrawCoinsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::util::withdraw_coins`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.pool),
      obj(txb, args.lpIn),
      pure(txb, args.minAOut, `u64`),
      pure(txb, args.minBOut, `u64`),
    ],
  })
}
