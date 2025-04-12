import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function encode(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::hex::encode`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function decode(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::hex::decode`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function decodeByte(tx: Transaction, u8: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::hex::decode_byte`,
    arguments: [pure(tx, u8, `u8`)],
  })
}
