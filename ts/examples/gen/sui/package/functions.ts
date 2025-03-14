import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function additivePolicy(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::package::additive_policy`, arguments: [] })
}

export interface AuthorizeUpgradeArgs {
  cap: TransactionObjectInput
  policy: number | TransactionArgument
  digest: Array<number | TransactionArgument> | TransactionArgument
}

export function authorizeUpgrade(tx: Transaction, args: AuthorizeUpgradeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::authorize_upgrade`,
    arguments: [
      obj(tx, args.cap),
      pure(tx, args.policy, `u8`),
      pure(tx, args.digest, `vector<u8>`),
    ],
  })
}

export function burnPublisher(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::burn_publisher`,
    arguments: [obj(tx, self)],
  })
}

export function claim(tx: Transaction, typeArg: string, otw: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::claim`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, otw)],
  })
}

export function claimAndKeep(tx: Transaction, typeArg: string, otw: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::claim_and_keep`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, otw)],
  })
}

export interface CommitUpgradeArgs {
  cap: TransactionObjectInput
  receipt: TransactionObjectInput
}

export function commitUpgrade(tx: Transaction, args: CommitUpgradeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::commit_upgrade`,
    arguments: [obj(tx, args.cap), obj(tx, args.receipt)],
  })
}

export function compatiblePolicy(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::package::compatible_policy`, arguments: [] })
}

export function depOnlyPolicy(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::package::dep_only_policy`, arguments: [] })
}

export function fromModule(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::from_module`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function fromPackage(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::from_package`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function makeImmutable(tx: Transaction, cap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::make_immutable`,
    arguments: [obj(tx, cap)],
  })
}

export function onlyAdditiveUpgrades(tx: Transaction, cap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::only_additive_upgrades`,
    arguments: [obj(tx, cap)],
  })
}

export function onlyDepUpgrades(tx: Transaction, cap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::only_dep_upgrades`,
    arguments: [obj(tx, cap)],
  })
}

export function publishedModule(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::published_module`,
    arguments: [obj(tx, self)],
  })
}

export function publishedPackage(tx: Transaction, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::published_package`,
    arguments: [obj(tx, self)],
  })
}

export function receiptCap(tx: Transaction, receipt: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::receipt_cap`,
    arguments: [obj(tx, receipt)],
  })
}

export function receiptPackage(tx: Transaction, receipt: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::receipt_package`,
    arguments: [obj(tx, receipt)],
  })
}

export interface RestrictArgs {
  cap: TransactionObjectInput
  policy: number | TransactionArgument
}

export function restrict(tx: Transaction, args: RestrictArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::restrict`,
    arguments: [obj(tx, args.cap), pure(tx, args.policy, `u8`)],
  })
}

export function ticketDigest(tx: Transaction, ticket: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_digest`,
    arguments: [obj(tx, ticket)],
  })
}

export function ticketPackage(tx: Transaction, ticket: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_package`,
    arguments: [obj(tx, ticket)],
  })
}

export function ticketPolicy(tx: Transaction, ticket: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::ticket_policy`,
    arguments: [obj(tx, ticket)],
  })
}

export function upgradePackage(tx: Transaction, cap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::upgrade_package`,
    arguments: [obj(tx, cap)],
  })
}

export function upgradePolicy(tx: Transaction, cap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::package::upgrade_policy`,
    arguments: [obj(tx, cap)],
  })
}

export function version(tx: Transaction, cap: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::package::version`, arguments: [obj(tx, cap)] })
}
