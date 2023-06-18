import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export function bls12381(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::groth16::bls12381`, arguments: [] })
}

export function bn254(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::groth16::bn254`, arguments: [] })
}

export interface PrepareVerifyingKeyArgs {
  curve: ObjectArg
  verifyingKey: Array<number | TransactionArgument> | TransactionArgument
}

export function prepareVerifyingKey(txb: TransactionBlock, args: PrepareVerifyingKeyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::prepare_verifying_key`,
    arguments: [obj(txb, args.curve), pure(txb, args.verifyingKey, `vector<u8>`)],
  })
}

export interface PrepareVerifyingKeyInternalArgs {
  curve: number | TransactionArgument
  verifyingKey: Array<number | TransactionArgument> | TransactionArgument
}

export function prepareVerifyingKeyInternal(
  txb: TransactionBlock,
  args: PrepareVerifyingKeyInternalArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::prepare_verifying_key_internal`,
    arguments: [pure(txb, args.curve, `u8`), pure(txb, args.verifyingKey, `vector<u8>`)],
  })
}

export function proofPointsFromBytes(
  txb: TransactionBlock,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::proof_points_from_bytes`,
    arguments: [pure(txb, bytes, `vector<u8>`)],
  })
}

export function publicProofInputsFromBytes(
  txb: TransactionBlock,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::public_proof_inputs_from_bytes`,
    arguments: [pure(txb, bytes, `vector<u8>`)],
  })
}

export interface PvkFromBytesArgs {
  vkGammaAbcG1Bytes: Array<number | TransactionArgument> | TransactionArgument
  alphaG1BetaG2Bytes: Array<number | TransactionArgument> | TransactionArgument
  gammaG2NegPcBytes: Array<number | TransactionArgument> | TransactionArgument
  deltaG2NegPcBytes: Array<number | TransactionArgument> | TransactionArgument
}

export function pvkFromBytes(txb: TransactionBlock, args: PvkFromBytesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::pvk_from_bytes`,
    arguments: [
      pure(txb, args.vkGammaAbcG1Bytes, `vector<u8>`),
      pure(txb, args.alphaG1BetaG2Bytes, `vector<u8>`),
      pure(txb, args.gammaG2NegPcBytes, `vector<u8>`),
      pure(txb, args.deltaG2NegPcBytes, `vector<u8>`),
    ],
  })
}

export function pvkToBytes(txb: TransactionBlock, pvk: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::pvk_to_bytes`,
    arguments: [obj(txb, pvk)],
  })
}

export interface VerifyGroth16ProofArgs {
  curve: ObjectArg
  preparedVerifyingKey: ObjectArg
  publicProofInputs: ObjectArg
  proofPoints: ObjectArg
}

export function verifyGroth16Proof(txb: TransactionBlock, args: VerifyGroth16ProofArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::verify_groth16_proof`,
    arguments: [
      obj(txb, args.curve),
      obj(txb, args.preparedVerifyingKey),
      obj(txb, args.publicProofInputs),
      obj(txb, args.proofPoints),
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

export function verifyGroth16ProofInternal(
  txb: TransactionBlock,
  args: VerifyGroth16ProofInternalArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::verify_groth16_proof_internal`,
    arguments: [
      pure(txb, args.curve, `u8`),
      pure(txb, args.vkGammaAbcG1Bytes, `vector<u8>`),
      pure(txb, args.alphaG1BetaG2Bytes, `vector<u8>`),
      pure(txb, args.gammaG2NegPcBytes, `vector<u8>`),
      pure(txb, args.deltaG2NegPcBytes, `vector<u8>`),
      pure(txb, args.publicProofInputs, `vector<u8>`),
      pure(txb, args.proofPoints, `vector<u8>`),
    ],
  })
}
