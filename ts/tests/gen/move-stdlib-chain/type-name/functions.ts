import { PUBLISHED_AT } from '..'
import { ObjectArg, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function get(txb: TransactionBlock, typeArg: string) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::type_name::get`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function getWithOriginalIds(txb: TransactionBlock, typeArg: string) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::type_name::get_with_original_ids`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function borrowString(txb: TransactionBlock, typeName: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::type_name::borrow_string`,
    arguments: [obj(txb, typeName)],
  })
}

export function getAddress(txb: TransactionBlock, typeName: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::type_name::get_address`,
    arguments: [obj(txb, typeName)],
  })
}

export function getModule(txb: TransactionBlock, typeName: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::type_name::get_module`,
    arguments: [obj(txb, typeName)],
  })
}

export function intoString(txb: TransactionBlock, typeName: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::type_name::into_string`,
    arguments: [obj(txb, typeName)],
  })
}
