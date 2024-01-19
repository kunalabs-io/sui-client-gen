import { PUBLISHED_AT } from '..'
import { GenericArg, generic } from '../../_framework/util'
import { TransactionBlock } from '@mysten/sui.js/transactions'

export function toBytes(txb: TransactionBlock, typeArg: string, v: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bcs::to_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, v)],
  })
}
