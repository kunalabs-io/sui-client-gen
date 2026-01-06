import { getPublishedAt } from '../../_envs'
import { GenericArg, generic } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function isOneTimeWitness(tx: Transaction, typeArg: string, t: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::types::is_one_time_witness`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t)],
  })
}
