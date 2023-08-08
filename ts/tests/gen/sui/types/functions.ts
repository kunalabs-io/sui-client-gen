import { PUBLISHED_AT } from '..'
import { GenericArg, Type, generic } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function isOneTimeWitness(txb: TransactionBlock, typeArg: Type, t: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::types::is_one_time_witness`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t)],
  })
}
