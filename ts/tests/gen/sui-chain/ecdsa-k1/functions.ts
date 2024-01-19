import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface Secp256k1EcrecoverArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  u8: number | TransactionArgument
}

export function secp256k1Ecrecover(txb: TransactionBlock, args: Secp256k1EcrecoverArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_k1::secp256k1_ecrecover`,
    arguments: [
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
      pure(txb, args.u8, `u8`),
    ],
  })
}

export function decompressPubkey(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_k1::decompress_pubkey`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export interface Secp256k1VerifyArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  u8: number | TransactionArgument
}

export function secp256k1Verify(txb: TransactionBlock, args: Secp256k1VerifyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::ecdsa_k1::secp256k1_verify`,
    arguments: [
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
      pure(txb, args.vecU83, `vector<u8>`),
      pure(txb, args.u8, `u8`),
    ],
  })
}
