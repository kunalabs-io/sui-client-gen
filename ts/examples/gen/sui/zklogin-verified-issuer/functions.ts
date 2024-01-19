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

export interface CheckZkloginIssuerArgs {
  address: string | TransactionArgument
  addressSeed: bigint | TransactionArgument
  issuer: string | TransactionArgument
}

export function checkZkloginIssuer(txb: TransactionBlock, args: CheckZkloginIssuerArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::check_zklogin_issuer`,
    arguments: [
      pure(txb, args.address, `address`),
      pure(txb, args.addressSeed, `u256`),
      pure(txb, args.issuer, `0x1::string::String`),
    ],
  })
}

export interface CheckZkloginIssuerInternalArgs {
  address: string | TransactionArgument
  addressSeed: bigint | TransactionArgument
  issuer: Array<number | TransactionArgument> | TransactionArgument
}

export function checkZkloginIssuerInternal(
  txb: TransactionBlock,
  args: CheckZkloginIssuerInternalArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::check_zklogin_issuer_internal`,
    arguments: [
      pure(txb, args.address, `address`),
      pure(txb, args.addressSeed, `u256`),
      pure(txb, args.issuer, `vector<u8>`),
    ],
  })
}

export interface VerifyZkloginIssuerArgs {
  addressSeed: bigint | TransactionArgument
  issuer: string | TransactionArgument
}

export function verifyZkloginIssuer(txb: TransactionBlock, args: VerifyZkloginIssuerArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::verify_zklogin_issuer`,
    arguments: [pure(txb, args.addressSeed, `u256`), pure(txb, args.issuer, `0x1::string::String`)],
  })
}
