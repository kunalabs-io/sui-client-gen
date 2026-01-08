import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

/**
 * @param data: Vector of BN254 field elements to hash.
 *
 * Hash the inputs using poseidon_bn254 and returns a BN254 field element.
 *
 * Each element has to be a BN254 field element in canonical representation so it must be smaller than the BN254
 * scalar field size which is 21888242871839275222246405745257275088548364400416034343698204186575808495617.
 *
 * This function supports between 1 and 16 inputs. If you need to hash more than 16 inputs, some implementations
 * instead returns the root of a k-ary Merkle tree with the inputs as leafs, but since this is not standardized,
 * we leave that to the caller to implement if needed.
 *
 * If the input is empty, the function will abort with EEmptyInput.
 * If more than 16 inputs are provided, the function will abort with ETooManyInputs.
 */
export function poseidonBn254(
  tx: Transaction,
  data: Array<bigint | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::poseidon::poseidon_bn254`,
    arguments: [pure(tx, data, `vector<u256>`)],
  })
}

/**
 * @param data: Vector of BN254 field elements in little-endian representation.
 *
 * Hash the inputs using poseidon_bn254 and returns a BN254 field element in little-endian representation.
 */
export function poseidonBn254Internal(
  tx: Transaction,
  data: Array<Array<number | TransactionArgument> | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::poseidon::poseidon_bn254_internal`,
    arguments: [pure(tx, data, `vector<vector<u8>>`)],
  })
}
