import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface EcvrfVerifyArgs {
  hash: Array<number | TransactionArgument>
  alphaString: Array<number | TransactionArgument>
  publicKey: Array<number | TransactionArgument>
  proof: Array<number | TransactionArgument>
}

export function ecvrfVerify(txb: TransactionBlock, args: EcvrfVerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ecvrf::ecvrf_verify`,
    arguments: [
      pure(txb, args.hash, `vector<u8>`),
      pure(txb, args.alphaString, `vector<u8>`),
      pure(txb, args.publicKey, `vector<u8>`),
      pure(txb, args.proof, `vector<u8>`),
    ],
  })
}
