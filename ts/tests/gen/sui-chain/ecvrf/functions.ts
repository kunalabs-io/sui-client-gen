import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export interface EcvrfVerifyArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  vecU84: Array<number | TransactionArgument> | TransactionArgument
}

export function ecvrfVerify(tx: Transaction, args: EcvrfVerifyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ecvrf::ecvrf_verify`,
    arguments: [
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      pure(tx, args.vecU84, `vector<u8>`),
    ],
  })
}
