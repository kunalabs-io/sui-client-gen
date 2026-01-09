import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'

export interface SettlementPrologueArgs {
  accumulatorRoot: TransactionObjectInput
  epoch: bigint | TransactionArgument
  checkpointHeight: bigint | TransactionArgument
  idx: bigint | TransactionArgument
  inputSui: bigint | TransactionArgument
  outputSui: bigint | TransactionArgument
}

/**
 * Called by settlement transactions to ensure that the settlement transaction has a unique
 * digest.
 */
export function settlementPrologue(
  tx: Transaction,
  args: SettlementPrologueArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_settlement::settlement_prologue`,
    arguments: [
      obj(tx, args.accumulatorRoot),
      pure(tx, args.epoch, `u64`),
      pure(tx, args.checkpointHeight, `u64`),
      pure(tx, args.idx, `u64`),
      pure(tx, args.inputSui, `u64`),
      pure(tx, args.outputSui, `u64`),
    ],
  })
}

export interface SettleU128Args {
  accumulatorRoot: TransactionObjectInput
  owner: string | TransactionArgument
  merge: bigint | TransactionArgument
  split: bigint | TransactionArgument
}

export function settleU128(
  tx: Transaction,
  typeArg: string,
  args: SettleU128Args,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_settlement::settle_u128`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.accumulatorRoot),
      pure(tx, args.owner, `address`),
      pure(tx, args.merge, `u128`),
      pure(tx, args.split, `u128`),
    ],
  })
}

export interface RecordSettlementSuiConservationArgs {
  inputSui: bigint | TransactionArgument
  outputSui: bigint | TransactionArgument
}

/** Called by the settlement transaction to track conservation of SUI. */
export function recordSettlementSuiConservation(
  tx: Transaction,
  args: RecordSettlementSuiConservationArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_settlement::record_settlement_sui_conservation`,
    arguments: [
      pure(tx, args.inputSui, `u64`),
      pure(tx, args.outputSui, `u64`),
    ],
  })
}

export interface AddToMmrArgs {
  newVal: bigint | TransactionArgument
  mmr: Array<bigint | TransactionArgument> | TransactionArgument
}

export function addToMmr(tx: Transaction, args: AddToMmrArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_settlement::add_to_mmr`,
    arguments: [
      pure(tx, args.newVal, `u256`),
      pure(tx, args.mmr, `vector<u256>`),
    ],
  })
}

export function u256FromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_settlement::u256_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export interface HashTwoToOneU256Args {
  left: bigint | TransactionArgument
  right: bigint | TransactionArgument
}

export function hashTwoToOneU256(tx: Transaction, args: HashTwoToOneU256Args): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_settlement::hash_two_to_one_u256`,
    arguments: [
      pure(tx, args.left, `u256`),
      pure(tx, args.right, `u256`),
    ],
  })
}

export interface NewStreamHeadArgs {
  newRoot: bigint | TransactionArgument
  eventCountDelta: bigint | TransactionArgument
  checkpointSeq: bigint | TransactionArgument
}

export function newStreamHead(tx: Transaction, args: NewStreamHeadArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_settlement::new_stream_head`,
    arguments: [
      pure(tx, args.newRoot, `u256`),
      pure(tx, args.eventCountDelta, `u64`),
      pure(tx, args.checkpointSeq, `u64`),
    ],
  })
}

export interface SettleEventsArgs {
  accumulatorRoot: TransactionObjectInput
  streamId: string | TransactionArgument
  newRoot: bigint | TransactionArgument
  eventCountDelta: bigint | TransactionArgument
  checkpointSeq: bigint | TransactionArgument
}

export function settleEvents(tx: Transaction, args: SettleEventsArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::accumulator_settlement::settle_events`,
    arguments: [
      obj(tx, args.accumulatorRoot),
      pure(tx, args.streamId, `address`),
      pure(tx, args.newRoot, `u256`),
      pure(tx, args.eventCountDelta, `u64`),
      pure(tx, args.checkpointSeq, `u64`),
    ],
  })
}
