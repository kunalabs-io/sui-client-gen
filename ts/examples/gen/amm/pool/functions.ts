import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface CreateArgs {
  registry: ObjectArg
  initA: ObjectArg
  initB: ObjectArg
  lpFeeBps: bigint | TransactionArgument
  adminFeePct: bigint | TransactionArgument
}

export function create(txb: TransactionBlock, typeArgs: [string, string], args: CreateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::create`,
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

export interface WithdrawArgs {
  pool: ObjectArg
  lpIn: ObjectArg
  minAOut: bigint | TransactionArgument
  minBOut: bigint | TransactionArgument
}

export function withdraw(txb: TransactionBlock, typeArgs: [string, string], args: WithdrawArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::withdraw`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.pool),
      obj(txb, args.lpIn),
      pure(txb, args.minAOut, `u64`),
      pure(txb, args.minBOut, `u64`),
    ],
  })
}

export function init(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::pool::init`, arguments: [] })
}

export interface AdminWithdrawFeesArgs {
  pool: ObjectArg
  adminCap: ObjectArg
  amount: bigint | TransactionArgument
}

export function adminWithdrawFees(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: AdminWithdrawFeesArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::admin_withdraw_fees`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.pool), obj(txb, args.adminCap), pure(txb, args.amount, `u64`)],
  })
}

export interface CalcSwapResultArgs {
  iValue: bigint | TransactionArgument
  iPoolValue: bigint | TransactionArgument
  oPoolValue: bigint | TransactionArgument
  poolLpValue: bigint | TransactionArgument
  lpFeeBps: bigint | TransactionArgument
  adminFeePct: bigint | TransactionArgument
}

export function calcSwapResult(txb: TransactionBlock, args: CalcSwapResultArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::calc_swap_result`,
    arguments: [
      pure(txb, args.iValue, `u64`),
      pure(txb, args.iPoolValue, `u64`),
      pure(txb, args.oPoolValue, `u64`),
      pure(txb, args.poolLpValue, `u64`),
      pure(txb, args.lpFeeBps, `u64`),
      pure(txb, args.adminFeePct, `u64`),
    ],
  })
}

export interface CeilDivU128Args {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
}

export function ceilDivU128(txb: TransactionBlock, args: CeilDivU128Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::ceil_div_u128`,
    arguments: [pure(txb, args.a, `u128`), pure(txb, args.b, `u128`)],
  })
}

export interface CeilMuldivArgs {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
  c: bigint | TransactionArgument
}

export function ceilMuldiv(txb: TransactionBlock, args: CeilMuldivArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::ceil_muldiv`,
    arguments: [pure(txb, args.a, `u64`), pure(txb, args.b, `u64`), pure(txb, args.c, `u64`)],
  })
}

export interface CmpTypeNamesArgs {
  a: ObjectArg
  b: ObjectArg
}

export function cmpTypeNames(txb: TransactionBlock, args: CmpTypeNamesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::cmp_type_names`,
    arguments: [obj(txb, args.a), obj(txb, args.b)],
  })
}

export interface DepositArgs {
  pool: ObjectArg
  inputA: ObjectArg
  inputB: ObjectArg
  minLpOut: bigint | TransactionArgument
}

export function deposit(txb: TransactionBlock, typeArgs: [string, string], args: DepositArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::deposit`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.pool),
      obj(txb, args.inputA),
      obj(txb, args.inputB),
      pure(txb, args.minLpOut, `u64`),
    ],
  })
}

export interface MuldivArgs {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
  c: bigint | TransactionArgument
}

export function muldiv(txb: TransactionBlock, args: MuldivArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::muldiv`,
    arguments: [pure(txb, args.a, `u64`), pure(txb, args.b, `u64`), pure(txb, args.c, `u64`)],
  })
}

export interface MuldivU128Args {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
  c: bigint | TransactionArgument
}

export function muldivU128(txb: TransactionBlock, args: MuldivU128Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::muldiv_u128`,
    arguments: [pure(txb, args.a, `u128`), pure(txb, args.b, `u128`), pure(txb, args.c, `u128`)],
  })
}

export interface MulsqrtArgs {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
}

export function mulsqrt(txb: TransactionBlock, args: MulsqrtArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::mulsqrt`,
    arguments: [pure(txb, args.a, `u64`), pure(txb, args.b, `u64`)],
  })
}

export function newRegistry(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::pool::new_registry`, arguments: [] })
}

export function poolAdminFeeValue(
  txb: TransactionBlock,
  typeArgs: [string, string],
  pool: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::pool_admin_fee_value`,
    typeArguments: typeArgs,
    arguments: [obj(txb, pool)],
  })
}

export function poolFees(txb: TransactionBlock, typeArgs: [string, string], pool: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::pool_fees`,
    typeArguments: typeArgs,
    arguments: [obj(txb, pool)],
  })
}

export function poolValues(txb: TransactionBlock, typeArgs: [string, string], pool: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::pool_values`,
    typeArguments: typeArgs,
    arguments: [obj(txb, pool)],
  })
}

export function registryAdd(txb: TransactionBlock, typeArgs: [string, string], self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::registry_add`,
    typeArguments: typeArgs,
    arguments: [obj(txb, self)],
  })
}

export interface SwapAArgs {
  pool: ObjectArg
  input: ObjectArg
  minOut: bigint | TransactionArgument
}

export function swapA(txb: TransactionBlock, typeArgs: [string, string], args: SwapAArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::swap_a`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.pool), obj(txb, args.input), pure(txb, args.minOut, `u64`)],
  })
}

export interface SwapBArgs {
  pool: ObjectArg
  input: ObjectArg
  minOut: bigint | TransactionArgument
}

export function swapB(txb: TransactionBlock, typeArgs: [string, string], args: SwapBArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::pool::swap_b`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.pool), obj(txb, args.input), pure(txb, args.minOut, `u64`)],
  })
}
