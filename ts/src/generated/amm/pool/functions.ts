import { TransactionArgument, TransactionBlock, is } from '@mysten/sui.js'
import { obj, ObjectArg } from 'framework/util'
import { PACKAGE_ID } from '..'
import { Type } from '../../../framework/type'

/**
 * Returns the balances of token A and B present in the pool and the total supply of LP coins.
 * @arguments (pool: &Pool<A, B>)
 * @returns (u64, u64, u64)
 */
export function poolValues(tx: TransactionBlock, typeArgs: [Type, Type], pool: ObjectArg) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::pool::pool_values`,
    typeArguments: [typeArgs[0], typeArgs[1]],
    arguments: [obj(tx, pool)],
  })
}

/**
 * Returns the pool fee info.
 * @arguments (pool: &Pool<A, B>)
 * @returns (u64, u64)
 */
export function poolFees(tx: TransactionBlock, typeArgs: [Type, Type], pool: ObjectArg) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::pool::pool_fees`,
    typeArguments: [typeArgs[0], typeArgs[1]],
    arguments: [obj(tx, pool)],
  })
}

/**
 * Returns the value of collected admin fees stored in the pool.
 * @arguments (pool: &Pool<A, B>)
 * @returns u64
 */
export function poolAdminFeeValue(tx: TransactionBlock, typeArgs: [Type, Type], pool: ObjectArg) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::pool::pool_admin_fee_value`,
    typeArguments: [typeArgs[0], typeArgs[1]],
    arguments: [obj(tx, pool)],
  })
}

export interface CreateArgs {
  registry: ObjectArg
  initA: ObjectArg
  initB: ObjectArg
  lpFeeBps: bigint
  adminFeePct: bigint
}

/**
 * Creates a new Pool with provided initial balances. Returns the inital LP coins.
 * @arguments (registry: &mut PoolRegistry, init_a: Balance\<A\>, init_b: Balance\<B\>, lp_fee_bps: u64, admin_fee_pct: u64)
 * @returns Balance<LP<A, B>>
 */
export function create(tx: TransactionBlock, typeArgs: [Type, Type], args: CreateArgs) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::pool::create`,
    typeArguments: [typeArgs[0], typeArgs[1]],
    arguments: [
      obj(tx, args.registry),
      obj(tx, args.initA),
      obj(tx, args.initB),
      tx.pure(args.lpFeeBps.toString()),
      tx.pure(args.adminFeePct.toString()),
    ],
  })
}

export interface DepositArgs {
  pool: ObjectArg
  inputA: ObjectArg
  inputB: ObjectArg
  minLpOut: bigint
}

/**
 * Deposit liquidity into pool. The deposit will use up the maximum amount of
 * the provided balances possible depending on the current pool ratio. Usually
 * this means that all of either `input_a` or `input_b` will be fully used, while
 * the other only partially. Otherwise, both input values will be fully used.
 * Returns the remaining input amounts (if any) and LP Coin of appropriate value.
 * Fails if the value of the issued LP Coin is smaller than `min_lp_out`.
 *
 * @arguments (pool: Balance<Pool<A, B>>, input_a: Balance\<A\>, input_b: Balance\<B\>, min_lp_out: u64)
 * @returns (Balance\<A\>, Balance\<B\>, Balance<LP<A, B>>)
 */
export function deposit(tx: TransactionBlock, typeArgs: [Type, Type], args: DepositArgs) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::pool::deposit`,
    typeArguments: [typeArgs[0], typeArgs[1]],
    arguments: [
      is(args.pool, TransactionArgument) ? args.pool : tx.object(args.pool),
      is(args.inputA, TransactionArgument) ? args.inputA : tx.object(args.inputA),
      is(args.inputB, TransactionArgument) ? args.inputB : tx.object(args.inputB),
      tx.pure(args.minLpOut.toString()),
    ],
  })
}

export interface WithdrawArgs {
  pool: ObjectArg
  lpIn: ObjectArg
  minAOut: bigint
  minBOut: bigint
}

/**
 * Bruns the provided LP Coin and withdraws corresponding pool balances.
 * Fails if the withdrawn balances are smaller than `min_a_out` and `min_b_out` respectively.
 *
 * @arguments (pool: &mut Pool<A, B>, lp_in: Balance<LP<A, B>>, min_a_out: u64, min_b_out: u64)
 * @returns (Balance\<A\>, Balance\<B\>)
 */
export function withdraw(tx: TransactionBlock, typeArgs: [Type, Type], args: WithdrawArgs) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::pool::withdraw`,
    typeArguments: [typeArgs[0], typeArgs[1]],
    arguments: [
      is(args.pool, TransactionArgument) ? args.pool : tx.object(args.pool),
      is(args.lpIn, TransactionArgument) ? args.lpIn : tx.object(args.lpIn),
      tx.pure(args.minAOut.toString()),
      tx.pure(args.minBOut.toString()),
    ],
  })
}

export interface SwapAArgs {
  pool: ObjectArg
  input: ObjectArg
  minOut: bigint
}

/**
 * Swaps the provided amount of A for B. Fails if the resulting amount of B is smaller than `min_out`.
 *
 * @arguments (pool: &mut Pool<A, B>, input: Balance\<A\>, min_out: u64)
 * @returns Balance\<B\>
 */
export function swapA(tx: TransactionBlock, typeArgs: [Type, Type], args: SwapAArgs) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::pool::swap_a`,
    typeArguments: [typeArgs[0], typeArgs[1]],
    arguments: [obj(tx, args.pool), obj(tx, args.input), obj(tx, args.minOut.toString())],
  })
}

export interface SwapBArgs {
  pool: ObjectArg
  input: ObjectArg
  minOut: bigint
}

/**
 * Swaps the provided amount of B for A. Fails if the resulting amount of A is smaller than `min_out`.
 *
 * @arguments (pool: &mut Pool<A, B>, input: Balance\<B\>, min_out: u64)
 * @returns Balance\<A\>
 */
export function swapB(tx: TransactionBlock, typeArgs: [Type, Type], args: SwapAArgs) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::pool::swap_b`,
    typeArguments: [typeArgs[0], typeArgs[1]],
    arguments: [obj(tx, args.pool), obj(tx, args.input), tx.pure(args.minOut.toString())],
  })
}

export interface AdminWithdrawFeesArgs {
  pool: ObjectArg
  adminCap: ObjectArg
  amount: bigint
}

/**
 * Withdraw `amount` of collected admin fees by providing pool's PoolAdminCap.
 * When `amount` is set to 0, it will withdraw all available fees.
 *
 * @arguments (pool: &mut Pool<A, B>, _: &AdminCap, amount: u64)
 * @returns Balance<LP<A, B>>
 */
export function adminWithdrawFees(
  tx: TransactionBlock,
  typeArgs: [Type, Type],
  args: AdminWithdrawFeesArgs
) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::pool::admin_withdraw_fees`,
    typeArguments: [typeArgs[0], typeArgs[1]],
    arguments: [obj(tx, args.pool), obj(tx, args.adminCap), obj(tx, args.amount.toString())],
  })
}
