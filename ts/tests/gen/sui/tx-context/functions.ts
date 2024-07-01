import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export interface DeriveIdArgs {
  txHash: Array<number | TransactionArgument> | TransactionArgument
  idsCreated: bigint | TransactionArgument
}

export function deriveId(tx: Transaction, args: DeriveIdArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::tx_context::derive_id`,
    arguments: [pure(tx, args.txHash, `vector<u8>`), pure(tx, args.idsCreated, `u64`)],
  })
}

export function idsCreated(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::tx_context::ids_created`, arguments: [] })
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

export function sender(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::tx_context::sender`, arguments: [] })
}
