import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'

export function sha2256(
  tx: Transaction,
  data: Array<number | TransactionArgument> | TransactionArgument,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std', options?.env)}::hash::sha2_256`,
    arguments: [pure(tx, data, `vector<u8>`)],
  })
}

export function sha3256(
  tx: Transaction,
  data: Array<number | TransactionArgument> | TransactionArgument,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std', options?.env)}::hash::sha3_256`,
    arguments: [pure(tx, data, `vector<u8>`)],
  })
}
