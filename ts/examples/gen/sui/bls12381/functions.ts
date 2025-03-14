import { PUBLISHED_AT } from '..'
import { obj, pure, vector } from '../../_framework/util'
import { Element } from '../group-ops/structs'
import { G1, G2, Scalar } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface Bls12381MinPkVerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

export function bls12381MinPkVerify(tx: Transaction, args: Bls12381MinPkVerifyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::bls12381_min_pk_verify`,
    arguments: [
      pure(tx, args.signature, `vector<u8>`),
      pure(tx, args.publicKey, `vector<u8>`),
      pure(tx, args.msg, `vector<u8>`),
    ],
  })
}

export interface Bls12381MinSigVerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

export function bls12381MinSigVerify(tx: Transaction, args: Bls12381MinSigVerifyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::bls12381_min_sig_verify`,
    arguments: [
      pure(tx, args.signature, `vector<u8>`),
      pure(tx, args.publicKey, `vector<u8>`),
      pure(tx, args.msg, `vector<u8>`),
    ],
  })
}

export interface G1AddArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g1Add(tx: Transaction, args: G1AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_add`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface G1DivArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g1Div(tx: Transaction, args: G1DivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_div`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export function g1FromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function g1Generator(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g1_generator`, arguments: [] })
}

export function g1Identity(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g1_identity`, arguments: [] })
}

export interface G1MulArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g1Mul(tx: Transaction, args: G1MulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_mul`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface G1MultiScalarMultiplicationArgs {
  scalars: Array<TransactionObjectInput> | TransactionArgument
  elements: Array<TransactionObjectInput> | TransactionArgument
}

export function g1MultiScalarMultiplication(
  tx: Transaction,
  args: G1MultiScalarMultiplicationArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_multi_scalar_multiplication`,
    arguments: [
      vector(tx, `${Element.$typeName}<${Scalar.$typeName}>`, args.scalars),
      vector(tx, `${Element.$typeName}<${G1.$typeName}>`, args.elements),
    ],
  })
}

export function g1Neg(tx: Transaction, e: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g1_neg`, arguments: [obj(tx, e)] })
}

export interface G1SubArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g1Sub(tx: Transaction, args: G1SubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_sub`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface G2AddArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g2Add(tx: Transaction, args: G2AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_add`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface G2DivArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g2Div(tx: Transaction, args: G2DivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_div`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export function g2FromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function g2Generator(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g2_generator`, arguments: [] })
}

export function g2Identity(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g2_identity`, arguments: [] })
}

export interface G2MulArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g2Mul(tx: Transaction, args: G2MulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_mul`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface G2MultiScalarMultiplicationArgs {
  scalars: Array<TransactionObjectInput> | TransactionArgument
  elements: Array<TransactionObjectInput> | TransactionArgument
}

export function g2MultiScalarMultiplication(
  tx: Transaction,
  args: G2MultiScalarMultiplicationArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_multi_scalar_multiplication`,
    arguments: [
      vector(tx, `${Element.$typeName}<${Scalar.$typeName}>`, args.scalars),
      vector(tx, `${Element.$typeName}<${G2.$typeName}>`, args.elements),
    ],
  })
}

export function g2Neg(tx: Transaction, e: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g2_neg`, arguments: [obj(tx, e)] })
}

export interface G2SubArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function g2Sub(tx: Transaction, args: G2SubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_sub`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface GtAddArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function gtAdd(tx: Transaction, args: GtAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_add`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface GtDivArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function gtDiv(tx: Transaction, args: GtDivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_div`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export function gtGenerator(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::gt_generator`, arguments: [] })
}

export function gtIdentity(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::gt_identity`, arguments: [] })
}

export interface GtMulArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function gtMul(tx: Transaction, args: GtMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_mul`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export function gtNeg(tx: Transaction, e: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::gt_neg`, arguments: [obj(tx, e)] })
}

export interface GtSubArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function gtSub(tx: Transaction, args: GtSubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_sub`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export function hashToG1(
  tx: Transaction,
  m: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::hash_to_g1`,
    arguments: [pure(tx, m, `vector<u8>`)],
  })
}

export function hashToG2(
  tx: Transaction,
  m: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::hash_to_g2`,
    arguments: [pure(tx, m, `vector<u8>`)],
  })
}

export interface PairingArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function pairing(tx: Transaction, args: PairingArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::pairing`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface ScalarAddArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function scalarAdd(tx: Transaction, args: ScalarAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_add`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface ScalarDivArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function scalarDiv(tx: Transaction, args: ScalarDivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_div`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export function scalarFromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function scalarFromU64(tx: Transaction, x: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_from_u64`,
    arguments: [pure(tx, x, `u64`)],
  })
}

export function scalarInv(tx: Transaction, e: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::scalar_inv`, arguments: [obj(tx, e)] })
}

export interface ScalarMulArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function scalarMul(tx: Transaction, args: ScalarMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_mul`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export function scalarNeg(tx: Transaction, e: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::scalar_neg`, arguments: [obj(tx, e)] })
}

export function scalarOne(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::scalar_one`, arguments: [] })
}

export interface ScalarSubArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function scalarSub(tx: Transaction, args: ScalarSubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_sub`,
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export function scalarZero(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::scalar_zero`, arguments: [] })
}
