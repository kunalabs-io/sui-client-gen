import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface DestroyOrTransferBalanceArgs {
  balance: TransactionObjectInput
  recipient: string | TransactionArgument
}

export function destroyOrTransferBalance(
  tx: Transaction,
  typeArg: string,
  args: DestroyOrTransferBalanceArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::destroy_or_transfer_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.balance), pure(tx, args.recipient, `address`)],
  })
}

export interface DestroyOrTransferCoinArgs {
  coin: TransactionObjectInput
  recipient: string | TransactionArgument
}

export function destroyOrTransferCoin(
  tx: Transaction,
  typeArg: string,
  args: DestroyOrTransferCoinArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::destroy_or_transfer_coin`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.coin), pure(tx, args.recipient, `address`)],
  })
}

export interface CreatePoolWithCoinsArgs {
  registry: TransactionObjectInput
  initA: TransactionObjectInput
  initB: TransactionObjectInput
  lpFeeBps: bigint | TransactionArgument
  adminFeePct: bigint | TransactionArgument
}

export function createPoolWithCoins(
  tx: Transaction,
  typeArgs: [string, string],
  args: CreatePoolWithCoinsArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::create_pool_with_coins`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.registry),
      obj(tx, args.initA),
      obj(tx, args.initB),
      pure(tx, args.lpFeeBps, `u64`),
      pure(tx, args.adminFeePct, `u64`),
    ],
  })
}

export interface CreatePoolAndTransferLpToSenderArgs {
  registry: TransactionObjectInput
  initA: TransactionObjectInput
  initB: TransactionObjectInput
  lpFeeBps: bigint | TransactionArgument
  adminFeePct: bigint | TransactionArgument
}

export function createPoolAndTransferLpToSender(
  tx: Transaction,
  typeArgs: [string, string],
  args: CreatePoolAndTransferLpToSenderArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::create_pool_and_transfer_lp_to_sender`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.registry),
      obj(tx, args.initA),
      obj(tx, args.initB),
      pure(tx, args.lpFeeBps, `u64`),
      pure(tx, args.adminFeePct, `u64`),
    ],
  })
}

export interface DepositCoinsArgs {
  pool: TransactionObjectInput
  inputA: TransactionObjectInput
  inputB: TransactionObjectInput
  minLpOut: bigint | TransactionArgument
}

export function depositCoins(tx: Transaction, typeArgs: [string, string], args: DepositCoinsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::deposit_coins`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.pool),
      obj(tx, args.inputA),
      obj(tx, args.inputB),
      pure(tx, args.minLpOut, `u64`),
    ],
  })
}

export interface DepositAndTransferToSenderArgs {
  pool: TransactionObjectInput
  inputA: TransactionObjectInput
  inputB: TransactionObjectInput
  minLpOut: bigint | TransactionArgument
}

export function depositAndTransferToSender(
  tx: Transaction,
  typeArgs: [string, string],
  args: DepositAndTransferToSenderArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::deposit_and_transfer_to_sender`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.pool),
      obj(tx, args.inputA),
      obj(tx, args.inputB),
      pure(tx, args.minLpOut, `u64`),
    ],
  })
}

export interface WithdrawCoinsArgs {
  pool: TransactionObjectInput
  lpIn: TransactionObjectInput
  minAOut: bigint | TransactionArgument
  minBOut: bigint | TransactionArgument
}

export function withdrawCoins(
  tx: Transaction,
  typeArgs: [string, string],
  args: WithdrawCoinsArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::withdraw_coins`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.pool),
      obj(tx, args.lpIn),
      pure(tx, args.minAOut, `u64`),
      pure(tx, args.minBOut, `u64`),
    ],
  })
}

export interface WithdrawAndTransferToSenderArgs {
  pool: TransactionObjectInput
  lpIn: TransactionObjectInput
  minAOut: bigint | TransactionArgument
  minBOut: bigint | TransactionArgument
}

export function withdrawAndTransferToSender(
  tx: Transaction,
  typeArgs: [string, string],
  args: WithdrawAndTransferToSenderArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::withdraw_and_transfer_to_sender`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.pool),
      obj(tx, args.lpIn),
      pure(tx, args.minAOut, `u64`),
      pure(tx, args.minBOut, `u64`),
    ],
  })
}

export interface SwapACoinArgs {
  pool: TransactionObjectInput
  input: TransactionObjectInput
  minOut: bigint | TransactionArgument
}

export function swapACoin(tx: Transaction, typeArgs: [string, string], args: SwapACoinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::swap_a_coin`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.input), pure(tx, args.minOut, `u64`)],
  })
}

export interface SwapAAndTransferToSenderArgs {
  pool: TransactionObjectInput
  input: TransactionObjectInput
  minOut: bigint | TransactionArgument
}

export function swapAAndTransferToSender(
  tx: Transaction,
  typeArgs: [string, string],
  args: SwapAAndTransferToSenderArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::swap_a_and_transfer_to_sender`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.input), pure(tx, args.minOut, `u64`)],
  })
}

export interface SwapBCoinArgs {
  pool: TransactionObjectInput
  input: TransactionObjectInput
  minOut: bigint | TransactionArgument
}

export function swapBCoin(tx: Transaction, typeArgs: [string, string], args: SwapBCoinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::swap_b_coin`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.input), pure(tx, args.minOut, `u64`)],
  })
}

export interface SwapBAndTransferToSenderArgs {
  pool: TransactionObjectInput
  input: TransactionObjectInput
  minOut: bigint | TransactionArgument
}

export function swapBAndTransferToSender(
  tx: Transaction,
  typeArgs: [string, string],
  args: SwapBAndTransferToSenderArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::swap_b_and_transfer_to_sender`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.input), pure(tx, args.minOut, `u64`)],
  })
}

export interface AdminWithdrawFeesCoinArgs {
  pool: TransactionObjectInput
  adminCap: TransactionObjectInput
  amount: bigint | TransactionArgument
}

export function adminWithdrawFeesCoin(
  tx: Transaction,
  typeArgs: [string, string],
  args: AdminWithdrawFeesCoinArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::admin_withdraw_fees_coin`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.adminCap), pure(tx, args.amount, `u64`)],
  })
}

export interface AdminWithdrawFeesAndTransferToSenderArgs {
  pool: TransactionObjectInput
  adminCap: TransactionObjectInput
  amount: bigint | TransactionArgument
}

export function adminWithdrawFeesAndTransferToSender(
  tx: Transaction,
  typeArgs: [string, string],
  args: AdminWithdrawFeesAndTransferToSenderArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::util::admin_withdraw_fees_and_transfer_to_sender`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.adminCap), pure(tx, args.amount, `u64`)],
  })
}
