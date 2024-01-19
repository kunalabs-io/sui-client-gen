import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::borrow::new`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function borrow(txb: TransactionBlock, typeArg: Type, referent: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::borrow::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(txb, referent)],
  })
}

export interface PutBackArgs {
  referent: ObjectArg
  t0: GenericArg
  borrow: ObjectArg
}

export function putBack(txb: TransactionBlock, typeArg: Type, args: PutBackArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::borrow::put_back`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.referent),
      generic(txb, `${typeArg}`, args.t0),
      obj(txb, args.borrow),
    ],
  })
}

export function destroy(txb: TransactionBlock, typeArg: Type, referent: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::borrow::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(txb, referent)],
  })
}
