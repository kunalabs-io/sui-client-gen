import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

/**
 * Get BCS serialized bytes for any value.
 * Re-exports stdlib `bcs::to_bytes`.
 */
export function toBytes(tx: Transaction, typeArg: string, value: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::to_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, value)],
  })
}

/**
 * Creates a new instance of BCS wrapper that holds inversed
 * bytes for better performance.
 */
export function new_(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::new`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/**
 * Unpack the `BCS` struct returning the leftover bytes.
 * Useful for passing the data further after partial deserialization.
 */
export function intoRemainderBytes(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::into_remainder_bytes`,
    arguments: [obj(tx, bcs)],
  })
}

/** Read address from the bcs-serialized bytes. */
export function peelAddress(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_address`,
    arguments: [obj(tx, bcs)],
  })
}

/** Read a `bool` value from bcs-serialized bytes. */
export function peelBool(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_bool`,
    arguments: [obj(tx, bcs)],
  })
}

/** Read `u8` value from bcs-serialized bytes. */
export function peelU8(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_u8`,
    arguments: [obj(tx, bcs)],
  })
}

/** Read `u16` value from bcs-serialized bytes. */
export function peelU16(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_u16`,
    arguments: [obj(tx, bcs)],
  })
}

/** Read `u32` value from bcs-serialized bytes. */
export function peelU32(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_u32`,
    arguments: [obj(tx, bcs)],
  })
}

/** Read `u64` value from bcs-serialized bytes. */
export function peelU64(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_u64`,
    arguments: [obj(tx, bcs)],
  })
}

/** Read `u128` value from bcs-serialized bytes. */
export function peelU128(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_u128`,
    arguments: [obj(tx, bcs)],
  })
}

/** Read `u256` value from bcs-serialized bytes. */
export function peelU256(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_u256`,
    arguments: [obj(tx, bcs)],
  })
}

/**
 * Read ULEB bytes expecting a vector length. Result should
 * then be used to perform `peel_*` operation LEN times.
 *
 * In BCS `vector` length is implemented with ULEB128;
 * See more here: https://en.wikipedia.org/wiki/LEB128
 */
export function peelVecLength(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_vec_length`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel a vector of `address` from serialized bytes. */
export function peelVecAddress(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_vec_address`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel a vector of `address` from serialized bytes. */
export function peelVecBool(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_vec_bool`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel a vector of `u8` (eg string) from serialized bytes. */
export function peelVecU8(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_vec_u8`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel a `vector<vector<u8>>` (eg vec of string) from serialized bytes. */
export function peelVecVecU8(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_vec_vec_u8`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel a vector of `u16` from serialized bytes. */
export function peelVecU16(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_vec_u16`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel a vector of `u32` from serialized bytes. */
export function peelVecU32(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_vec_u32`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel a vector of `u64` from serialized bytes. */
export function peelVecU64(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_vec_u64`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel a vector of `u128` from serialized bytes. */
export function peelVecU128(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_vec_u128`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel a vector of `u256` from serialized bytes. */
export function peelVecU256(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_vec_u256`,
    arguments: [obj(tx, bcs)],
  })
}

/**
 * Peel enum from serialized bytes, where `$f` takes a `tag` value and returns
 * the corresponding enum variant. Move enums are limited to 127 variants,
 * however the tag can be any `u32` value.
 *
 * Example:
 * ```rust
 * let my_enum = match (bcs.peel_enum_tag()) {
 * 0 => Enum::Empty,
 * 1 => Enum::U8(bcs.peel_u8()),
 * 2 => Enum::U16(bcs.peel_u16()),
 * 3 => Enum::Struct { a: bcs.peel_address(), b: bcs.peel_u8() },
 * _ => abort,
 * };
 * ```
 */
export function peelEnumTag(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_enum_tag`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel `Option<address>` from serialized bytes. */
export function peelOptionAddress(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_option_address`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel `Option<bool>` from serialized bytes. */
export function peelOptionBool(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_option_bool`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel `Option<u8>` from serialized bytes. */
export function peelOptionU8(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_option_u8`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel `Option<u16>` from serialized bytes. */
export function peelOptionU16(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_option_u16`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel `Option<u32>` from serialized bytes. */
export function peelOptionU32(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_option_u32`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel `Option<u64>` from serialized bytes. */
export function peelOptionU64(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_option_u64`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel `Option<u128>` from serialized bytes. */
export function peelOptionU128(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_option_u128`,
    arguments: [obj(tx, bcs)],
  })
}

/** Peel `Option<u256>` from serialized bytes. */
export function peelOptionU256(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::bcs::peel_option_u256`,
    arguments: [obj(tx, bcs)],
  })
}
