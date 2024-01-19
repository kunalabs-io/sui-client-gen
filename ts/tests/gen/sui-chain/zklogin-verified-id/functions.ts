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

export function audience(txb: TransactionBlock, verifiedId: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::audience`,
    arguments: [obj(txb, verifiedId)],
  })
}

export interface VerifyZkloginIdArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
  string3: string | TransactionArgument
  string4: string | TransactionArgument
  u256: bigint | TransactionArgument
}

export function verifyZkloginId(txb: TransactionBlock, args: VerifyZkloginIdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::verify_zklogin_id`,
    arguments: [
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::string::String`),
      pure(txb, args.string3, `0x1::string::String`),
      pure(txb, args.string4, `0x1::string::String`),
      pure(txb, args.u256, `u256`),
    ],
  })
}

export interface CheckZkloginIdArgs {
  address: string | TransactionArgument
  string1: string | TransactionArgument
  string2: string | TransactionArgument
  string3: string | TransactionArgument
  string4: string | TransactionArgument
  u256: bigint | TransactionArgument
}

export function checkZkloginId(txb: TransactionBlock, args: CheckZkloginIdArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::check_zklogin_id`,
    arguments: [
      pure(txb, args.address, `address`),
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::string::String`),
      pure(txb, args.string3, `0x1::string::String`),
      pure(txb, args.string4, `0x1::string::String`),
      pure(txb, args.u256, `u256`),
    ],
  })
}

export interface CheckZkloginIdInternalArgs {
  address: string | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  vecU84: Array<number | TransactionArgument> | TransactionArgument
  u256: bigint | TransactionArgument
}

export function checkZkloginIdInternal(txb: TransactionBlock, args: CheckZkloginIdInternalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::check_zklogin_id_internal`,
    arguments: [
      pure(txb, args.address, `address`),
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
      pure(txb, args.vecU83, `vector<u8>`),
      pure(txb, args.vecU84, `vector<u8>`),
      pure(txb, args.u256, `u256`),
    ],
  })
}
