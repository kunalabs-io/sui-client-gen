import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function singleOwner(tx: Transaction, address: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::party::single_owner`,
    arguments: [pure(tx, address, `address`)],
  })
}

export function empty(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::party::empty`, arguments: [] })
}

export interface SetPermissionsArgs {
  party: TransactionObjectInput
  address: string | TransactionArgument
  permissions: TransactionObjectInput
}

export function setPermissions(tx: Transaction, args: SetPermissionsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::party::set_permissions`,
    arguments: [obj(tx, args.party), pure(tx, args.address, `address`), obj(tx, args.permissions)],
  })
}

export function isSingleOwner(tx: Transaction, party: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::party::is_single_owner`,
    arguments: [obj(tx, party)],
  })
}

export function intoNative(tx: Transaction, party: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::party::into_native`, arguments: [obj(tx, party)] })
}
