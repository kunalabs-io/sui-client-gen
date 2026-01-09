import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { String } from '../../std/string/structs'

/**
 * Create an empty Display object. It can either be shared empty or filled
 * with data right away via cheaper `set_owned` method.
 */
export function new_(
  tx: Transaction,
  typeArg: string,
  pub: TransactionObjectInput,
): TransactionResult {
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

/** Create a new Display<T> object with a set of fields. */
export function newWithFields(
  tx: Transaction,
  typeArg: string,
  args: NewWithFieldsArgs,
): TransactionResult {
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

/** Create a new empty Display<T> object and keep it. */
export function createAndKeep(
  tx: Transaction,
  typeArg: string,
  pub: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::create_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

/** Manually bump the version and emit an event with the updated version's contents. */
export function updateVersion(
  tx: Transaction,
  typeArg: string,
  display: TransactionObjectInput,
): TransactionResult {
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

/** Sets a custom `name` field with the `value`. */
export function add(tx: Transaction, typeArg: string, args: AddArgs): TransactionResult {
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

/** Sets multiple `fields` with `values`. */
export function addMultiple(
  tx: Transaction,
  typeArg: string,
  args: AddMultipleArgs,
): TransactionResult {
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

/**
 * Change the value of the field.
 * TODO (long run): version changes;
 */
export function edit(tx: Transaction, typeArg: string, args: EditArgs): TransactionResult {
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

/** Remove the key from the Display. */
export function remove(tx: Transaction, typeArg: string, args: RemoveArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::remove`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.self),
      pure(tx, args.name, `${String.$typeName}`),
    ],
  })
}

/** Authorization check; can be performed externally to implement protection rules for Display. */
export function isAuthorized(
  tx: Transaction,
  typeArg: string,
  pub: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::is_authorized`,
    typeArguments: [typeArg],
    arguments: [obj(tx, pub)],
  })
}

/** Read the `version` field. */
export function version(
  tx: Transaction,
  typeArg: string,
  d: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::version`,
    typeArguments: [typeArg],
    arguments: [obj(tx, d)],
  })
}

/** Read the `fields` field. */
export function fields(
  tx: Transaction,
  typeArg: string,
  d: TransactionObjectInput,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('sui')}::display::fields`,
    typeArguments: [typeArg],
    arguments: [obj(tx, d)],
  })
}

/** Internal function to create a new `Display<T>`. */
export function createInternal(tx: Transaction, typeArg: string): TransactionResult {
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

/** Private method for inserting fields without security checks. */
export function addInternal(
  tx: Transaction,
  typeArg: string,
  args: AddInternalArgs,
): TransactionResult {
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
