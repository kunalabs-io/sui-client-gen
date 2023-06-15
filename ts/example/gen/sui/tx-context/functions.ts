import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface DeriveIdArgs {
  txHash: Array<number | TransactionArgument>
  idsCreated: bigint | TransactionArgument
}

export function deriveId(txb: TransactionBlock, args: DeriveIdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::tx_context::derive_id`,
    arguments: [pure(txb, args.txHash, `vector<u8>`), pure(txb, args.idsCreated, `u64`)],
  })
}

export function idsCreated(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::tx_context::ids_created`, arguments: [] })
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

export function sender(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::tx_context::sender`, arguments: [] })
}
