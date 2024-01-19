import { PUBLISHED_AT } from '..'
import { GenericArg, generic } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function emit(txb: TransactionBlock, typeArg: string, event: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::event::emit`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, event)],
  })
}
