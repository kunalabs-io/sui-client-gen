import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface Secp256k1EcrecoverArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
  hash: number | TransactionArgument
}

export function secp256k1Ecrecover(tx: Transaction, args: Secp256k1EcrecoverArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::ecdsa_k1::secp256k1_ecrecover`,
    arguments: [
      pure(tx, args.signature, `vector<u8>`),
      pure(tx, args.msg, `vector<u8>`),
      pure(tx, args.hash, `u8`),
    ],
  })
}

export function decompressPubkey(
  tx: Transaction,
  pubkey: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::ecdsa_k1::decompress_pubkey`,
    arguments: [pure(tx, pubkey, `vector<u8>`)],
  })
}

export interface Secp256k1VerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
  hash: number | TransactionArgument
}

export function secp256k1Verify(tx: Transaction, args: Secp256k1VerifyArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::ecdsa_k1::secp256k1_verify`,
    arguments: [
      pure(tx, args.signature, `vector<u8>`),
      pure(tx, args.publicKey, `vector<u8>`),
      pure(tx, args.msg, `vector<u8>`),
      pure(tx, args.hash, `u8`),
    ],
  })
}
