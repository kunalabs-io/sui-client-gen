import { PUBLISHED_AT } from '..'
import { GenericArg, generic } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function isOneTimeWitness(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::types::is_one_time_witness`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}
