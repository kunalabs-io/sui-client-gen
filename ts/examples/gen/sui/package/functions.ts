import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure } from '../../_framework/util'

/**
 * Claim a Publisher object.
 * Requires a One-Time-Witness to prove ownership. Due to this
 * constraint there can be only one Publisher object per module
 * but multiple per package (!).
 */
export function claim(tx: Transaction, typeArg: string, otw: GenericArg): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::claim`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, otw)],
  })
}

/**
 * Claim a Publisher object and send it to transaction sender.
 * Since this function can only be called in the module initializer,
 * the sender is the publisher.
 */
export function claimAndKeep(tx: Transaction, typeArg: string, otw: GenericArg): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::claim_and_keep`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, otw)],
  })
}

/**
 * Destroy a Publisher object effectively removing all privileges
 * associated with it.
 */
export function burnPublisher(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::burn_publisher`,
    arguments: [obj(tx, self)],
  })
}

/** Check whether type belongs to the same package as the publisher object. */
export function fromPackage(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::from_package`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Check whether a type belongs to the same module as the publisher object. */
export function fromModule(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::from_module`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Read the name of the module. */
export function publishedModule(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::published_module`,
    arguments: [obj(tx, self)],
  })
}

/** Read the package address string. */
export function publishedPackage(tx: Transaction, self: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::published_package`,
    arguments: [obj(tx, self)],
  })
}

/**
 * The ID of the package that this cap authorizes upgrades for.
 * Can be `0x0` if the cap cannot currently authorize an upgrade
 * because there is already a pending upgrade in the transaction.
 * Otherwise guaranteed to be the latest version of any given
 * package.
 */
export function upgradePackage(tx: Transaction, cap: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::upgrade_package`,
    arguments: [obj(tx, cap)],
  })
}

/**
 * The most recent version of the package, increments by one for each
 * successfully applied upgrade.
 */
export function version(tx: Transaction, cap: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::version`,
    arguments: [obj(tx, cap)],
  })
}

/**
 * The most permissive kind of upgrade currently supported by this
 * `cap`.
 */
export function upgradePolicy(tx: Transaction, cap: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::upgrade_policy`,
    arguments: [obj(tx, cap)],
  })
}

/** The package that this ticket is authorized to upgrade */
export function ticketPackage(tx: Transaction, ticket: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::ticket_package`,
    arguments: [obj(tx, ticket)],
  })
}

/** The kind of upgrade that this ticket authorizes. */
export function ticketPolicy(tx: Transaction, ticket: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::ticket_policy`,
    arguments: [obj(tx, ticket)],
  })
}

/**
 * ID of the `UpgradeCap` that this `receipt` should be used to
 * update.
 */
export function receiptCap(tx: Transaction, receipt: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::receipt_cap`,
    arguments: [obj(tx, receipt)],
  })
}

/**
 * ID of the package that was upgraded to: the latest version of
 * the package, as of the upgrade represented by this `receipt`.
 */
export function receiptPackage(
  tx: Transaction,
  receipt: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::receipt_package`,
    arguments: [obj(tx, receipt)],
  })
}

/**
 * A hash of the package contents for the new version of the
 * package.  This ticket only authorizes an upgrade to a package
 * that matches this digest.  A package's contents are identified
 * by two things:
 *
 * - modules: [[u8]]       a list of the package's module contents
 * - deps:    [[u8; 32]]   a list of 32 byte ObjectIDs of the
 * package's transitive dependencies
 *
 * A package's digest is calculated as:
 *
 * sha3_256(sort(modules ++ deps))
 */
export function ticketDigest(tx: Transaction, ticket: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::ticket_digest`,
    arguments: [obj(tx, ticket)],
  })
}

/** Expose the constants representing various upgrade policies */
export function compatiblePolicy(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::compatible_policy`,
    arguments: [],
  })
}

export function additivePolicy(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::additive_policy`,
    arguments: [],
  })
}

export function depOnlyPolicy(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::dep_only_policy`,
    arguments: [],
  })
}

/**
 * Restrict upgrades through this upgrade `cap` to just add code, or
 * change dependencies.
 */
export function onlyAdditiveUpgrades(
  tx: Transaction,
  cap: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::only_additive_upgrades`,
    arguments: [obj(tx, cap)],
  })
}

/**
 * Restrict upgrades through this upgrade `cap` to just change
 * dependencies.
 */
export function onlyDepUpgrades(tx: Transaction, cap: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::only_dep_upgrades`,
    arguments: [obj(tx, cap)],
  })
}

/** Discard the `UpgradeCap` to make a package immutable. */
export function makeImmutable(tx: Transaction, cap: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::make_immutable`,
    arguments: [obj(tx, cap)],
  })
}

export interface AuthorizeUpgradeArgs {
  cap: TransactionObjectInput
  policy: number | TransactionArgument
  digest: Array<number | TransactionArgument> | TransactionArgument
}

/**
 * Issue a ticket authorizing an upgrade to a particular new bytecode
 * (identified by its digest).  A ticket will only be issued if one has
 * not already been issued, and if the `policy` requested is at least as
 * restrictive as the policy set out by the `cap`.
 *
 * The `digest` supplied and the `policy` will both be checked by
 * validators when running the upgrade.  I.e. the bytecode supplied in
 * the upgrade must have a matching digest, and the changes relative to
 * the parent package must be compatible with the policy in the ticket
 * for the upgrade to succeed.
 */
export function authorizeUpgrade(tx: Transaction, args: AuthorizeUpgradeArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::authorize_upgrade`,
    arguments: [
      obj(tx, args.cap),
      pure(tx, args.policy, `u8`),
      pure(tx, args.digest, `vector<u8>`),
    ],
  })
}

export interface CommitUpgradeArgs {
  cap: TransactionObjectInput
  receipt: TransactionObjectInput
}

/**
 * Consume an `UpgradeReceipt` to update its `UpgradeCap`, finalizing
 * the upgrade.
 */
export function commitUpgrade(tx: Transaction, args: CommitUpgradeArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::commit_upgrade`,
    arguments: [
      obj(tx, args.cap),
      obj(tx, args.receipt),
    ],
  })
}

export interface RestrictArgs {
  cap: TransactionObjectInput
  policy: number | TransactionArgument
}

export function restrict(tx: Transaction, args: RestrictArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::package::restrict`,
    arguments: [
      obj(tx, args.cap),
      pure(tx, args.policy, `u8`),
    ],
  })
}
