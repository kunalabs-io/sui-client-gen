import { PUBLISHED_AT } from '..'
import { GenericArg, Type, generic } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js'

export function toBytes(txb: TransactionBlock, typeArg: Type, v: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::to_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, v)],
  })
}
