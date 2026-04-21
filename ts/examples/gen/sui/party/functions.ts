import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'

/**
 * Creates a `Party` value with a single "owner" that has all permissions. No other party
 * has any permissions. And there are no default permissions.
 */
export function singleOwner(
  tx: Transaction,
  owner: string | TransactionArgument,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::party::single_owner`,
    arguments: [pure(tx, owner, `address`)],
  })
}

export function empty(tx: Transaction, options?: { env?: EnvConfig }): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::party::empty`,
    arguments: [],
  })
}

export interface SetPermissionsArgs {
  p: TransactionObjectInput
  address: string | TransactionArgument
  permissions: TransactionObjectInput
}

export function setPermissions(
  tx: Transaction,
  args: SetPermissionsArgs,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::party::set_permissions`,
    arguments: [
      obj(tx, args.p),
      pure(tx, args.address, `address`),
      obj(tx, args.permissions),
    ],
  })
}

export function isSingleOwner(
  tx: Transaction,
  p: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::party::is_single_owner`,
    arguments: [obj(tx, p)],
  })
}

export function intoNative(
  tx: Transaction,
  p: TransactionObjectInput,
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui', options?.env)}::party::into_native`,
    arguments: [obj(tx, p)],
  })
}
