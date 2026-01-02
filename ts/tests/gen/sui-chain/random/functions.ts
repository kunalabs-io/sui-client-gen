import { PUBLISHED_AT } from '..'
import { GenericArg, obj, pure, vector } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function create(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::random::create`, arguments: [] })
}

export function loadInnerMut(tx: Transaction, random: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner_mut`,
    arguments: [obj(tx, random)],
  })
}

export function loadInner(tx: Transaction, random: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner`,
    arguments: [obj(tx, random)],
  })
}

export interface UpdateRandomnessStateArgs {
  random: TransactionObjectInput
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function updateRandomnessState(tx: Transaction, args: UpdateRandomnessStateArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::update_randomness_state`,
    arguments: [
      obj(tx, args.random),
      pure(tx, args.u64, `u64`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export function newGenerator(tx: Transaction, random: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::new_generator`,
    arguments: [obj(tx, random)],
  })
}

export function deriveNextBlock(tx: Transaction, randomGenerator: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::derive_next_block`,
    arguments: [obj(tx, randomGenerator)],
  })
}

export interface GenerateBytesArgs {
  randomGenerator: TransactionObjectInput
  u16: number | TransactionArgument
}

export function generateBytes(tx: Transaction, args: GenerateBytesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_bytes`,
    arguments: [obj(tx, args.randomGenerator), pure(tx, args.u16, `u16`)],
  })
}

export function generateU256(tx: Transaction, randomGenerator: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u256`,
    arguments: [obj(tx, randomGenerator)],
  })
}

export function generateU128(tx: Transaction, randomGenerator: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u128`,
    arguments: [obj(tx, randomGenerator)],
  })
}

export function generateU64(tx: Transaction, randomGenerator: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u64`,
    arguments: [obj(tx, randomGenerator)],
  })
}

export function generateU32(tx: Transaction, randomGenerator: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u32`,
    arguments: [obj(tx, randomGenerator)],
  })
}

export function generateU16(tx: Transaction, randomGenerator: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u16`,
    arguments: [obj(tx, randomGenerator)],
  })
}

export function generateU8(tx: Transaction, randomGenerator: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u8`,
    arguments: [obj(tx, randomGenerator)],
  })
}

export function generateBool(tx: Transaction, randomGenerator: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_bool`,
    arguments: [obj(tx, randomGenerator)],
  })
}

export interface GenerateU128InRangeArgs {
  randomGenerator: TransactionObjectInput
  u1281: bigint | TransactionArgument
  u1282: bigint | TransactionArgument
}

export function generateU128InRange(tx: Transaction, args: GenerateU128InRangeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u128_in_range`,
    arguments: [
      obj(tx, args.randomGenerator),
      pure(tx, args.u1281, `u128`),
      pure(tx, args.u1282, `u128`),
    ],
  })
}

export interface GenerateU64InRangeArgs {
  randomGenerator: TransactionObjectInput
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function generateU64InRange(tx: Transaction, args: GenerateU64InRangeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u64_in_range`,
    arguments: [
      obj(tx, args.randomGenerator),
      pure(tx, args.u641, `u64`),
      pure(tx, args.u642, `u64`),
    ],
  })
}

export interface GenerateU32InRangeArgs {
  randomGenerator: TransactionObjectInput
  u321: number | TransactionArgument
  u322: number | TransactionArgument
}

export function generateU32InRange(tx: Transaction, args: GenerateU32InRangeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u32_in_range`,
    arguments: [
      obj(tx, args.randomGenerator),
      pure(tx, args.u321, `u32`),
      pure(tx, args.u322, `u32`),
    ],
  })
}

export interface GenerateU16InRangeArgs {
  randomGenerator: TransactionObjectInput
  u161: number | TransactionArgument
  u162: number | TransactionArgument
}

export function generateU16InRange(tx: Transaction, args: GenerateU16InRangeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u16_in_range`,
    arguments: [
      obj(tx, args.randomGenerator),
      pure(tx, args.u161, `u16`),
      pure(tx, args.u162, `u16`),
    ],
  })
}

export interface GenerateU8InRangeArgs {
  randomGenerator: TransactionObjectInput
  u81: number | TransactionArgument
  u82: number | TransactionArgument
}

export function generateU8InRange(tx: Transaction, args: GenerateU8InRangeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u8_in_range`,
    arguments: [obj(tx, args.randomGenerator), pure(tx, args.u81, `u8`), pure(tx, args.u82, `u8`)],
  })
}

export interface ShuffleArgs {
  randomGenerator: TransactionObjectInput
  vecT0: Array<GenericArg> | TransactionArgument
}

export function shuffle(tx: Transaction, typeArg: string, args: ShuffleArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::shuffle`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.randomGenerator), vector(tx, `${typeArg}`, args.vecT0)],
  })
}
