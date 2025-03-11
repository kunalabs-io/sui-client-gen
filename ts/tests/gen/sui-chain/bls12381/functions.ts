import { PUBLISHED_AT } from '..'
import { obj, pure, vector } from '../../_framework/util'
import { Element } from '../group-ops/structs'
import { G1, G2, Scalar, UncompressedG1 } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface PairingArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function pairing(tx: Transaction, args: PairingArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::pairing`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface Bls12381MinSigVerifyArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
}

export function bls12381MinSigVerify(tx: Transaction, args: Bls12381MinSigVerifyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::bls12381_min_sig_verify`,
    arguments: [
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
    ],
  })
}

export interface Bls12381MinPkVerifyArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
}

export function bls12381MinPkVerify(tx: Transaction, args: Bls12381MinPkVerifyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::bls12381_min_pk_verify`,
    arguments: [
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
    ],
  })
}

export function scalarFromBytes(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_from_bytes`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function scalarFromU64(tx: Transaction, u64: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_from_u64`,
    arguments: [pure(tx, u64, `u64`)],
  })
}

export function scalarZero(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::scalar_zero`, arguments: [] })
}

export function scalarOne(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::scalar_one`, arguments: [] })
}

export interface ScalarAddArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function scalarAdd(tx: Transaction, args: ScalarAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_add`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface ScalarSubArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function scalarSub(tx: Transaction, args: ScalarSubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_sub`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface ScalarMulArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function scalarMul(tx: Transaction, args: ScalarMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_mul`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface ScalarDivArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function scalarDiv(tx: Transaction, args: ScalarDivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_div`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export function scalarNeg(tx: Transaction, element: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_neg`,
    arguments: [obj(tx, element)],
  })
}

export function scalarInv(tx: Transaction, element: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::scalar_inv`,
    arguments: [obj(tx, element)],
  })
}

export function g1FromBytes(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_from_bytes`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function g1Identity(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g1_identity`, arguments: [] })
}

export function g1Generator(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g1_generator`, arguments: [] })
}

export interface G1AddArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function g1Add(tx: Transaction, args: G1AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_add`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface G1SubArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function g1Sub(tx: Transaction, args: G1SubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_sub`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface G1MulArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function g1Mul(tx: Transaction, args: G1MulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_mul`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface G1DivArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function g1Div(tx: Transaction, args: G1DivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_div`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export function g1Neg(tx: Transaction, element: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g1_neg`, arguments: [obj(tx, element)] })
}

export function hashToG1(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::hash_to_g1`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export interface G1MultiScalarMultiplicationArgs {
  vecElement1: Array<TransactionObjectInput> | TransactionArgument
  vecElement2: Array<TransactionObjectInput> | TransactionArgument
}

export function g1MultiScalarMultiplication(
  tx: Transaction,
  args: G1MultiScalarMultiplicationArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_multi_scalar_multiplication`,
    arguments: [
      vector(tx, `${Element.$typeName}<${Scalar.$typeName}>`, args.vecElement1),
      vector(tx, `${Element.$typeName}<${G1.$typeName}>`, args.vecElement2),
    ],
  })
}

export function g1ToUncompressedG1(tx: Transaction, element: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g1_to_uncompressed_g1`,
    arguments: [obj(tx, element)],
  })
}

export function g2FromBytes(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_from_bytes`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function g2Identity(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g2_identity`, arguments: [] })
}

export function g2Generator(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g2_generator`, arguments: [] })
}

export interface G2AddArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function g2Add(tx: Transaction, args: G2AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_add`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface G2SubArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function g2Sub(tx: Transaction, args: G2SubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_sub`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface G2MulArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function g2Mul(tx: Transaction, args: G2MulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_mul`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface G2DivArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function g2Div(tx: Transaction, args: G2DivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_div`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export function g2Neg(tx: Transaction, element: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::g2_neg`, arguments: [obj(tx, element)] })
}

export function hashToG2(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::hash_to_g2`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export interface G2MultiScalarMultiplicationArgs {
  vecElement1: Array<TransactionObjectInput> | TransactionArgument
  vecElement2: Array<TransactionObjectInput> | TransactionArgument
}

export function g2MultiScalarMultiplication(
  tx: Transaction,
  args: G2MultiScalarMultiplicationArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::g2_multi_scalar_multiplication`,
    arguments: [
      vector(tx, `${Element.$typeName}<${Scalar.$typeName}>`, args.vecElement1),
      vector(tx, `${Element.$typeName}<${G2.$typeName}>`, args.vecElement2),
    ],
  })
}

export function gtIdentity(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::gt_identity`, arguments: [] })
}

export function gtGenerator(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::gt_generator`, arguments: [] })
}

export interface GtAddArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function gtAdd(tx: Transaction, args: GtAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_add`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface GtSubArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function gtSub(tx: Transaction, args: GtSubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_sub`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface GtMulArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function gtMul(tx: Transaction, args: GtMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_mul`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface GtDivArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function gtDiv(tx: Transaction, args: GtDivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::gt_div`,
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export function gtNeg(tx: Transaction, element: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bls12381::gt_neg`, arguments: [obj(tx, element)] })
}

export function uncompressedG1ToG1(tx: Transaction, element: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::uncompressed_g1_to_g1`,
    arguments: [obj(tx, element)],
  })
}

export function uncompressedG1Sum(
  tx: Transaction,
  vecElement: Array<TransactionObjectInput> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bls12381::uncompressed_g1_sum`,
    arguments: [vector(tx, `${Element.$typeName}<${UncompressedG1.$typeName}>`, vecElement)],
  })
}
