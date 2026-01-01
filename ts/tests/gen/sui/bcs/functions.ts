import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function toBytes(tx: Transaction, typeArg: string, value: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bcs::to_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, value)],
  })
}

export function new_(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bcs::new`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function intoRemainderBytes(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bcs::into_remainder_bytes`,
    arguments: [obj(tx, bcs)],
  })
}

export function peelAddress(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_address`, arguments: [obj(tx, bcs)] })
}

export function peelBool(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_bool`, arguments: [obj(tx, bcs)] })
}

export function peelU8(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_u8`, arguments: [obj(tx, bcs)] })
}

export function peelU16(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_u16`, arguments: [obj(tx, bcs)] })
}

export function peelU32(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_u32`, arguments: [obj(tx, bcs)] })
}

export function peelU64(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_u64`, arguments: [obj(tx, bcs)] })
}

export function peelU128(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_u128`, arguments: [obj(tx, bcs)] })
}

export function peelU256(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_u256`, arguments: [obj(tx, bcs)] })
}

export function peelVecLength(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_length`, arguments: [obj(tx, bcs)] })
}

export function peelVecAddress(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_vec_address`,
    arguments: [obj(tx, bcs)],
  })
}

export function peelVecBool(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_bool`, arguments: [obj(tx, bcs)] })
}

export function peelVecU8(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_u8`, arguments: [obj(tx, bcs)] })
}

export function peelVecVecU8(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_vec_u8`, arguments: [obj(tx, bcs)] })
}

export function peelVecU16(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_u16`, arguments: [obj(tx, bcs)] })
}

export function peelVecU32(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_u32`, arguments: [obj(tx, bcs)] })
}

export function peelVecU64(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_u64`, arguments: [obj(tx, bcs)] })
}

export function peelVecU128(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_u128`, arguments: [obj(tx, bcs)] })
}

export function peelVecU256(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_u256`, arguments: [obj(tx, bcs)] })
}

export function peelEnumTag(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_enum_tag`, arguments: [obj(tx, bcs)] })
}

export function peelOptionAddress(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_option_address`,
    arguments: [obj(tx, bcs)],
  })
}

export function peelOptionBool(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_option_bool`,
    arguments: [obj(tx, bcs)],
  })
}

export function peelOptionU8(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_option_u8`, arguments: [obj(tx, bcs)] })
}

export function peelOptionU16(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_option_u16`, arguments: [obj(tx, bcs)] })
}

export function peelOptionU32(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_option_u32`, arguments: [obj(tx, bcs)] })
}

export function peelOptionU64(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_option_u64`, arguments: [obj(tx, bcs)] })
}

export function peelOptionU128(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_option_u128`,
    arguments: [obj(tx, bcs)],
  })
}

export function peelOptionU256(tx: Transaction, bcs: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_option_u256`,
    arguments: [obj(tx, bcs)],
  })
}
