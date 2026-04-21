import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { obj } from '../../_framework/util'

export function init(
  tx: Transaction,
  otw: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples', options?.env)}::example_coin::init`,
    arguments: [obj(tx, otw)],
  })
}

export function faucetMint(
  tx: Transaction,
  faucet: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples', options?.env)}::example_coin::faucet_mint`,
    arguments: [obj(tx, faucet)],
  })
}

export function faucetMintBalance(
  tx: Transaction,
  faucet: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples', options?.env)}::example_coin::faucet_mint_balance`,
    arguments: [obj(tx, faucet)],
  })
}
