import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj } from '../../_framework/util'
import { Transaction, TransactionObjectInput } from '@mysten/sui/transactions'

export function borrow(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::borrow::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function new_(tx: Transaction, typeArg: string, value: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::borrow::new`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, value)],
  })
}

export function destroy(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::borrow::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export interface PutBackArgs {
  self: TransactionObjectInput
  value: GenericArg
  borrow: TransactionObjectInput
}

export function putBack(tx: Transaction, typeArg: string, args: PutBackArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::borrow::put_back`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), generic(tx, `${typeArg}`, args.value), obj(tx, args.borrow)],
  })
}
