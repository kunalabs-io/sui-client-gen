import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, option, pure } from '../../_framework/util'
import { Option } from '../../std/option/structs'
import { String } from '../../std/string/structs'
import { Balance } from '../balance/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function newPolicy(tx: Transaction, typeArg: string, treasuryCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::new_policy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasuryCap)],
  })
}

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

export function transfer(tx: Transaction, typeArg: string, args: TransferArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::transfer`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.t), pure(tx, args.recipient, `address`)],
  })
}

export function spend(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::spend`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

export function toCoin(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::to_coin`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

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

export function split(tx: Transaction, typeArg: string, args: SplitArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.token), pure(tx, args.amount, `u64`)],
  })
}

export function zero(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function destroyZero(tx: Transaction, typeArg: string, token: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(tx, token)],
  })
}

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

export function rules(tx: Transaction, typeArg: string, args: RulesArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::rules`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.action, `${String.$typeName}`)],
  })
}

export function spentBalance(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::spent_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function value(tx: Transaction, typeArg: string, t: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, t)],
  })
}

export function transferAction(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::transfer_action`,
    arguments: [],
  })
}

export function spendAction(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::spend_action`,
    arguments: [],
  })
}

export function toCoinAction(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::to_coin_action`,
    arguments: [],
  })
}

export function fromCoinAction(tx: Transaction) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::from_coin_action`,
    arguments: [],
  })
}

export function action(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::action`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function amount(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::amount`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function sender(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::sender`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function recipient(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::recipient`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function approvals(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::approvals`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function spent(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::spent`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function key(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::token::key`,
    typeArguments: [typeArg],
    arguments: [],
  })
}
