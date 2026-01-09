import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { obj, pure, vector } from '../../_framework/util'
import { Element } from '../group-ops/structs'
import { G1, G2, Scalar, UncompressedG1 } from './structs'

export interface Bls12381MinSigVerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

/**
 * @param signature: A 48-bytes signature that is a point on the G1 subgroup.
 * @param public_key: A 96-bytes public key that is a point on the G2 subgroup.
 * @param msg: The message that we test the signature against.
 *
 * If the signature is a valid signature of the message and public key according to
 * BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_, return true. Otherwise, return false.
 */
export function bls12381MinSigVerify(
  tx: Transaction,
  args: Bls12381MinSigVerifyArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::bls12381_min_sig_verify`,
    arguments: [
      pure(tx, args.signature, `vector<u8>`),
      pure(tx, args.publicKey, `vector<u8>`),
      pure(tx, args.msg, `vector<u8>`),
    ],
  })
}

export interface Bls12381MinPkVerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

/**
 * @param signature: A 96-bytes signature that is a point on the G2 subgroup.
 * @param public_key: A 48-bytes public key that is a point on the G1 subgroup.
 * @param msg: The message that we test the signature against.
 *
 * If the signature is a valid signature of the message and public key according to
 * BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_, return true. Otherwise, return false.
 */
export function bls12381MinPkVerify(
  tx: Transaction,
  args: Bls12381MinPkVerifyArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::bls12381_min_pk_verify`,
    arguments: [
      pure(tx, args.signature, `vector<u8>`),
      pure(tx, args.publicKey, `vector<u8>`),
      pure(tx, args.msg, `vector<u8>`),
    ],
  })
}

export function scalarFromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::scalar_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function scalarFromU64(tx: Transaction, x: bigint | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::scalar_from_u64`,
    arguments: [pure(tx, x, `u64`)],
  })
}

export function scalarZero(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::scalar_zero`,
    arguments: [],
  })
}

export function scalarOne(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::scalar_one`,
    arguments: [],
  })
}

export interface ScalarAddArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function scalarAdd(tx: Transaction, args: ScalarAddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::scalar_add`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface ScalarSubArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function scalarSub(tx: Transaction, args: ScalarSubArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::scalar_sub`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface ScalarMulArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function scalarMul(tx: Transaction, args: ScalarMulArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::scalar_mul`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface ScalarDivArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

/** Returns e2/e1, fails if a is zero. */
export function scalarDiv(tx: Transaction, args: ScalarDivArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::scalar_div`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export function scalarNeg(tx: Transaction, e: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::scalar_neg`,
    arguments: [obj(tx, e)],
  })
}

export function scalarInv(tx: Transaction, e: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::scalar_inv`,
    arguments: [obj(tx, e)],
  })
}

export function g1FromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g1_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function g1Identity(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g1_identity`,
    arguments: [],
  })
}

export function g1Generator(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g1_generator`,
    arguments: [],
  })
}

export interface G1AddArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g1Add(tx: Transaction, args: G1AddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g1_add`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface G1SubArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g1Sub(tx: Transaction, args: G1SubArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g1_sub`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface G1MulArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g1Mul(tx: Transaction, args: G1MulArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g1_mul`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface G1DivArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

/** Returns e2 / e1, fails if scalar is zero. */
export function g1Div(tx: Transaction, args: G1DivArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g1_div`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export function g1Neg(tx: Transaction, e: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g1_neg`,
    arguments: [obj(tx, e)],
  })
}

/** Hash using DST = BLS_SIG_BLS12381G1_XMD:SHA-256_SSWU_RO_NUL_ */
export function hashToG1(
  tx: Transaction,
  m: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::hash_to_g1`,
    arguments: [pure(tx, m, `vector<u8>`)],
  })
}

export interface G1MultiScalarMultiplicationArgs {
  scalars: Array<TransactionObjectInput> | TransactionArgument
  elements: Array<TransactionObjectInput> | TransactionArgument
}

/**
 * Let 'scalars' be the vector [s1, s2, ..., sn] and 'elements' be the vector [e1, e2, ..., en].
 * Returns s1*e1 + s2*e2 + ... + sn*en.
 * Aborts with `EInputTooLong` if the vectors are larger than 32 (may increase in the future).
 */
export function g1MultiScalarMultiplication(
  tx: Transaction,
  args: G1MultiScalarMultiplicationArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g1_multi_scalar_multiplication`,
    arguments: [
      vector(tx, `${Element.$typeName}<${Scalar.$typeName}>`, args.scalars),
      vector(tx, `${Element.$typeName}<${G1.$typeName}>`, args.elements),
    ],
  })
}

/** Convert an `Element<G1>` to uncompressed form. */
export function g1ToUncompressedG1(tx: Transaction, e: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g1_to_uncompressed_g1`,
    arguments: [obj(tx, e)],
  })
}

export function g2FromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g2_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function g2Identity(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g2_identity`,
    arguments: [],
  })
}

export function g2Generator(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g2_generator`,
    arguments: [],
  })
}

export interface G2AddArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g2Add(tx: Transaction, args: G2AddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g2_add`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface G2SubArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g2Sub(tx: Transaction, args: G2SubArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g2_sub`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface G2MulArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g2Mul(tx: Transaction, args: G2MulArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g2_mul`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface G2DivArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

/** Returns e2 / e1, fails if scalar is zero. */
export function g2Div(tx: Transaction, args: G2DivArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g2_div`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export function g2Neg(tx: Transaction, e: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g2_neg`,
    arguments: [obj(tx, e)],
  })
}

/** Hash using DST = BLS_SIG_BLS12381G2_XMD:SHA-256_SSWU_RO_NUL_ */
export function hashToG2(
  tx: Transaction,
  m: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::hash_to_g2`,
    arguments: [pure(tx, m, `vector<u8>`)],
  })
}

export interface G2MultiScalarMultiplicationArgs {
  scalars: Array<TransactionObjectInput> | TransactionArgument
  elements: Array<TransactionObjectInput> | TransactionArgument
}

/**
 * Let 'scalars' be the vector [s1, s2, ..., sn] and 'elements' be the vector [e1, e2, ..., en].
 * Returns s1*e1 + s2*e2 + ... + sn*en.
 * Aborts with `EInputTooLong` if the vectors are larger than 32 (may increase in the future).
 */
export function g2MultiScalarMultiplication(
  tx: Transaction,
  args: G2MultiScalarMultiplicationArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::g2_multi_scalar_multiplication`,
    arguments: [
      vector(tx, `${Element.$typeName}<${Scalar.$typeName}>`, args.scalars),
      vector(tx, `${Element.$typeName}<${G2.$typeName}>`, args.elements),
    ],
  })
}

export function gtIdentity(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::gt_identity`,
    arguments: [],
  })
}

export function gtGenerator(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::gt_generator`,
    arguments: [],
  })
}

export interface GtAddArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function gtAdd(tx: Transaction, args: GtAddArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::gt_add`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface GtSubArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function gtSub(tx: Transaction, args: GtSubArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::gt_sub`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface GtMulArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function gtMul(tx: Transaction, args: GtMulArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::gt_mul`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export interface GtDivArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

/** Returns e2 / e1, fails if scalar is zero. */
export function gtDiv(tx: Transaction, args: GtDivArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::gt_div`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

export function gtNeg(tx: Transaction, e: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::gt_neg`,
    arguments: [obj(tx, e)],
  })
}

export interface PairingArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function pairing(tx: Transaction, args: PairingArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::pairing`,
    arguments: [
      obj(tx, args.e1),
      obj(tx, args.e2),
    ],
  })
}

/**
 * UncompressedG1 group operations ///
 * Create a `Element<G1>` from its uncompressed form.
 */
export function uncompressedG1ToG1(tx: Transaction, e: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::uncompressed_g1_to_g1`,
    arguments: [obj(tx, e)],
  })
}

/**
 * Compute the sum of a list of uncompressed elements.
 * This is significantly faster and cheaper than summing the elements.
 */
export function uncompressedG1Sum(
  tx: Transaction,
  terms: Array<TransactionObjectInput> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bls12381::uncompressed_g1_sum`,
    arguments: [vector(tx, `${Element.$typeName}<${UncompressedG1.$typeName}>`, terms)],
  })
}
