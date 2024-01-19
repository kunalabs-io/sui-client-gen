import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function sender(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::tx_context::sender`, arguments: [] })
}

export function digest(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::tx_context::digest`, arguments: [] })
}

export function epoch(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::tx_context::epoch`, arguments: [] })
}

export function epochTimestampMs(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::tx_context::epoch_timestamp_ms`, arguments: [] })
}

export function freshObjectAddress(txb: TransactionBlock) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::tx_context::fresh_object_address`,
    arguments: [],
  })
}

export function idsCreated(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::tx_context::ids_created`, arguments: [] })
}

export interface DeriveIdArgs {
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function deriveId(txb: TransactionBlock, args: DeriveIdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::tx_context::derive_id`,
    arguments: [pure(txb, args.vecU8, `vector<u8>`), pure(txb, args.u64, `u64`)],
  })
}
