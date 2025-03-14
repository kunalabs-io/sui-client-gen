import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { String } from '../../move-stdlib-chain/string/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface CheckZkloginIssuerArgs {
  address: string | TransactionArgument
  u256: bigint | TransactionArgument
  string: string | TransactionArgument
}

export function checkZkloginIssuer(tx: Transaction, args: CheckZkloginIssuerArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::check_zklogin_issuer`,
    arguments: [
      pure(tx, args.address, `address`),
      pure(tx, args.u256, `u256`),
      pure(tx, args.string, `${String.$typeName}`),
    ],
  })
}

export interface CheckZkloginIssuerInternalArgs {
  address: string | TransactionArgument
  u256: bigint | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function checkZkloginIssuerInternal(tx: Transaction, args: CheckZkloginIssuerInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::check_zklogin_issuer_internal`,
    arguments: [
      pure(tx, args.address, `address`),
      pure(tx, args.u256, `u256`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export function delete_(tx: Transaction, verifiedIssuer: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::delete`,
    arguments: [obj(tx, verifiedIssuer)],
  })
}

export function issuer(tx: Transaction, verifiedIssuer: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::issuer`,
    arguments: [obj(tx, verifiedIssuer)],
  })
}

export function owner(tx: Transaction, verifiedIssuer: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::owner`,
    arguments: [obj(tx, verifiedIssuer)],
  })
}

export interface VerifyZkloginIssuerArgs {
  u256: bigint | TransactionArgument
  string: string | TransactionArgument
}

export function verifyZkloginIssuer(tx: Transaction, args: VerifyZkloginIssuerArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::zklogin_verified_issuer::verify_zklogin_issuer`,
    arguments: [pure(tx, args.u256, `u256`), pure(tx, args.string, `${String.$typeName}`)],
  })
}
