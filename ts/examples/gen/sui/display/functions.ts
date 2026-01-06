import { String } from '../../_dependencies/std/string/structs'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction, typeArg: string, pub: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::new`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

export interface NewWithFieldsArgs {
  pub: TransactionObjectInput
  fields: Array<string | TransactionArgument> | TransactionArgument
  values: Array<string | TransactionArgument> | TransactionArgument
}

export function newWithFields(tx: Transaction, typeArg: string, args: NewWithFieldsArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::new_with_fields`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.pub),
      pure(tx, args.fields, `vector<${String.$typeName}>`),
      pure(tx, args.values, `vector<${String.$typeName}>`),
    ],
  })
}

export function createAndKeep(tx: Transaction, typeArg: string, pub: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::create_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

export function updateVersion(tx: Transaction, typeArg: string, display: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::update_version`,
    typeArguments: [typeArg],
    arguments: [obj(tx, display)],
  })
}

export interface AddArgs {
  self: TransactionObjectInput
  name: string | TransactionArgument
  value: string | TransactionArgument
}

export function add(tx: Transaction, typeArg: string, args: AddArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::add`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.name, `${String.$typeName}`),
      pure(tx, args.value, `${String.$typeName}`),
    ],
  })
}

export interface AddMultipleArgs {
  self: TransactionObjectInput
  fields: Array<string | TransactionArgument> | TransactionArgument
  values: Array<string | TransactionArgument> | TransactionArgument
}

export function addMultiple(tx: Transaction, typeArg: string, args: AddMultipleArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::add_multiple`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.fields, `vector<${String.$typeName}>`),
      pure(tx, args.values, `vector<${String.$typeName}>`),
    ],
  })
}

export interface EditArgs {
  self: TransactionObjectInput
  name: string | TransactionArgument
  value: string | TransactionArgument
}

export function edit(tx: Transaction, typeArg: string, args: EditArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::edit`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.name, `${String.$typeName}`),
      pure(tx, args.value, `${String.$typeName}`),
    ],
  })
}

export interface RemoveArgs {
  self: TransactionObjectInput
  name: string | TransactionArgument
}

export function remove(tx: Transaction, typeArg: string, args: RemoveArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.name, `${String.$typeName}`)],
  })
}

export function isAuthorized(tx: Transaction, typeArg: string, pub: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::is_authorized`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

export function version(tx: Transaction, typeArg: string, d: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::version`,
    typeArguments: [typeArg],
    arguments: [obj(tx, d)],
  })
}

export function fields(tx: Transaction, typeArg: string, d: TransactionObjectInput) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::fields`,
    typeArguments: [typeArg],
    arguments: [obj(tx, d)],
  })
}

export function createInternal(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::create_internal`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface AddInternalArgs {
  display: TransactionObjectInput
  name: string | TransactionArgument
  value: string | TransactionArgument
}

export function addInternal(tx: Transaction, typeArg: string, args: AddInternalArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::add_internal`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.display),
      pure(tx, args.name, `${String.$typeName}`),
      pure(tx, args.value, `${String.$typeName}`),
    ],
  })
}
