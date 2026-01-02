import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface Secp256r1EcrecoverArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  u8: number | TransactionArgument
}

export function secp256r1Ecrecover(tx: Transaction, args: Secp256r1EcrecoverArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_r1::secp256r1_ecrecover`,
    arguments: [
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.u8, `u8`),
    ],
  })
}

export interface Secp256r1VerifyArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  u8: number | TransactionArgument
}

export function secp256r1Verify(tx: Transaction, args: Secp256r1VerifyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_r1::secp256r1_verify`,
    arguments: [
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      pure(tx, args.u8, `u8`),
    ],
  })
}
