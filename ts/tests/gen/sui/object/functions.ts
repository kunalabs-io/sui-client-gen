import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj as obj_, pure } from '../../_framework/util'
import { ID } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

/** Get the raw bytes of a `ID` */
export function idToBytes(tx: Transaction, id: string | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::id_to_bytes`,
    arguments: [pure(tx, id, `${ID.$typeName}`)],
  })
}

/** Get the inner bytes of `id` as an address. */
export function idToAddress(tx: Transaction, id: string | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::id_to_address`,
    arguments: [pure(tx, id, `${ID.$typeName}`)],
  })
}

/** Make an `ID` from raw bytes. */
export function idFromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::id_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/** Make an `ID` from an address. */
export function idFromAddress(tx: Transaction, bytes: string | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::id_from_address`,
    arguments: [pure(tx, bytes, `address`)],
  })
}

/**
 * Create the `UID` for the singleton `SuiSystemState` object.
 * This should only be called once from `sui_system`.
 */
export function suiSystemState(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::sui_system_state`,
    arguments: [],
  })
}

/**
 * Create the `UID` for the singleton `Clock` object.
 * This should only be called once from `clock`.
 */
export function clock(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::clock`,
    arguments: [],
  })
}

/**
 * Create the `UID` for the singleton `AuthenticatorState` object.
 * This should only be called once from `authenticator_state`.
 */
export function authenticatorState(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::authenticator_state`,
    arguments: [],
  })
}

/**
 * Create the `UID` for the singleton `Random` object.
 * This should only be called once from `random`.
 */
export function randomnessState(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::randomness_state`,
    arguments: [],
  })
}

/**
 * Create the `UID` for the singleton `DenyList` object.
 * This should only be called once from `deny_list`.
 */
export function suiDenyListObjectId(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::sui_deny_list_object_id`,
    arguments: [],
  })
}

export function suiAccumulatorRootObjectId(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::sui_accumulator_root_object_id`,
    arguments: [],
  })
}

export function suiAccumulatorRootAddress(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::sui_accumulator_root_address`,
    arguments: [],
  })
}

/**
 * Create the `UID` for the singleton `CoinRegistry` object.
 * This should only be called once from `coin_registry`.
 */
export function suiCoinRegistryObjectId(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::sui_coin_registry_object_id`,
    arguments: [],
  })
}

export function suiCoinRegistryAddress(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::sui_coin_registry_address`,
    arguments: [],
  })
}

/**
 * Create the `UID` for the singleton `Bridge` object.
 * This should only be called once from `bridge`.
 */
export function bridge(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::bridge`,
    arguments: [],
  })
}

/** Get the inner `ID` of `uid` */
export function uidAsInner(tx: Transaction, uid: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::uid_as_inner`,
    arguments: [obj_(tx, uid)],
  })
}

/** Get the raw bytes of a `uid`'s inner `ID` */
export function uidToInner(tx: Transaction, uid: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::uid_to_inner`,
    arguments: [obj_(tx, uid)],
  })
}

/** Get the raw bytes of a `UID` */
export function uidToBytes(tx: Transaction, uid: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::uid_to_bytes`,
    arguments: [obj_(tx, uid)],
  })
}

/** Get the inner bytes of `id` as an address. */
export function uidToAddress(tx: Transaction, uid: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::uid_to_address`,
    arguments: [obj_(tx, uid)],
  })
}

/**
 * Create a new object. Returns the `UID` that must be stored in a Sui object.
 * This is the only way to create `UID`s.
 */
export function new_(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::new`,
    arguments: [],
  })
}

/**
 * Delete the object and its `UID`. This is the only way to eliminate a `UID`.
 * This exists to inform Sui of object deletions. When an object
 * gets unpacked, the programmer will have to do something with its
 * `UID`. The implementation of this function emits a deleted
 * system event so Sui knows to process the object deletion
 */
export function delete_(tx: Transaction, id: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::delete`,
    arguments: [obj_(tx, id)],
  })
}

/** Get the underlying `ID` of `obj` */
export function id(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::id`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

/** Borrow the underlying `ID` of `obj` */
export function borrowId(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::borrow_id`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

/** Get the raw bytes for the underlying `ID` of `obj` */
export function idBytes(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::id_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

/** Get the inner bytes for the underlying `ID` of `obj` */
export function idAddress(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::id_address`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

/**
 * Get the `UID` for `obj`.
 * Safe because Sui has an extra bytecode verifier pass that forces every struct with
 * the `key` ability to have a distinguished `UID` field.
 * Cannot be made public as the access to `UID` for a given object must be privileged, and
 * restrictable in the object's module.
 */
export function borrowUid(tx: Transaction, typeArg: string, obj: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::borrow_uid`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, obj)],
  })
}

/** Generate a new UID specifically used for creating a UID from a hash */
export function newUidFromHash(tx: Transaction, bytes: string | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::new_uid_from_hash`,
    arguments: [pure(tx, bytes, `address`)],
  })
}

export function deleteImpl(tx: Transaction, id: string | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::delete_impl`,
    arguments: [pure(tx, id, `address`)],
  })
}

export function recordNewUid(tx: Transaction, id: string | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::object::record_new_uid`,
    arguments: [pure(tx, id, `address`)],
  })
}
