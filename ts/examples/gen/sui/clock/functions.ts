import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'

/**
 * The `clock`'s current timestamp as a running total of
 * milliseconds since an arbitrary point in the past.
 */
export function timestampMs(
  tx: Transaction,
  clock: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::clock::timestamp_ms`,
    arguments: [obj(tx, clock)],
  })
}

/**
 * Create and share the singleton Clock -- this function is
 * called exactly once, during genesis.
 */
export function create(tx: Transaction, options?: { env?: EnvConfig }): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::clock::create`,
    arguments: [],
  })
}

export interface ConsensusCommitPrologueArgs {
  clock: TransactionObjectInput
  timestampMs: bigint | TransactionArgument
}

export function consensusCommitPrologue(
  tx: Transaction,
  args: ConsensusCommitPrologueArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::clock::consensus_commit_prologue`,
    arguments: [
      obj(tx, args.clock),
      pure(tx, args.timestampMs, `u64`),
    ],
  })
}
