import { PUBLISHED_AT } from '..'
import { GenericArg, Type, generic } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js'

export function print(txb: TransactionBlock, typeArg: Type, x: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::debug::print`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, x)],
  })
}

export function printStackTrace(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::debug::print_stack_trace`, arguments: [] })
}
