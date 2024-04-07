import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function create(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::random::create`, arguments: [] })
}

export function loadInnerMut(txb: TransactionBlock, random: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner_mut`,
    arguments: [obj(txb, random)],
  })
}

export function loadInner(txb: TransactionBlock, random: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner`,
    arguments: [obj(txb, random)],
  })
}

export interface UpdateRandomnessStateArgs {
  random: ObjectArg
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function updateRandomnessState(txb: TransactionBlock, args: UpdateRandomnessStateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::update_randomness_state`,
    arguments: [
      obj(txb, args.random),
      pure(txb, args.u64, `u64`),
      pure(txb, args.vecU8, `vector<u8>`),
    ],
  })
}

export function newGenerator(txb: TransactionBlock, random: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::new_generator`,
    arguments: [obj(txb, random)],
  })
}

export function deriveNextBlock(txb: TransactionBlock, randomGenerator: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::derive_next_block`,
    arguments: [obj(txb, randomGenerator)],
  })
}

export function fillBuffer(txb: TransactionBlock, randomGenerator: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::fill_buffer`,
    arguments: [obj(txb, randomGenerator)],
  })
}

export interface GenerateBytesArgs {
  randomGenerator: ObjectArg
  u16: number | TransactionArgument
}

export function generateBytes(txb: TransactionBlock, args: GenerateBytesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_bytes`,
    arguments: [obj(txb, args.randomGenerator), pure(txb, args.u16, `u16`)],
  })
}

export interface U256FromBytesArgs {
  randomGenerator: ObjectArg
  u8: number | TransactionArgument
}

export function u256FromBytes(txb: TransactionBlock, args: U256FromBytesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::u256_from_bytes`,
    arguments: [obj(txb, args.randomGenerator), pure(txb, args.u8, `u8`)],
  })
}

export function generateU256(txb: TransactionBlock, randomGenerator: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u256`,
    arguments: [obj(txb, randomGenerator)],
  })
}

export function generateU128(txb: TransactionBlock, randomGenerator: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u128`,
    arguments: [obj(txb, randomGenerator)],
  })
}

export function generateU64(txb: TransactionBlock, randomGenerator: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u64`,
    arguments: [obj(txb, randomGenerator)],
  })
}

export function generateU32(txb: TransactionBlock, randomGenerator: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u32`,
    arguments: [obj(txb, randomGenerator)],
  })
}

export function generateU16(txb: TransactionBlock, randomGenerator: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u16`,
    arguments: [obj(txb, randomGenerator)],
  })
}

export function generateU8(txb: TransactionBlock, randomGenerator: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u8`,
    arguments: [obj(txb, randomGenerator)],
  })
}

export function generateBool(txb: TransactionBlock, randomGenerator: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_bool`,
    arguments: [obj(txb, randomGenerator)],
  })
}

export interface U128InRangeArgs {
  randomGenerator: ObjectArg
  u1281: bigint | TransactionArgument
  u1282: bigint | TransactionArgument
  u8: number | TransactionArgument
}

export function u128InRange(txb: TransactionBlock, args: U128InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::u128_in_range`,
    arguments: [
      obj(txb, args.randomGenerator),
      pure(txb, args.u1281, `u128`),
      pure(txb, args.u1282, `u128`),
      pure(txb, args.u8, `u8`),
    ],
  })
}

export interface GenerateU128InRangeArgs {
  randomGenerator: ObjectArg
  u1281: bigint | TransactionArgument
  u1282: bigint | TransactionArgument
}

export function generateU128InRange(txb: TransactionBlock, args: GenerateU128InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u128_in_range`,
    arguments: [
      obj(txb, args.randomGenerator),
      pure(txb, args.u1281, `u128`),
      pure(txb, args.u1282, `u128`),
    ],
  })
}

export interface GenerateU64InRangeArgs {
  randomGenerator: ObjectArg
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function generateU64InRange(txb: TransactionBlock, args: GenerateU64InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u64_in_range`,
    arguments: [
      obj(txb, args.randomGenerator),
      pure(txb, args.u641, `u64`),
      pure(txb, args.u642, `u64`),
    ],
  })
}

export interface GenerateU32InRangeArgs {
  randomGenerator: ObjectArg
  u321: number | TransactionArgument
  u322: number | TransactionArgument
}

export function generateU32InRange(txb: TransactionBlock, args: GenerateU32InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u32_in_range`,
    arguments: [
      obj(txb, args.randomGenerator),
      pure(txb, args.u321, `u32`),
      pure(txb, args.u322, `u32`),
    ],
  })
}

export interface GenerateU16InRangeArgs {
  randomGenerator: ObjectArg
  u161: number | TransactionArgument
  u162: number | TransactionArgument
}

export function generateU16InRange(txb: TransactionBlock, args: GenerateU16InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u16_in_range`,
    arguments: [
      obj(txb, args.randomGenerator),
      pure(txb, args.u161, `u16`),
      pure(txb, args.u162, `u16`),
    ],
  })
}

export interface GenerateU8InRangeArgs {
  randomGenerator: ObjectArg
  u81: number | TransactionArgument
  u82: number | TransactionArgument
}

export function generateU8InRange(txb: TransactionBlock, args: GenerateU8InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u8_in_range`,
    arguments: [
      obj(txb, args.randomGenerator),
      pure(txb, args.u81, `u8`),
      pure(txb, args.u82, `u8`),
    ],
  })
}

export interface ShuffleArgs {
  randomGenerator: ObjectArg
  vecT0: Array<GenericArg> | TransactionArgument
}

export function shuffle(txb: TransactionBlock, typeArg: string, args: ShuffleArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::shuffle`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.randomGenerator), vector(txb, `${typeArg}`, args.vecT0)],
  })
}
