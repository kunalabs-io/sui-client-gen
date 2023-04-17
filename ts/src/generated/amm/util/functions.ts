import { TransactionBlock } from '@mysten/sui.js'
import { Type } from 'framework/type'
import { ObjectArg, obj } from 'framework/util'
import { PACKAGE_ID } from '..'

export interface CreatePoolWithCoinsArgs {
  registry: ObjectArg
  initA: ObjectArg
  initB: ObjectArg
  lpFeeBps: bigint
  adminFeePct: bigint
}

/**
 * Calls `pool::create` using Coins as input. Returns the resulting LP Coin.
 * @arguments (registry: &mut PoolRegistry, init_a: Coin\<A\>, init_b: Coin\<B\>, lp_fee_bps: u64, admin_fee_pct: u64)
 * @returns Coin<LP<A, B>>
 */
export function createPoolWithCoins(
  tx: TransactionBlock,
  typeArgs: [Type, Type],
  args: CreatePoolWithCoinsArgs
) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::util::create_pool_with_coins`,
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
