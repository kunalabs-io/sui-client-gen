import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function default_(txb: TransactionBlock, typeArg: string, pub: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::default`,
    typeArguments: [typeArg],
    arguments: [obj(txb, pub)],
  })
}

export function new_(txb: TransactionBlock, typeArg: string, pub: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::new`,
    typeArguments: [typeArg],
    arguments: [obj(txb, pub)],
  })
}

export function uid(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::uid`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface AddReceiptArgs {
  rule: GenericArg
  request: ObjectArg
}

export function addReceipt(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: AddReceiptArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::add_receipt`,
    typeArguments: typeArgs,
    arguments: [generic(txb, `${typeArgs[1]}`, args.rule), obj(txb, args.request)],
  })
}

export interface AddRuleArgs {
  rule: GenericArg
  policy: ObjectArg
  cap: ObjectArg
  cfg: GenericArg
}

export function addRule(
  txb: TransactionBlock,
  typeArgs: [string, string, string],
  args: AddRuleArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::add_rule`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[1]}`, args.rule),
      obj(txb, args.policy),
      obj(txb, args.cap),
      generic(txb, `${typeArgs[2]}`, args.cfg),
    ],
  })
}

export interface AddToBalanceArgs {
  rule: GenericArg
  policy: ObjectArg
  coin: ObjectArg
}

export function addToBalance(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: AddToBalanceArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::add_to_balance`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[1]}`, args.rule),
      obj(txb, args.policy),
      obj(txb, args.coin),
    ],
  })
}

export interface ConfirmRequestArgs {
  self: ObjectArg
  request: ObjectArg
}

export function confirmRequest(txb: TransactionBlock, typeArg: string, args: ConfirmRequestArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::confirm_request`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.request)],
  })
}

export interface DestroyAndWithdrawArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function destroyAndWithdraw(
  txb: TransactionBlock,
  typeArg: string,
  args: DestroyAndWithdrawArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::destroy_and_withdraw`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export function from(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::from`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface GetRuleArgs {
  rule: GenericArg
  policy: ObjectArg
}

export function getRule(
  txb: TransactionBlock,
  typeArgs: [string, string, string],
  args: GetRuleArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::get_rule`,
    typeArguments: typeArgs,
    arguments: [generic(txb, `${typeArgs[1]}`, args.rule), obj(txb, args.policy)],
  })
}

export function hasRule(txb: TransactionBlock, typeArgs: [string, string], policy: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::has_rule`,
    typeArguments: typeArgs,
    arguments: [obj(txb, policy)],
  })
}

export function item(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::item`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface NewRequestArgs {
  item: string | TransactionArgument
  paid: bigint | TransactionArgument
  from: string | TransactionArgument
}

export function newRequest(txb: TransactionBlock, typeArg: string, args: NewRequestArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::new_request`,
    typeArguments: [typeArg],
    arguments: [
      pure(txb, args.item, `0x2::object::ID`),
      pure(txb, args.paid, `u64`),
      pure(txb, args.from, `0x2::object::ID`),
    ],
  })
}

export function paid(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::paid`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface RemoveRuleArgs {
  policy: ObjectArg
  cap: ObjectArg
}

export function removeRule(
  txb: TransactionBlock,
  typeArgs: [string, string, string],
  args: RemoveRuleArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::remove_rule`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.policy), obj(txb, args.cap)],
  })
}

export function rules(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::rules`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export interface UidMutAsOwnerArgs {
  self: ObjectArg
  cap: ObjectArg
}

export function uidMutAsOwner(txb: TransactionBlock, typeArg: string, args: UidMutAsOwnerArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::uid_mut_as_owner`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.cap)],
  })
}

export interface WithdrawArgs {
  self: ObjectArg
  cap: ObjectArg
  amount: bigint | TransactionArgument | TransactionArgument | null
}

export function withdraw(txb: TransactionBlock, typeArg: string, args: WithdrawArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::withdraw`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      obj(txb, args.cap),
      pure(txb, args.amount, `0x1::option::Option<u64>`),
    ],
  })
}
