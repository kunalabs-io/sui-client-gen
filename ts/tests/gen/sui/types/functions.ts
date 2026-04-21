import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg } from '../../_framework/util'

/**
 * Tests if the argument type is a one-time witness, that is a type with only one instantiation
 * across the entire code base.
 */
export function isOneTimeWitness(
  tx: Transaction,
  typeArg: string,
  t: GenericArg,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::types::is_one_time_witness`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t)],
  })
}
