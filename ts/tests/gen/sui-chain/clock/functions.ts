import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function timestampMs(txb: TransactionBlock, clock: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::clock::timestamp_ms`,
    arguments: [obj(txb, clock)],
  })
}

export function create(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::clock::create`, arguments: [] })
}

export interface ConsensusCommitPrologueArgs {
  clock: ObjectArg
  u64: bigint | TransactionArgument
}

export function consensusCommitPrologue(txb: TransactionBlock, args: ConsensusCommitPrologueArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::clock::consensus_commit_prologue`,
    arguments: [obj(txb, args.clock), pure(txb, args.u64, `u64`)],
  })
}
