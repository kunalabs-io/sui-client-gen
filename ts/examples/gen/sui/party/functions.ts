import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

/**
 * Creates a `Party` value with a single "owner" that has all permissions. No other party
 * has any permissions. And there are no default permissions.
 */
export function singleOwner(
  tx: Transaction,
  owner: string | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::party::single_owner`,
    arguments: [pure(tx, owner, `address`)],
  })
}

export function empty(tx: Transaction): TransactionResult {
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

export function setPermissions(tx: Transaction, args: SetPermissionsArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::party::set_permissions`,
    arguments: [obj(tx, args.p), pure(tx, args.address, `address`), obj(tx, args.permissions)],
  })
}

export function isSingleOwner(tx: Transaction, p: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::party::is_single_owner`,
    arguments: [obj(tx, p)],
  })
}

export function intoNative(tx: Transaction, p: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::party::into_native`,
    arguments: [obj(tx, p)],
  })
}
