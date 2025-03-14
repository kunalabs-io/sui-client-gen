import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { String } from '../../move-stdlib-chain/string/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function audience(tx: Transaction, verifiedId: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::audience`,
    arguments: [obj(tx, verifiedId)],
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

export function checkZkloginId(tx: Transaction, args: CheckZkloginIdArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::check_zklogin_id`,
    arguments: [
      pure(tx, args.address, `address`),
      pure(tx, args.string1, `${String.$typeName}`),
      pure(tx, args.string2, `${String.$typeName}`),
      pure(tx, args.string3, `${String.$typeName}`),
      pure(tx, args.string4, `${String.$typeName}`),
      pure(tx, args.u256, `u256`),
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

export function checkZkloginIdInternal(tx: Transaction, args: CheckZkloginIdInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::check_zklogin_id_internal`,
    arguments: [
      pure(tx, args.address, `address`),
      pure(tx, args.vecU81, `vector<u8>`),
      pure(tx, args.vecU82, `vector<u8>`),
      pure(tx, args.vecU83, `vector<u8>`),
      pure(tx, args.vecU84, `vector<u8>`),
      pure(tx, args.u256, `u256`),
    ],
  })
}

export function delete_(tx: Transaction, verifiedId: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::delete`,
    arguments: [obj(tx, verifiedId)],
  })
}

export function issuer(tx: Transaction, verifiedId: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::issuer`,
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

export function owner(tx: Transaction, verifiedId: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::owner`,
    arguments: [obj(tx, verifiedId)],
  })
}

export interface VerifyZkloginIdArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
  string3: string | TransactionArgument
  string4: string | TransactionArgument
  u256: bigint | TransactionArgument
}

export function verifyZkloginId(tx: Transaction, args: VerifyZkloginIdArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_id::verify_zklogin_id`,
    arguments: [
      pure(tx, args.string1, `${String.$typeName}`),
      pure(tx, args.string2, `${String.$typeName}`),
      pure(tx, args.string3, `${String.$typeName}`),
      pure(tx, args.string4, `${String.$typeName}`),
      pure(tx, args.u256, `u256`),
    ],
  })
}
