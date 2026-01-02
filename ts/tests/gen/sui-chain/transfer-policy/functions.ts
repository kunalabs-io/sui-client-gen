import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Option } from '../../move-stdlib-chain/option/structs'
import { ID } from '../object/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface NewRequestArgs {
  id1: string | TransactionArgument
  u64: bigint | TransactionArgument
  id2: string | TransactionArgument
}

export function newRequest(tx: Transaction, typeArg: string, args: NewRequestArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::new_request`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.id1, `${ID.$typeName}`),
      pure(tx, args.u64, `u64`),
      pure(tx, args.id2, `${ID.$typeName}`),
    ],
  })
}

export function new_(tx: Transaction, typeArg: string, publisher: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::new`,
    typeArguments: [typeArg],
    arguments: [obj(tx, publisher)],
  })
}

export function default_(tx: Transaction, typeArg: string, publisher: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::default`,
    typeArguments: [typeArg],
    arguments: [obj(tx, publisher)],
  })
}

export interface WithdrawArgs {
  transferPolicy: TransactionObjectInput
  transferPolicyCap: TransactionObjectInput
  option: bigint | TransactionArgument | null
}

export function withdraw(tx: Transaction, typeArg: string, args: WithdrawArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::withdraw`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.transferPolicy),
      obj(tx, args.transferPolicyCap),
      pure(tx, args.option, `${Option.$typeName}<u64>`),
    ],
  })
}

export interface DestroyAndWithdrawArgs {
  transferPolicy: TransactionObjectInput
  transferPolicyCap: TransactionObjectInput
}

export function destroyAndWithdraw(tx: Transaction, typeArg: string, args: DestroyAndWithdrawArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::destroy_and_withdraw`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.transferPolicy), obj(tx, args.transferPolicyCap)],
  })
}

export interface ConfirmRequestArgs {
  transferPolicy: TransactionObjectInput
  transferRequest: TransactionObjectInput
}

export function confirmRequest(tx: Transaction, typeArg: string, args: ConfirmRequestArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::confirm_request`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.transferPolicy), obj(tx, args.transferRequest)],
  })
}

export interface AddRuleArgs {
  t1: GenericArg
  transferPolicy: TransactionObjectInput
  transferPolicyCap: TransactionObjectInput
  t2: GenericArg
}

export function addRule(tx: Transaction, typeArgs: [string, string, string], args: AddRuleArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::add_rule`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[1]}`, args.t1),
      obj(tx, args.transferPolicy),
      obj(tx, args.transferPolicyCap),
      generic(tx, `${typeArgs[2]}`, args.t2),
    ],
  })
}

export interface GetRuleArgs {
  t1: GenericArg
  transferPolicy: TransactionObjectInput
}

export function getRule(tx: Transaction, typeArgs: [string, string, string], args: GetRuleArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::get_rule`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.t1), obj(tx, args.transferPolicy)],
  })
}

export interface AddToBalanceArgs {
  t1: GenericArg
  transferPolicy: TransactionObjectInput
  coin: TransactionObjectInput
}

export function addToBalance(tx: Transaction, typeArgs: [string, string], args: AddToBalanceArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::add_to_balance`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[1]}`, args.t1),
      obj(tx, args.transferPolicy),
      obj(tx, args.coin),
    ],
  })
}

export interface AddReceiptArgs {
  t1: GenericArg
  transferRequest: TransactionObjectInput
}

export function addReceipt(tx: Transaction, typeArgs: [string, string], args: AddReceiptArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::add_receipt`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[1]}`, args.t1), obj(tx, args.transferRequest)],
  })
}

export function hasRule(
  tx: Transaction,
  typeArgs: [string, string],
  transferPolicy: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::has_rule`,
    typeArguments: typeArgs,
    arguments: [obj(tx, transferPolicy)],
  })
}

export interface RemoveRuleArgs {
  transferPolicy: TransactionObjectInput
  transferPolicyCap: TransactionObjectInput
}

export function removeRule(
  tx: Transaction,
  typeArgs: [string, string, string],
  args: RemoveRuleArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::remove_rule`,
    typeArguments: typeArgs,
    arguments: [obj(tx, args.transferPolicy), obj(tx, args.transferPolicyCap)],
  })
}

export function uid(tx: Transaction, typeArg: string, transferPolicy: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::uid`,
    typeArguments: [typeArg],
    arguments: [obj(tx, transferPolicy)],
  })
}

export interface UidMutAsOwnerArgs {
  transferPolicy: TransactionObjectInput
  transferPolicyCap: TransactionObjectInput
}

export function uidMutAsOwner(tx: Transaction, typeArg: string, args: UidMutAsOwnerArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::uid_mut_as_owner`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.transferPolicy), obj(tx, args.transferPolicyCap)],
  })
}

export function rules(tx: Transaction, typeArg: string, transferPolicy: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::rules`,
    typeArguments: [typeArg],
    arguments: [obj(tx, transferPolicy)],
  })
}

export function item(tx: Transaction, typeArg: string, transferRequest: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::item`,
    typeArguments: [typeArg],
    arguments: [obj(tx, transferRequest)],
  })
}

export function paid(tx: Transaction, typeArg: string, transferRequest: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::paid`,
    typeArguments: [typeArg],
    arguments: [obj(tx, transferRequest)],
  })
}

export function from(tx: Transaction, typeArg: string, transferRequest: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::transfer_policy::from`,
    typeArguments: [typeArg],
    arguments: [obj(tx, transferRequest)],
  })
}
