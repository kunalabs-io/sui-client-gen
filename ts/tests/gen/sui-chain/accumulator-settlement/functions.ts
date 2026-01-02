import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface SettlementPrologueArgs {
  accumulatorRoot: TransactionObjectInput
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
  u643: bigint | TransactionArgument
  u644: bigint | TransactionArgument
  u645: bigint | TransactionArgument
}

export function settlementPrologue(tx: Transaction, args: SettlementPrologueArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_settlement::settlement_prologue`,
    arguments: [
      obj(tx, args.accumulatorRoot),
      pure(tx, args.u641, `u64`),
      pure(tx, args.u642, `u64`),
      pure(tx, args.u643, `u64`),
      pure(tx, args.u644, `u64`),
      pure(tx, args.u645, `u64`),
    ],
  })
}

export interface SettleU128Args {
  accumulatorRoot: TransactionObjectInput
  address: string | TransactionArgument
  u1281: bigint | TransactionArgument
  u1282: bigint | TransactionArgument
}

export function settleU128(tx: Transaction, typeArg: string, args: SettleU128Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_settlement::settle_u128`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.accumulatorRoot),
      pure(tx, args.address, `address`),
      pure(tx, args.u1281, `u128`),
      pure(tx, args.u1282, `u128`),
    ],
  })
}

export interface RecordSettlementSuiConservationArgs {
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function recordSettlementSuiConservation(
  tx: Transaction,
  args: RecordSettlementSuiConservationArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_settlement::record_settlement_sui_conservation`,
    arguments: [pure(tx, args.u641, `u64`), pure(tx, args.u642, `u64`)],
  })
}

export interface AddToMmrArgs {
  u256: bigint | TransactionArgument
  vecU256: Array<bigint | TransactionArgument> | TransactionArgument
}

export function addToMmr(tx: Transaction, args: AddToMmrArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_settlement::add_to_mmr`,
    arguments: [pure(tx, args.u256, `u256`), pure(tx, args.vecU256, `vector<u256>`)],
  })
}

export function u256FromBytes(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_settlement::u256_from_bytes`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export interface HashTwoToOneU256Args {
  u2561: bigint | TransactionArgument
  u2562: bigint | TransactionArgument
}

export function hashTwoToOneU256(tx: Transaction, args: HashTwoToOneU256Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_settlement::hash_two_to_one_u256`,
    arguments: [pure(tx, args.u2561, `u256`), pure(tx, args.u2562, `u256`)],
  })
}

export interface NewStreamHeadArgs {
  u256: bigint | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function newStreamHead(tx: Transaction, args: NewStreamHeadArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_settlement::new_stream_head`,
    arguments: [
      pure(tx, args.u256, `u256`),
      pure(tx, args.u641, `u64`),
      pure(tx, args.u642, `u64`),
    ],
  })
}

export interface SettleEventsArgs {
  accumulatorRoot: TransactionObjectInput
  address: string | TransactionArgument
  u256: bigint | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function settleEvents(tx: Transaction, args: SettleEventsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::accumulator_settlement::settle_events`,
    arguments: [
      obj(tx, args.accumulatorRoot),
      pure(tx, args.address, `address`),
      pure(tx, args.u256, `u256`),
      pure(tx, args.u641, `u64`),
      pure(tx, args.u642, `u64`),
    ],
  })
}
