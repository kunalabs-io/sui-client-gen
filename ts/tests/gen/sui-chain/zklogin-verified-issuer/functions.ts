import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function delete_(txb: TransactionBlock, verifiedIssuer: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::delete`,
    arguments: [obj(txb, verifiedIssuer)],
  })
}

export function owner(txb: TransactionBlock, verifiedIssuer: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::owner`,
    arguments: [obj(txb, verifiedIssuer)],
  })
}

export function issuer(txb: TransactionBlock, verifiedIssuer: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::issuer`,
    arguments: [obj(txb, verifiedIssuer)],
  })
}

export interface VerifyZkloginIssuerArgs {
  u256: bigint | TransactionArgument
  string: string | TransactionArgument
}

export function verifyZkloginIssuer(txb: TransactionBlock, args: VerifyZkloginIssuerArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::verify_zklogin_issuer`,
    arguments: [pure(txb, args.u256, `u256`), pure(txb, args.string, `0x1::string::String`)],
  })
}

export interface CheckZkloginIssuerArgs {
  address: string | TransactionArgument
  u256: bigint | TransactionArgument
  string: string | TransactionArgument
}

export function checkZkloginIssuer(txb: TransactionBlock, args: CheckZkloginIssuerArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::check_zklogin_issuer`,
    arguments: [
      pure(txb, args.address, `address`),
      pure(txb, args.u256, `u256`),
      pure(txb, args.string, `0x1::string::String`),
    ],
  })
}

export interface CheckZkloginIssuerInternalArgs {
  address: string | TransactionArgument
  u256: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function checkZkloginIssuerInternal(
  txb: TransactionBlock,
  args: CheckZkloginIssuerInternalArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::check_zklogin_issuer_internal`,
    arguments: [
      pure(txb, args.address, `address`),
      pure(txb, args.u256, `u256`),
      pure(txb, args.vecU8, `vector<u8>`),
    ],
  })
}
