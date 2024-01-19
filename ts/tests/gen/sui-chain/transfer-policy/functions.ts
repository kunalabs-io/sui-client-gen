import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock, typeArg: string, publisher: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::new`,
    typeArguments: [typeArg],
    arguments: [obj(txb, publisher)],
  })
}

export function uid(txb: TransactionBlock, typeArg: string, transferPolicy: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::uid`,
    typeArguments: [typeArg],
    arguments: [obj(txb, transferPolicy)],
  })
}

export interface NewRequestArgs {
  id1: string | TransactionArgument
  u64: bigint | TransactionArgument
  id2: string | TransactionArgument
}

export function newRequest(txb: TransactionBlock, typeArg: string, args: NewRequestArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::new_request`,
    typeArguments: [typeArg],
    arguments: [
      pure(txb, args.id1, `0x2::object::ID`),
      pure(txb, args.u64, `u64`),
      pure(txb, args.id2, `0x2::object::ID`),
    ],
  })
}

export interface ConfirmRequestArgs {
  transferPolicy: ObjectArg
  transferRequest: ObjectArg
}

export function confirmRequest(txb: TransactionBlock, typeArg: string, args: ConfirmRequestArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::confirm_request`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.transferPolicy), obj(txb, args.transferRequest)],
  })
}

export function rules(txb: TransactionBlock, typeArg: string, transferPolicy: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::rules`,
    typeArguments: [typeArg],
    arguments: [obj(txb, transferPolicy)],
  })
}

export function default_(txb: TransactionBlock, typeArg: string, publisher: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::default`,
    typeArguments: [typeArg],
    arguments: [obj(txb, publisher)],
  })
}

export interface WithdrawArgs {
  transferPolicy: ObjectArg
  transferPolicyCap: ObjectArg
  option: bigint | TransactionArgument | TransactionArgument | null
}

export function withdraw(txb: TransactionBlock, typeArg: string, args: WithdrawArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::withdraw`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.transferPolicy),
      obj(txb, args.transferPolicyCap),
      pure(txb, args.option, `0x1::option::Option<u64>`),
    ],
  })
}

export interface DestroyAndWithdrawArgs {
  transferPolicy: ObjectArg
  transferPolicyCap: ObjectArg
}

export function destroyAndWithdraw(
  txb: TransactionBlock,
  typeArg: string,
  args: DestroyAndWithdrawArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::destroy_and_withdraw`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.transferPolicy), obj(txb, args.transferPolicyCap)],
  })
}

export interface AddRuleArgs {
  t1: GenericArg
  transferPolicy: ObjectArg
  transferPolicyCap: ObjectArg
  t2: GenericArg
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
      generic(txb, `${typeArgs[1]}`, args.t1),
      obj(txb, args.transferPolicy),
      obj(txb, args.transferPolicyCap),
      generic(txb, `${typeArgs[2]}`, args.t2),
    ],
  })
}

export interface GetRuleArgs {
  t1: GenericArg
  transferPolicy: ObjectArg
}

export function getRule(
  txb: TransactionBlock,
  typeArgs: [string, string, string],
  args: GetRuleArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::get_rule`,
    typeArguments: typeArgs,
    arguments: [generic(txb, `${typeArgs[1]}`, args.t1), obj(txb, args.transferPolicy)],
  })
}

export interface AddToBalanceArgs {
  t1: GenericArg
  transferPolicy: ObjectArg
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
      generic(txb, `${typeArgs[1]}`, args.t1),
      obj(txb, args.transferPolicy),
      obj(txb, args.coin),
    ],
  })
}

export interface AddReceiptArgs {
  t1: GenericArg
  transferRequest: ObjectArg
}

export function addReceipt(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: AddReceiptArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::add_receipt`,
    typeArguments: typeArgs,
    arguments: [generic(txb, `${typeArgs[1]}`, args.t1), obj(txb, args.transferRequest)],
  })
}

export function hasRule(
  txb: TransactionBlock,
  typeArgs: [string, string],
  transferPolicy: ObjectArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::has_rule`,
    typeArguments: typeArgs,
    arguments: [obj(txb, transferPolicy)],
  })
}

export interface RemoveRuleArgs {
  transferPolicy: ObjectArg
  transferPolicyCap: ObjectArg
}

export function removeRule(
  txb: TransactionBlock,
  typeArgs: [string, string, string],
  args: RemoveRuleArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::remove_rule`,
    typeArguments: typeArgs,
    arguments: [obj(txb, args.transferPolicy), obj(txb, args.transferPolicyCap)],
  })
}

export interface UidMutAsOwnerArgs {
  transferPolicy: ObjectArg
  transferPolicyCap: ObjectArg
}

export function uidMutAsOwner(txb: TransactionBlock, typeArg: string, args: UidMutAsOwnerArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::uid_mut_as_owner`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.transferPolicy), obj(txb, args.transferPolicyCap)],
  })
}

export function item(txb: TransactionBlock, typeArg: string, transferRequest: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::item`,
    typeArguments: [typeArg],
    arguments: [obj(txb, transferRequest)],
  })
}

export function paid(txb: TransactionBlock, typeArg: string, transferRequest: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::paid`,
    typeArguments: [typeArg],
    arguments: [obj(txb, transferRequest)],
  })
}

export function from(txb: TransactionBlock, typeArg: string, transferRequest: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::from`,
    typeArguments: [typeArg],
    arguments: [obj(txb, transferRequest)],
  })
}
