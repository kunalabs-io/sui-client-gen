import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function timestampMs(tx: Transaction, clock: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::clock::timestamp_ms`,
    arguments: [obj(tx, clock)],
  })
}

export function create(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::clock::create`,
    arguments: [],
  })
}

export interface ConsensusCommitPrologueArgs {
  clock: TransactionObjectInput
  timestampMs: bigint | TransactionArgument
}

export function consensusCommitPrologue(tx: Transaction, args: ConsensusCommitPrologueArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::clock::consensus_commit_prologue`,
    arguments: [obj(tx, args.clock), pure(tx, args.timestampMs, `u64`)],
  })
}
