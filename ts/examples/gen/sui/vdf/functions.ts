import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function hashToInput(
  tx: Transaction,
  message: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vdf::hash_to_input`,
    arguments: [pure(tx, message, `vector<u8>`)],
  })
}

export function hashToInputInternal(
  tx: Transaction,
  message: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vdf::hash_to_input_internal`,
    arguments: [pure(tx, message, `vector<u8>`)],
  })
}

export interface VdfVerifyArgs {
  input: Array<number | TransactionArgument> | TransactionArgument
  output: Array<number | TransactionArgument> | TransactionArgument
  proof: Array<number | TransactionArgument> | TransactionArgument
  iterations: bigint | TransactionArgument
}

export function vdfVerify(tx: Transaction, args: VdfVerifyArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vdf::vdf_verify`,
    arguments: [
      pure(tx, args.input, `vector<u8>`),
      pure(tx, args.output, `vector<u8>`),
      pure(tx, args.proof, `vector<u8>`),
      pure(tx, args.iterations, `u64`),
    ],
  })
}

export interface VdfVerifyInternalArgs {
  input: Array<number | TransactionArgument> | TransactionArgument
  output: Array<number | TransactionArgument> | TransactionArgument
  proof: Array<number | TransactionArgument> | TransactionArgument
  iterations: bigint | TransactionArgument
}

export function vdfVerifyInternal(tx: Transaction, args: VdfVerifyInternalArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::vdf::vdf_verify_internal`,
    arguments: [
      pure(tx, args.input, `vector<u8>`),
      pure(tx, args.output, `vector<u8>`),
      pure(tx, args.proof, `vector<u8>`),
      pure(tx, args.iterations, `u64`),
    ],
  })
}
