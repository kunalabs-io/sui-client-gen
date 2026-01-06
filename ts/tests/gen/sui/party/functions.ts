import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function singleOwner(tx: Transaction, owner: string | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::party::single_owner`,
    arguments: [pure(tx, owner, `address`)],
  })
}

export function empty(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::party::empty`,
    arguments: [],
  })
}

export interface SetPermissionsArgs {
  p: TransactionObjectInput
  address: string | TransactionArgument
  permissions: TransactionObjectInput
}

export function setPermissions(tx: Transaction, args: SetPermissionsArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::party::set_permissions`,
    arguments: [obj(tx, args.p), pure(tx, args.address, `address`), obj(tx, args.permissions)],
  })
}

export function isSingleOwner(tx: Transaction, p: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::party::is_single_owner`,
    arguments: [obj(tx, p)],
  })
}

export function intoNative(tx: Transaction, p: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::party::into_native`,
    arguments: [obj(tx, p)],
  })
}
