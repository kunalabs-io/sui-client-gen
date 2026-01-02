import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function timestampMs(tx: Transaction, clock: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::clock::timestamp_ms`,
    arguments: [obj(tx, clock)],
  })
}

export function create(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::clock::create`,
    arguments: [],
  })
}

export interface ConsensusCommitPrologueArgs {
  clock: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function consensusCommitPrologue(tx: Transaction, args: ConsensusCommitPrologueArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::clock::consensus_commit_prologue`,
    arguments: [obj(tx, args.clock), pure(tx, args.u64, `u64`)],
  })
}
