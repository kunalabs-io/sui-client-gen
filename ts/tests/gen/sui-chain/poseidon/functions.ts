import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function poseidonBn254(
  tx: Transaction,
  vecU256: Array<bigint | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::poseidon::poseidon_bn254`,
    arguments: [pure(tx, vecU256, `vector<u256>`)],
  })
}

export function poseidonBn254Internal(
  tx: Transaction,
  vecVecU8: Array<Array<number | TransactionArgument> | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::poseidon::poseidon_bn254_internal`,
    arguments: [pure(tx, vecVecU8, `vector<vector<u8>>`)],
  })
}
