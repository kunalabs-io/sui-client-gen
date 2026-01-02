import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::borrow::new`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function borrow(tx: Transaction, typeArg: string, referent: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::borrow::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(tx, referent)],
  })
}

export interface PutBackArgs {
  referent: TransactionObjectInput
  t0: GenericArg
  borrow: TransactionObjectInput
}

export function putBack(tx: Transaction, typeArg: string, args: PutBackArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::borrow::put_back`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.referent), generic(tx, `${typeArg}`, args.t0), obj(tx, args.borrow)],
  })
}

export function destroy(tx: Transaction, typeArg: string, referent: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::borrow::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, referent)],
  })
}
