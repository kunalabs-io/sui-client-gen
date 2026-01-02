import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure, vector } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function create(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::create`,
    arguments: [],
  })
}

export function loadInnerMut(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner_mut`,
    arguments: [obj(tx, self)],
  })
}

export function loadInner(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner`,
    arguments: [obj(tx, self)],
  })
}

export interface UpdateRandomnessStateArgs {
  self: TransactionObjectInput
  newRound: bigint | TransactionArgument
  newBytes: Array<number | TransactionArgument> | TransactionArgument
}

export function updateRandomnessState(tx: Transaction, args: UpdateRandomnessStateArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::update_randomness_state`,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.newRound, `u64`),
      pure(tx, args.newBytes, `vector<u8>`),
    ],
  })
}

export function newGenerator(tx: Transaction, r: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::new_generator`,
    arguments: [obj(tx, r)],
  })
}

export function deriveNextBlock(tx: Transaction, g: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::derive_next_block`,
    arguments: [obj(tx, g)],
  })
}

export interface GenerateBytesArgs {
  g: TransactionObjectInput
  numOfBytes: number | TransactionArgument
}

export function generateBytes(tx: Transaction, args: GenerateBytesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_bytes`,
    arguments: [obj(tx, args.g), pure(tx, args.numOfBytes, `u16`)],
  })
}

export function generateU256(tx: Transaction, g: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u256`,
    arguments: [obj(tx, g)],
  })
}

export function generateU128(tx: Transaction, g: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u128`,
    arguments: [obj(tx, g)],
  })
}

export function generateU64(tx: Transaction, g: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u64`,
    arguments: [obj(tx, g)],
  })
}

export function generateU32(tx: Transaction, g: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u32`,
    arguments: [obj(tx, g)],
  })
}

export function generateU16(tx: Transaction, g: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u16`,
    arguments: [obj(tx, g)],
  })
}

export function generateU8(tx: Transaction, g: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u8`,
    arguments: [obj(tx, g)],
  })
}

export function generateBool(tx: Transaction, g: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_bool`,
    arguments: [obj(tx, g)],
  })
}

export interface GenerateU128InRangeArgs {
  g: TransactionObjectInput
  min: bigint | TransactionArgument
  max: bigint | TransactionArgument
}

export function generateU128InRange(tx: Transaction, args: GenerateU128InRangeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u128_in_range`,
    arguments: [obj(tx, args.g), pure(tx, args.min, `u128`), pure(tx, args.max, `u128`)],
  })
}

export interface GenerateU64InRangeArgs {
  g: TransactionObjectInput
  min: bigint | TransactionArgument
  max: bigint | TransactionArgument
}

export function generateU64InRange(tx: Transaction, args: GenerateU64InRangeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u64_in_range`,
    arguments: [obj(tx, args.g), pure(tx, args.min, `u64`), pure(tx, args.max, `u64`)],
  })
}

export interface GenerateU32InRangeArgs {
  g: TransactionObjectInput
  min: number | TransactionArgument
  max: number | TransactionArgument
}

export function generateU32InRange(tx: Transaction, args: GenerateU32InRangeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u32_in_range`,
    arguments: [obj(tx, args.g), pure(tx, args.min, `u32`), pure(tx, args.max, `u32`)],
  })
}

export interface GenerateU16InRangeArgs {
  g: TransactionObjectInput
  min: number | TransactionArgument
  max: number | TransactionArgument
}

export function generateU16InRange(tx: Transaction, args: GenerateU16InRangeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u16_in_range`,
    arguments: [obj(tx, args.g), pure(tx, args.min, `u16`), pure(tx, args.max, `u16`)],
  })
}

export interface GenerateU8InRangeArgs {
  g: TransactionObjectInput
  min: number | TransactionArgument
  max: number | TransactionArgument
}

export function generateU8InRange(tx: Transaction, args: GenerateU8InRangeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::generate_u8_in_range`,
    arguments: [obj(tx, args.g), pure(tx, args.min, `u8`), pure(tx, args.max, `u8`)],
  })
}

export interface ShuffleArgs {
  g: TransactionObjectInput
  v: Array<GenericArg> | TransactionArgument
}

export function shuffle(tx: Transaction, typeArg: string, args: ShuffleArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::random::shuffle`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.g), vector(tx, `${typeArg}`, args.v)],
  })
}
