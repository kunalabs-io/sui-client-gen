import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function bls12381(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::groth16::bls12381`, arguments: [] })
}

export function bn254(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::groth16::bn254`, arguments: [] })
}

export interface PvkFromBytesArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  vecU84: Array<number | TransactionArgument> | TransactionArgument
}

export function pvkFromBytes(txb: TransactionBlock, args: PvkFromBytesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::pvk_from_bytes`,
    arguments: [
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
      pure(txb, args.vecU83, `vector<u8>`),
      pure(txb, args.vecU84, `vector<u8>`),
    ],
  })
}

export function pvkToBytes(txb: TransactionBlock, preparedVerifyingKey: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::pvk_to_bytes`,
    arguments: [obj(txb, preparedVerifyingKey)],
  })
}

export function publicProofInputsFromBytes(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::public_proof_inputs_from_bytes`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export function proofPointsFromBytes(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::proof_points_from_bytes`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export interface PrepareVerifyingKeyArgs {
  curve: ObjectArg
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function prepareVerifyingKey(txb: TransactionBlock, args: PrepareVerifyingKeyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::prepare_verifying_key`,
    arguments: [obj(txb, args.curve), pure(txb, args.vecU8, `vector<u8>`)],
  })
}

export interface PrepareVerifyingKeyInternalArgs {
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function prepareVerifyingKeyInternal(
  txb: TransactionBlock,
  args: PrepareVerifyingKeyInternalArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::prepare_verifying_key_internal`,
    arguments: [pure(txb, args.u8, `u8`), pure(txb, args.vecU8, `vector<u8>`)],
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
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  vecU84: Array<number | TransactionArgument> | TransactionArgument
  vecU85: Array<number | TransactionArgument> | TransactionArgument
  vecU86: Array<number | TransactionArgument> | TransactionArgument
}

export function verifyGroth16ProofInternal(
  txb: TransactionBlock,
  args: VerifyGroth16ProofInternalArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::groth16::verify_groth16_proof_internal`,
    arguments: [
      pure(txb, args.u8, `u8`),
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
      pure(txb, args.vecU83, `vector<u8>`),
      pure(txb, args.vecU84, `vector<u8>`),
      pure(txb, args.vecU85, `vector<u8>`),
      pure(txb, args.vecU86, `vector<u8>`),
    ],
  })
}
