import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj } from '../../_framework/util'

/** Create a new `Referent` struct */
export function new_(tx: Transaction, typeArg: string, value: GenericArg): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::borrow::new`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, value)],
  })
}

/**
 * Borrow the `T` from the `Referent`, receiving the `T` and a `Borrow`
 * hot potato.
 */
export function borrow(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::borrow::borrow`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export interface PutBackArgs {
  self: TransactionObjectInput
  value: GenericArg
  borrow: TransactionObjectInput
}

/** Put an object and the `Borrow` hot potato back. */
export function putBack(tx: Transaction, typeArg: string, args: PutBackArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::borrow::put_back`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      generic(tx, `${typeArg}`, args.value),
      obj(tx, args.borrow),
    ],
  })
}

/** Unpack the `Referent` struct and return the value. */
export function destroy(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::borrow::destroy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
