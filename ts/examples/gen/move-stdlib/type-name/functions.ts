import { PUBLISHED_AT } from '..'
import { obj } from '../../_framework/util'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'

export function withDefiningIds(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::with_defining_ids`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function withOriginalIds(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::with_original_ids`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function definingId(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::defining_id`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function originalId(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::original_id`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function isPrimitive(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::is_primitive`,
    arguments: [obj(tx, self)],
  })
}

export function asString(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::as_string`,
    arguments: [obj(tx, self)],
  })
}

export function addressString(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::address_string`,
    arguments: [obj(tx, self)],
  })
}

export function moduleString(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::module_string`,
    arguments: [obj(tx, self)],
  })
}

export function intoString(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::into_string`,
    arguments: [obj(tx, self)],
  })
}

export function get(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::get`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function getWithOriginalIds(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::get_with_original_ids`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function borrowString(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::borrow_string`,
    arguments: [obj(tx, self)],
  })
}

export function getAddress(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::get_address`,
    arguments: [obj(tx, self)],
  })
}

export function getModule(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::type_name::get_module`,
    arguments: [obj(tx, self)],
  })
}
