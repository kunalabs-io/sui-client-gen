import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface Ed25519VerifyArgs {
  signature: Array<number | TransactionArgument>
  publicKey: Array<number | TransactionArgument>
  msg: Array<number | TransactionArgument>
}

export function ed25519Verify(txb: TransactionBlock, args: Ed25519VerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ed25519::ed25519_verify`,
    arguments: [
      pure(txb, args.signature, `vector<u8>`),
      pure(txb, args.publicKey, `vector<u8>`),
      pure(txb, args.msg, `vector<u8>`),
    ],
  })
}
