import { PUBLISHED_AT } from '..'
import { GenericArg, generic, pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function emit(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::event::emit`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function emitAuthenticated(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::event::emit_authenticated`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export interface EmitAuthenticatedImplArgs {
  address1: string | TransactionArgument
  address2: string | TransactionArgument
  t1: GenericArg
}

export function emitAuthenticatedImpl(
  tx: Transaction,
  typeArgs: [string, string],
  args: EmitAuthenticatedImplArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::event::emit_authenticated_impl`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.address1, `address`),
      pure(tx, args.address2, `address`),
      generic(tx, `${typeArgs[1]}`, args.t1),
    ],
  })
}
