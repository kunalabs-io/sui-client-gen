import { ObjectArg, obj } from 'framework/util'
import { PACKAGE_ID } from '..'
import { TransactionBlock } from '@mysten/sui.js'

/** @returns Coin\<EXAMPLE_COIN\> */
export function faucetMint(tx: TransactionBlock, faucet: ObjectArg) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::example_coin::faucet_mint`,
    arguments: [obj(tx, faucet)],
  })
}

/** @returns Balance\<EXAMPLE_COIN\> */
export function faucetMintBalance(tx: TransactionBlock, faucet: ObjectArg) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::example_coin::faucet_mint_balance`,
    arguments: [obj(tx, faucet)],
  })
}
