import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { String as String1 } from '../../std/ascii/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

/** Create a `Url`, with no validation */
export function newUnsafe(tx: Transaction, url: string | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::url::new_unsafe`,
    arguments: [pure(tx, url, `${String1.$typeName}`)],
  })
}

/**
 * Create a `Url` with no validation from bytes
 * Note: this will abort if `bytes` is not valid ASCII
 */
export function newUnsafeFromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::url::new_unsafe_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/** Get inner URL */
export function innerUrl(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::url::inner_url`,
    arguments: [obj(tx, self)],
  })
}

export interface UpdateArgs {
  self: TransactionObjectInput
  url: string | TransactionArgument
}

/** Update the inner URL */
export function update(tx: Transaction, args: UpdateArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::url::update`,
    arguments: [obj(tx, args.self), pure(tx, args.url, `${String1.$typeName}`)],
  })
}
