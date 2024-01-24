import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function poseidonBn254(
  txb: TransactionBlock,
  vecU256: Array<bigint | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::poseidon::poseidon_bn254`,
    arguments: [pure(txb, vecU256, `vector<u256>`)],
  })
}

export function poseidonBn254Internal(
  txb: TransactionBlock,
  vecVecU8: Array<Array<number | TransactionArgument> | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::poseidon::poseidon_bn254_internal`,
    arguments: [pure(txb, vecVecU8, `vector<vector<u8>>`)],
  })
}
