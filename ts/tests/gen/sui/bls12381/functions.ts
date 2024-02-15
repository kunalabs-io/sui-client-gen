import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface PairingArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function pairing(txb: TransactionBlock, args: PairingArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::pairing`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface Bls12381MinPkVerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

export function bls12381MinPkVerify(txb: TransactionBlock, args: Bls12381MinPkVerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::bls12381_min_pk_verify`,
    arguments: [
      pure(txb, args.signature, `vector<u8>`),
      pure(txb, args.publicKey, `vector<u8>`),
      pure(txb, args.msg, `vector<u8>`),
    ],
  })
}

export interface Bls12381MinSigVerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

export function bls12381MinSigVerify(txb: TransactionBlock, args: Bls12381MinSigVerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::bls12381_min_sig_verify`,
    arguments: [
      pure(txb, args.signature, `vector<u8>`),
      pure(txb, args.publicKey, `vector<u8>`),
      pure(txb, args.msg, `vector<u8>`),
    ],
  })
}

export interface G1AddArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function g1Add(txb: TransactionBlock, args: G1AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_add`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface G1DivArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function g1Div(txb: TransactionBlock, args: G1DivArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_div`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export function g1FromBytes(
  txb: TransactionBlock,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_from_bytes`,
    arguments: [pure(txb, bytes, `vector<u8>`)],
  })
}

export function g1Generator(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::g1_generator`, arguments: [] })
}

export function g1Identity(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::g1_identity`, arguments: [] })
}

export interface G1MulArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function g1Mul(txb: TransactionBlock, args: G1MulArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_mul`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface G1MultiScalarMultiplicationArgs {
  scalars: Array<ObjectArg> | TransactionArgument
  elements: Array<ObjectArg> | TransactionArgument
}

export function g1MultiScalarMultiplication(
  txb: TransactionBlock,
  args: G1MultiScalarMultiplicationArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_multi_scalar_multiplication`,
    arguments: [
      vector(txb, `0x2::group_ops::Element<0x2::bls12381::Scalar>`, args.scalars),
      vector(txb, `0x2::group_ops::Element<0x2::bls12381::G1>`, args.elements),
    ],
  })
}

export function g1Neg(txb: TransactionBlock, e: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::g1_neg`, arguments: [obj(txb, e)] })
}

export interface G1SubArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function g1Sub(txb: TransactionBlock, args: G1SubArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_sub`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface G2AddArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function g2Add(txb: TransactionBlock, args: G2AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_add`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface G2DivArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function g2Div(txb: TransactionBlock, args: G2DivArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_div`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export function g2FromBytes(
  txb: TransactionBlock,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_from_bytes`,
    arguments: [pure(txb, bytes, `vector<u8>`)],
  })
}

export function g2Generator(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::g2_generator`, arguments: [] })
}

export function g2Identity(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::g2_identity`, arguments: [] })
}

export interface G2MulArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function g2Mul(txb: TransactionBlock, args: G2MulArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_mul`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface G2MultiScalarMultiplicationArgs {
  scalars: Array<ObjectArg> | TransactionArgument
  elements: Array<ObjectArg> | TransactionArgument
}

export function g2MultiScalarMultiplication(
  txb: TransactionBlock,
  args: G2MultiScalarMultiplicationArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_multi_scalar_multiplication`,
    arguments: [
      vector(txb, `0x2::group_ops::Element<0x2::bls12381::Scalar>`, args.scalars),
      vector(txb, `0x2::group_ops::Element<0x2::bls12381::G2>`, args.elements),
    ],
  })
}

export function g2Neg(txb: TransactionBlock, e: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::g2_neg`, arguments: [obj(txb, e)] })
}

export interface G2SubArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function g2Sub(txb: TransactionBlock, args: G2SubArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_sub`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface GtAddArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function gtAdd(txb: TransactionBlock, args: GtAddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_add`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface GtDivArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function gtDiv(txb: TransactionBlock, args: GtDivArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_div`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export function gtGenerator(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::gt_generator`, arguments: [] })
}

export function gtIdentity(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::gt_identity`, arguments: [] })
}

export interface GtMulArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function gtMul(txb: TransactionBlock, args: GtMulArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_mul`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export function gtNeg(txb: TransactionBlock, e: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::gt_neg`, arguments: [obj(txb, e)] })
}

export interface GtSubArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function gtSub(txb: TransactionBlock, args: GtSubArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_sub`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export function hashToG1(
  txb: TransactionBlock,
  m: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::hash_to_g1`,
    arguments: [pure(txb, m, `vector<u8>`)],
  })
}

export function hashToG2(
  txb: TransactionBlock,
  m: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::hash_to_g2`,
    arguments: [pure(txb, m, `vector<u8>`)],
  })
}

export interface ScalarAddArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function scalarAdd(txb: TransactionBlock, args: ScalarAddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_add`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface ScalarDivArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function scalarDiv(txb: TransactionBlock, args: ScalarDivArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_div`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export function scalarFromBytes(
  txb: TransactionBlock,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_from_bytes`,
    arguments: [pure(txb, bytes, `vector<u8>`)],
  })
}

export function scalarFromU64(txb: TransactionBlock, x: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_from_u64`,
    arguments: [pure(txb, x, `u64`)],
  })
}

export function scalarInv(txb: TransactionBlock, e: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::scalar_inv`, arguments: [obj(txb, e)] })
}

export interface ScalarMulArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function scalarMul(txb: TransactionBlock, args: ScalarMulArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_mul`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export function scalarNeg(txb: TransactionBlock, e: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::scalar_neg`, arguments: [obj(txb, e)] })
}

export function scalarOne(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::scalar_one`, arguments: [] })
}

export interface ScalarSubArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function scalarSub(txb: TransactionBlock, args: ScalarSubArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_sub`,
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export function scalarZero(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bls12381::scalar_zero`, arguments: [] })
}
