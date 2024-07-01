import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export interface Secp256k1EcrecoverArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  u8: number | TransactionArgument
}

export function secp256k1Ecrecover(tx: Transaction, args: Secp256k1EcrecoverArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_k1::secp256k1_ecrecover`,
    arguments: [
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.u8, `u8`),
    ],
  })
}

export function decompressPubkey(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_k1::decompress_pubkey`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export interface Secp256k1VerifyArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  u8: number | TransactionArgument
}

export function secp256k1Verify(tx: Transaction, args: Secp256k1VerifyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_k1::secp256k1_verify`,
    arguments: [
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      pure(tx, args.u8, `u8`),
    ],
  })
}
