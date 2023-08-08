import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface Secp256r1EcrecoverArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
  hash: number | TransactionArgument
}

export function secp256r1Ecrecover(txb: TransactionBlock, args: Secp256r1EcrecoverArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_r1::secp256r1_ecrecover`,
    arguments: [
      pure(txb, args.signature, `vector<u8>`),
      pure(txb, args.msg, `vector<u8>`),
      pure(txb, args.hash, `u8`),
    ],
  })
}

export interface Secp256r1VerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
  hash: number | TransactionArgument
}

export function secp256r1Verify(txb: TransactionBlock, args: Secp256r1VerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_r1::secp256r1_verify`,
    arguments: [
      pure(txb, args.signature, `vector<u8>`),
      pure(txb, args.publicKey, `vector<u8>`),
      pure(txb, args.msg, `vector<u8>`),
      pure(txb, args.hash, `u8`),
    ],
  })
}
