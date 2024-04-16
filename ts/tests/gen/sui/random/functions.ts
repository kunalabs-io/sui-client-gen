import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function create(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::random::create`, arguments: [] })
}

export function loadInner(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner`,
    arguments: [obj(txb, self)],
  })
}

export function loadInnerMut(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner_mut`,
    arguments: [obj(txb, self)],
  })
}

export function deriveNextBlock(txb: TransactionBlock, g: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::derive_next_block`,
    arguments: [obj(txb, g)],
  })
}

export function fillBuffer(txb: TransactionBlock, g: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::random::fill_buffer`, arguments: [obj(txb, g)] })
}

export function generateBool(txb: TransactionBlock, g: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_bool`,
    arguments: [obj(txb, g)],
  })
}

export interface GenerateBytesArgs {
  g: ObjectArg
  numOfBytes: number | TransactionArgument
}

export function generateBytes(txb: TransactionBlock, args: GenerateBytesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_bytes`,
    arguments: [obj(txb, args.g), pure(txb, args.numOfBytes, `u16`)],
  })
}

export function generateU128(txb: TransactionBlock, g: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u128`,
    arguments: [obj(txb, g)],
  })
}

export interface GenerateU128InRangeArgs {
  g: ObjectArg
  min: bigint | TransactionArgument
  max: bigint | TransactionArgument
}

export function generateU128InRange(txb: TransactionBlock, args: GenerateU128InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u128_in_range`,
    arguments: [obj(txb, args.g), pure(txb, args.min, `u128`), pure(txb, args.max, `u128`)],
  })
}

export function generateU16(txb: TransactionBlock, g: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::random::generate_u16`, arguments: [obj(txb, g)] })
}

export interface GenerateU16InRangeArgs {
  g: ObjectArg
  min: number | TransactionArgument
  max: number | TransactionArgument
}

export function generateU16InRange(txb: TransactionBlock, args: GenerateU16InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u16_in_range`,
    arguments: [obj(txb, args.g), pure(txb, args.min, `u16`), pure(txb, args.max, `u16`)],
  })
}

export function generateU256(txb: TransactionBlock, g: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u256`,
    arguments: [obj(txb, g)],
  })
}

export function generateU32(txb: TransactionBlock, g: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::random::generate_u32`, arguments: [obj(txb, g)] })
}

export interface GenerateU32InRangeArgs {
  g: ObjectArg
  min: number | TransactionArgument
  max: number | TransactionArgument
}

export function generateU32InRange(txb: TransactionBlock, args: GenerateU32InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u32_in_range`,
    arguments: [obj(txb, args.g), pure(txb, args.min, `u32`), pure(txb, args.max, `u32`)],
  })
}

export function generateU64(txb: TransactionBlock, g: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::random::generate_u64`, arguments: [obj(txb, g)] })
}

export interface GenerateU64InRangeArgs {
  g: ObjectArg
  min: bigint | TransactionArgument
  max: bigint | TransactionArgument
}

export function generateU64InRange(txb: TransactionBlock, args: GenerateU64InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u64_in_range`,
    arguments: [obj(txb, args.g), pure(txb, args.min, `u64`), pure(txb, args.max, `u64`)],
  })
}

export function generateU8(txb: TransactionBlock, g: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::random::generate_u8`, arguments: [obj(txb, g)] })
}

export interface GenerateU8InRangeArgs {
  g: ObjectArg
  min: number | TransactionArgument
  max: number | TransactionArgument
}

export function generateU8InRange(txb: TransactionBlock, args: GenerateU8InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u8_in_range`,
    arguments: [obj(txb, args.g), pure(txb, args.min, `u8`), pure(txb, args.max, `u8`)],
  })
}

export function newGenerator(txb: TransactionBlock, r: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::new_generator`,
    arguments: [obj(txb, r)],
  })
}

export interface ShuffleArgs {
  g: ObjectArg
  v: Array<GenericArg> | TransactionArgument
}

export function shuffle(txb: TransactionBlock, typeArg: string, args: ShuffleArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::shuffle`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.g), vector(txb, `${typeArg}`, args.v)],
  })
}

export interface U128InRangeArgs {
  g: ObjectArg
  min: bigint | TransactionArgument
  max: bigint | TransactionArgument
  numOfBytes: number | TransactionArgument
}

export function u128InRange(txb: TransactionBlock, args: U128InRangeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::u128_in_range`,
    arguments: [
      obj(txb, args.g),
      pure(txb, args.min, `u128`),
      pure(txb, args.max, `u128`),
      pure(txb, args.numOfBytes, `u8`),
    ],
  })
}

export interface U256FromBytesArgs {
  g: ObjectArg
  numOfBytes: number | TransactionArgument
}

export function u256FromBytes(txb: TransactionBlock, args: U256FromBytesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::u256_from_bytes`,
    arguments: [obj(txb, args.g), pure(txb, args.numOfBytes, `u8`)],
  })
}

export interface UpdateRandomnessStateArgs {
  self: ObjectArg
  newRound: bigint | TransactionArgument
  newBytes: Array<number | TransactionArgument> | TransactionArgument
}

export function updateRandomnessState(txb: TransactionBlock, args: UpdateRandomnessStateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::update_randomness_state`,
    arguments: [
      obj(txb, args.self),
      pure(txb, args.newRound, `u64`),
      pure(txb, args.newBytes, `vector<u8>`),
    ],
  })
}
