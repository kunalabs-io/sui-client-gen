import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface Ed25519VerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

export function ed25519Verify(tx: Transaction, args: Ed25519VerifyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ed25519::ed25519_verify`,
    arguments: [
      pure(tx, args.signature, `vector<u8>`),
      pure(tx, args.publicKey, `vector<u8>`),
      pure(tx, args.msg, `vector<u8>`),
    ],
  })
}
