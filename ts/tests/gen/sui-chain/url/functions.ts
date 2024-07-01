import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { String } from '../../move-stdlib-chain/ascii/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function newUnsafe(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::url::new_unsafe`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export function newUnsafeFromBytes(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::url::new_unsafe_from_bytes`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function innerUrl(tx: Transaction, url: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::url::inner_url`, arguments: [obj(tx, url)] })
}

export interface UpdateArgs {
  url: TransactionObjectInput
  string: string | TransactionArgument
}

export function update(tx: Transaction, args: UpdateArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::url::update`,
    arguments: [obj(tx, args.url), pure(tx, args.string, `${String.$typeName}`)],
  })
}
