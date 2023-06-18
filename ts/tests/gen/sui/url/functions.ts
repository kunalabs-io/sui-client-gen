import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface UpdateArgs {
  self: ObjectArg
  url: string | TransactionArgument
}

export function update(txb: TransactionBlock, args: UpdateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::url::update`,
    arguments: [obj(txb, args.self), pure(txb, args.url, `0x1::ascii::String`)],
  })
}

export function innerUrl(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::url::inner_url`, arguments: [obj(txb, self)] })
}

export function newUnsafe(txb: TransactionBlock, url: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::url::new_unsafe`,
    arguments: [pure(txb, url, `0x1::ascii::String`)],
  })
}

export function newUnsafeFromBytes(
  txb: TransactionBlock,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::url::new_unsafe_from_bytes`,
    arguments: [pure(txb, bytes, `vector<u8>`)],
  })
}
