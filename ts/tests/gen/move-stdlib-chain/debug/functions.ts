import { PUBLISHED_AT } from '..'
import { GenericArg, generic } from '../../_framework/util'
import { Transaction } from '@mysten/sui/transactions'

export function print(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::debug::print`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function printStackTrace(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::debug::print_stack_trace`, arguments: [] })
}
