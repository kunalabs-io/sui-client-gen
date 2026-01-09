import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

export function sha2256(
  tx: Transaction,
  data: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::hash::sha2_256`,
    arguments: [pure(tx, data, `vector<u8>`)],
  })
}

export function sha3256(
  tx: Transaction,
  data: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::hash::sha3_256`,
    arguments: [pure(tx, data, `vector<u8>`)],
  })
}
