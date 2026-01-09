import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

/**
 * The `clock`'s current timestamp as a running total of
 * milliseconds since an arbitrary point in the past.
 */
export function timestampMs(tx: Transaction, clock: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::clock::timestamp_ms`,
    arguments: [obj(tx, clock)],
  })
}

/**
 * Create and share the singleton Clock -- this function is
 * called exactly once, during genesis.
 */
export function create(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::clock::create`,
    arguments: [],
  })
}

export interface ConsensusCommitPrologueArgs {
  clock: TransactionObjectInput
  timestampMs: bigint | TransactionArgument
}

export function consensusCommitPrologue(
  tx: Transaction,
  args: ConsensusCommitPrologueArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::clock::consensus_commit_prologue`,
    arguments: [obj(tx, args.clock), pure(tx, args.timestampMs, `u64`)],
  })
}
