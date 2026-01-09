import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'

export interface EcvrfVerifyArgs {
  hash: Array<number | TransactionArgument> | TransactionArgument
  alphaString: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  proof: Array<number | TransactionArgument> | TransactionArgument
}

/**
 * @param hash: The hash/output from a ECVRF to be verified.
 * @param alpha_string: Input/seed to the ECVRF used to generate the output.
 * @param public_key: The public key corresponding to the private key used to generate the output.
 * @param proof: The proof of validity of the output.
 * Verify a proof for a Ristretto ECVRF. Returns true if the proof is valid and corresponds to the given output. May abort with `EInvalidHashLength`, `EInvalidPublicKeyEncoding` or `EInvalidProofEncoding`.
 */
export function ecvrfVerify(tx: Transaction, args: EcvrfVerifyArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::ecvrf::ecvrf_verify`,
    arguments: [
      pure(tx, args.hash, `vector<u8>`),
      pure(tx, args.alphaString, `vector<u8>`),
      pure(tx, args.publicKey, `vector<u8>`),
      pure(tx, args.proof, `vector<u8>`),
    ],
  })
}
