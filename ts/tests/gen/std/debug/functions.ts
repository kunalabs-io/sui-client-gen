import { getPublishedAt } from '../../_envs'
import { GenericArg, generic } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'

export function print(tx: Transaction, typeArg: string, x: GenericArg): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::debug::print`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, x)],
  })
}

export function printStackTrace(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::debug::print_stack_trace`,
    arguments: [],
  })
}
