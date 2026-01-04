import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { String as String1 } from '../../std/ascii/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function newUnsafe(tx: Transaction, url: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::url::new_unsafe`,
    arguments: [pure(tx, url, `${String1.$typeName}`)],
  })
}

export function newUnsafeFromBytes(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::url::new_unsafe_from_bytes`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function innerUrl(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::url::inner_url`,
    arguments: [obj(tx, self)],
  })
}

export interface UpdateArgs {
  self: TransactionObjectInput
  url: string | TransactionArgument
}

export function update(tx: Transaction, args: UpdateArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::url::update`,
    arguments: [obj(tx, args.self), pure(tx, args.url, `${String1.$typeName}`)],
  })
}
