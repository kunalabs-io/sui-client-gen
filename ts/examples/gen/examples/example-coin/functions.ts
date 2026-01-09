import { getPublishedAt } from '../../_envs'
import { obj } from '../../_framework/util'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

export function init(tx: Transaction, otw: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::example_coin::init`,
    arguments: [obj(tx, otw)],
  })
}

export function faucetMint(tx: Transaction, faucet: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::example_coin::faucet_mint`,
    arguments: [obj(tx, faucet)],
  })
}

export function faucetMintBalance(
  tx: Transaction,
  faucet: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::example_coin::faucet_mint_balance`,
    arguments: [obj(tx, faucet)],
  })
}
