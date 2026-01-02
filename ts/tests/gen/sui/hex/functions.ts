import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function encode(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::hex::encode`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function decode(
  tx: Transaction,
  hex: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::hex::decode`,
    arguments: [pure(tx, hex, `vector<u8>`)],
  })
}

export function decodeByte(tx: Transaction, hex: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::hex::decode_byte`,
    arguments: [pure(tx, hex, `u8`)],
  })
}
