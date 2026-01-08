import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

/**
 * Hash an arbitrary binary `message` to a class group element to be used as input for `vdf_verify`.
 *
 * This function is currently only enabled on Devnet.
 */
export function hashToInput(
  tx: Transaction,
  message: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vdf::hash_to_input`,
    arguments: [pure(tx, message, `vector<u8>`)],
  })
}

/** The internal functions for `hash_to_input`. */
export function hashToInputInternal(
  tx: Transaction,
  message: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vdf::hash_to_input_internal`,
    arguments: [pure(tx, message, `vector<u8>`)],
  })
}

export interface VdfVerifyArgs {
  input: Array<number | TransactionArgument> | TransactionArgument
  output: Array<number | TransactionArgument> | TransactionArgument
  proof: Array<number | TransactionArgument> | TransactionArgument
  iterations: bigint | TransactionArgument
}

/**
 * Verify the output and proof of a VDF with the given number of iterations. The `input`, `output` and `proof`
 * are all class group elements represented by triples `(a,b,c)` such that `b^2 - 4ac = discriminant`. The are expected
 * to be encoded as a BCS encoding of a triple of byte arrays, each being the big-endian twos-complement encoding of
 * a, b and c in that order.
 *
 * This uses Wesolowski's VDF construction over imaginary class groups as described in Wesolowski (2020),
 * 'Efficient Verifiable Delay Functions.', J. Cryptol. 33, and is compatible with the VDF implementation in
 * fastcrypto.
 *
 * The discriminant for the class group is pre-computed and fixed. See how this was generated in the fastcrypto-vdf
 * crate. The final selection of the discriminant for Mainnet will be computed and announced under a nothing-up-my-sleeve
 * process.
 *
 * This function is currently only enabled on Devnet.
 */
export function vdfVerify(tx: Transaction, args: VdfVerifyArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vdf::vdf_verify`,
    arguments: [
      pure(tx, args.input, `vector<u8>`),
      pure(tx, args.output, `vector<u8>`),
      pure(tx, args.proof, `vector<u8>`),
      pure(tx, args.iterations, `u64`),
    ],
  })
}

export interface VdfVerifyInternalArgs {
  input: Array<number | TransactionArgument> | TransactionArgument
  output: Array<number | TransactionArgument> | TransactionArgument
  proof: Array<number | TransactionArgument> | TransactionArgument
  iterations: bigint | TransactionArgument
}

/** The internal functions for `vdf_verify_internal`. */
export function vdfVerifyInternal(tx: Transaction, args: VdfVerifyInternalArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vdf::vdf_verify_internal`,
    arguments: [
      pure(tx, args.input, `vector<u8>`),
      pure(tx, args.output, `vector<u8>`),
      pure(tx, args.proof, `vector<u8>`),
      pure(tx, args.iterations, `u64`),
    ],
  })
}
