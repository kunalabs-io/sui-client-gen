import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

export interface Ed25519VerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

/**
 * @param signature: 32-byte signature that is a point on the Ed25519 elliptic curve.
 * @param public_key: 32-byte signature that is a point on the Ed25519 elliptic curve.
 * @param msg: The message that we test the signature against.
 *
 * If the signature is a valid Ed25519 signature of the message and public key, return true.
 * Otherwise, return false.
 */
export function ed25519Verify(tx: Transaction, args: Ed25519VerifyArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::ed25519::ed25519_verify`,
    arguments: [
      pure(tx, args.signature, `vector<u8>`),
      pure(tx, args.publicKey, `vector<u8>`),
      pure(tx, args.msg, `vector<u8>`),
    ],
  })
}
