import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface ActiveJwkEqualArgs {
  a: ObjectArg
  b: ObjectArg
}

export function activeJwkEqual(txb: TransactionBlock, args: ActiveJwkEqualArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::active_jwk_equal`,
    arguments: [obj(txb, args.a), obj(txb, args.b)],
  })
}

export function checkSorted(
  txb: TransactionBlock,
  newActiveJwks: Array<ObjectArg> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::check_sorted`,
    arguments: [vector(txb, `0x2::authenticator_state::ActiveJwk`, newActiveJwks)],
  })
}

export function create(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::authenticator_state::create`, arguments: [] })
}

export function deduplicate(txb: TransactionBlock, jwks: Array<ObjectArg> | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::deduplicate`,
    arguments: [vector(txb, `0x2::authenticator_state::ActiveJwk`, jwks)],
  })
}

export interface ExpireJwksArgs {
  self: ObjectArg
  minEpoch: bigint | TransactionArgument
}

export function expireJwks(txb: TransactionBlock, args: ExpireJwksArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::expire_jwks`,
    arguments: [obj(txb, args.self), pure(txb, args.minEpoch, `u64`)],
  })
}

export function getActiveJwks(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::get_active_jwks`,
    arguments: [obj(txb, self)],
  })
}

export interface JwkEqualArgs {
  a: ObjectArg
  b: ObjectArg
}

export function jwkEqual(txb: TransactionBlock, args: JwkEqualArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::jwk_equal`,
    arguments: [obj(txb, args.a), obj(txb, args.b)],
  })
}

export interface JwkIdEqualArgs {
  a: ObjectArg
  b: ObjectArg
}

export function jwkIdEqual(txb: TransactionBlock, args: JwkIdEqualArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::jwk_id_equal`,
    arguments: [obj(txb, args.a), obj(txb, args.b)],
  })
}

export interface JwkLtArgs {
  a: ObjectArg
  b: ObjectArg
}

export function jwkLt(txb: TransactionBlock, args: JwkLtArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::jwk_lt`,
    arguments: [obj(txb, args.a), obj(txb, args.b)],
  })
}

export function loadInner(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::load_inner`,
    arguments: [obj(txb, self)],
  })
}

export function loadInnerMut(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::load_inner_mut`,
    arguments: [obj(txb, self)],
  })
}

export interface StringBytesLtArgs {
  a: string | TransactionArgument
  b: string | TransactionArgument
}

export function stringBytesLt(txb: TransactionBlock, args: StringBytesLtArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::string_bytes_lt`,
    arguments: [pure(txb, args.a, `0x1::string::String`), pure(txb, args.b, `0x1::string::String`)],
  })
}

export interface UpdateAuthenticatorStateArgs {
  self: ObjectArg
  newActiveJwks: Array<ObjectArg> | TransactionArgument
}

export function updateAuthenticatorState(
  txb: TransactionBlock,
  args: UpdateAuthenticatorStateArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::authenticator_state::update_authenticator_state`,
    arguments: [
      obj(txb, args.self),
      vector(txb, `0x2::authenticator_state::ActiveJwk`, args.newActiveJwks),
    ],
  })
}
