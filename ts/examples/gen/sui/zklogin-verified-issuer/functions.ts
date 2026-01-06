import { String } from '../../_dependencies/std/string/structs'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function owner(tx: Transaction, verifiedIssuer: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_issuer::owner`,
    arguments: [obj(tx, verifiedIssuer)],
  })
}

export function issuer(tx: Transaction, verifiedIssuer: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_issuer::issuer`,
    arguments: [obj(tx, verifiedIssuer)],
  })
}

export function delete_(tx: Transaction, verifiedIssuer: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_issuer::delete`,
    arguments: [obj(tx, verifiedIssuer)],
  })
}

export interface VerifyZkloginIssuerArgs {
  addressSeed: bigint | TransactionArgument
  issuer: string | TransactionArgument
}

export function verifyZkloginIssuer(tx: Transaction, args: VerifyZkloginIssuerArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_issuer::verify_zklogin_issuer`,
    arguments: [pure(tx, args.addressSeed, `u256`), pure(tx, args.issuer, `${String.$typeName}`)],
  })
}

export interface CheckZkloginIssuerArgs {
  address: string | TransactionArgument
  addressSeed: bigint | TransactionArgument
  issuer: string | TransactionArgument
}

export function checkZkloginIssuer(tx: Transaction, args: CheckZkloginIssuerArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_issuer::check_zklogin_issuer`,
    arguments: [
      pure(tx, args.address, `address`),
      pure(tx, args.addressSeed, `u256`),
      pure(tx, args.issuer, `${String.$typeName}`),
    ],
  })
}

export interface CheckZkloginIssuerInternalArgs {
  address: string | TransactionArgument
  addressSeed: bigint | TransactionArgument
  issuer: Array<number | TransactionArgument> | TransactionArgument
}

export function checkZkloginIssuerInternal(tx: Transaction, args: CheckZkloginIssuerInternalArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::zklogin_verified_issuer::check_zklogin_issuer_internal`,
    arguments: [
      pure(tx, args.address, `address`),
      pure(tx, args.addressSeed, `u256`),
      pure(tx, args.issuer, `vector<u8>`),
    ],
  })
}
