import { PUBLISHED_AT } from '..'
import { String } from '../../_dependencies/source/0x1/string/structs'
import { obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface RemoveArgs {
  self: TransactionObjectInput
  name: string | TransactionArgument
}

export function remove(tx: Transaction, typeArg: string, args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.name, `${String.$typeName}`)],
  })
}

export function new_(tx: Transaction, typeArg: string, pub: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::new`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

export function version(tx: Transaction, typeArg: string, d: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::version`,
    typeArguments: [typeArg],
    arguments: [obj(tx, d)],
  })
}

export interface AddArgs {
  self: TransactionObjectInput
  name: string | TransactionArgument
  value: string | TransactionArgument
}

export function add(tx: Transaction, typeArg: string, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::add`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.name, `${String.$typeName}`),
      pure(tx, args.value, `${String.$typeName}`),
    ],
  })
}

export interface AddInternalArgs {
  display: TransactionObjectInput
  name: string | TransactionArgument
  value: string | TransactionArgument
}

export function addInternal(tx: Transaction, typeArg: string, args: AddInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::add_internal`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.display),
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
    target: `${PUBLISHED_AT}::display::add_multiple`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.fields, `vector<${String.$typeName}>`),
      pure(tx, args.values, `vector<${String.$typeName}>`),
    ],
  })
}

export function fields(tx: Transaction, typeArg: string, d: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::fields`,
    typeArguments: [typeArg],
    arguments: [obj(tx, d)],
  })
}

export function createAndKeep(tx: Transaction, typeArg: string, pub: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::create_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

export function createInternal(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::create_internal`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface EditArgs {
  self: TransactionObjectInput
  name: string | TransactionArgument
  value: string | TransactionArgument
}

export function edit(tx: Transaction, typeArg: string, args: EditArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::edit`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.name, `${String.$typeName}`),
      pure(tx, args.value, `${String.$typeName}`),
    ],
  })
}

export function isAuthorized(tx: Transaction, typeArg: string, pub: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::is_authorized`,
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
    target: `${PUBLISHED_AT}::display::new_with_fields`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.pub),
      pure(tx, args.fields, `vector<${String.$typeName}>`),
      pure(tx, args.values, `vector<${String.$typeName}>`),
    ],
  })
}

export function updateVersion(tx: Transaction, typeArg: string, display: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::update_version`,
    typeArguments: [typeArg],
    arguments: [obj(tx, display)],
  })
}
