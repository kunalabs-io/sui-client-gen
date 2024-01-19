import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface Ed25519VerifyArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
}

export function ed25519Verify(txb: TransactionBlock, args: Ed25519VerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ed25519::ed25519_verify`,
    arguments: [
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
      pure(txb, args.vecU83, `vector<u8>`),
    ],
  })
}
