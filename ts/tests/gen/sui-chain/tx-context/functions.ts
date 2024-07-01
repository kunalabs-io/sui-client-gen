import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function sender(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::tx_context::sender`, arguments: [] })
}

export function digest(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::tx_context::digest`, arguments: [] })
}

export function epoch(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::tx_context::epoch`, arguments: [] })
}

export function epochTimestampMs(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::tx_context::epoch_timestamp_ms`, arguments: [] })
}

export function freshObjectAddress(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::tx_context::fresh_object_address`, arguments: [] })
}

export function idsCreated(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::tx_context::ids_created`, arguments: [] })
}

export interface DeriveIdArgs {
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function deriveId(tx: Transaction, args: DeriveIdArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::tx_context::derive_id`,
    arguments: [pure(tx, args.vecU8, `vector<u8>`), pure(tx, args.u64, `u64`)],
  })
}
