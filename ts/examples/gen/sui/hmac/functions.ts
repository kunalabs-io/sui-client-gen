import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface HmacSha3256Args {
  key: Array<number | TransactionArgument>
  msg: Array<number | TransactionArgument>
}

export function hmacSha3256(txb: TransactionBlock, args: HmacSha3256Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::hmac::hmac_sha3_256`,
    arguments: [pure(txb, args.key, `vector<u8>`), pure(txb, args.msg, `vector<u8>`)],
  })
}
