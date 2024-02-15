import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function bytes(txb: TransactionBlock, typeArg: string, e: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::bytes`,
    typeArguments: [typeArg],
    arguments: [obj(txb, e)],
  })
}

export interface FromBytesArgs {
  type: number | TransactionArgument
  bytes: Array<number | TransactionArgument> | TransactionArgument
  isTrusted: boolean | TransactionArgument
}

export function fromBytes(txb: TransactionBlock, typeArg: string, args: FromBytesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::from_bytes`,
    typeArguments: [typeArg],
    arguments: [
      pure(txb, args.type, `u8`),
      pure(txb, args.bytes, `vector<u8>`),
      pure(txb, args.isTrusted, `bool`),
    ],
  })
}

export interface AddArgs {
  type: number | TransactionArgument
  e1: ObjectArg
  e2: ObjectArg
}

export function add(txb: TransactionBlock, typeArg: string, args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::add`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.type, `u8`), obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface DivArgs {
  type: number | TransactionArgument
  scalar: ObjectArg
  e: ObjectArg
}

export function div(txb: TransactionBlock, typeArgs: [string, string], args: DivArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::div`,
    typeArguments: typeArgs,
    arguments: [pure(txb, args.type, `u8`), obj(txb, args.scalar), obj(txb, args.e)],
  })
}

export interface EqualArgs {
  e1: ObjectArg
  e2: ObjectArg
}

export function equal(txb: TransactionBlock, typeArg: string, args: EqualArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::equal`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface HashToArgs {
  type: number | TransactionArgument
  m: Array<number | TransactionArgument> | TransactionArgument
}

export function hashTo(txb: TransactionBlock, typeArg: string, args: HashToArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::hash_to`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.type, `u8`), pure(txb, args.m, `vector<u8>`)],
  })
}

export interface InternalAddArgs {
  type: number | TransactionArgument
  e1: Array<number | TransactionArgument> | TransactionArgument
  e2: Array<number | TransactionArgument> | TransactionArgument
}

export function internalAdd(txb: TransactionBlock, args: InternalAddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_add`,
    arguments: [
      pure(txb, args.type, `u8`),
      pure(txb, args.e1, `vector<u8>`),
      pure(txb, args.e2, `vector<u8>`),
    ],
  })
}

export interface InternalDivArgs {
  type: number | TransactionArgument
  e1: Array<number | TransactionArgument> | TransactionArgument
  e2: Array<number | TransactionArgument> | TransactionArgument
}

export function internalDiv(txb: TransactionBlock, args: InternalDivArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_div`,
    arguments: [
      pure(txb, args.type, `u8`),
      pure(txb, args.e1, `vector<u8>`),
      pure(txb, args.e2, `vector<u8>`),
    ],
  })
}

export interface InternalHashToArgs {
  type: number | TransactionArgument
  m: Array<number | TransactionArgument> | TransactionArgument
}

export function internalHashTo(txb: TransactionBlock, args: InternalHashToArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_hash_to`,
    arguments: [pure(txb, args.type, `u8`), pure(txb, args.m, `vector<u8>`)],
  })
}

export interface InternalMulArgs {
  type: number | TransactionArgument
  e1: Array<number | TransactionArgument> | TransactionArgument
  e2: Array<number | TransactionArgument> | TransactionArgument
}

export function internalMul(txb: TransactionBlock, args: InternalMulArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_mul`,
    arguments: [
      pure(txb, args.type, `u8`),
      pure(txb, args.e1, `vector<u8>`),
      pure(txb, args.e2, `vector<u8>`),
    ],
  })
}

export interface InternalMultiScalarMulArgs {
  type: number | TransactionArgument
  scalars: Array<number | TransactionArgument> | TransactionArgument
  elements: Array<number | TransactionArgument> | TransactionArgument
}

export function internalMultiScalarMul(txb: TransactionBlock, args: InternalMultiScalarMulArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_multi_scalar_mul`,
    arguments: [
      pure(txb, args.type, `u8`),
      pure(txb, args.scalars, `vector<u8>`),
      pure(txb, args.elements, `vector<u8>`),
    ],
  })
}

export interface InternalPairingArgs {
  type: number | TransactionArgument
  e1: Array<number | TransactionArgument> | TransactionArgument
  e2: Array<number | TransactionArgument> | TransactionArgument
}

export function internalPairing(txb: TransactionBlock, args: InternalPairingArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_pairing`,
    arguments: [
      pure(txb, args.type, `u8`),
      pure(txb, args.e1, `vector<u8>`),
      pure(txb, args.e2, `vector<u8>`),
    ],
  })
}

export interface InternalSubArgs {
  type: number | TransactionArgument
  e1: Array<number | TransactionArgument> | TransactionArgument
  e2: Array<number | TransactionArgument> | TransactionArgument
}

export function internalSub(txb: TransactionBlock, args: InternalSubArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_sub`,
    arguments: [
      pure(txb, args.type, `u8`),
      pure(txb, args.e1, `vector<u8>`),
      pure(txb, args.e2, `vector<u8>`),
    ],
  })
}

export interface InternalValidateArgs {
  type: number | TransactionArgument
  bytes: Array<number | TransactionArgument> | TransactionArgument
}

export function internalValidate(txb: TransactionBlock, args: InternalValidateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_validate`,
    arguments: [pure(txb, args.type, `u8`), pure(txb, args.bytes, `vector<u8>`)],
  })
}

export interface MulArgs {
  type: number | TransactionArgument
  scalar: ObjectArg
  e: ObjectArg
}

export function mul(txb: TransactionBlock, typeArgs: [string, string], args: MulArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::mul`,
    typeArguments: typeArgs,
    arguments: [pure(txb, args.type, `u8`), obj(txb, args.scalar), obj(txb, args.e)],
  })
}

export interface MultiScalarMultiplicationArgs {
  type: number | TransactionArgument
  scalars: Array<ObjectArg> | TransactionArgument
  elements: Array<ObjectArg> | TransactionArgument
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
      pure(txb, args.type, `u8`),
      vector(txb, `0x2::group_ops::Element<${typeArgs[0]}>`, args.scalars),
      vector(txb, `0x2::group_ops::Element<${typeArgs[1]}>`, args.elements),
    ],
  })
}

export interface PairingArgs {
  type: number | TransactionArgument
  e1: ObjectArg
  e2: ObjectArg
}

export function pairing(
  txb: TransactionBlock,
  typeArgs: [string, string, string],
  args: PairingArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::pairing`,
    typeArguments: typeArgs,
    arguments: [pure(txb, args.type, `u8`), obj(txb, args.e1), obj(txb, args.e2)],
  })
}

export interface SetAsPrefixArgs {
  x: bigint | TransactionArgument
  bigEndian: boolean | TransactionArgument
  buffer: Array<number | TransactionArgument> | TransactionArgument
}

export function setAsPrefix(txb: TransactionBlock, args: SetAsPrefixArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::set_as_prefix`,
    arguments: [
      pure(txb, args.x, `u64`),
      pure(txb, args.bigEndian, `bool`),
      pure(txb, args.buffer, `vector<u8>`),
    ],
  })
}

export interface SubArgs {
  type: number | TransactionArgument
  e1: ObjectArg
  e2: ObjectArg
}

export function sub(txb: TransactionBlock, typeArg: string, args: SubArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::group_ops::sub`,
    typeArguments: [typeArg],
    arguments: [pure(txb, args.type, `u8`), obj(txb, args.e1), obj(txb, args.e2)],
  })
}
