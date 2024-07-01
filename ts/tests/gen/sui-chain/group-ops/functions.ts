import { PUBLISHED_AT } from '..'
import { obj, pure, vector } from '../../_framework/util'
import { Element } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function bytes(tx: Transaction, typeArg: string, element: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::bytes`,
    typeArguments: [typeArg],
    arguments: [obj(tx, element)],
  })
}

export interface FromBytesArgs {
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  bool: boolean | TransactionArgument
}

export function fromBytes(tx: Transaction, typeArg: string, args: FromBytesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::from_bytes`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.bool, `bool`),
    ],
  })
}

export interface EqualArgs {
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function equal(tx: Transaction, typeArg: string, args: EqualArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::equal`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface AddArgs {
  u8: number | TransactionArgument
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function add(tx: Transaction, typeArg: string, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::add`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.u8, `u8`), obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface SubArgs {
  u8: number | TransactionArgument
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function sub(tx: Transaction, typeArg: string, args: SubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::sub`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.u8, `u8`), obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface MulArgs {
  u8: number | TransactionArgument
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function mul(tx: Transaction, typeArgs: [string, string], args: MulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::mul`,
    typeArguments: typeArgs,
    arguments: [pure(tx, args.u8, `u8`), obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface DivArgs {
  u8: number | TransactionArgument
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function div(tx: Transaction, typeArgs: [string, string], args: DivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::div`,
    typeArguments: typeArgs,
    arguments: [pure(tx, args.u8, `u8`), obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface HashToArgs {
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function hashTo(tx: Transaction, typeArg: string, args: HashToArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::hash_to`,
    typeArguments: [typeArg],
    arguments: [pure(tx, args.u8, `u8`), pure(tx, args.vecU8, `vector<u8>`)],
  })
}

export interface MultiScalarMultiplicationArgs {
  u8: number | TransactionArgument
  vecElement1: Array<TransactionObjectInput> | TransactionArgument
  vecElement2: Array<TransactionObjectInput> | TransactionArgument
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
      pure(tx, args.u8, `u8`),
      vector(tx, `${Element.$typeName}<${typeArgs[0]}>`, args.vecElement1),
      vector(tx, `${Element.$typeName}<${typeArgs[1]}>`, args.vecElement2),
    ],
  })
}

export interface PairingArgs {
  u8: number | TransactionArgument
  element1: TransactionObjectInput
  element2: TransactionObjectInput
}

export function pairing(tx: Transaction, typeArgs: [string, string, string], args: PairingArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::pairing`,
    typeArguments: typeArgs,
    arguments: [pure(tx, args.u8, `u8`), obj(tx, args.element1), obj(tx, args.element2)],
  })
}

export interface InternalValidateArgs {
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function internalValidate(tx: Transaction, args: InternalValidateArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_validate`,
    arguments: [pure(tx, args.u8, `u8`), pure(tx, args.vecU8, `vector<u8>`)],
  })
}

export interface InternalAddArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalAdd(tx: Transaction, args: InternalAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_add`,
    arguments: [
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface InternalSubArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalSub(tx: Transaction, args: InternalSubArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_sub`,
    arguments: [
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface InternalMulArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalMul(tx: Transaction, args: InternalMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_mul`,
    arguments: [
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface InternalDivArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalDiv(tx: Transaction, args: InternalDivArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_div`,
    arguments: [
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface InternalHashToArgs {
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function internalHashTo(tx: Transaction, args: InternalHashToArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_hash_to`,
    arguments: [pure(tx, args.u8, `u8`), pure(tx, args.vecU8, `vector<u8>`)],
  })
}

export interface InternalMultiScalarMulArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalMultiScalarMul(tx: Transaction, args: InternalMultiScalarMulArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_multi_scalar_mul`,
    arguments: [
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface InternalPairingArgs {
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalPairing(tx: Transaction, args: InternalPairingArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::internal_pairing`,
    arguments: [
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
    ],
  })
}

export interface SetAsPrefixArgs {
  u64: bigint | TransactionArgument
  bool: boolean | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function setAsPrefix(tx: Transaction, args: SetAsPrefixArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::group_ops::set_as_prefix`,
    arguments: [
      pure(tx, args.u64, `u64`),
      pure(tx, args.bool, `bool`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}
