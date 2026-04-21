import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg } from '../../_framework/util'

export function print(
  tx: Transaction,
  typeArg: string,
  x: GenericArg,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std', options?.env)}::debug::print`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, x)],
  })
}

export function printStackTrace(tx: Transaction, options?: { env?: EnvConfig }): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std', options?.env)}::debug::print_stack_trace`,
    arguments: [],
  })
}
