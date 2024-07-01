import { PUBLISHED_AT } from '..'
import { GenericArg, generic } from '../../_framework/util'
import { Transaction } from '@mysten/sui/transactions'

export function emit(tx: Transaction, typeArg: string, event: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::event::emit`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, event)],
  })
}
