import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface EcvrfVerifyArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  vecU84: Array<number | TransactionArgument> | TransactionArgument
}

export function ecvrfVerify(txb: TransactionBlock, args: EcvrfVerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ecvrf::ecvrf_verify`,
    arguments: [
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
      pure(txb, args.vecU83, `vector<u8>`),
      pure(txb, args.vecU84, `vector<u8>`),
    ],
  })
}
