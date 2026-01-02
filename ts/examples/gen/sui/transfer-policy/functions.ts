import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Option } from '../../move-stdlib/option/structs'
import { ID } from '../object/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface NewRequestArgs {
  item: string | TransactionArgument
  paid: bigint | TransactionArgument
  from: string | TransactionArgument
}

export function newRequest(tx: Transaction, typeArg: string, args: NewRequestArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::new_request`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.item, `${ID.$typeName}`),
      pure(tx, args.paid, `u64`),
      pure(tx, args.from, `${ID.$typeName}`),
    ],
  })
}

export function new_(tx: Transaction, typeArg: string, pub: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::new`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

export function default_(tx: Transaction, typeArg: string, pub: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::default`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

export interface WithdrawArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
  amount: bigint | TransactionArgument | null
}

export function withdraw(tx: Transaction, typeArg: string, args: WithdrawArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::withdraw`,
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

export function destroyAndWithdraw(tx: Transaction, typeArg: string, args: DestroyAndWithdrawArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::destroy_and_withdraw`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export interface ConfirmRequestArgs {
  self: TransactionObjectInput
  request: TransactionObjectInput
}

export function confirmRequest(tx: Transaction, typeArg: string, args: ConfirmRequestArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::confirm_request`,
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

export function addRule(tx: Transaction, typeArgs: [string, string, string], args: AddRuleArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::add_rule`,
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

export function getRule(tx: Transaction, typeArgs: [string, string, string], args: GetRuleArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::get_rule`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.rule), obj(tx, args.policy)],
  })
}

export interface AddToBalanceArgs {
  rule: GenericArg
  policy: TransactionObjectInput
  coin: TransactionObjectInput
}

export function addToBalance(tx: Transaction, typeArgs: [string, string], args: AddToBalanceArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::add_to_balance`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.rule), obj(tx, args.policy), obj(tx, args.coin)],
  })
}

export interface AddReceiptArgs {
  rule: GenericArg
  request: TransactionObjectInput
}

export function addReceipt(tx: Transaction, typeArgs: [string, string], args: AddReceiptArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::add_receipt`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.rule), obj(tx, args.request)],
  })
}

export function hasRule(
  tx: Transaction,
  typeArgs: [string, string],
  policy: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::has_rule`,
    typeArguments: typeArgs,
    arguments: [obj(tx, policy)],
  })
}

export interface RemoveRuleArgs {
  policy: TransactionObjectInput
  cap: TransactionObjectInput
}

export function removeRule(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RemoveRuleArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::remove_rule`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.policy), obj(tx, args.cap)],
  })
}

export function uid(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::uid`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export interface UidMutAsOwnerArgs {
  self: TransactionObjectInput
  cap: TransactionObjectInput
}

export function uidMutAsOwner(tx: Transaction, typeArg: string, args: UidMutAsOwnerArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::uid_mut_as_owner`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.cap)],
  })
}

export function rules(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::rules`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function item(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::item`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function paid(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::paid`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function from(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::from`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}
