import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function version(tx: Transaction, upgradeCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::version`,
    arguments: [obj(tx, upgradeCap)],
  })
}

export function claim(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::claim`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function claimAndKeep(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::claim_and_keep`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function burnPublisher(tx: Transaction, publisher: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::burn_publisher`,
    arguments: [obj(tx, publisher)],
  })
}

export function fromPackage(tx: Transaction, typeArg: string, publisher: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::from_package`,
    typeArguments: [typeArg],
    arguments: [obj(tx, publisher)],
  })
}

export function fromModule(tx: Transaction, typeArg: string, publisher: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::from_module`,
    typeArguments: [typeArg],
    arguments: [obj(tx, publisher)],
  })
}

export function publishedModule(tx: Transaction, publisher: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::published_module`,
    arguments: [obj(tx, publisher)],
  })
}

export function publishedPackage(tx: Transaction, publisher: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::published_package`,
    arguments: [obj(tx, publisher)],
  })
}

export function upgradePackage(tx: Transaction, upgradeCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::upgrade_package`,
    arguments: [obj(tx, upgradeCap)],
  })
}

export function upgradePolicy(tx: Transaction, upgradeCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::upgrade_policy`,
    arguments: [obj(tx, upgradeCap)],
  })
}

export function ticketPackage(tx: Transaction, upgradeTicket: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_package`,
    arguments: [obj(tx, upgradeTicket)],
  })
}

export function ticketPolicy(tx: Transaction, upgradeTicket: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_policy`,
    arguments: [obj(tx, upgradeTicket)],
  })
}

export function receiptCap(tx: Transaction, upgradeReceipt: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::receipt_cap`,
    arguments: [obj(tx, upgradeReceipt)],
  })
}

export function receiptPackage(tx: Transaction, upgradeReceipt: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::receipt_package`,
    arguments: [obj(tx, upgradeReceipt)],
  })
}

export function ticketDigest(tx: Transaction, upgradeTicket: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_digest`,
    arguments: [obj(tx, upgradeTicket)],
  })
}

export function compatiblePolicy(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::package::compatible_policy`, arguments: [] })
}

export function additivePolicy(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::package::additive_policy`, arguments: [] })
}

export function depOnlyPolicy(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::package::dep_only_policy`, arguments: [] })
}

export function onlyAdditiveUpgrades(tx: Transaction, upgradeCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::only_additive_upgrades`,
    arguments: [obj(tx, upgradeCap)],
  })
}

export function onlyDepUpgrades(tx: Transaction, upgradeCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::only_dep_upgrades`,
    arguments: [obj(tx, upgradeCap)],
  })
}

export function makeImmutable(tx: Transaction, upgradeCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::make_immutable`,
    arguments: [obj(tx, upgradeCap)],
  })
}

export interface AuthorizeUpgradeArgs {
  upgradeCap: TransactionObjectInput
  u8: number | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function authorizeUpgrade(tx: Transaction, args: AuthorizeUpgradeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::authorize_upgrade`,
    arguments: [
      obj(tx, args.upgradeCap),
      pure(tx, args.u8, `u8`),
      pure(tx, args.vecU8, `vector<u8>`),
    ],
  })
}

export interface CommitUpgradeArgs {
  upgradeCap: TransactionObjectInput
  upgradeReceipt: TransactionObjectInput
}

export function commitUpgrade(tx: Transaction, args: CommitUpgradeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::commit_upgrade`,
    arguments: [obj(tx, args.upgradeCap), obj(tx, args.upgradeReceipt)],
  })
}

export interface RestrictArgs {
  upgradeCap: TransactionObjectInput
  u8: number | TransactionArgument
}

export function restrict(tx: Transaction, args: RestrictArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::restrict`,
    arguments: [obj(tx, args.upgradeCap), pure(tx, args.u8, `u8`)],
  })
}
