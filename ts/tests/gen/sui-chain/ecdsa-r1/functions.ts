import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface Secp256r1EcrecoverArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  u8: number | TransactionArgument
}

export function secp256r1Ecrecover(txb: TransactionBlock, args: Secp256r1EcrecoverArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_r1::secp256r1_ecrecover`,
    arguments: [
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
      pure(txb, args.u8, `u8`),
    ],
  })
}

export interface Secp256r1VerifyArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  u8: number | TransactionArgument
}

export function secp256r1Verify(txb: TransactionBlock, args: Secp256r1VerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_r1::secp256r1_verify`,
    arguments: [
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
      pure(txb, args.vecU83, `vector<u8>`),
      pure(txb, args.u8, `u8`),
    ],
  })
}
