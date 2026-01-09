import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

/** Return the `Curve` value indicating that the BLS12-381 construction should be used in a given function. */
export function bls12381(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::groth16::bls12381`,
    arguments: [],
  })
}

/** Return the `Curve` value indicating that the BN254 construction should be used in a given function. */
export function bn254(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::groth16::bn254`,
    arguments: [],
  })
}

export interface PvkFromBytesArgs {
  vkGammaAbcG1Bytes: Array<number | TransactionArgument> | TransactionArgument
  alphaG1BetaG2Bytes: Array<number | TransactionArgument> | TransactionArgument
  gammaG2NegPcBytes: Array<number | TransactionArgument> | TransactionArgument
  deltaG2NegPcBytes: Array<number | TransactionArgument> | TransactionArgument
}

/** Creates a `PreparedVerifyingKey` from bytes. */
export function pvkFromBytes(tx: Transaction, args: PvkFromBytesArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::groth16::pvk_from_bytes`,
    arguments: [
      pure(tx, args.vkGammaAbcG1Bytes, `vector<u8>`),
      pure(tx, args.alphaG1BetaG2Bytes, `vector<u8>`),
      pure(tx, args.gammaG2NegPcBytes, `vector<u8>`),
      pure(tx, args.deltaG2NegPcBytes, `vector<u8>`),
    ],
  })
}

/** Returns bytes of the four components of the `PreparedVerifyingKey`. */
export function pvkToBytes(tx: Transaction, pvk: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::groth16::pvk_to_bytes`,
    arguments: [obj(tx, pvk)],
  })
}

/**
 * Creates a `PublicProofInputs` wrapper from bytes. The `bytes` parameter should be a concatenation of a number of
 * 32 bytes scalar field elements to be used as public inputs in little-endian format to a circuit.
 */
export function publicProofInputsFromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::groth16::public_proof_inputs_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/** Creates a Groth16 `ProofPoints` from bytes. */
export function proofPointsFromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::groth16::proof_points_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export interface PrepareVerifyingKeyArgs {
  curve: TransactionObjectInput
  verifyingKey: Array<number | TransactionArgument> | TransactionArgument
}

/**
 * @param curve: What elliptic curve construction to use. See `bls12381` and `bn254`.
 * @param verifying_key: An Arkworks canonical compressed serialization of a verifying key.
 *
 * Returns four vectors of bytes representing the four components of a prepared verifying key.
 * This step computes one pairing e(P, Q), and binds the verification to one particular proof statement.
 * This can be used as inputs for the `verify_groth16_proof` function.
 */
export function prepareVerifyingKey(
  tx: Transaction,
  args: PrepareVerifyingKeyArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::groth16::prepare_verifying_key`,
    arguments: [obj(tx, args.curve), pure(tx, args.verifyingKey, `vector<u8>`)],
  })
}

export interface PrepareVerifyingKeyInternalArgs {
  curve: number | TransactionArgument
  verifyingKey: Array<number | TransactionArgument> | TransactionArgument
}

/** Native functions that flattens the inputs into an array and passes to the Rust native function. May abort with `EInvalidVerifyingKey` or `EInvalidCurve`. */
export function prepareVerifyingKeyInternal(
  tx: Transaction,
  args: PrepareVerifyingKeyInternalArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::groth16::prepare_verifying_key_internal`,
    arguments: [pure(tx, args.curve, `u8`), pure(tx, args.verifyingKey, `vector<u8>`)],
  })
}

export interface VerifyGroth16ProofArgs {
  curve: TransactionObjectInput
  preparedVerifyingKey: TransactionObjectInput
  publicProofInputs: TransactionObjectInput
  proofPoints: TransactionObjectInput
}

/**
 * @param curve: What elliptic curve construction to use. See the `bls12381` and `bn254` functions.
 * @param prepared_verifying_key: Consists of four vectors of bytes representing the four components of a prepared verifying key.
 * @param public_proof_inputs: Represent inputs that are public.
 * @param proof_points: Represent three proof points.
 *
 * Returns a boolean indicating whether the proof is valid.
 */
export function verifyGroth16Proof(
  tx: Transaction,
  args: VerifyGroth16ProofArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::groth16::verify_groth16_proof`,
    arguments: [
      obj(tx, args.curve),
      obj(tx, args.preparedVerifyingKey),
      obj(tx, args.publicProofInputs),
      obj(tx, args.proofPoints),
    ],
  })
}

export interface VerifyGroth16ProofInternalArgs {
  curve: number | TransactionArgument
  vkGammaAbcG1Bytes: Array<number | TransactionArgument> | TransactionArgument
  alphaG1BetaG2Bytes: Array<number | TransactionArgument> | TransactionArgument
  gammaG2NegPcBytes: Array<number | TransactionArgument> | TransactionArgument
  deltaG2NegPcBytes: Array<number | TransactionArgument> | TransactionArgument
  publicProofInputs: Array<number | TransactionArgument> | TransactionArgument
  proofPoints: Array<number | TransactionArgument> | TransactionArgument
}

/** Native functions that flattens the inputs into arrays of vectors and passed to the Rust native function. May abort with `EInvalidCurve` or `ETooManyPublicInputs`. */
export function verifyGroth16ProofInternal(
  tx: Transaction,
  args: VerifyGroth16ProofInternalArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::groth16::verify_groth16_proof_internal`,
    arguments: [
      pure(tx, args.curve, `u8`),
      pure(tx, args.vkGammaAbcG1Bytes, `vector<u8>`),
      pure(tx, args.alphaG1BetaG2Bytes, `vector<u8>`),
      pure(tx, args.gammaG2NegPcBytes, `vector<u8>`),
      pure(tx, args.deltaG2NegPcBytes, `vector<u8>`),
      pure(tx, args.publicProofInputs, `vector<u8>`),
      pure(tx, args.proofPoints, `vector<u8>`),
    ],
  })
}
