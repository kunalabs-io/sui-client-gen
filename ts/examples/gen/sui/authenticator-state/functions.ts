import { String } from '../../_dependencies/std/string/structs'
import { getPublishedAt } from '../../_envs'
import { obj, pure, vector } from '../../_framework/util'
import { ActiveJwk } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface ActiveJwkEqualArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function activeJwkEqual(tx: Transaction, args: ActiveJwkEqualArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::active_jwk_equal`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface JwkEqualArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function jwkEqual(tx: Transaction, args: JwkEqualArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::jwk_equal`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface JwkIdEqualArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function jwkIdEqual(tx: Transaction, args: JwkIdEqualArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::jwk_id_equal`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export interface StringBytesLtArgs {
  a: string | TransactionArgument
  b: string | TransactionArgument
}

export function stringBytesLt(tx: Transaction, args: StringBytesLtArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::string_bytes_lt`,
    arguments: [pure(tx, args.a, `${String.$typeName}`), pure(tx, args.b, `${String.$typeName}`)],
  })
}

export interface JwkLtArgs {
  a: TransactionObjectInput
  b: TransactionObjectInput
}

export function jwkLt(tx: Transaction, args: JwkLtArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::jwk_lt`,
    arguments: [obj(tx, args.a), obj(tx, args.b)],
  })
}

export function create(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::create`,
    arguments: [],
  })
}

export function loadInnerMut(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::load_inner_mut`,
    arguments: [obj(tx, self)],
  })
}

export function loadInner(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::load_inner`,
    arguments: [obj(tx, self)],
  })
}

export function checkSorted(
  tx: Transaction,
  newActiveJwks: Array<TransactionObjectInput> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::check_sorted`,
    arguments: [vector(tx, `${ActiveJwk.$typeName}`, newActiveJwks)],
  })
}

export interface UpdateAuthenticatorStateArgs {
  self: TransactionObjectInput
  newActiveJwks: Array<TransactionObjectInput> | TransactionArgument
}

export function updateAuthenticatorState(tx: Transaction, args: UpdateAuthenticatorStateArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::update_authenticator_state`,
    arguments: [obj(tx, args.self), vector(tx, `${ActiveJwk.$typeName}`, args.newActiveJwks)],
  })
}

export function deduplicate(
  tx: Transaction,
  jwks: Array<TransactionObjectInput> | TransactionArgument
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::deduplicate`,
    arguments: [vector(tx, `${ActiveJwk.$typeName}`, jwks)],
  })
}

export interface ExpireJwksArgs {
  self: TransactionObjectInput
  minEpoch: bigint | TransactionArgument
}

export function expireJwks(tx: Transaction, args: ExpireJwksArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::expire_jwks`,
    arguments: [obj(tx, args.self), pure(tx, args.minEpoch, `u64`)],
  })
}

export function getActiveJwks(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::authenticator_state::get_active_jwks`,
    arguments: [obj(tx, self)],
  })
}
