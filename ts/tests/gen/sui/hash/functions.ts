import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

/**
 * @param data: Arbitrary binary data to hash
 * Hash the input bytes using Blake2b-256 and returns 32 bytes.
 */
export function blake2b256(
  tx: Transaction,
  data: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::hash::blake2b256`,
    arguments: [pure(tx, data, `vector<u8>`)],
  })
}

/**
 * @param data: Arbitrary binary data to hash
 * Hash the input bytes using keccak256 and returns 32 bytes.
 */
export function keccak256(
  tx: Transaction,
  data: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::hash::keccak256`,
    arguments: [pure(tx, data, `vector<u8>`)],
  })
}
