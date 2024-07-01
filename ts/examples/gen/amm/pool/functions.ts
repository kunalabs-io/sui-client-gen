import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface CreateArgs {
  registry: TransactionObjectInput
  initA: TransactionObjectInput
  initB: TransactionObjectInput
  lpFeeBps: bigint | TransactionArgument
  adminFeePct: bigint | TransactionArgument
}

export function create(tx: Transaction, typeArgs: [string, string], args: CreateArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::create`,
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

export interface WithdrawArgs {
  pool: TransactionObjectInput
  lpIn: TransactionObjectInput
  minAOut: bigint | TransactionArgument
  minBOut: bigint | TransactionArgument
}

export function withdraw(tx: Transaction, typeArgs: [string, string], args: WithdrawArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::withdraw`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.pool),
      obj(tx, args.lpIn),
      pure(tx, args.minAOut, `u64`),
      pure(tx, args.minBOut, `u64`),
    ],
  })
}

export function init(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::pool::init`, arguments: [] })
}

export interface AdminWithdrawFeesArgs {
  pool: TransactionObjectInput
  adminCap: TransactionObjectInput
  amount: bigint | TransactionArgument
}

export function adminWithdrawFees(
  tx: Transaction,
  typeArgs: [string, string],
  args: AdminWithdrawFeesArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::admin_withdraw_fees`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.adminCap), pure(tx, args.amount, `u64`)],
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

export function calcSwapResult(tx: Transaction, args: CalcSwapResultArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::calc_swap_result`,
    arguments: [
      pure(tx, args.iValue, `u64`),
      pure(tx, args.iPoolValue, `u64`),
      pure(tx, args.oPoolValue, `u64`),
      pure(tx, args.poolLpValue, `u64`),
      pure(tx, args.lpFeeBps, `u64`),
      pure(tx, args.adminFeePct, `u64`),
    ],
  })
}

export interface CeilDivU128Args {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
}

export function ceilDivU128(tx: Transaction, args: CeilDivU128Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::ceil_div_u128`,
    arguments: [pure(tx, args.a, `u128`), pure(tx, args.b, `u128`)],
  })
}

export interface CeilMuldivArgs {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
  c: bigint | TransactionArgument
}

export function ceilMuldiv(tx: Transaction, args: CeilMuldivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::ceil_muldiv`,
    arguments: [pure(tx, args.a, `u64`), pure(tx, args.b, `u64`), pure(tx, args.c, `u64`)],
  })
}

export interface CmpTypeNamesArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function cmpTypeNames(tx: Transaction, args: CmpTypeNamesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::cmp_type_names`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface DepositArgs {
  pool: TransactionObjectInput
  inputA: TransactionObjectInput
  inputB: TransactionObjectInput
  minLpOut: bigint | TransactionArgument
}

export function deposit(tx: Transaction, typeArgs: [string, string], args: DepositArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::deposit`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.pool),
      obj(tx, args.inputA),
      obj(tx, args.inputB),
      pure(tx, args.minLpOut, `u64`),
    ],
  })
}

export interface MuldivArgs {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
  c: bigint | TransactionArgument
}

export function muldiv(tx: Transaction, args: MuldivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::muldiv`,
    arguments: [pure(tx, args.a, `u64`), pure(tx, args.b, `u64`), pure(tx, args.c, `u64`)],
  })
}

export interface MuldivU128Args {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
  c: bigint | TransactionArgument
}

export function muldivU128(tx: Transaction, args: MuldivU128Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::muldiv_u128`,
    arguments: [pure(tx, args.a, `u128`), pure(tx, args.b, `u128`), pure(tx, args.c, `u128`)],
  })
}

export interface MulsqrtArgs {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
}

export function mulsqrt(tx: Transaction, args: MulsqrtArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::mulsqrt`,
    arguments: [pure(tx, args.a, `u64`), pure(tx, args.b, `u64`)],
  })
}

export function newRegistry(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::pool::new_registry`, arguments: [] })
}

export function poolAdminFeeValue(
  tx: Transaction,
  typeArgs: [string, string],
  pool: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::pool_admin_fee_value`,
    typeArguments: typeArgs,
    arguments: [obj(tx, pool)],
  })
}

export function poolFees(
  tx: Transaction,
  typeArgs: [string, string],
  pool: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::pool_fees`,
    typeArguments: typeArgs,
    arguments: [obj(tx, pool)],
  })
}

export function poolValues(
  tx: Transaction,
  typeArgs: [string, string],
  pool: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::pool_values`,
    typeArguments: typeArgs,
    arguments: [obj(tx, pool)],
  })
}

export function registryAdd(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::registry_add`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export interface SwapAArgs {
  pool: TransactionObjectInput
  input: TransactionObjectInput
  minOut: bigint | TransactionArgument
}

export function swapA(tx: Transaction, typeArgs: [string, string], args: SwapAArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::swap_a`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.input), pure(tx, args.minOut, `u64`)],
  })
}

export interface SwapBArgs {
  pool: TransactionObjectInput
  input: TransactionObjectInput
  minOut: bigint | TransactionArgument
}

export function swapB(tx: Transaction, typeArgs: [string, string], args: SwapBArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::pool::swap_b`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.input), pure(tx, args.minOut, `u64`)],
  })
}
