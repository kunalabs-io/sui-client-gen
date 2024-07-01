import { PUBLISHED_AT } from '..'
import { obj, pure, vector } from '../../_framework/util'
import { Element } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function bytes(tx: Transaction, typeArg: string, e: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::bytes`,
    typeArguments: [typeArg],
    arguments: [obj(tx, e)],
  })
}

export interface FromBytesArgs {
  type: number | TransactionArgument
  bytes: Array<number | TransactionArgument> | TransactionArgument
  isTrusted: boolean | TransactionArgument
}

export function fromBytes(tx: Transaction, typeArg: string, args: FromBytesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::from_bytes`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.type, `u8`),
      pure(tx, args.bytes, `vector<u8>`),
      pure(tx, args.isTrusted, `bool`),
    ],
  })
}

export interface AddArgs {
  type: number | TransactionArgument
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function add(tx: Transaction, typeArg: string, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::add`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.type, `u8`), obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface DivArgs {
  type: number | TransactionArgument
  scalar: TransactionObjectInput
  e: TransactionObjectInput
}

export function div(tx: Transaction, typeArgs: [string, string], args: DivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::div`,
    typeArguments: typeArgs,
    arguments: [pure(tx, args.type, `u8`), obj(tx, args.scalar), obj(tx, args.e)],
  })
}

export interface EqualArgs {
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function equal(tx: Transaction, typeArg: string, args: EqualArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::equal`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface HashToArgs {
  type: number | TransactionArgument
  m: Array<number | TransactionArgument> | TransactionArgument
}

export function hashTo(tx: Transaction, typeArg: string, args: HashToArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::hash_to`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.type, `u8`), pure(tx, args.m, `vector<u8>`)],
  })
}

export interface InternalAddArgs {
  type: number | TransactionArgument
  e1: Array<number | TransactionArgument> | TransactionArgument
  e2: Array<number | TransactionArgument> | TransactionArgument
}

export function internalAdd(tx: Transaction, args: InternalAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_add`,
    arguments: [
      pure(tx, args.type, `u8`),
      pure(tx, args.e1, `vector<u8>`),
      pure(tx, args.e2, `vector<u8>`),
    ],
  })
}

export interface InternalDivArgs {
  type: number | TransactionArgument
  e1: Array<number | TransactionArgument> | TransactionArgument
  e2: Array<number | TransactionArgument> | TransactionArgument
}

export function internalDiv(tx: Transaction, args: InternalDivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_div`,
    arguments: [
      pure(tx, args.type, `u8`),
      pure(tx, args.e1, `vector<u8>`),
      pure(tx, args.e2, `vector<u8>`),
    ],
  })
}

export interface InternalHashToArgs {
  type: number | TransactionArgument
  m: Array<number | TransactionArgument> | TransactionArgument
}

export function internalHashTo(tx: Transaction, args: InternalHashToArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_hash_to`,
    arguments: [pure(tx, args.type, `u8`), pure(tx, args.m, `vector<u8>`)],
  })
}

export interface InternalMulArgs {
  type: number | TransactionArgument
  e1: Array<number | TransactionArgument> | TransactionArgument
  e2: Array<number | TransactionArgument> | TransactionArgument
}

export function internalMul(tx: Transaction, args: InternalMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_mul`,
    arguments: [
      pure(tx, args.type, `u8`),
      pure(tx, args.e1, `vector<u8>`),
      pure(tx, args.e2, `vector<u8>`),
    ],
  })
}

export interface InternalMultiScalarMulArgs {
  type: number | TransactionArgument
  scalars: Array<number | TransactionArgument> | TransactionArgument
  elements: Array<number | TransactionArgument> | TransactionArgument
}

export function internalMultiScalarMul(tx: Transaction, args: InternalMultiScalarMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_multi_scalar_mul`,
    arguments: [
      pure(tx, args.type, `u8`),
      pure(tx, args.scalars, `vector<u8>`),
      pure(tx, args.elements, `vector<u8>`),
    ],
  })
}

export interface InternalPairingArgs {
  type: number | TransactionArgument
  e1: Array<number | TransactionArgument> | TransactionArgument
  e2: Array<number | TransactionArgument> | TransactionArgument
}

export function internalPairing(tx: Transaction, args: InternalPairingArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_pairing`,
    arguments: [
      pure(tx, args.type, `u8`),
      pure(tx, args.e1, `vector<u8>`),
      pure(tx, args.e2, `vector<u8>`),
    ],
  })
}

export interface InternalSubArgs {
  type: number | TransactionArgument
  e1: Array<number | TransactionArgument> | TransactionArgument
  e2: Array<number | TransactionArgument> | TransactionArgument
}

export function internalSub(tx: Transaction, args: InternalSubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_sub`,
    arguments: [
      pure(tx, args.type, `u8`),
      pure(tx, args.e1, `vector<u8>`),
      pure(tx, args.e2, `vector<u8>`),
    ],
  })
}

export interface InternalValidateArgs {
  type: number | TransactionArgument
  bytes: Array<number | TransactionArgument> | TransactionArgument
}

export function internalValidate(tx: Transaction, args: InternalValidateArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_validate`,
    arguments: [pure(tx, args.type, `u8`), pure(tx, args.bytes, `vector<u8>`)],
  })
}

export interface MulArgs {
  type: number | TransactionArgument
  scalar: TransactionObjectInput
  e: TransactionObjectInput
}

export function mul(tx: Transaction, typeArgs: [string, string], args: MulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::mul`,
    typeArguments: typeArgs,
    arguments: [pure(tx, args.type, `u8`), obj(tx, args.scalar), obj(tx, args.e)],
  })
}

export interface MultiScalarMultiplicationArgs {
  type: number | TransactionArgument
  scalars: Array<TransactionObjectInput> | TransactionArgument
  elements: Array<TransactionObjectInput> | TransactionArgument
}

export function multiScalarMultiplication(
  tx: Transaction,
  typeArgs: [string, string],
  args: MultiScalarMultiplicationArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::multi_scalar_multiplication`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.type, `u8`),
      vector(tx, `${Element.$typeName}<${typeArgs[0]}>`, args.scalars),
      vector(tx, `${Element.$typeName}<${typeArgs[1]}>`, args.elements),
    ],
  })
}

export interface PairingArgs {
  type: number | TransactionArgument
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function pairing(tx: Transaction, typeArgs: [string, string, string], args: PairingArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::pairing`,
    typeArguments: typeArgs,
    arguments: [pure(tx, args.type, `u8`), obj(tx, args.e1), obj(tx, args.e2)],
  })
}

export interface SetAsPrefixArgs {
  x: bigint | TransactionArgument
  bigEndian: boolean | TransactionArgument
  buffer: Array<number | TransactionArgument> | TransactionArgument
}

export function setAsPrefix(tx: Transaction, args: SetAsPrefixArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::set_as_prefix`,
    arguments: [
      pure(tx, args.x, `u64`),
      pure(tx, args.bigEndian, `bool`),
      pure(tx, args.buffer, `vector<u8>`),
    ],
  })
}

export interface SubArgs {
  type: number | TransactionArgument
  e1: TransactionObjectInput
  e2: TransactionObjectInput
}

export function sub(tx: Transaction, typeArg: string, args: SubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::sub`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.type, `u8`), obj(tx, args.e1), obj(tx, args.e2)],
  })
}
