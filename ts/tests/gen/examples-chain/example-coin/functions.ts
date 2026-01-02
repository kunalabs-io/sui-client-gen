import { PUBLISHED_AT } from '..'
import { obj } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function init(tx: Transaction, exampleCoin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::example_coin::init`,
    arguments: [obj(tx, exampleCoin)],
  })
}

export function faucetMint(tx: Transaction, faucet: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::example_coin::faucet_mint`,
    arguments: [obj(tx, faucet)],
  })
}

export function faucetMintBalance(tx: Transaction, faucet: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::example_coin::faucet_mint_balance`,
    arguments: [obj(tx, faucet)],
  })
}
