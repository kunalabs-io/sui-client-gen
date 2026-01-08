import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

/**
 * Returns the balances of token A and B present in the pool and the total
 * supply of LP coins.
 */
export function values(tx: Transaction, typeArgs: [string, string], pool: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::values`,
    typeArguments: typeArgs,
    arguments: [obj(tx, pool)],
  })
}

/** Returns the pool fee info. */
export function fees(tx: Transaction, typeArgs: [string, string], pool: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::fees`,
    typeArguments: typeArgs,
    arguments: [obj(tx, pool)],
  })
}

/** Returns the value of collected admin fees stored in the pool. */
export function adminFeeValue(
  tx: Transaction,
  typeArgs: [string, string],
  pool: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::admin_fee_value`,
    typeArguments: typeArgs,
    arguments: [obj(tx, pool)],
  })
}

/** Creat a new empty `PoolRegistry`. */
export function newRegistry(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::new_registry`,
    arguments: [],
  })
}

export interface CmpTypeNamesArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function cmpTypeNames(tx: Transaction, args: CmpTypeNamesArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::cmp_type_names`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

/**
 * Add a new coin type tuple (`A`, `B`) to the registry. Types must be sorted alphabetically (ASCII ordered)
 * such that `A` < `B`. They also cannot be equal.
 * Aborts when coin types are the same.
 * Aborts when coin types are not in order (type `A` must come before `B` alphabetically).
 * Aborts when coin type tuple is already in the registry.
 */
export function registryAdd(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::registry_add`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export interface MuldivArgs {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
  c: bigint | TransactionArgument
}

/** Calculates (a * b) / c. Errors if result doesn't fit into u64. */
export function muldiv(tx: Transaction, args: MuldivArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::muldiv`,
    arguments: [pure(tx, args.a, `u64`), pure(tx, args.b, `u64`), pure(tx, args.c, `u64`)],
  })
}

export interface CeilMuldivArgs {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
  c: bigint | TransactionArgument
}

/** Calculates ceil_div((a * b), c). Errors if result doesn't fit into u64. */
export function ceilMuldiv(tx: Transaction, args: CeilMuldivArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::ceil_muldiv`,
    arguments: [pure(tx, args.a, `u64`), pure(tx, args.b, `u64`), pure(tx, args.c, `u64`)],
  })
}

export interface MulsqrtArgs {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
}

/** Calculates sqrt(a * b). */
export function mulsqrt(tx: Transaction, args: MulsqrtArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::mulsqrt`,
    arguments: [pure(tx, args.a, `u64`), pure(tx, args.b, `u64`)],
  })
}

export interface MuldivU128Args {
  a: bigint | TransactionArgument
  b: bigint | TransactionArgument
  c: bigint | TransactionArgument
}

/** Calculates (a * b) / c for u128. Errors if result doesn't fit into u128. */
export function muldivU128(tx: Transaction, args: MuldivU128Args) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::muldiv_u128`,
    arguments: [pure(tx, args.a, `u128`), pure(tx, args.b, `u128`), pure(tx, args.c, `u128`)],
  })
}

/** Initializes the `PoolRegistry` objects and shares it, and transfers `AdminCap` to sender. */
export function init(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::init`,
    arguments: [],
  })
}

export interface CreateArgs {
  registry: TransactionObjectInput
  initA: TransactionObjectInput
  initB: TransactionObjectInput
  lpFeeBps: bigint | TransactionArgument
  adminFeePct: bigint | TransactionArgument
}

/** Creates a new Pool with provided initial balances. Returns the initial LP coins. */
export function create(tx: Transaction, typeArgs: [string, string], args: CreateArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::create`,
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

export interface DepositArgs {
  pool: TransactionObjectInput
  inputA: TransactionObjectInput
  inputB: TransactionObjectInput
  minLpOut: bigint | TransactionArgument
}

/**
 * Deposit liquidity into pool. The deposit will use up the maximum amount of
 * the provided balances possible depending on the current pool ratio. Usually
 * this means that all of either `input_a` or `input_b` will be fully used, while
 * the other only partially. Otherwise, both input values will be fully used.
 * Returns the remaining input amounts (if any) and LP Coin of appropriate value.
 * Fails if the value of the issued LP Coin is smaller than `min_lp_out`.
 */
export function deposit(tx: Transaction, typeArgs: [string, string], args: DepositArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::deposit`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.pool),
      obj(tx, args.inputA),
      obj(tx, args.inputB),
      pure(tx, args.minLpOut, `u64`),
    ],
  })
}

export interface WithdrawArgs {
  pool: TransactionObjectInput
  lpIn: TransactionObjectInput
  minAOut: bigint | TransactionArgument
  minBOut: bigint | TransactionArgument
}

/**
 * Burns the provided LP Coin and withdraws corresponding pool balances.
 * Fails if the withdrawn balances are smaller than `min_a_out` and `min_b_out`
 * respectively.
 */
export function withdraw(tx: Transaction, typeArgs: [string, string], args: WithdrawArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::withdraw`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.pool),
      obj(tx, args.lpIn),
      pure(tx, args.minAOut, `u64`),
      pure(tx, args.minBOut, `u64`),
    ],
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

/** Calclates swap result and fees based on the input amount and current pool state. */
export function calcSwapResult(tx: Transaction, args: CalcSwapResultArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::calc_swap_result`,
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

export interface SwapAArgs {
  pool: TransactionObjectInput
  input: TransactionObjectInput
  minOut: bigint | TransactionArgument
}

/**
 * Swaps the provided amount of A for B. Fails if the resulting amount of B
 * is smaller than `min_out`.
 */
export function swapA(tx: Transaction, typeArgs: [string, string], args: SwapAArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::swap_a`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.input), pure(tx, args.minOut, `u64`)],
  })
}

export interface SwapBArgs {
  pool: TransactionObjectInput
  input: TransactionObjectInput
  minOut: bigint | TransactionArgument
}

/**
 * Swaps the provided amount of B for A. Fails if the resulting amount of A
 * is smaller than `min_out`.
 */
export function swapB(tx: Transaction, typeArgs: [string, string], args: SwapBArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::swap_b`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.input), pure(tx, args.minOut, `u64`)],
  })
}

export interface AdminWithdrawFeesArgs {
  pool: TransactionObjectInput
  adminCap: TransactionObjectInput
  amount: bigint | TransactionArgument
}

/**
 * Withdraw `amount` of collected admin fees by providing pool's PoolAdminCap.
 * When `amount` is set to 0, it will withdraw all available fees.
 */
export function adminWithdrawFees(
  tx: Transaction,
  typeArgs: [string, string],
  args: AdminWithdrawFeesArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::admin_withdraw_fees`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.pool), obj(tx, args.adminCap), pure(tx, args.amount, `u64`)],
  })
}

export interface AdminSetFeesArgs {
  pool: TransactionObjectInput
  adminCap: TransactionObjectInput
  lpFeeBps: bigint | TransactionArgument
  adminFeePct: bigint | TransactionArgument
}

/** Admin function. Set new fees for the pool. */
export function adminSetFees(tx: Transaction, typeArgs: [string, string], args: AdminSetFeesArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('amm')}::pool::admin_set_fees`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.pool),
      obj(tx, args.adminCap),
      pure(tx, args.lpFeeBps, `u64`),
      pure(tx, args.adminFeePct, `u64`),
    ],
  })
}
