import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, option, pure } from '../../_framework/util'
import { Option } from '../../move-stdlib-chain/option/structs'
import { String } from '../../move-stdlib-chain/string/structs'
import { Balance } from '../balance/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function sender(tx: Transaction, typeArg: string, actionRequest: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::sender`,
    typeArguments: [typeArg],
    arguments: [obj(tx, actionRequest)],
  })
}

export function value(tx: Transaction, typeArg: string, token: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, token)],
  })
}

export function zero(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface JoinArgs {
  token1: TransactionObjectInput
  token2: TransactionObjectInput
}

export function join(tx: Transaction, typeArg: string, args: JoinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::join`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.token1), obj(tx, args.token2)],
  })
}

export interface SplitArgs {
  token: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function split(tx: Transaction, typeArg: string, args: SplitArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.token), pure(tx, args.u64, `u64`)],
  })
}

export function destroyZero(tx: Transaction, typeArg: string, token: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(tx, token)],
  })
}

export interface TransferArgs {
  token: TransactionObjectInput
  address: string | TransactionArgument
}

export function transfer(tx: Transaction, typeArg: string, args: TransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::transfer`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.token), pure(tx, args.address, `address`)],
  })
}

export function key(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::key`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface MintArgs {
  treasuryCap: TransactionObjectInput
  u64: bigint | TransactionArgument
}

export function mint(tx: Transaction, typeArg: string, args: MintArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::mint`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.treasuryCap), pure(tx, args.u64, `u64`)],
  })
}

export interface BurnArgs {
  treasuryCap: TransactionObjectInput
  token: TransactionObjectInput
}

export function burn(tx: Transaction, typeArg: string, args: BurnArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::burn`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.treasuryCap), obj(tx, args.token)],
  })
}

export function keep(tx: Transaction, typeArg: string, token: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, token)],
  })
}

export function newPolicy(tx: Transaction, typeArg: string, treasuryCap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::new_policy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasuryCap)],
  })
}

export function sharePolicy(tx: Transaction, typeArg: string, tokenPolicy: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::share_policy`,
    typeArguments: [typeArg],
    arguments: [obj(tx, tokenPolicy)],
  })
}

export function spend(tx: Transaction, typeArg: string, token: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::spend`,
    typeArguments: [typeArg],
    arguments: [obj(tx, token)],
  })
}

export function toCoin(tx: Transaction, typeArg: string, token: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::to_coin`,
    typeArguments: [typeArg],
    arguments: [obj(tx, token)],
  })
}

export function fromCoin(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::from_coin`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export interface NewRequestArgs {
  string: string | TransactionArgument
  u64: bigint | TransactionArgument
  option1: string | TransactionArgument | TransactionArgument | null
  option2: TransactionObjectInput | TransactionArgument | null
}

export function newRequest(tx: Transaction, typeArg: string, args: NewRequestArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::new_request`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.string, `${String.$typeName}`),
      pure(tx, args.u64, `u64`),
      pure(tx, args.option1, `${Option.$typeName}<address>`),
      option(tx, `${Balance.$typeName}<${typeArg}>`, args.option2),
    ],
  })
}

export interface ConfirmRequestArgs {
  tokenPolicy: TransactionObjectInput
  actionRequest: TransactionObjectInput
}

export function confirmRequest(tx: Transaction, typeArg: string, args: ConfirmRequestArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_request`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tokenPolicy), obj(tx, args.actionRequest)],
  })
}

export interface ConfirmRequestMutArgs {
  tokenPolicy: TransactionObjectInput
  actionRequest: TransactionObjectInput
}

export function confirmRequestMut(tx: Transaction, typeArg: string, args: ConfirmRequestMutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_request_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tokenPolicy), obj(tx, args.actionRequest)],
  })
}

export interface ConfirmWithPolicyCapArgs {
  tokenPolicyCap: TransactionObjectInput
  actionRequest: TransactionObjectInput
}

export function confirmWithPolicyCap(
  tx: Transaction,
  typeArg: string,
  args: ConfirmWithPolicyCapArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_with_policy_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tokenPolicyCap), obj(tx, args.actionRequest)],
  })
}

export interface ConfirmWithTreasuryCapArgs {
  treasuryCap: TransactionObjectInput
  actionRequest: TransactionObjectInput
}

export function confirmWithTreasuryCap(
  tx: Transaction,
  typeArg: string,
  args: ConfirmWithTreasuryCapArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::confirm_with_treasury_cap`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.treasuryCap), obj(tx, args.actionRequest)],
  })
}

export interface AddApprovalArgs {
  t1: GenericArg
  actionRequest: TransactionObjectInput
}

export function addApproval(tx: Transaction, typeArgs: [string, string], args: AddApprovalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::add_approval`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.t1), obj(tx, args.actionRequest)],
  })
}

export interface AddRuleConfigArgs {
  t1: GenericArg
  tokenPolicy: TransactionObjectInput
  tokenPolicyCap: TransactionObjectInput
  t2: GenericArg
}

export function addRuleConfig(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: AddRuleConfigArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::add_rule_config`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[1]}`, args.t1),
      obj(tx, args.tokenPolicy),
      obj(tx, args.tokenPolicyCap),
      generic(tx, `${typeArgs[2]}`, args.t2),
    ],
  })
}

export interface RuleConfigArgs {
  t1: GenericArg
  tokenPolicy: TransactionObjectInput
}

export function ruleConfig(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RuleConfigArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::rule_config`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.t1), obj(tx, args.tokenPolicy)],
  })
}

export interface RuleConfigMutArgs {
  t1: GenericArg
  tokenPolicy: TransactionObjectInput
  tokenPolicyCap: TransactionObjectInput
}

export function ruleConfigMut(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RuleConfigMutArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::rule_config_mut`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[1]}`, args.t1),
      obj(tx, args.tokenPolicy),
      obj(tx, args.tokenPolicyCap),
    ],
  })
}

export interface RemoveRuleConfigArgs {
  tokenPolicy: TransactionObjectInput
  tokenPolicyCap: TransactionObjectInput
}

export function removeRuleConfig(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RemoveRuleConfigArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::remove_rule_config`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.tokenPolicy), obj(tx, args.tokenPolicyCap)],
  })
}

export function hasRuleConfig(
  tx: Transaction,
  typeArgs: [string, string],
  tokenPolicy: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::has_rule_config`,
    typeArguments: typeArgs,
    arguments: [obj(tx, tokenPolicy)],
  })
}

export function hasRuleConfigWithType(
  tx: Transaction,
  typeArgs: [string, string, string],
  tokenPolicy: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::has_rule_config_with_type`,
    typeArguments: typeArgs,
    arguments: [obj(tx, tokenPolicy)],
  })
}

export interface AllowArgs {
  tokenPolicy: TransactionObjectInput
  tokenPolicyCap: TransactionObjectInput
  string: string | TransactionArgument
}

export function allow(tx: Transaction, typeArg: string, args: AllowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::allow`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.tokenPolicy),
      obj(tx, args.tokenPolicyCap),
      pure(tx, args.string, `${String.$typeName}`),
    ],
  })
}

export interface DisallowArgs {
  tokenPolicy: TransactionObjectInput
  tokenPolicyCap: TransactionObjectInput
  string: string | TransactionArgument
}

export function disallow(tx: Transaction, typeArg: string, args: DisallowArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::disallow`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.tokenPolicy),
      obj(tx, args.tokenPolicyCap),
      pure(tx, args.string, `${String.$typeName}`),
    ],
  })
}

export interface AddRuleForActionArgs {
  tokenPolicy: TransactionObjectInput
  tokenPolicyCap: TransactionObjectInput
  string: string | TransactionArgument
}

export function addRuleForAction(
  tx: Transaction,
  typeArgs: [string, string],
  args: AddRuleForActionArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::add_rule_for_action`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.tokenPolicy),
      obj(tx, args.tokenPolicyCap),
      pure(tx, args.string, `${String.$typeName}`),
    ],
  })
}

export interface RemoveRuleForActionArgs {
  tokenPolicy: TransactionObjectInput
  tokenPolicyCap: TransactionObjectInput
  string: string | TransactionArgument
}

export function removeRuleForAction(
  tx: Transaction,
  typeArgs: [string, string],
  args: RemoveRuleForActionArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::remove_rule_for_action`,
    typeArguments: typeArgs,
    arguments: [
      obj(tx, args.tokenPolicy),
      obj(tx, args.tokenPolicyCap),
      pure(tx, args.string, `${String.$typeName}`),
    ],
  })
}

export interface FlushArgs {
  tokenPolicy: TransactionObjectInput
  treasuryCap: TransactionObjectInput
}

export function flush(tx: Transaction, typeArg: string, args: FlushArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::flush`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tokenPolicy), obj(tx, args.treasuryCap)],
  })
}

export interface IsAllowedArgs {
  tokenPolicy: TransactionObjectInput
  string: string | TransactionArgument
}

export function isAllowed(tx: Transaction, typeArg: string, args: IsAllowedArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::is_allowed`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tokenPolicy), pure(tx, args.string, `${String.$typeName}`)],
  })
}

export interface RulesArgs {
  tokenPolicy: TransactionObjectInput
  string: string | TransactionArgument
}

export function rules(tx: Transaction, typeArg: string, args: RulesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::rules`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.tokenPolicy), pure(tx, args.string, `${String.$typeName}`)],
  })
}

export function spentBalance(
  tx: Transaction,
  typeArg: string,
  tokenPolicy: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::spent_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, tokenPolicy)],
  })
}

export function transferAction(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::token::transfer_action`, arguments: [] })
}

export function spendAction(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::token::spend_action`, arguments: [] })
}

export function toCoinAction(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::token::to_coin_action`, arguments: [] })
}

export function fromCoinAction(tx: Transaction) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::token::from_coin_action`, arguments: [] })
}

export function action(tx: Transaction, typeArg: string, actionRequest: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::action`,
    typeArguments: [typeArg],
    arguments: [obj(tx, actionRequest)],
  })
}

export function amount(tx: Transaction, typeArg: string, actionRequest: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::amount`,
    typeArguments: [typeArg],
    arguments: [obj(tx, actionRequest)],
  })
}

export function recipient(tx: Transaction, typeArg: string, actionRequest: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::recipient`,
    typeArguments: [typeArg],
    arguments: [obj(tx, actionRequest)],
  })
}

export function approvals(tx: Transaction, typeArg: string, actionRequest: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::approvals`,
    typeArguments: [typeArg],
    arguments: [obj(tx, actionRequest)],
  })
}

export function spent(tx: Transaction, typeArg: string, actionRequest: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::token::spent`,
    typeArguments: [typeArg],
    arguments: [obj(tx, actionRequest)],
  })
}
