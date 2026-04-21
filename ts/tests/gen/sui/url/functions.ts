import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { String as String1 } from '../../std/ascii/structs'

/** Create a `Url`, with no validation */
export function newUnsafe(
  tx: Transaction,
  url: string | TransactionArgument,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::url::new_unsafe`,
    arguments: [pure(tx, url, `${String1.$typeName}`)],
  })
}

/**
 * Create a `Url` with no validation from bytes
 * Note: this will abort if `bytes` is not valid ASCII
 */
export function newUnsafeFromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::url::new_unsafe_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/** Get inner URL */
export function innerUrl(
  tx: Transaction,
  self: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::url::inner_url`,
    arguments: [obj(tx, self)],
  })
}

export interface UpdateArgs {
  self: TransactionObjectInput
  url: string | TransactionArgument
}

/** Update the inner URL */
export function update(
  tx: Transaction,
  args: UpdateArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::url::update`,
    arguments: [
      obj(tx, args.self),
      pure(tx, args.url, `${String1.$typeName}`),
    ],
  })
}
