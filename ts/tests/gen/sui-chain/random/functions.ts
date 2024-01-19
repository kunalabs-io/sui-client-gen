import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function create(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::random::create`, arguments: [] })
}

export function loadInnerMut(txb: TransactionBlock, random: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner_mut`,
    arguments: [obj(txb, random)],
  })
}

export function loadInner(txb: TransactionBlock, random: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::load_inner`,
    arguments: [obj(txb, random)],
  })
}

export interface UpdateRandomnessStateArgs {
  random: ObjectArg
  u64: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function updateRandomnessState(txb: TransactionBlock, args: UpdateRandomnessStateArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::random::update_randomness_state`,
    arguments: [
      obj(txb, args.random),
      pure(txb, args.u64, `u64`),
      pure(txb, args.vecU8, `vector<u8>`),
    ],
  })
}
