import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::new`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export function toBytes(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::to_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function intoRemainderBytes(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::into_remainder_bytes`,
    arguments: [obj(txb, bcs)],
  })
}

export function peelAddress(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_address`, arguments: [obj(txb, bcs)] })
}

export function peelBool(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_bool`, arguments: [obj(txb, bcs)] })
}

export function peelU8(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_u8`, arguments: [obj(txb, bcs)] })
}

export function peelU64(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_u64`, arguments: [obj(txb, bcs)] })
}

export function peelU128(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_u128`, arguments: [obj(txb, bcs)] })
}

export function peelVecLength(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_vec_length`,
    arguments: [obj(txb, bcs)],
  })
}

export function peelVecAddress(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_vec_address`,
    arguments: [obj(txb, bcs)],
  })
}

export function peelVecBool(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_bool`, arguments: [obj(txb, bcs)] })
}

export function peelVecU8(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_u8`, arguments: [obj(txb, bcs)] })
}

export function peelVecVecU8(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_vec_vec_u8`,
    arguments: [obj(txb, bcs)],
  })
}

export function peelVecU64(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_u64`, arguments: [obj(txb, bcs)] })
}

export function peelVecU128(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::bcs::peel_vec_u128`, arguments: [obj(txb, bcs)] })
}

export function peelOptionAddress(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_option_address`,
    arguments: [obj(txb, bcs)],
  })
}

export function peelOptionBool(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_option_bool`,
    arguments: [obj(txb, bcs)],
  })
}

export function peelOptionU8(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_option_u8`,
    arguments: [obj(txb, bcs)],
  })
}

export function peelOptionU64(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_option_u64`,
    arguments: [obj(txb, bcs)],
  })
}

export function peelOptionU128(txb: TransactionBlock, bcs: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::peel_option_u128`,
    arguments: [obj(txb, bcs)],
  })
}
