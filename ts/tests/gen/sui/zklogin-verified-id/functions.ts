import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { String } from '../../std/string/structs'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

/** Returns the address associated with the given VerifiedID */
export function owner(tx: Transaction, verifiedId: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_id::owner`,
    arguments: [obj(tx, verifiedId)],
  })
}

/** Returns the name of the key claim associated with the given VerifiedID */
export function keyClaimName(
  tx: Transaction,
  verifiedId: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_id::key_claim_name`,
    arguments: [obj(tx, verifiedId)],
  })
}

/** Returns the value of the key claim associated with the given VerifiedID */
export function keyClaimValue(
  tx: Transaction,
  verifiedId: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_id::key_claim_value`,
    arguments: [obj(tx, verifiedId)],
  })
}

/** Returns the issuer associated with the given VerifiedID */
export function issuer(tx: Transaction, verifiedId: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_id::issuer`,
    arguments: [obj(tx, verifiedId)],
  })
}

/** Returns the audience (wallet) associated with the given VerifiedID */
export function audience(tx: Transaction, verifiedId: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_id::audience`,
    arguments: [obj(tx, verifiedId)],
  })
}

/** Delete a VerifiedID */
export function delete_(tx: Transaction, verifiedId: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_id::delete`,
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

/** This function has been disabled. */
export function verifyZkloginId(tx: Transaction, args: VerifyZkloginIdArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_id::verify_zklogin_id`,
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

/** This function has been disabled. */
export function checkZkloginId(tx: Transaction, args: CheckZkloginIdArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_id::check_zklogin_id`,
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

/**
 * Returns true if `address` was created using zklogin and the given parameters.
 *
 * Aborts with `EInvalidInput` if any of `kc_name`, `kc_value`, `iss` and `aud` is not a properly encoded UTF-8
 * string or if the inputs are longer than the allowed upper bounds: `kc_name` must be at most 32 characters,
 * `kc_value` must be at most 115 characters and `aud` must be at most 145 characters.
 */
export function checkZkloginIdInternal(
  tx: Transaction,
  args: CheckZkloginIdInternalArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_id::check_zklogin_id_internal`,
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
