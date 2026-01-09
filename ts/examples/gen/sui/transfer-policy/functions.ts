import { Option } from '../../_dependencies/std/option/structs'
import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { ID } from '../object/structs'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

export interface NewRequestArgs {
  item: string | TransactionArgument
  paid: bigint | TransactionArgument
  from: string | TransactionArgument
}

/**
 * Construct a new `TransferRequest` hot potato which requires an
 * approving action from the creator to be destroyed / resolved. Once
 * created, it must be confirmed in the `confirm_request` call otherwise
 * the transaction will fail.
 */
export function newRequest(
  tx: Transaction,
  typeArg: string,
  args: NewRequestArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::new_request`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.item, `${ID.$typeName}`),
      pure(tx, args.paid, `u64`),
      pure(tx, args.from, `${ID.$typeName}`),
    ],
  })
}

/**
 * Register a type in the Kiosk system and receive a `TransferPolicy` and
 * a `TransferPolicyCap` for the type. The `TransferPolicy` is required to
 * confirm kiosk deals for the `T`. If there's no `TransferPolicy`
 * available for use, the type can not be traded in kiosks.
 */
export function new_(
  tx: Transaction,
  typeArg: string,
  pub: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::new`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

/**
 * Initialize the Transfer Policy in the default scenario: Create and share
 * the `TransferPolicy`, transfer `TransferPolicyCap` to the transaction
 * sender.
 */
export function default_(
  tx: Transaction,
  typeArg: string,
  pub: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::default`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

export interface WithdrawArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  amount: bigint | TransactionArgument | null
}

/**
 * Withdraw some amount of profits from the `TransferPolicy`. If amount
 * is not specified, all profits are withdrawn.
 */
export function withdraw(tx: Transaction, typeArg: string, args: WithdrawArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::withdraw`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.amount, `${Option.$typeName}<u64>`),
    ],
  })
}

export interface DestroyAndWithdrawArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Destroy a TransferPolicyCap.
 * Can be performed by any party as long as they own it.
 */
export function destroyAndWithdraw(
  tx: Transaction,
  typeArg: string,
  args: DestroyAndWithdrawArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::destroy_and_withdraw`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface ConfirmRequestArgs {
  self: TransactionObjectInput
  request: TransactionObjectInput
}

/**
 * Allow a `TransferRequest` for the type `T`. The call is protected
 * by the type constraint, as only the publisher of the `T` can get
 * `TransferPolicy<T>`.
 *
 * Note: unless there's a policy for `T` to allow transfers,
 * Kiosk trades will not be possible.
 */
export function confirmRequest(
  tx: Transaction,
  typeArg: string,
  args: ConfirmRequestArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::confirm_request`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.request)],
  })
}

export interface AddRuleArgs {
  rule: GenericArg
  policy: TransactionObjectInput
  cap: TransactionObjectInput
  cfg: GenericArg
}

/**
 * Add a custom Rule to the `TransferPolicy`. Once set, `TransferRequest` must
 * receive a confirmation of the rule executed so the hot potato can be unpacked.
 *
 * - T: the type to which TransferPolicy<T> is applied.
 * - Rule: the witness type for the Custom rule
 * - Config: a custom configuration for the rule
 *
 * Config requires `drop` to allow creators to remove any policy at any moment,
 * even if graceful unpacking has not been implemented in a "rule module".
 */
export function addRule(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: AddRuleArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::add_rule`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[1]}`, args.rule),
      obj(tx, args.policy),
      obj(tx, args.cap),
      generic(tx, `${typeArgs[2]}`, args.cfg),
    ],
  })
}

export interface GetRuleArgs {
  rule: GenericArg
  policy: TransactionObjectInput
}

/** Get the custom Config for the Rule (can be only one per "Rule" type). */
export function getRule(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: GetRuleArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::get_rule`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.rule), obj(tx, args.policy)],
  })
}

export interface AddToBalanceArgs {
  rule: GenericArg
  policy: TransactionObjectInput
  coin: TransactionObjectInput
}

/** Add some `SUI` to the balance of a `TransferPolicy`. */
export function addToBalance(
  tx: Transaction,
  typeArgs: [string, string],
  args: AddToBalanceArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::add_to_balance`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.rule), obj(tx, args.policy), obj(tx, args.coin)],
  })
}

export interface AddReceiptArgs {
  rule: GenericArg
  request: TransactionObjectInput
}

/**
 * Adds a `Receipt` to the `TransferRequest`, unblocking the request and
 * confirming that the policy requirements are satisfied.
 */
export function addReceipt(
  tx: Transaction,
  typeArgs: [string, string],
  args: AddReceiptArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::add_receipt`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.rule), obj(tx, args.request)],
  })
}

/** Check whether a custom rule has been added to the `TransferPolicy`. */
export function hasRule(
  tx: Transaction,
  typeArgs: [string, string],
  policy: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::has_rule`,
    typeArguments: typeArgs,
    arguments: [obj(tx, policy)],
  })
}

export interface RemoveRuleArgs {
  policy: TransactionObjectInput
  cap: TransactionObjectInput
}

/** Remove the Rule from the `TransferPolicy`. */
export function removeRule(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RemoveRuleArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::remove_rule`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.policy), obj(tx, args.cap)],
  })
}

/** Allows reading custom attachments to the `TransferPolicy` if there are any. */
export function uid(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::uid`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export interface UidMutAsOwnerArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Get a mutable reference to the `self.id` to enable custom attachments
 * to the `TransferPolicy`.
 */
export function uidMutAsOwner(
  tx: Transaction,
  typeArg: string,
  args: UidMutAsOwnerArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::uid_mut_as_owner`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

/** Read the `rules` field from the `TransferPolicy`. */
export function rules(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::rules`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Get the `item` field of the `TransferRequest`. */
export function item(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::item`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Get the `paid` field of the `TransferRequest`. */
export function paid(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::paid`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Get the `from` field of the `TransferRequest`. */
export function from(
  tx: Transaction,
  typeArg: string,
  self: TransactionObjectInput
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::transfer_policy::from`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
