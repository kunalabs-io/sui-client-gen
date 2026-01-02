import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function poseidonBn254(
  tx: Transaction,
  data: Array<bigint | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::poseidon::poseidon_bn254`,
    arguments: [pure(tx, data, `vector<u256>`)],
  })
}

export function poseidonBn254Internal(
  tx: Transaction,
  data: Array<Array<number | TransactionArgument> | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::poseidon::poseidon_bn254_internal`,
    arguments: [pure(tx, data, `vector<vector<u8>>`)],
  })
}
