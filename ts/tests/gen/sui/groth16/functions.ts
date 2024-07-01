import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function bls12381(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::groth16::bls12381`, arguments: [] })
}

export function bn254(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::groth16::bn254`, arguments: [] })
}

export interface PrepareVerifyingKeyArgs {
  curve: TransactionObjectInput
  verifyingKey: Array<number | TransactionArgument> | TransactionArgument
}

export function prepareVerifyingKey(tx: Transaction, args: PrepareVerifyingKeyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::prepare_verifying_key`,
    arguments: [obj(tx, args.curve), pure(tx, args.verifyingKey, `vector<u8>`)],
  })
}

export interface PrepareVerifyingKeyInternalArgs {
  curve: number | TransactionArgument
  verifyingKey: Array<number | TransactionArgument> | TransactionArgument
}

export function prepareVerifyingKeyInternal(
  tx: Transaction,
  args: PrepareVerifyingKeyInternalArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::prepare_verifying_key_internal`,
    arguments: [pure(tx, args.curve, `u8`), pure(tx, args.verifyingKey, `vector<u8>`)],
  })
}

export function proofPointsFromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::proof_points_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function publicProofInputsFromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::public_proof_inputs_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export interface PvkFromBytesArgs {
  vkGammaAbcG1Bytes: Array<number | TransactionArgument> | TransactionArgument
  alphaG1BetaG2Bytes: Array<number | TransactionArgument> | TransactionArgument
  gammaG2NegPcBytes: Array<number | TransactionArgument> | TransactionArgument
  deltaG2NegPcBytes: Array<number | TransactionArgument> | TransactionArgument
}

export function pvkFromBytes(tx: Transaction, args: PvkFromBytesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::pvk_from_bytes`,
    arguments: [
      pure(tx, args.vkGammaAbcG1Bytes, `vector<u8>`),
      pure(tx, args.alphaG1BetaG2Bytes, `vector<u8>`),
      pure(tx, args.gammaG2NegPcBytes, `vector<u8>`),
      pure(tx, args.deltaG2NegPcBytes, `vector<u8>`),
    ],
  })
}

export function pvkToBytes(tx: Transaction, pvk: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::pvk_to_bytes`,
    arguments: [obj(tx, pvk)],
  })
}

export interface VerifyGroth16ProofArgs {
  curve: TransactionObjectInput
  preparedVerifyingKey: TransactionObjectInput
  publicProofInputs: TransactionObjectInput
  proofPoints: TransactionObjectInput
}

export function verifyGroth16Proof(tx: Transaction, args: VerifyGroth16ProofArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::verify_groth16_proof`,
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

export function verifyGroth16ProofInternal(tx: Transaction, args: VerifyGroth16ProofInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::verify_groth16_proof_internal`,
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
