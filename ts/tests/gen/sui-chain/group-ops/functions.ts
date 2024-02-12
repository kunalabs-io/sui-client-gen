import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function bytes(txb: TransactionBlock, typeArg: string, element: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::bytes`,
    typeArguments: [typeArg],
    arguments: [obj(txb, element)],
  })
}

export interface FromBytesArgs {
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  bool: boolean | TransactionArgument
}

export function fromBytes(txb: TransactionBlock, typeArg: string, args: FromBytesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::from_bytes`,
    typeArguments: [typeArg],
    arguments: [
      pure(txb, args.u8, `u8`),
      pure(txb, args.vecU8, `vector<u8>`),
      pure(txb, args.bool, `bool`),
    ],
  })
}

export interface EqualArgs {
  element1: ObjectArg
  element2: ObjectArg
}

export function equal(txb: TransactionBlock, typeArg: string, args: EqualArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::equal`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.element1), obj(txb, args.element2)],
  })
}

export interface AddArgs {
  u8: number | TransactionArgument
  element1: ObjectArg
  element2: ObjectArg
}

export function add(txb: TransactionBlock, typeArg: string, args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::add`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.u8, `u8`), obj(txb, args.element1), obj(txb, args.element2)],
  })
}

export interface SubArgs {
  u8: number | TransactionArgument
  element1: ObjectArg
  element2: ObjectArg
}

export function sub(txb: TransactionBlock, typeArg: string, args: SubArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::sub`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.u8, `u8`), obj(txb, args.element1), obj(txb, args.element2)],
  })
}

export interface MulArgs {
  u8: number | TransactionArgument
  element1: ObjectArg
  element2: ObjectArg
}

export function mul(txb: TransactionBlock, typeArgs: [string, string], args: MulArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::mul`,
    typeArguments: typeArgs,
    arguments: [pure(txb, args.u8, `u8`), obj(txb, args.element1), obj(txb, args.element2)],
  })
}

export interface DivArgs {
  u8: number | TransactionArgument
  element1: ObjectArg
  element2: ObjectArg
}

export function div(txb: TransactionBlock, typeArgs: [string, string], args: DivArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::div`,
    typeArguments: typeArgs,
    arguments: [pure(txb, args.u8, `u8`), obj(txb, args.element1), obj(txb, args.element2)],
  })
}

export interface HashToArgs {
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function hashTo(txb: TransactionBlock, typeArg: string, args: HashToArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::hash_to`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.u8, `u8`), pure(txb, args.vecU8, `vector<u8>`)],
  })
}

export interface MultiScalarMultiplicationArgs {
  u8: number | TransactionArgument
  vecElement1: Array<ObjectArg> | TransactionArgument
  vecElement2: Array<ObjectArg> | TransactionArgument
}

export function multiScalarMultiplication(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: MultiScalarMultiplicationArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::multi_scalar_multiplication`,
    typeArguments: typeArgs,
    arguments: [
      pure(txb, args.u8, `u8`),
      vector(txb, `0x2::group_ops::Element<${typeArgs[0]}>`, args.vecElement1),
      vector(txb, `0x2::group_ops::Element<${typeArgs[1]}>`, args.vecElement2),
    ],
  })
}

export interface PairingArgs {
  u8: number | TransactionArgument
  element1: ObjectArg
  element2: ObjectArg
}

export function pairing(
  txb: TransactionBlock,
  typeArgs: [string, string, string],
  args: PairingArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::pairing`,
    typeArguments: typeArgs,
    arguments: [pure(txb, args.u8, `u8`), obj(txb, args.element1), obj(txb, args.element2)],
  })
}

export interface InternalValidateArgs {
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function internalValidate(txb: TransactionBlock, args: InternalValidateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_validate`,
    arguments: [pure(txb, args.u8, `u8`), pure(txb, args.vecU8, `vector<u8>`)],
  })
}

export interface InternalAddArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalAdd(txb: TransactionBlock, args: InternalAddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_add`,
    arguments: [
      pure(txb, args.u8, `u8`),
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface InternalSubArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalSub(txb: TransactionBlock, args: InternalSubArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_sub`,
    arguments: [
      pure(txb, args.u8, `u8`),
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface InternalMulArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalMul(txb: TransactionBlock, args: InternalMulArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_mul`,
    arguments: [
      pure(txb, args.u8, `u8`),
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface InternalDivArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalDiv(txb: TransactionBlock, args: InternalDivArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_div`,
    arguments: [
      pure(txb, args.u8, `u8`),
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface InternalHashToArgs {
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function internalHashTo(txb: TransactionBlock, args: InternalHashToArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_hash_to`,
    arguments: [pure(txb, args.u8, `u8`), pure(txb, args.vecU8, `vector<u8>`)],
  })
}

export interface InternalMultiScalarMulArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalMultiScalarMul(txb: TransactionBlock, args: InternalMultiScalarMulArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_multi_scalar_mul`,
    arguments: [
      pure(txb, args.u8, `u8`),
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface InternalPairingArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalPairing(txb: TransactionBlock, args: InternalPairingArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_pairing`,
    arguments: [
      pure(txb, args.u8, `u8`),
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface SetAsPrefixArgs {
  u64: bigint | TransactionArgument
  bool: boolean | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function setAsPrefix(txb: TransactionBlock, args: SetAsPrefixArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::set_as_prefix`,
    arguments: [
      pure(txb, args.u64, `u64`),
      pure(txb, args.bool, `bool`),
      pure(txb, args.vecU8, `vector<u8>`),
    ],
  })
}
