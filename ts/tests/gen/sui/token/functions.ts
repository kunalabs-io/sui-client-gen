import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, option, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function value(txb: TransactionBlock, typeArg: Type, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::value`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}

export function key(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::key`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function amount(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::amount`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface AllowArgs {
  self: ObjectArg
  cap: ObjectArg
  action: string | TransactionArgument
}

export function allow(txb: TransactionBlock, typeArg: Type, args: AllowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::allow`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      obj(txb, args.cap),
      pure(txb, args.action, `0x1::string::String`),
    ],
  })
}

export function sender(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::sender`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface TransferArgs {
  t: ObjectArg
  recipient: string | TransactionArgument
}

export function transfer(txb: TransactionBlock, typeArg: Type, args: TransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::transfer`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.t), pure(txb, args.recipient, `address`)],
  })
}

export function recipient(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::recipient`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function destroyZero(txb: TransactionBlock, typeArg: Type, token: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(txb, token)],
  })
}

export interface JoinArgs {
  token: ObjectArg
  another: ObjectArg
}

export function join(txb: TransactionBlock, typeArg: Type, args: JoinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::join`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.token), obj(txb, args.another)],
  })
}

export interface SplitArgs {
  token: ObjectArg
  amount: bigint | TransactionArgument
}

export function split(txb: TransactionBlock, typeArg: Type, args: SplitArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::split`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.token), pure(txb, args.amount, `u64`)],
  })
}

export function zero(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface BurnArgs {
  cap: ObjectArg
  token: ObjectArg
}

export function burn(txb: TransactionBlock, typeArg: Type, args: BurnArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::burn`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.cap), obj(txb, args.token)],
  })
}

export interface MintArgs {
  cap: ObjectArg
  amount: bigint | TransactionArgument
}

export function mint(txb: TransactionBlock, typeArg: Type, args: MintArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::mint`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.cap), pure(txb, args.amount, `u64`)],
  })
}

export interface ConfirmRequestArgs {
  policy: ObjectArg
  request: ObjectArg
}

export function confirmRequest(txb: TransactionBlock, typeArg: Type, args: ConfirmRequestArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_request`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.policy), obj(txb, args.request)],
  })
}

export interface NewRequestArgs {
  name: string | TransactionArgument
  amount: bigint | TransactionArgument
  recipient: string | TransactionArgument | TransactionArgument | null
  spentBalance: ObjectArg | TransactionArgument | null
}

export function newRequest(txb: TransactionBlock, typeArg: Type, args: NewRequestArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::new_request`,
    typeArguments: [typeArg],
    arguments: [
      pure(txb, args.name, `0x1::string::String`),
      pure(txb, args.amount, `u64`),
      pure(txb, args.recipient, `0x1::option::Option<address>`),
      option(txb, `0x2::balance::Balance<${typeArg}>`, args.spentBalance),
    ],
  })
}

export interface RulesArgs {
  self: ObjectArg
  action: string | TransactionArgument
}

export function rules(txb: TransactionBlock, typeArg: Type, args: RulesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::rules`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.action, `0x1::string::String`)],
  })
}

export function keep(txb: TransactionBlock, typeArg: Type, token: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::keep`,
    typeArguments: [typeArg],
    arguments: [obj(txb, token)],
  })
}

export function action(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::action`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface AddApprovalArgs {
  t: GenericArg
  request: ObjectArg
}

export function addApproval(txb: TransactionBlock, typeArgs: [Type, Type], args: AddApprovalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::add_approval`,
    typeArguments: typeArgs,
    arguments: [generic(txb, `${typeArgs[1]}`, args.t), obj(txb, args.request)],
  })
}

export interface AddRuleConfigArgs {
  rule: GenericArg
  self: ObjectArg
  cap: ObjectArg
  config: GenericArg
}

export function addRuleConfig(
  txb: TransactionBlock,
  typeArgs: [Type, Type, Type],
  args: AddRuleConfigArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::add_rule_config`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[1]}`, args.rule),
      obj(txb, args.self),
      obj(txb, args.cap),
      generic(txb, `${typeArgs[2]}`, args.config),
    ],
  })
}

export interface AddRuleForActionArgs {
  self: ObjectArg
  cap: ObjectArg
  action: string | TransactionArgument
}

export function addRuleForAction(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: AddRuleForActionArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::add_rule_for_action`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.self),
      obj(txb, args.cap),
      pure(txb, args.action, `0x1::string::String`),
    ],
  })
}

export function approvals(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::approvals`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface ConfirmRequestMutArgs {
  policy: ObjectArg
  request: ObjectArg
}

export function confirmRequestMut(
  txb: TransactionBlock,
  typeArg: Type,
  args: ConfirmRequestMutArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_request_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.policy), obj(txb, args.request)],
  })
}

export interface ConfirmWithPolicyCapArgs {
  policyCap: ObjectArg
  request: ObjectArg
}

export function confirmWithPolicyCap(
  txb: TransactionBlock,
  typeArg: Type,
  args: ConfirmWithPolicyCapArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_with_policy_cap`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.policyCap), obj(txb, args.request)],
  })
}

export interface ConfirmWithTreasuryCapArgs {
  treasuryCap: ObjectArg
  request: ObjectArg
}

export function confirmWithTreasuryCap(
  txb: TransactionBlock,
  typeArg: Type,
  args: ConfirmWithTreasuryCapArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_with_treasury_cap`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.treasuryCap), obj(txb, args.request)],
  })
}

export interface DisallowArgs {
  self: ObjectArg
  cap: ObjectArg
  action: string | TransactionArgument
}

export function disallow(txb: TransactionBlock, typeArg: Type, args: DisallowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::disallow`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      obj(txb, args.cap),
      pure(txb, args.action, `0x1::string::String`),
    ],
  })
}

export interface FlushArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function flush(txb: TransactionBlock, typeArg: Type, args: FlushArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::flush`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export function fromCoin(txb: TransactionBlock, typeArg: Type, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::from_coin`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export function fromCoinAction(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::token::from_coin_action`, arguments: [] })
}

export function hasRuleConfig(txb: TransactionBlock, typeArgs: [Type, Type], self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::has_rule_config`,
    typeArguments: typeArgs,
    arguments: [obj(txb, self)],
  })
}

export function hasRuleConfigWithType(
  txb: TransactionBlock,
  typeArgs: [Type, Type, Type],
  self: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::has_rule_config_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(txb, self)],
  })
}

export interface IsAllowedArgs {
  self: ObjectArg
  action: string | TransactionArgument
}

export function isAllowed(txb: TransactionBlock, typeArg: Type, args: IsAllowedArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::is_allowed`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.action, `0x1::string::String`)],
  })
}

export function newPolicy(txb: TransactionBlock, typeArg: Type, treasuryCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::new_policy`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasuryCap)],
  })
}

export function spentBalance(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::spent_balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface RemoveRuleConfigArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function removeRuleConfig(
  txb: TransactionBlock,
  typeArgs: [Type, Type, Type],
  args: RemoveRuleConfigArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::remove_rule_config`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export interface RemoveRuleForActionArgs {
  self: ObjectArg
  cap: ObjectArg
  action: string | TransactionArgument
}

export function removeRuleForAction(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: RemoveRuleForActionArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::remove_rule_for_action`,
    typeArguments: typeArgs,
    arguments: [
      obj(txb, args.self),
      obj(txb, args.cap),
      pure(txb, args.action, `0x1::string::String`),
    ],
  })
}

export interface RuleConfigArgs {
  rule: GenericArg
  self: ObjectArg
}

export function ruleConfig(
  txb: TransactionBlock,
  typeArgs: [Type, Type, Type],
  args: RuleConfigArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::rule_config`,
    typeArguments: typeArgs,
    arguments: [generic(txb, `${typeArgs[1]}`, args.rule), obj(txb, args.self)],
  })
}

export interface RuleConfigMutArgs {
  rule: GenericArg
  self: ObjectArg
  cap: ObjectArg
}

export function ruleConfigMut(
  txb: TransactionBlock,
  typeArgs: [Type, Type, Type],
  args: RuleConfigMutArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::rule_config_mut`,
    typeArguments: typeArgs,
    arguments: [generic(txb, `${typeArgs[1]}`, args.rule), obj(txb, args.self), obj(txb, args.cap)],
  })
}

export function sharePolicy(txb: TransactionBlock, typeArg: Type, policy: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::share_policy`,
    typeArguments: [typeArg],
    arguments: [obj(txb, policy)],
  })
}

export function spend(txb: TransactionBlock, typeArg: Type, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::spend`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}

export function spendAction(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::token::spend_action`, arguments: [] })
}

export function spent(txb: TransactionBlock, typeArg: Type, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::spent`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function toCoin(txb: TransactionBlock, typeArg: Type, t: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::to_coin`,
    typeArguments: [typeArg],
    arguments: [obj(txb, t)],
  })
}

export function toCoinAction(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::token::to_coin_action`, arguments: [] })
}

export function transferAction(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::token::transfer_action`, arguments: [] })
}
