import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function delete_(txb: TransactionBlock, verifiedId: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::delete`,
    arguments: [obj(txb, verifiedId)],
  })
}

export function owner(txb: TransactionBlock, verifiedId: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::owner`,
    arguments: [obj(txb, verifiedId)],
  })
}

export function audience(txb: TransactionBlock, verifiedId: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::audience`,
    arguments: [obj(txb, verifiedId)],
  })
}

export interface CheckZkloginIdArgs {
  address: string | TransactionArgument
  keyClaimName: string | TransactionArgument
  keyClaimValue: string | TransactionArgument
  issuer: string | TransactionArgument
  audience: string | TransactionArgument
  pinHash: bigint | TransactionArgument
}

export function checkZkloginId(txb: TransactionBlock, args: CheckZkloginIdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::check_zklogin_id`,
    arguments: [
      pure(txb, args.address, `address`),
      pure(txb, args.keyClaimName, `0x1::string::String`),
      pure(txb, args.keyClaimValue, `0x1::string::String`),
      pure(txb, args.issuer, `0x1::string::String`),
      pure(txb, args.audience, `0x1::string::String`),
      pure(txb, args.pinHash, `u256`),
    ],
  })
}

export interface CheckZkloginIdInternalArgs {
  address: string | TransactionArgument
  keyClaimName: Array<number | TransactionArgument> | TransactionArgument
  keyClaimValue: Array<number | TransactionArgument> | TransactionArgument
  issuer: Array<number | TransactionArgument> | TransactionArgument
  audience: Array<number | TransactionArgument> | TransactionArgument
  pinHash: bigint | TransactionArgument
}

export function checkZkloginIdInternal(txb: TransactionBlock, args: CheckZkloginIdInternalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::check_zklogin_id_internal`,
    arguments: [
      pure(txb, args.address, `address`),
      pure(txb, args.keyClaimName, `vector<u8>`),
      pure(txb, args.keyClaimValue, `vector<u8>`),
      pure(txb, args.issuer, `vector<u8>`),
      pure(txb, args.audience, `vector<u8>`),
      pure(txb, args.pinHash, `u256`),
    ],
  })
}

export function keyClaimName(txb: TransactionBlock, verifiedId: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::key_claim_name`,
    arguments: [obj(txb, verifiedId)],
  })
}

export function keyClaimValue(txb: TransactionBlock, verifiedId: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::key_claim_value`,
    arguments: [obj(txb, verifiedId)],
  })
}

export function issuer(txb: TransactionBlock, verifiedId: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::issuer`,
    arguments: [obj(txb, verifiedId)],
  })
}

export interface VerifyZkloginIdArgs {
  keyClaimName: string | TransactionArgument
  keyClaimValue: string | TransactionArgument
  issuer: string | TransactionArgument
  audience: string | TransactionArgument
  pinHash: bigint | TransactionArgument
}

export function verifyZkloginId(txb: TransactionBlock, args: VerifyZkloginIdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::verify_zklogin_id`,
    arguments: [
      pure(txb, args.keyClaimName, `0x1::string::String`),
      pure(txb, args.keyClaimValue, `0x1::string::String`),
      pure(txb, args.issuer, `0x1::string::String`),
      pure(txb, args.audience, `0x1::string::String`),
      pure(txb, args.pinHash, `u256`),
    ],
  })
}
