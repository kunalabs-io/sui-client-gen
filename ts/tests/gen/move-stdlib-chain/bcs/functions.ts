import { PUBLISHED_AT } from '..'
import { GenericArg, generic } from '../../_framework/util'
import { Transaction } from '@mysten/sui/transactions'

export function toBytes(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::bcs::to_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}
