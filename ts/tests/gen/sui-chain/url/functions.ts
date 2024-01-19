import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function newUnsafe(txb: TransactionBlock, string: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::url::new_unsafe`,
    arguments: [pure(txb, string, `0x1::ascii::String`)],
  })
}

export function newUnsafeFromBytes(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::url::new_unsafe_from_bytes`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export function innerUrl(txb: TransactionBlock, url: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::url::inner_url`, arguments: [obj(txb, url)] })
}

export interface UpdateArgs {
  url: ObjectArg
  string: string | TransactionArgument
}

export function update(txb: TransactionBlock, args: UpdateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::url::update`,
    arguments: [obj(txb, args.url), pure(txb, args.string, `0x1::ascii::String`)],
  })
}
