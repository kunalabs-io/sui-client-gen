import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js'

export function borrow(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::borrow::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function new_(txb: TransactionBlock, typeArg: Type, value: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::borrow::new`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, value)],
  })
}

export function destroy(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::borrow::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface PutBackArgs {
  self: ObjectArg
  value: GenericArg
  borrow: ObjectArg
}

export function putBack(txb: TransactionBlock, typeArg: Type, args: PutBackArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::borrow::put_back`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), generic(txb, `${typeArg}`, args.value), obj(txb, args.borrow)],
  })
}
