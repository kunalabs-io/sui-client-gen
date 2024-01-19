import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::object::new`, arguments: [] })
}

export function id(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::id`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function idToBytes(txb: TransactionBlock, id: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::id_to_bytes`,
    arguments: [pure(txb, id, `0x2::object::ID`)],
  })
}

export function idToAddress(txb: TransactionBlock, id: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::id_to_address`,
    arguments: [pure(txb, id, `0x2::object::ID`)],
  })
}

export function idFromBytes(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::id_from_bytes`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export function idFromAddress(txb: TransactionBlock, address: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::id_from_address`,
    arguments: [pure(txb, address, `address`)],
  })
}

export function suiSystemState(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::object::sui_system_state`, arguments: [] })
}

export function clock(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::object::clock`, arguments: [] })
}

export function authenticatorState(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::object::authenticator_state`, arguments: [] })
}

export function randomnessState(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::object::randomness_state`, arguments: [] })
}

export function uidAsInner(txb: TransactionBlock, uid: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::uid_as_inner`,
    arguments: [obj(txb, uid)],
  })
}

export function uidToInner(txb: TransactionBlock, uid: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::uid_to_inner`,
    arguments: [obj(txb, uid)],
  })
}

export function uidToBytes(txb: TransactionBlock, uid: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::uid_to_bytes`,
    arguments: [obj(txb, uid)],
  })
}

export function uidToAddress(txb: TransactionBlock, uid: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::uid_to_address`,
    arguments: [obj(txb, uid)],
  })
}

export function delete_(txb: TransactionBlock, uid: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::object::delete`, arguments: [obj(txb, uid)] })
}

export function borrowId(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::borrow_id`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function idBytes(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::id_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function idAddress(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::id_address`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function borrowUid(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::borrow_uid`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function newUidFromHash(txb: TransactionBlock, address: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::new_uid_from_hash`,
    arguments: [pure(txb, address, `address`)],
  })
}

export function deleteImpl(txb: TransactionBlock, address: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::delete_impl`,
    arguments: [pure(txb, address, `address`)],
  })
}

export function recordNewUid(txb: TransactionBlock, address: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::object::record_new_uid`,
    arguments: [pure(txb, address, `address`)],
  })
}
