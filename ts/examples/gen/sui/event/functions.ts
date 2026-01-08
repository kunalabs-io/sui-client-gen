import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

/**
 * Emit a custom Move event, sending the data offchain.
 *
 * Used for creating custom indexes and tracking onchain
 * activity in a way that suits a specific application the most.
 *
 * The type `T` is the main way to index the event, and can contain
 * phantom parameters, eg `emit(MyEvent<phantom T>)`.
 */
export function emit(tx: Transaction, typeArg: string, event: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::event::emit`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, event)],
  })
}

/**
 * Emits a custom Move event which can be authenticated by a light client.
 *
 * This method emits the authenticated event to the event stream for the Move package that
 * defines the event type `T`.
 * Only the package that defines the type `T` can emit authenticated events to this stream.
 */
export function emitAuthenticated(tx: Transaction, typeArg: string, event: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::event::emit_authenticated`,
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
    target: `${getPublishedAt('sui')}::event::emit_authenticated_impl`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.accumulatorId, `address`),
      pure(tx, args.stream, `address`),
      generic(tx, `${typeArgs[1]}`, args.event),
    ],
  })
}
