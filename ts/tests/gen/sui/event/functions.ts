import { PUBLISHED_AT } from '..'
import { GenericArg, generic, pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function emit(tx: Transaction, typeArg: string, event: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::event::emit`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, event)],
  })
}

export function emitAuthenticated(tx: Transaction, typeArg: string, event: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::event::emit_authenticated`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, event)],
  })
}

export interface EmitAuthenticatedImplArgs {
  accumulatorId: string | TransactionArgument
  stream: string | TransactionArgument
  event: GenericArg
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
      pure(tx, args.accumulatorId, `address`),
      pure(tx, args.stream, `address`),
      generic(tx, `${typeArgs[1]}`, args.event),
    ],
  })
}
