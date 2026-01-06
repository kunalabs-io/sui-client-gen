import { PUBLISHED_AT } from '..'
import { String } from '../../_dependencies/0x1/string/structs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function owner(tx: Transaction, verifiedId: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::owner`,
    arguments: [obj(tx, verifiedId)],
  })
}

export function keyClaimName(tx: Transaction, verifiedId: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::key_claim_name`,
    arguments: [obj(tx, verifiedId)],
  })
}

export function keyClaimValue(tx: Transaction, verifiedId: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::key_claim_value`,
    arguments: [obj(tx, verifiedId)],
  })
}

export function issuer(tx: Transaction, verifiedId: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::issuer`,
    arguments: [obj(tx, verifiedId)],
  })
}

export function audience(tx: Transaction, verifiedId: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::audience`,
    arguments: [obj(tx, verifiedId)],
  })
}

export function delete_(tx: Transaction, verifiedId: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::delete`,
    arguments: [obj(tx, verifiedId)],
  })
}

export interface VerifyZkloginIdArgs {
  keyClaimName: string | TransactionArgument
  keyClaimValue: string | TransactionArgument
  issuer: string | TransactionArgument
  audience: string | TransactionArgument
  pinHash: bigint | TransactionArgument
}

export function verifyZkloginId(tx: Transaction, args: VerifyZkloginIdArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::verify_zklogin_id`,
    arguments: [
      pure(tx, args.keyClaimName, `${String.$typeName}`),
      pure(tx, args.keyClaimValue, `${String.$typeName}`),
      pure(tx, args.issuer, `${String.$typeName}`),
      pure(tx, args.audience, `${String.$typeName}`),
      pure(tx, args.pinHash, `u256`),
    ],
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

export function checkZkloginId(tx: Transaction, args: CheckZkloginIdArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::check_zklogin_id`,
    arguments: [
      pure(tx, args.address, `address`),
      pure(tx, args.keyClaimName, `${String.$typeName}`),
      pure(tx, args.keyClaimValue, `${String.$typeName}`),
      pure(tx, args.issuer, `${String.$typeName}`),
      pure(tx, args.audience, `${String.$typeName}`),
      pure(tx, args.pinHash, `u256`),
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

export function checkZkloginIdInternal(tx: Transaction, args: CheckZkloginIdInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::check_zklogin_id_internal`,
    arguments: [
      pure(tx, args.address, `address`),
      pure(tx, args.keyClaimName, `vector<u8>`),
      pure(tx, args.keyClaimValue, `vector<u8>`),
      pure(tx, args.issuer, `vector<u8>`),
      pure(tx, args.audience, `vector<u8>`),
      pure(tx, args.pinHash, `u256`),
    ],
  })
}
