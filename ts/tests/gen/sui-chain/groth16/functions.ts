import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function bls12381(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::bls12381`,
    arguments: [],
  })
}

export function bn254(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::bn254`,
    arguments: [],
  })
}

export interface PvkFromBytesArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  vecU84: Array<number | TransactionArgument> | TransactionArgument
}

export function pvkFromBytes(tx: Transaction, args: PvkFromBytesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::pvk_from_bytes`,
    arguments: [
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      pure(tx, args.vecU84, `vector<u8>`),
    ],
  })
}

export function pvkToBytes(tx: Transaction, preparedVerifyingKey: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::pvk_to_bytes`,
    arguments: [obj(tx, preparedVerifyingKey)],
  })
}

export function publicProofInputsFromBytes(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::public_proof_inputs_from_bytes`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function proofPointsFromBytes(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::proof_points_from_bytes`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export interface PrepareVerifyingKeyArgs {
  curve: TransactionObjectInput
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function prepareVerifyingKey(tx: Transaction, args: PrepareVerifyingKeyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::prepare_verifying_key`,
    arguments: [obj(tx, args.curve), pure(tx, args.vecU8, `vector<u8>`)],
  })
}

export interface PrepareVerifyingKeyInternalArgs {
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function prepareVerifyingKeyInternal(
  tx: Transaction,
  args: PrepareVerifyingKeyInternalArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::prepare_verifying_key_internal`,
    arguments: [pure(tx, args.u8, `u8`), pure(tx, args.vecU8, `vector<u8>`)],
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
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  vecU84: Array<number | TransactionArgument> | TransactionArgument
  vecU85: Array<number | TransactionArgument> | TransactionArgument
  vecU86: Array<number | TransactionArgument> | TransactionArgument
}

export function verifyGroth16ProofInternal(tx: Transaction, args: VerifyGroth16ProofInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::groth16::verify_groth16_proof_internal`,
    arguments: [
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      pure(tx, args.vecU84, `vector<u8>`),
      pure(tx, args.vecU85, `vector<u8>`),
      pure(tx, args.vecU86, `vector<u8>`),
    ],
  })
}
