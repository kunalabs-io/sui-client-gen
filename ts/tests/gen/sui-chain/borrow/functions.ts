import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock, typeArg: string, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::borrow::new`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function borrow(txb: TransactionBlock, typeArg: string, referent: ObjectArg) {
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

export function putBack(txb: TransactionBlock, typeArg: string, args: PutBackArgs) {
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

export function destroy(txb: TransactionBlock, typeArg: string, referent: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::borrow::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(txb, referent)],
  })
}
