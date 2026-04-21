import { Transaction, TransactionArgument, TransactionResult } from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg } from '../../_framework/util'

/** Return the binary representation of `v` in BCS (Binary Canonical Serialization) format */
export function toBytes(
  tx: Transaction,
  typeArg: string,
  v: GenericArg,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std', options?.env)}::bcs::to_bytes`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, v)],
  })
}
