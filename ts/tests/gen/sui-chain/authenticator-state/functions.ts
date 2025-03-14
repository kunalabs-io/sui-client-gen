import { PUBLISHED_AT } from '..'
import { obj, pure, vector } from '../../_framework/util'
import { String } from '../../move-stdlib-chain/string/structs'
import { ActiveJwk } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface ActiveJwkEqualArgs {
  activeJwk1: TransactionObjectInput
  activeJwk2: TransactionObjectInput
}

export function activeJwkEqual(tx: Transaction, args: ActiveJwkEqualArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::active_jwk_equal`,
    arguments: [obj(tx, args.activeJwk1), obj(tx, args.activeJwk2)],
  })
}

export function checkSorted(
  tx: Transaction,
  vecActiveJwk: Array<TransactionObjectInput> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::check_sorted`,
    arguments: [vector(tx, `${ActiveJwk.$typeName}`, vecActiveJwk)],
  })
}

export function create(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::authenticator_state::create`, arguments: [] })
}

export function deduplicate(
  tx: Transaction,
  vecActiveJwk: Array<TransactionObjectInput> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::deduplicate`,
    arguments: [vector(tx, `${ActiveJwk.$typeName}`, vecActiveJwk)],
  })
}

export interface ExpireJwksArgs {
  authenticatorState: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function expireJwks(tx: Transaction, args: ExpireJwksArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::expire_jwks`,
    arguments: [obj(tx, args.authenticatorState), pure(tx, args.u64, `u64`)],
  })
}

export function getActiveJwks(tx: Transaction, authenticatorState: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::get_active_jwks`,
    arguments: [obj(tx, authenticatorState)],
  })
}

export interface JwkEqualArgs {
  jwk1: TransactionObjectInput
  jwk2: TransactionObjectInput
}

export function jwkEqual(tx: Transaction, args: JwkEqualArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::jwk_equal`,
    arguments: [obj(tx, args.jwk1), obj(tx, args.jwk2)],
  })
}

export interface JwkIdEqualArgs {
  jwkId1: TransactionObjectInput
  jwkId2: TransactionObjectInput
}

export function jwkIdEqual(tx: Transaction, args: JwkIdEqualArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::jwk_id_equal`,
    arguments: [obj(tx, args.jwkId1), obj(tx, args.jwkId2)],
  })
}

export interface JwkLtArgs {
  activeJwk1: TransactionObjectInput
  activeJwk2: TransactionObjectInput
}

export function jwkLt(tx: Transaction, args: JwkLtArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::jwk_lt`,
    arguments: [obj(tx, args.activeJwk1), obj(tx, args.activeJwk2)],
  })
}

export function loadInner(tx: Transaction, authenticatorState: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::load_inner`,
    arguments: [obj(tx, authenticatorState)],
  })
}

export function loadInnerMut(tx: Transaction, authenticatorState: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::load_inner_mut`,
    arguments: [obj(tx, authenticatorState)],
  })
}

export interface StringBytesLtArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function stringBytesLt(tx: Transaction, args: StringBytesLtArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::string_bytes_lt`,
    arguments: [
      pure(tx, args.string1, `${String.$typeName}`),
      pure(tx, args.string2, `${String.$typeName}`),
    ],
  })
}

export interface UpdateAuthenticatorStateArgs {
  authenticatorState: TransactionObjectInput
  vecActiveJwk: Array<TransactionObjectInput> | TransactionArgument
}

export function updateAuthenticatorState(tx: Transaction, args: UpdateAuthenticatorStateArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::update_authenticator_state`,
    arguments: [
      obj(tx, args.authenticatorState),
      vector(tx, `${ActiveJwk.$typeName}`, args.vecActiveJwk),
    ],
  })
}
