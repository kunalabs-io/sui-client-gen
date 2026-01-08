import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface HmacSha3256Args {
  key: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

/**
 * @param key: HMAC key, arbitrary bytes.
 * @param msg: message to sign, arbitrary bytes.
 * Returns the 32 bytes digest of HMAC-SHA3-256(key, msg).
 */
export function hmacSha3256(tx: Transaction, args: HmacSha3256Args) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::hmac::hmac_sha3_256`,
    arguments: [pure(tx, args.key, `vector<u8>`), pure(tx, args.msg, `vector<u8>`)],
  })
}
