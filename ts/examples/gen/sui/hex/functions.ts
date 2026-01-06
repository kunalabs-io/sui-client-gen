import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function encode(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::hex::encode`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function decode(
  tx: Transaction,
  hex: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::hex::decode`,
    arguments: [pure(tx, hex, `vector<u8>`)],
  })
}

export function decodeByte(tx: Transaction, hex: number | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::hex::decode_byte`,
    arguments: [pure(tx, hex, `u8`)],
  })
}
