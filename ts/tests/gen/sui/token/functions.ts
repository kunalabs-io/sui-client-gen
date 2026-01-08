import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, option, pure } from '../../_framework/util'
import { Option } from '../../std/option/structs'
import { String } from '../../std/string/structs'
import { Balance } from '../balance/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

/**
 * Create a new `TokenPolicy` and a matching `TokenPolicyCap`.
 * The `TokenPolicy` must then be shared using the `share_policy` method.
 *
 * `TreasuryCap` guarantees full ownership over the currency, and is unique,
 * hence it is safe to use it for authorization.
 */
export function newPolicy(tx: Transaction, typeArg: string, treasuryCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::new_policy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasuryCap)],
  })
}

/**
 * Share the `TokenPolicy`. Due to `key`-only restriction, it must be
 * shared after initialization.
 */
export function sharePolicy(tx: Transaction, typeArg: string, policy: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::share_policy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, policy)],
  })
}

export interface TransferArgs {
  t: TransactionObjectInput
  recipient: string | TransactionArgument
}

/**
 * Transfer a `Token` to a `recipient`. Creates an `ActionRequest` for the
 * "transfer" action. The `ActionRequest` contains the `recipient` field
 * to be used in verification.
 */
export function transfer(tx: Transaction, typeArg: string, args: TransferArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::transfer`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.t), pure(tx, args.recipient, `address`)],
  })
}

/**
 * Spend a `Token` by unwrapping it and storing the `Balance` in the
 * `ActionRequest` for the "spend" action. The `ActionRequest` contains
 * the `spent_balance` field to be used in verification.
 *
 * Spend action requires `confirm_request_mut` to be called to confirm the
 * request and join the spent balance with the `TokenPolicy.spent_balance`.
 */
export function spend(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::spend`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

/**
 * Convert `Token` into an open `Coin`. Creates an `ActionRequest` for the
 * "to_coin" action.
 */
export function toCoin(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::to_coin`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

/**
 * Convert an open `Coin` into a `Token`. Creates an `ActionRequest` for
 * the "from_coin" action.
 */
export function fromCoin(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::from_coin`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export interface JoinArgs {
  token: TransactionObjectInput
  another: TransactionObjectInput
}

/** Join two `Token`s into one, always available. */
export function join(tx: Transaction, typeArg: string, args: JoinArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::join`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.token), obj(tx, args.another)],
  })
}

export interface SplitArgs {
  token: TransactionObjectInput
  amount: bigint | TransactionArgument
}

/**
 * Split a `Token` with `amount`.
 * Aborts if the `Token.balance` is lower than `amount`.
 */
export function split(tx: Transaction, typeArg: string, args: SplitArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.token), pure(tx, args.amount, `u64`)],
  })
}

/** Create a zero `Token`. */
export function zero(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

/**
 * Destroy an empty `Token`, fails if the balance is non-zero.
 * Aborts if the `Token.balance` is not zero.
 */
export function destroyZero(tx: Transaction, typeArg: string, token: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(tx, token)],
  })
}

/** Transfer the `Token` to the transaction sender. */
export function keep(tx: Transaction, typeArg: string, token: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, token)],
  })
}

export interface NewRequestArgs {
  name: string | TransactionArgument
  amount: bigint | TransactionArgument
  recipient: string | TransactionArgument | null
  spentBalance: TransactionObjectInput | null
}

/**
 * Create a new `ActionRequest`.
 * Publicly available method to allow for custom actions.
 */
export function newRequest(tx: Transaction, typeArg: string, args: NewRequestArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::new_request`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.name, `${String.$typeName}`),
      pure(tx, args.amount, `u64`),
      pure(tx, args.recipient, `${Option.$typeName}<address>`),
      option(tx, `${Balance.$typeName}<${typeArg}>`, args.spentBalance),
    ],
  })
}

export interface ConfirmRequestArgs {
  policy: TransactionObjectInput
  request: TransactionObjectInput
}

/**
 * Confirm the request against the `TokenPolicy` and return the parameters
 * of the request: (Name, Amount, Sender, Recipient).
 *
 * Cannot be used for `spend` and similar actions that deliver `spent_balance`
 * to the `TokenPolicy`. For those actions use `confirm_request_mut`.
 *
 * Aborts if:
 * - the action is not allowed (missing record in `rules`)
 * - action contains `spent_balance` (use `confirm_request_mut`)
 * - the `ActionRequest` does not meet the `TokenPolicy` rules for the action
 */
export function confirmRequest(tx: Transaction, typeArg: string, args: ConfirmRequestArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::confirm_request`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.policy), obj(tx, args.request)],
  })
}

export interface ConfirmRequestMutArgs {
  policy: TransactionObjectInput
  request: TransactionObjectInput
}

/**
 * Confirm the request against the `TokenPolicy` and return the parameters
 * of the request: (Name, Amount, Sender, Recipient).
 *
 * Unlike `confirm_request` this function requires mutable access to the
 * `TokenPolicy` and must be used on `spend` action. After dealing with the
 * spent balance it calls `confirm_request` internally.
 *
 * See `confirm_request` for the list of abort conditions.
 */
export function confirmRequestMut(tx: Transaction, typeArg: string, args: ConfirmRequestMutArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::confirm_request_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.policy), obj(tx, args.request)],
  })
}

export interface ConfirmWithPolicyCapArgs {
  policyCap: TransactionObjectInput
  request: TransactionObjectInput
}

/**
 * Confirm an `ActionRequest` as the `TokenPolicyCap` owner. This function
 * allows `TokenPolicy` owner to perform Capability-gated actions ignoring
 * the ruleset specified in the `TokenPolicy`.
 *
 * Aborts if request contains `spent_balance` due to inability of the
 * `TokenPolicyCap` to decrease supply. For scenarios like this a
 * `TreasuryCap` is required (see `confirm_with_treasury_cap`).
 */
export function confirmWithPolicyCap(
  tx: Transaction,
  typeArg: string,
  args: ConfirmWithPolicyCapArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::confirm_with_policy_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.policyCap), obj(tx, args.request)],
  })
}

export interface ConfirmWithTreasuryCapArgs {
  treasuryCap: TransactionObjectInput
  request: TransactionObjectInput
}

/**
 * Confirm an `ActionRequest` as the `TreasuryCap` owner. This function
 * allows `TreasuryCap` owner to perform Capability-gated actions ignoring
 * the ruleset specified in the `TokenPolicy`.
 *
 * Unlike `confirm_with_policy_cap` this function allows `spent_balance`
 * to be consumed, decreasing the `total_supply` of the `Token`.
 */
export function confirmWithTreasuryCap(
  tx: Transaction,
  typeArg: string,
  args: ConfirmWithTreasuryCapArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::confirm_with_treasury_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.treasuryCap), obj(tx, args.request)],
  })
}

export interface AddApprovalArgs {
  t: GenericArg
  request: TransactionObjectInput
}

/**
 * Add an "approval" to the `ActionRequest` by providing a Witness.
 * Intended to be used by Rules to add their own approvals, however, can
 * be used to add arbitrary approvals to the request (not only the ones
 * required by the `TokenPolicy`).
 */
export function addApproval(tx: Transaction, typeArgs: [string, string], args: AddApprovalArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::add_approval`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.t), obj(tx, args.request)],
  })
}

export interface AddRuleConfigArgs {
  rule: GenericArg
  self: TransactionObjectInput
  cap: TransactionObjectInput
  config: GenericArg
}

/**
 * Add a `Config` for a `Rule` in the `TokenPolicy`. Rule configuration is
 * independent from the `TokenPolicy.rules` and needs to be managed by the
 * Rule itself. Configuration is stored per `Rule` and not per `Rule` per
 * `Action` to allow reuse in different actions.
 *
 * - Rule witness guarantees that the `Config` is approved by the Rule.
 * - `TokenPolicyCap` guarantees that the `Config` setup is initiated by
 * the `TokenPolicy` owner.
 */
export function addRuleConfig(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: AddRuleConfigArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::add_rule_config`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[1]}`, args.rule),
      obj(tx, args.self),
      obj(tx, args.cap),
      generic(tx, `${typeArgs[2]}`, args.config),
    ],
  })
}

export interface RuleConfigArgs {
  rule: GenericArg
  self: TransactionObjectInput
}

/**
 * Get a `Config` for a `Rule` in the `TokenPolicy`. Requires `Rule`
 * witness, hence can only be read by the `Rule` itself. This requirement
 * guarantees safety of the stored `Config` and allows for simpler dynamic
 * field management inside the Rule Config (custom type keys are not needed
 * for access gating).
 *
 * Aborts if the Config is not present.
 */
export function ruleConfig(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RuleConfigArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::rule_config`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.rule), obj(tx, args.self)],
  })
}

export interface RuleConfigMutArgs {
  rule: GenericArg
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Get mutable access to the `Config` for a `Rule` in the `TokenPolicy`.
 * Requires `Rule` witness, hence can only be read by the `Rule` itself,
 * as well as `TokenPolicyCap` to guarantee that the `TokenPolicy` owner
 * is the one who initiated the `Config` modification.
 *
 * Aborts if:
 * - the Config is not present
 * - `TokenPolicyCap` is not matching the `TokenPolicy`
 */
export function ruleConfigMut(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RuleConfigMutArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::rule_config_mut`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.rule), obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface RemoveRuleConfigArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Remove a `Config` for a `Rule` in the `TokenPolicy`.
 * Unlike the `add_rule_config`, this function does not require a `Rule`
 * witness, hence can be performed by the `TokenPolicy` owner on their own.
 *
 * Rules need to make sure that the `Config` is present when performing
 * verification of the `ActionRequest`.
 *
 * Aborts if:
 * - the Config is not present
 * - `TokenPolicyCap` is not matching the `TokenPolicy`
 */
export function removeRuleConfig(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RemoveRuleConfigArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::remove_rule_config`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

/**
 * Check if a config for a `Rule` is set in the `TokenPolicy` without
 * checking the type of the `Config`.
 */
export function hasRuleConfig(
  tx: Transaction,
  typeArgs: [string, string],
  self: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::has_rule_config`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

/**
 * Check if a `Config` for a `Rule` is set in the `TokenPolicy` and that
 * it matches the type provided.
 */
export function hasRuleConfigWithType(
  tx: Transaction,
  typeArgs: [string, string, string],
  self: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::has_rule_config_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, self)],
  })
}

export interface AllowArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  action: string | TransactionArgument
}

/**
 * Allows an `action` to be performed on the `Token` freely by adding an
 * empty set of `Rules` for the `action`.
 *
 * Aborts if the `TokenPolicyCap` is not matching the `TokenPolicy`.
 */
export function allow(tx: Transaction, typeArg: string, args: AllowArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::allow`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.action, `${String.$typeName}`),
    ],
  })
}

export interface DisallowArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  action: string | TransactionArgument
}

/**
 * Completely disallows an `action` on the `Token` by removing the record
 * from the `TokenPolicy.rules`.
 *
 * Aborts if the `TokenPolicyCap` is not matching the `TokenPolicy`.
 */
export function disallow(tx: Transaction, typeArg: string, args: DisallowArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::disallow`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.action, `${String.$typeName}`),
    ],
  })
}

export interface AddRuleForActionArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  action: string | TransactionArgument
}

/**
 * Adds a Rule for an action with `name` in the `TokenPolicy`.
 *
 * Aborts if the `TokenPolicyCap` is not matching the `TokenPolicy`.
 */
export function addRuleForAction(
  tx: Transaction,
  typeArgs: [string, string],
  args: AddRuleForActionArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::add_rule_for_action`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.action, `${String.$typeName}`),
    ],
  })
}

export interface RemoveRuleForActionArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  action: string | TransactionArgument
}

/**
 * Removes a rule for an action with `name` in the `TokenPolicy`. Returns
 * the config object to be handled by the sender (or a Rule itself).
 *
 * Aborts if the `TokenPolicyCap` is not matching the `TokenPolicy`.
 */
export function removeRuleForAction(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveRuleForActionArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::remove_rule_for_action`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.self),
      obj(tx, args.cap),
      pure(tx, args.action, `${String.$typeName}`),
    ],
  })
}

export interface MintArgs {
  cap: TransactionObjectInput
  amount: bigint | TransactionArgument
}

/** Mint a `Token` with a given `amount` using the `TreasuryCap`. */
export function mint(tx: Transaction, typeArg: string, args: MintArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::mint`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.cap), pure(tx, args.amount, `u64`)],
  })
}

export interface BurnArgs {
  cap: TransactionObjectInput
  token: TransactionObjectInput
}

/** Burn a `Token` using the `TreasuryCap`. */
export function burn(tx: Transaction, typeArg: string, args: BurnArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::burn`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.cap), obj(tx, args.token)],
  })
}

export interface FlushArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

/**
 * Flush the `TokenPolicy.spent_balance` into the `TreasuryCap`. This
 * action is only available to the `TreasuryCap` owner.
 */
export function flush(tx: Transaction, typeArg: string, args: FlushArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::flush`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface IsAllowedArgs {
  self: TransactionObjectInput
  action: string | TransactionArgument
}

/** Check whether an action is present in the rules VecMap. */
export function isAllowed(tx: Transaction, typeArg: string, args: IsAllowedArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::is_allowed`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.action, `${String.$typeName}`)],
  })
}

export interface RulesArgs {
  self: TransactionObjectInput
  action: string | TransactionArgument
}

/** Returns the rules required for a specific action. */
export function rules(tx: Transaction, typeArg: string, args: RulesArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::rules`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.action, `${String.$typeName}`)],
  })
}

/** Returns the `spent_balance` of the `TokenPolicy`. */
export function spentBalance(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::spent_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Returns the `balance` of the `Token`. */
export function value(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

/** Name of the Transfer action. */
export function transferAction(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::transfer_action`,
    arguments: [],
  })
}

/** Name of the `Spend` action. */
export function spendAction(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::spend_action`,
    arguments: [],
  })
}

/** Name of the `ToCoin` action. */
export function toCoinAction(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::to_coin_action`,
    arguments: [],
  })
}

/** Name of the `FromCoin` action. */
export function fromCoinAction(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::from_coin_action`,
    arguments: [],
  })
}

/** The Action in the `ActionRequest`. */
export function action(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::action`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Amount of the `ActionRequest`. */
export function amount(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::amount`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Sender of the `ActionRequest`. */
export function sender(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::sender`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Recipient of the `ActionRequest`. */
export function recipient(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::recipient`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Approvals of the `ActionRequest`. */
export function approvals(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::approvals`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/** Burned balance of the `ActionRequest`. */
export function spent(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::spent`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

/**
 * Create a new `RuleKey` for a `Rule`. The `is_protected` field is kept
 * for potential future use, if Rules were to have a freely modifiable
 * storage as addition / replacement for the `Config` system.
 *
 * The goal of `is_protected` is to potentially allow Rules store a mutable
 * version of their configuration and mutate state on user action.
 */
export function key(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::key`,
    typeArguments: [typeArg],
    arguments: [],
  })
}
