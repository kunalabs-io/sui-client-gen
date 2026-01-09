import { String } from '../../_dependencies/std/string/structs'
import { getPublishedAt } from '../../_envs'
import { obj, pure, vector } from '../../_framework/util'
import { ActiveJwk } from './structs'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

export interface ActiveJwkEqualArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function activeJwkEqual(tx: Transaction, args: ActiveJwkEqualArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::active_jwk_equal`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface JwkEqualArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function jwkEqual(tx: Transaction, args: JwkEqualArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::jwk_equal`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface JwkIdEqualArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function jwkIdEqual(tx: Transaction, args: JwkIdEqualArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::jwk_id_equal`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface StringBytesLtArgs {
  a: string | TransactionArgument
  b: string | TransactionArgument
}

export function stringBytesLt(tx: Transaction, args: StringBytesLtArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::string_bytes_lt`,
    arguments: [pure(tx, args.a, `${String.$typeName}`), pure(tx, args.b, `${String.$typeName}`)],
  })
}

export interface JwkLtArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function jwkLt(tx: Transaction, args: JwkLtArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::jwk_lt`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

/**
 * Create and share the AuthenticatorState object. This function is call exactly once, when
 * the authenticator state object is first created.
 * Can only be called by genesis or change_epoch transactions.
 */
export function create(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::create`,
    arguments: [],
  })
}

export function loadInnerMut(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::load_inner_mut`,
    arguments: [obj(tx, self)],
  })
}

export function loadInner(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::load_inner`,
    arguments: [obj(tx, self)],
  })
}

export function checkSorted(
  tx: Transaction,
  newActiveJwks: Array<TransactionObjectInput> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::check_sorted`,
    arguments: [vector(tx, `${ActiveJwk.$typeName}`, newActiveJwks)],
  })
}

export interface UpdateAuthenticatorStateArgs {
  self: TransactionObjectInput
  newActiveJwks: Array<TransactionObjectInput> | TransactionArgument
}

/**
 * Record a new set of active_jwks. Called when executing the AuthenticatorStateUpdate system
 * transaction. The new input vector must be sorted and must not contain duplicates.
 * If a new JWK is already present, but with a previous epoch, then the epoch is updated to
 * indicate that the JWK has been validated in the current epoch and should not be expired.
 */
export function updateAuthenticatorState(
  tx: Transaction,
  args: UpdateAuthenticatorStateArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::update_authenticator_state`,
    arguments: [obj(tx, args.self), vector(tx, `${ActiveJwk.$typeName}`, args.newActiveJwks)],
  })
}

export function deduplicate(
  tx: Transaction,
  jwks: Array<TransactionObjectInput> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::deduplicate`,
    arguments: [vector(tx, `${ActiveJwk.$typeName}`, jwks)],
  })
}

export interface ExpireJwksArgs {
  self: TransactionObjectInput
  minEpoch: bigint | TransactionArgument
}

export function expireJwks(tx: Transaction, args: ExpireJwksArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::expire_jwks`,
    arguments: [obj(tx, args.self), pure(tx, args.minEpoch, `u64`)],
  })
}

/**
 * Get the current active_jwks. Called when the node starts up in order to load the current
 * JWK state from the chain.
 */
export function getActiveJwks(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::get_active_jwks`,
    arguments: [obj(tx, self)],
  })
}
