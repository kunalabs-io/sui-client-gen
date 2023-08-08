import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface Bls12381MinPkVerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

export function bls12381MinPkVerify(txb: TransactionBlock, args: Bls12381MinPkVerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::bls12381_min_pk_verify`,
    arguments: [
      pure(txb, args.signature, `vector<u8>`),
      pure(txb, args.publicKey, `vector<u8>`),
      pure(txb, args.msg, `vector<u8>`),
    ],
  })
}

export interface Bls12381MinSigVerifyArgs {
  signature: Array<number | TransactionArgument> | TransactionArgument
  publicKey: Array<number | TransactionArgument> | TransactionArgument
  msg: Array<number | TransactionArgument> | TransactionArgument
}

export function bls12381MinSigVerify(txb: TransactionBlock, args: Bls12381MinSigVerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::bls12381::bls12381_min_sig_verify`,
    arguments: [
      pure(txb, args.signature, `vector<u8>`),
      pure(txb, args.publicKey, `vector<u8>`),
      pure(txb, args.msg, `vector<u8>`),
    ],
  })
}
