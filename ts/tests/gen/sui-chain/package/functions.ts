import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function version(txb: TransactionBlock, upgradeCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::version`,
    arguments: [obj(txb, upgradeCap)],
  })
}

export function claim(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::claim`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function claimAndKeep(txb: TransactionBlock, typeArg: Type, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::claim_and_keep`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function burnPublisher(txb: TransactionBlock, publisher: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::burn_publisher`,
    arguments: [obj(txb, publisher)],
  })
}

export function fromPackage(txb: TransactionBlock, typeArg: Type, publisher: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::from_package`,
    typeArguments: [typeArg],
    arguments: [obj(txb, publisher)],
  })
}

export function fromModule(txb: TransactionBlock, typeArg: Type, publisher: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::from_module`,
    typeArguments: [typeArg],
    arguments: [obj(txb, publisher)],
  })
}

export function publishedModule(txb: TransactionBlock, publisher: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::published_module`,
    arguments: [obj(txb, publisher)],
  })
}

export function publishedPackage(txb: TransactionBlock, publisher: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::published_package`,
    arguments: [obj(txb, publisher)],
  })
}

export function upgradePackage(txb: TransactionBlock, upgradeCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::upgrade_package`,
    arguments: [obj(txb, upgradeCap)],
  })
}

export function upgradePolicy(txb: TransactionBlock, upgradeCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::upgrade_policy`,
    arguments: [obj(txb, upgradeCap)],
  })
}

export function ticketPackage(txb: TransactionBlock, upgradeTicket: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_package`,
    arguments: [obj(txb, upgradeTicket)],
  })
}

export function ticketPolicy(txb: TransactionBlock, upgradeTicket: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_policy`,
    arguments: [obj(txb, upgradeTicket)],
  })
}

export function receiptCap(txb: TransactionBlock, upgradeReceipt: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::receipt_cap`,
    arguments: [obj(txb, upgradeReceipt)],
  })
}

export function receiptPackage(txb: TransactionBlock, upgradeReceipt: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::receipt_package`,
    arguments: [obj(txb, upgradeReceipt)],
  })
}

export function ticketDigest(txb: TransactionBlock, upgradeTicket: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_digest`,
    arguments: [obj(txb, upgradeTicket)],
  })
}

export function compatiblePolicy(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::package::compatible_policy`, arguments: [] })
}

export function additivePolicy(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::package::additive_policy`, arguments: [] })
}

export function depOnlyPolicy(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::package::dep_only_policy`, arguments: [] })
}

export function onlyAdditiveUpgrades(txb: TransactionBlock, upgradeCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::only_additive_upgrades`,
    arguments: [obj(txb, upgradeCap)],
  })
}

export function onlyDepUpgrades(txb: TransactionBlock, upgradeCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::only_dep_upgrades`,
    arguments: [obj(txb, upgradeCap)],
  })
}

export function makeImmutable(txb: TransactionBlock, upgradeCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::make_immutable`,
    arguments: [obj(txb, upgradeCap)],
  })
}

export interface AuthorizeUpgradeArgs {
  upgradeCap: ObjectArg
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function authorizeUpgrade(txb: TransactionBlock, args: AuthorizeUpgradeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::authorize_upgrade`,
    arguments: [
      obj(txb, args.upgradeCap),
      pure(txb, args.u8, `u8`),
      pure(txb, args.vecU8, `vector<u8>`),
    ],
  })
}

export interface CommitUpgradeArgs {
  upgradeCap: ObjectArg
  upgradeReceipt: ObjectArg
}

export function commitUpgrade(txb: TransactionBlock, args: CommitUpgradeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::commit_upgrade`,
    arguments: [obj(txb, args.upgradeCap), obj(txb, args.upgradeReceipt)],
  })
}

export interface RestrictArgs {
  upgradeCap: ObjectArg
  u8: number | TransactionArgument
}

export function restrict(txb: TransactionBlock, args: RestrictArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::package::restrict`,
    arguments: [obj(txb, args.upgradeCap), pure(txb, args.u8, `u8`)],
  })
}
