import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function create(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::authenticator_state::create`, arguments: [] })
}

export interface ActiveJwkEqualArgs {
  activeJwk1: ObjectArg
  activeJwk2: ObjectArg
}

export function activeJwkEqual(txb: TransactionBlock, args: ActiveJwkEqualArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::active_jwk_equal`,
    arguments: [obj(txb, args.activeJwk1), obj(txb, args.activeJwk2)],
  })
}

export interface JwkEqualArgs {
  jwk1: ObjectArg
  jwk2: ObjectArg
}

export function jwkEqual(txb: TransactionBlock, args: JwkEqualArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::jwk_equal`,
    arguments: [obj(txb, args.jwk1), obj(txb, args.jwk2)],
  })
}

export interface JwkIdEqualArgs {
  jwkId1: ObjectArg
  jwkId2: ObjectArg
}

export function jwkIdEqual(txb: TransactionBlock, args: JwkIdEqualArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::jwk_id_equal`,
    arguments: [obj(txb, args.jwkId1), obj(txb, args.jwkId2)],
  })
}

export interface StringBytesLtArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function stringBytesLt(txb: TransactionBlock, args: StringBytesLtArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::string_bytes_lt`,
    arguments: [
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::string::String`),
    ],
  })
}

export interface JwkLtArgs {
  activeJwk1: ObjectArg
  activeJwk2: ObjectArg
}

export function jwkLt(txb: TransactionBlock, args: JwkLtArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::jwk_lt`,
    arguments: [obj(txb, args.activeJwk1), obj(txb, args.activeJwk2)],
  })
}

export function loadInnerMut(txb: TransactionBlock, authenticatorState: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::load_inner_mut`,
    arguments: [obj(txb, authenticatorState)],
  })
}

export function loadInner(txb: TransactionBlock, authenticatorState: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::load_inner`,
    arguments: [obj(txb, authenticatorState)],
  })
}

export function checkSorted(
  txb: TransactionBlock,
  vecActiveJwk: Array<ObjectArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::check_sorted`,
    arguments: [vector(txb, `0x2::authenticator_state::ActiveJwk`, vecActiveJwk)],
  })
}

export interface UpdateAuthenticatorStateArgs {
  authenticatorState: ObjectArg
  vecActiveJwk: Array<ObjectArg> | TransactionArgument
}

export function updateAuthenticatorState(
  txb: TransactionBlock,
  args: UpdateAuthenticatorStateArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::update_authenticator_state`,
    arguments: [
      obj(txb, args.authenticatorState),
      vector(txb, `0x2::authenticator_state::ActiveJwk`, args.vecActiveJwk),
    ],
  })
}

export function deduplicate(
  txb: TransactionBlock,
  vecActiveJwk: Array<ObjectArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::deduplicate`,
    arguments: [vector(txb, `0x2::authenticator_state::ActiveJwk`, vecActiveJwk)],
  })
}

export interface ExpireJwksArgs {
  authenticatorState: ObjectArg
  u64: bigint | TransactionArgument
}

export function expireJwks(txb: TransactionBlock, args: ExpireJwksArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::expire_jwks`,
    arguments: [obj(txb, args.authenticatorState), pure(txb, args.u64, `u64`)],
  })
}

export function getActiveJwks(txb: TransactionBlock, authenticatorState: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::get_active_jwks`,
    arguments: [obj(txb, authenticatorState)],
  })
}
