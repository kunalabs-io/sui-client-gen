import { PUBLISHED_AT } from '..'
import { GenericArg, Type, generic } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js'

export function emit(txb: TransactionBlock, typeArg: Type, event: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::event::emit`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, event)],
  })
}
