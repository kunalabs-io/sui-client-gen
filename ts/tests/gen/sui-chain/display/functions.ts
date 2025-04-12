import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { String } from '../../move-stdlib-chain/string/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function new_(tx: Transaction, typeArg: string, publisher: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::new`,
    typeArguments: [typeArg],
    arguments: [obj(tx, publisher)],
  })
}

export interface NewWithFieldsArgs {
  publisher: TransactionObjectInput
  vecString1: Array<string | TransactionArgument> | TransactionArgument
  vecString2: Array<string | TransactionArgument> | TransactionArgument
}

export function newWithFields(tx: Transaction, typeArg: string, args: NewWithFieldsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::new_with_fields`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.publisher),
      pure(tx, args.vecString1, `vector<${String.$typeName}>`),
      pure(tx, args.vecString2, `vector<${String.$typeName}>`),
    ],
  })
}

export function createAndKeep(tx: Transaction, typeArg: string, publisher: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::create_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(tx, publisher)],
  })
}

export function updateVersion(tx: Transaction, typeArg: string, display: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::update_version`,
    typeArguments: [typeArg],
    arguments: [obj(tx, display)],
  })
}

export interface AddArgs {
  display: TransactionObjectInput
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function add(tx: Transaction, typeArg: string, args: AddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::add`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.display),
      pure(tx, args.string1, `${String.$typeName}`),
      pure(tx, args.string2, `${String.$typeName}`),
    ],
  })
}

export interface AddMultipleArgs {
  display: TransactionObjectInput
  vecString1: Array<string | TransactionArgument> | TransactionArgument
  vecString2: Array<string | TransactionArgument> | TransactionArgument
}

export function addMultiple(tx: Transaction, typeArg: string, args: AddMultipleArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::add_multiple`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.display),
      pure(tx, args.vecString1, `vector<${String.$typeName}>`),
      pure(tx, args.vecString2, `vector<${String.$typeName}>`),
    ],
  })
}

export interface EditArgs {
  display: TransactionObjectInput
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function edit(tx: Transaction, typeArg: string, args: EditArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::edit`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.display),
      pure(tx, args.string1, `${String.$typeName}`),
      pure(tx, args.string2, `${String.$typeName}`),
    ],
  })
}

export interface RemoveArgs {
  display: TransactionObjectInput
  string: string | TransactionArgument
}

export function remove(tx: Transaction, typeArg: string, args: RemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.display), pure(tx, args.string, `${String.$typeName}`)],
  })
}

export function isAuthorized(tx: Transaction, typeArg: string, publisher: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::is_authorized`,
    typeArguments: [typeArg],
    arguments: [obj(tx, publisher)],
  })
}

export function version(tx: Transaction, typeArg: string, display: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::version`,
    typeArguments: [typeArg],
    arguments: [obj(tx, display)],
  })
}

export function fields(tx: Transaction, typeArg: string, display: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::fields`,
    typeArguments: [typeArg],
    arguments: [obj(tx, display)],
  })
}

export function createInternal(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::create_internal`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface AddInternalArgs {
  display: TransactionObjectInput
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function addInternal(tx: Transaction, typeArg: string, args: AddInternalArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::display::add_internal`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.display),
      pure(tx, args.string1, `${String.$typeName}`),
      pure(tx, args.string2, `${String.$typeName}`),
    ],
  })
}
