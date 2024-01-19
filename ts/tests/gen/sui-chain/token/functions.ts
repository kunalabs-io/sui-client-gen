import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, option, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function sender(txb: TransactionBlock, typeArg: Type, actionRequest: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::sender`,
    typeArguments: [typeArg],
    arguments: [obj(txb, actionRequest)],
  })
}

export function value(txb: TransactionBlock, typeArg: Type, token: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::value`,
    typeArguments: [typeArg],
    arguments: [obj(txb, token)],
  })
}

export function zero(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface JoinArgs {
  token1: ObjectArg
  token2: ObjectArg
}

export function join(txb: TransactionBlock, typeArg: Type, args: JoinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::join`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.token1), obj(txb, args.token2)],
  })
}

export interface SplitArgs {
  token: ObjectArg
  u64: bigint | TransactionArgument
}

export function split(txb: TransactionBlock, typeArg: Type, args: SplitArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::split`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.token), pure(txb, args.u64, `u64`)],
  })
}

export function destroyZero(txb: TransactionBlock, typeArg: Type, token: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(txb, token)],
  })
}

export interface TransferArgs {
  token: ObjectArg
  address: string | TransactionArgument
}

export function transfer(txb: TransactionBlock, typeArg: Type, args: TransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::transfer`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.token), pure(txb, args.address, `address`)],
  })
}

export interface MintArgs {
  treasuryCap: ObjectArg
  u64: bigint | TransactionArgument
}

export function mint(txb: TransactionBlock, typeArg: Type, args: MintArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::mint`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.treasuryCap), pure(txb, args.u64, `u64`)],
  })
}

export interface BurnArgs {
  treasuryCap: ObjectArg
  token: ObjectArg
}

export function burn(txb: TransactionBlock, typeArg: Type, args: BurnArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::burn`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.treasuryCap), obj(txb, args.token)],
  })
}

export function keep(txb: TransactionBlock, typeArg: Type, token: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::keep`,
    typeArguments: [typeArg],
    arguments: [obj(txb, token)],
  })
}

export function key(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::key`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function newPolicy(txb: TransactionBlock, typeArg: Type, treasuryCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::new_policy`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasuryCap)],
  })
}

export function sharePolicy(txb: TransactionBlock, typeArg: Type, tokenPolicy: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::share_policy`,
    typeArguments: [typeArg],
    arguments: [obj(txb, tokenPolicy)],
  })
}

export function spend(txb: TransactionBlock, typeArg: Type, token: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::spend`,
    typeArguments: [typeArg],
    arguments: [obj(txb, token)],
  })
}

export function toCoin(txb: TransactionBlock, typeArg: Type, token: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::to_coin`,
    typeArguments: [typeArg],
    arguments: [obj(txb, token)],
  })
}

export function fromCoin(txb: TransactionBlock, typeArg: Type, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::from_coin`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export interface NewRequestArgs {
  string: string | TransactionArgument
  u64: bigint | TransactionArgument
  option1: string | TransactionArgument | TransactionArgument | null
  option2: ObjectArg | TransactionArgument | null
}

export function newRequest(txb: TransactionBlock, typeArg: Type, args: NewRequestArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::new_request`,
    typeArguments: [typeArg],
    arguments: [
      pure(txb, args.string, `0x1::string::String`),
      pure(txb, args.u64, `u64`),
      pure(txb, args.option1, `0x1::option::Option<address>`),
      option(txb, `0x2::balance::Balance<${typeArg}>`, args.option2),
    ],
  })
}

export interface ConfirmRequestArgs {
  tokenPolicy: ObjectArg
  actionRequest: ObjectArg
}

export function confirmRequest(txb: TransactionBlock, typeArg: Type, args: ConfirmRequestArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_request`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tokenPolicy), obj(txb, args.actionRequest)],
  })
}

export interface ConfirmRequestMutArgs {
  tokenPolicy: ObjectArg
  actionRequest: ObjectArg
}

export function confirmRequestMut(
  txb: TransactionBlock,
  typeArg: Type,
  args: ConfirmRequestMutArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_request_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tokenPolicy), obj(txb, args.actionRequest)],
  })
}

export interface ConfirmWithPolicyCapArgs {
  tokenPolicyCap: ObjectArg
  actionRequest: ObjectArg
}

export function confirmWithPolicyCap(
  txb: TransactionBlock,
  typeArg: Type,
  args: ConfirmWithPolicyCapArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_with_policy_cap`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tokenPolicyCap), obj(txb, args.actionRequest)],
  })
}

export interface ConfirmWithTreasuryCapArgs {
  treasuryCap: ObjectArg
  actionRequest: ObjectArg
}

export function confirmWithTreasuryCap(
  txb: TransactionBlock,
  typeArg: Type,
  args: ConfirmWithTreasuryCapArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_with_treasury_cap`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.treasuryCap), obj(txb, args.actionRequest)],
  })
}

export interface AddApprovalArgs {
  t1: GenericArg
  actionRequest: ObjectArg
}

export function addApproval(txb: TransactionBlock, typeArgs: [Type, Type], args: AddApprovalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::add_approval`,
    typeArguments: typeArgs,
    arguments: [generic(txb, `${typeArgs[1]}`, args.t1), obj(txb, args.actionRequest)],
  })
}

export interface AddRuleConfigArgs {
  t1: GenericArg
  tokenPolicy: ObjectArg
  tokenPolicyCap: ObjectArg
  t2: GenericArg
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
      generic(txb, `${typeArgs[1]}`, args.t1),
      obj(txb, args.tokenPolicy),
      obj(txb, args.tokenPolicyCap),
      generic(txb, `${typeArgs[2]}`, args.t2),
    ],
  })
}

export interface RuleConfigArgs {
  t1: GenericArg
  tokenPolicy: ObjectArg
}

export function ruleConfig(
  txb: TransactionBlock,
  typeArgs: [Type, Type, Type],
  args: RuleConfigArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::rule_config`,
    typeArguments: typeArgs,
    arguments: [generic(txb, `${typeArgs[1]}`, args.t1), obj(txb, args.tokenPolicy)],
  })
}

export interface RuleConfigMutArgs {
  t1: GenericArg
  tokenPolicy: ObjectArg
  tokenPolicyCap: ObjectArg
}

export function ruleConfigMut(
  txb: TransactionBlock,
  typeArgs: [Type, Type, Type],
  args: RuleConfigMutArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::rule_config_mut`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[1]}`, args.t1),
      obj(txb, args.tokenPolicy),
      obj(txb, args.tokenPolicyCap),
    ],
  })
}

export interface RemoveRuleConfigArgs {
  tokenPolicy: ObjectArg
  tokenPolicyCap: ObjectArg
}

export function removeRuleConfig(
  txb: TransactionBlock,
  typeArgs: [Type, Type, Type],
  args: RemoveRuleConfigArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::remove_rule_config`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.tokenPolicy), obj(txb, args.tokenPolicyCap)],
  })
}

export function hasRuleConfig(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  tokenPolicy: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::has_rule_config`,
    typeArguments: typeArgs,
    arguments: [obj(txb, tokenPolicy)],
  })
}

export function hasRuleConfigWithType(
  txb: TransactionBlock,
  typeArgs: [Type, Type, Type],
  tokenPolicy: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::has_rule_config_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(txb, tokenPolicy)],
  })
}

export interface AllowArgs {
  tokenPolicy: ObjectArg
  tokenPolicyCap: ObjectArg
  string: string | TransactionArgument
}

export function allow(txb: TransactionBlock, typeArg: Type, args: AllowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::allow`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.tokenPolicy),
      obj(txb, args.tokenPolicyCap),
      pure(txb, args.string, `0x1::string::String`),
    ],
  })
}

export interface DisallowArgs {
  tokenPolicy: ObjectArg
  tokenPolicyCap: ObjectArg
  string: string | TransactionArgument
}

export function disallow(txb: TransactionBlock, typeArg: Type, args: DisallowArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::disallow`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.tokenPolicy),
      obj(txb, args.tokenPolicyCap),
      pure(txb, args.string, `0x1::string::String`),
    ],
  })
}

export interface AddRuleForActionArgs {
  tokenPolicy: ObjectArg
  tokenPolicyCap: ObjectArg
  string: string | TransactionArgument
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
      obj(txb, args.tokenPolicy),
      obj(txb, args.tokenPolicyCap),
      pure(txb, args.string, `0x1::string::String`),
    ],
  })
}

export interface RemoveRuleForActionArgs {
  tokenPolicy: ObjectArg
  tokenPolicyCap: ObjectArg
  string: string | TransactionArgument
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
      obj(txb, args.tokenPolicy),
      obj(txb, args.tokenPolicyCap),
      pure(txb, args.string, `0x1::string::String`),
    ],
  })
}

export interface FlushArgs {
  tokenPolicy: ObjectArg
  treasuryCap: ObjectArg
}

export function flush(txb: TransactionBlock, typeArg: Type, args: FlushArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::flush`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tokenPolicy), obj(txb, args.treasuryCap)],
  })
}

export interface IsAllowedArgs {
  tokenPolicy: ObjectArg
  string: string | TransactionArgument
}

export function isAllowed(txb: TransactionBlock, typeArg: Type, args: IsAllowedArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::is_allowed`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tokenPolicy), pure(txb, args.string, `0x1::string::String`)],
  })
}

export interface RulesArgs {
  tokenPolicy: ObjectArg
  string: string | TransactionArgument
}

export function rules(txb: TransactionBlock, typeArg: Type, args: RulesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::rules`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.tokenPolicy), pure(txb, args.string, `0x1::string::String`)],
  })
}

export function spentBalance(txb: TransactionBlock, typeArg: Type, tokenPolicy: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::spent_balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, tokenPolicy)],
  })
}

export function transferAction(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::token::transfer_action`, arguments: [] })
}

export function spendAction(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::token::spend_action`, arguments: [] })
}

export function toCoinAction(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::token::to_coin_action`, arguments: [] })
}

export function fromCoinAction(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::token::from_coin_action`, arguments: [] })
}

export function action(txb: TransactionBlock, typeArg: Type, actionRequest: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::action`,
    typeArguments: [typeArg],
    arguments: [obj(txb, actionRequest)],
  })
}

export function amount(txb: TransactionBlock, typeArg: Type, actionRequest: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::amount`,
    typeArguments: [typeArg],
    arguments: [obj(txb, actionRequest)],
  })
}

export function recipient(txb: TransactionBlock, typeArg: Type, actionRequest: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::recipient`,
    typeArguments: [typeArg],
    arguments: [obj(txb, actionRequest)],
  })
}

export function approvals(txb: TransactionBlock, typeArg: Type, actionRequest: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::approvals`,
    typeArguments: [typeArg],
    arguments: [obj(txb, actionRequest)],
  })
}

export function spent(txb: TransactionBlock, typeArg: Type, actionRequest: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::token::spent`,
    typeArguments: [typeArg],
    arguments: [obj(txb, actionRequest)],
  })
}
