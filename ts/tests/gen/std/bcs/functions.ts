import { getPublishedAt } from '../../_envs'
import { GenericArg, generic } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'

/** Return the binary representation of `v` in BCS (Binary Canonical Serialization) format */
export function toBytes(tx: Transaction, typeArg: string, v: GenericArg): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::bcs::to_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, v)],
  })
}
