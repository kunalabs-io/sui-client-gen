import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface Secp256r1EcrecoverArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
  hash: number | TransactionArgument
}

export function secp256r1Ecrecover(tx: Transaction, args: Secp256r1EcrecoverArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_r1::secp256r1_ecrecover`,
    arguments: [
      pure(tx, args.signature, `vector<u8>`),
      pure(tx, args.msg, `vector<u8>`),
      pure(tx, args.hash, `u8`),
    ],
  })
}

export interface Secp256r1VerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
  hash: number | TransactionArgument
}

export function secp256r1Verify(tx: Transaction, args: Secp256r1VerifyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_r1::secp256r1_verify`,
    arguments: [
      pure(tx, args.signature, `vector<u8>`),
      pure(tx, args.publicKey, `vector<u8>`),
      pure(tx, args.msg, `vector<u8>`),
      pure(tx, args.hash, `u8`),
    ],
  })
}
