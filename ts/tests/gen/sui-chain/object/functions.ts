import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { ID } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::new`, arguments: [] })
}

export function idToBytes(tx: Transaction, id: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::id_to_bytes`,
    arguments: [pure(tx, id, `${ID.$typeName}`)],
  })
}

export function idToAddress(tx: Transaction, id: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::id_to_address`,
    arguments: [pure(tx, id, `${ID.$typeName}`)],
  })
}

export function idFromBytes(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::id_from_bytes`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function idFromAddress(tx: Transaction, address: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::id_from_address`,
    arguments: [pure(tx, address, `address`)],
  })
}

export function suiSystemState(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::sui_system_state`, arguments: [] })
}

export function clock(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::clock`, arguments: [] })
}

export function authenticatorState(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::authenticator_state`, arguments: [] })
}

export function randomnessState(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::randomness_state`, arguments: [] })
}

export function suiDenyListObjectId(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::sui_deny_list_object_id`, arguments: [] })
}

export function bridge(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::bridge`, arguments: [] })
}

export function uidAsInner(tx: Transaction, uid: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::uid_as_inner`, arguments: [obj(tx, uid)] })
}

export function uidToInner(tx: Transaction, uid: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::uid_to_inner`, arguments: [obj(tx, uid)] })
}

export function uidToBytes(tx: Transaction, uid: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::uid_to_bytes`, arguments: [obj(tx, uid)] })
}

export function uidToAddress(tx: Transaction, uid: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::uid_to_address`,
    arguments: [obj(tx, uid)],
  })
}

export function delete_(tx: Transaction, uid: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::object::delete`, arguments: [obj(tx, uid)] })
}

export function id(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::id`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function borrowId(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::borrow_id`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function idBytes(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::id_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function idAddress(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::id_address`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function borrowUid(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::borrow_uid`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function newUidFromHash(tx: Transaction, address: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::new_uid_from_hash`,
    arguments: [pure(tx, address, `address`)],
  })
}

export function deleteImpl(tx: Transaction, address: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::delete_impl`,
    arguments: [pure(tx, address, `address`)],
  })
}

export function recordNewUid(tx: Transaction, address: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::object::record_new_uid`,
    arguments: [pure(tx, address, `address`)],
  })
}
