import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function hashToInput(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vdf::hash_to_input`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function hashToInputInternal(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vdf::hash_to_input_internal`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export interface VdfVerifyArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function vdfVerify(tx: Transaction, args: VdfVerifyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vdf::vdf_verify`,
    arguments: [
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      pure(tx, args.u64, `u64`),
    ],
  })
}

export interface VdfVerifyInternalArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function vdfVerifyInternal(tx: Transaction, args: VdfVerifyInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::vdf::vdf_verify_internal`,
    arguments: [
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      pure(tx, args.u64, `u64`),
    ],
  })
}
