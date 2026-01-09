import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

/** Encode `bytes` in lowercase hex */
export function encode(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::hex::encode`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/**
 * Decode hex into `bytes`
 * Takes a hex string (no 0x prefix) (e.g. b"0f3a")
 * Returns vector of `bytes` that represents the hex string (e.g. x"0f3a")
 * Hex string can be case insensitive (e.g. b"0F3A" and b"0f3a" both return x"0f3a")
 * Aborts if the hex string does not have an even number of characters (as each hex character is 2 characters long)
 * Aborts if the hex string contains non-valid hex characters (valid characters are 0 - 9, a - f, A - F)
 */
export function decode(
  tx: Transaction,
  hex: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::hex::decode`,
    arguments: [pure(tx, hex, `vector<u8>`)],
  })
}

export function decodeByte(tx: Transaction, hex: number | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::hex::decode_byte`,
    arguments: [pure(tx, hex, `u8`)],
  })
}
