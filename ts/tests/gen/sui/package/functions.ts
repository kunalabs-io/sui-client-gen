import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export function additivePolicy(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::package::additive_policy`, arguments: [] })
}

export interface AuthorizeUpgradeArgs {
  cap: ObjectArg
  policy: number | TransactionArgument
  digest: Array<number | TransactionArgument>
}

export function authorizeUpgrade(txb: TransactionBlock, args: AuthorizeUpgradeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::authorize_upgrade`,
    arguments: [
      obj(txb, args.cap),
      pure(txb, args.policy, `u8`),
      pure(txb, args.digest, `vector<u8>`),
    ],
  })
}

export function burnPublisher(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::burn_publisher`,
    arguments: [obj(txb, self)],
  })
}

export function claim(txb: TransactionBlock, typeArg: Type, otw: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::claim`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, otw)],
  })
}

export function claimAndKeep(txb: TransactionBlock, typeArg: Type, otw: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::claim_and_keep`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, otw)],
  })
}

export interface CommitUpgradeArgs {
  cap: ObjectArg
  receipt: ObjectArg
}

export function commitUpgrade(txb: TransactionBlock, args: CommitUpgradeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::commit_upgrade`,
    arguments: [obj(txb, args.cap), obj(txb, args.receipt)],
  })
}

export function compatiblePolicy(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::package::compatible_policy`, arguments: [] })
}

export function depOnlyPolicy(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::package::dep_only_policy`, arguments: [] })
}

export function fromModule(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::from_module`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function fromPackage(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::from_package`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function makeImmutable(txb: TransactionBlock, cap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::make_immutable`,
    arguments: [obj(txb, cap)],
  })
}

export function onlyAdditiveUpgrades(txb: TransactionBlock, cap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::only_additive_upgrades`,
    arguments: [obj(txb, cap)],
  })
}

export function onlyDepUpgrades(txb: TransactionBlock, cap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::only_dep_upgrades`,
    arguments: [obj(txb, cap)],
  })
}

export function publishedModule(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::published_module`,
    arguments: [obj(txb, self)],
  })
}

export function publishedPackage(txb: TransactionBlock, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::published_package`,
    arguments: [obj(txb, self)],
  })
}

export function receiptCap(txb: TransactionBlock, receipt: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::receipt_cap`,
    arguments: [obj(txb, receipt)],
  })
}

export function receiptPackage(txb: TransactionBlock, receipt: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::receipt_package`,
    arguments: [obj(txb, receipt)],
  })
}

export interface RestrictArgs {
  cap: ObjectArg
  policy: number | TransactionArgument
}

export function restrict(txb: TransactionBlock, args: RestrictArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::restrict`,
    arguments: [obj(txb, args.cap), pure(txb, args.policy, `u8`)],
  })
}

export function ticketDigest(txb: TransactionBlock, ticket: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_digest`,
    arguments: [obj(txb, ticket)],
  })
}

export function ticketPackage(txb: TransactionBlock, ticket: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_package`,
    arguments: [obj(txb, ticket)],
  })
}

export function ticketPolicy(txb: TransactionBlock, ticket: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_policy`,
    arguments: [obj(txb, ticket)],
  })
}

export function upgradePackage(txb: TransactionBlock, cap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::upgrade_package`,
    arguments: [obj(txb, cap)],
  })
}

export function upgradePolicy(txb: TransactionBlock, cap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::upgrade_policy`,
    arguments: [obj(txb, cap)],
  })
}

export function version(txb: TransactionBlock, cap: ObjectArg) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::package::version`, arguments: [obj(txb, cap)] })
}
