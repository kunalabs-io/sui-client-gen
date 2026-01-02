import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export interface HmacSha3256Args {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function hmacSha3256(tx: Transaction, args: HmacSha3256Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::hmac::hmac_sha3_256`,
    arguments: [pure(tx, args.vecU81, `vector<u8>`), pure(tx, args.vecU82, `vector<u8>`)],
  })
}
