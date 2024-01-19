import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function create(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::random::create`, arguments: [] })
}

export function loadInner(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner`,
    arguments: [obj(txb, self)],
  })
}

export function loadInnerMut(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner_mut`,
    arguments: [obj(txb, self)],
  })
}

export interface UpdateRandomnessStateArgs {
  self: ObjectArg
  newRound: bigint | TransactionArgument
  newBytes: Array<number | TransactionArgument> | TransactionArgument
}

export function updateRandomnessState(txb: TransactionBlock, args: UpdateRandomnessStateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::update_randomness_state`,
    arguments: [
      obj(txb, args.self),
      pure(txb, args.newRound, `u64`),
      pure(txb, args.newBytes, `vector<u8>`),
    ],
  })
}
