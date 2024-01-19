import { PUBLISHED_AT } from '..'
import { GenericArg, generic } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function print(txb: TransactionBlock, typeArg: string, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::debug::print`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function printStackTrace(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::debug::print_stack_trace`, arguments: [] })
}
