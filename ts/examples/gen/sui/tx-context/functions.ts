import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'

/**
 * Return the address of the user that signed the current
 * transaction
 */
export function sender(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::sender`,
    arguments: [],
  })
}

export function nativeSender(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::native_sender`,
    arguments: [],
  })
}

/**
 * Return the transaction digest (hash of transaction inputs).
 * Please do not use as a source of randomness.
 */
export function digest(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::digest`,
    arguments: [],
  })
}

/** Return the current epoch */
export function epoch(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::epoch`,
    arguments: [],
  })
}

export function nativeEpoch(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::native_epoch`,
    arguments: [],
  })
}

/** Return the epoch start time as a unix timestamp in milliseconds. */
export function epochTimestampMs(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::epoch_timestamp_ms`,
    arguments: [],
  })
}

export function nativeEpochTimestampMs(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::native_epoch_timestamp_ms`,
    arguments: [],
  })
}

/** Return the adress of the transaction sponsor or `None` if there was no sponsor. */
export function sponsor(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::sponsor`,
    arguments: [],
  })
}

/**
 * Create an `address` that has not been used. As it is an object address, it will never
 * occur as the address for a user.
 * In other words, the generated address is a globally unique object ID.
 */
export function freshObjectAddress(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::fresh_object_address`,
    arguments: [],
  })
}

export function freshId(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::fresh_id`,
    arguments: [],
  })
}

/**
 * Return the reference gas price in effect for the epoch the transaction
 * is being executed in.
 */
export function referenceGasPrice(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::reference_gas_price`,
    arguments: [],
  })
}

export function nativeRgp(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::native_rgp`,
    arguments: [],
  })
}

/**
 * Return the gas price submitted for the current transaction.
 * That is the value the user submitted with the transaction data.
 */
export function gasPrice(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::gas_price`,
    arguments: [],
  })
}

export function nativeGasPrice(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::native_gas_price`,
    arguments: [],
  })
}

export function nativeIdsCreated(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::native_ids_created`,
    arguments: [],
  })
}

export function nativeGasBudget(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::native_gas_budget`,
    arguments: [],
  })
}

export function optionSponsor(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::option_sponsor`,
    arguments: [],
  })
}

export function nativeSponsor(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::native_sponsor`,
    arguments: [],
  })
}

export interface DeriveIdArgs {
  txHash: Array<number | TransactionArgument> | TransactionArgument
  idsCreated: bigint | TransactionArgument
}

/** Native function for deriving an ID via hash(tx_hash || ids_created) */
export function deriveId(tx: Transaction, args: DeriveIdArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::tx_context::derive_id`,
    arguments: [
      pure(tx, args.txHash, `vector<u8>`),
      pure(tx, args.idsCreated, `u64`),
    ],
  })
}
