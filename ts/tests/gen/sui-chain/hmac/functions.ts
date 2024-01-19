import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface HmacSha3256Args {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function hmacSha3256(txb: TransactionBlock, args: HmacSha3256Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hmac::hmac_sha3_256`,
    arguments: [pure(txb, args.vecU81, `vector<u8>`), pure(txb, args.vecU82, `vector<u8>`)],
  })
}
