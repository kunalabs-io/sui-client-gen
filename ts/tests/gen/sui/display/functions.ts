import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export interface RemoveArgs {
  self: ObjectArg
  name: string | TransactionArgument
}

export function remove(txb: TransactionBlock, typeArg: string, args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::remove`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.name, `0x1::string::String`)],
  })
}

export function new_(txb: TransactionBlock, typeArg: string, pub: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::new`,
    typeArguments: [typeArg],
    arguments: [obj(txb, pub)],
  })
}

export function version(txb: TransactionBlock, typeArg: string, d: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::version`,
    typeArguments: [typeArg],
    arguments: [obj(txb, d)],
  })
}

export interface AddArgs {
  self: ObjectArg
  name: string | TransactionArgument
  value: string | TransactionArgument
}

export function add(txb: TransactionBlock, typeArg: string, args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::add`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      pure(txb, args.name, `0x1::string::String`),
      pure(txb, args.value, `0x1::string::String`),
    ],
  })
}

export interface AddInternalArgs {
  display: ObjectArg
  name: string | TransactionArgument
  value: string | TransactionArgument
}

export function addInternal(txb: TransactionBlock, typeArg: string, args: AddInternalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::add_internal`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.display),
      pure(txb, args.name, `0x1::string::String`),
      pure(txb, args.value, `0x1::string::String`),
    ],
  })
}

export interface AddMultipleArgs {
  self: ObjectArg
  fields: Array<string | TransactionArgument> | TransactionArgument
  values: Array<string | TransactionArgument> | TransactionArgument
}

export function addMultiple(txb: TransactionBlock, typeArg: string, args: AddMultipleArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::add_multiple`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      pure(txb, args.fields, `vector<0x1::string::String>`),
      pure(txb, args.values, `vector<0x1::string::String>`),
    ],
  })
}

export function fields(txb: TransactionBlock, typeArg: string, d: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::fields`,
    typeArguments: [typeArg],
    arguments: [obj(txb, d)],
  })
}

export function createAndKeep(txb: TransactionBlock, typeArg: string, pub: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::create_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(txb, pub)],
  })
}

export function createInternal(txb: TransactionBlock, typeArg: string) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::create_internal`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface EditArgs {
  self: ObjectArg
  name: string | TransactionArgument
  value: string | TransactionArgument
}

export function edit(txb: TransactionBlock, typeArg: string, args: EditArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::edit`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.self),
      pure(txb, args.name, `0x1::string::String`),
      pure(txb, args.value, `0x1::string::String`),
    ],
  })
}

export function isAuthorized(txb: TransactionBlock, typeArg: string, pub: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::is_authorized`,
    typeArguments: [typeArg],
    arguments: [obj(txb, pub)],
  })
}

export interface NewWithFieldsArgs {
  pub: ObjectArg
  fields: Array<string | TransactionArgument> | TransactionArgument
  values: Array<string | TransactionArgument> | TransactionArgument
}

export function newWithFields(txb: TransactionBlock, typeArg: string, args: NewWithFieldsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::new_with_fields`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.pub),
      pure(txb, args.fields, `vector<0x1::string::String>`),
      pure(txb, args.values, `vector<0x1::string::String>`),
    ],
  })
}

export function updateVersion(txb: TransactionBlock, typeArg: string, display: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::update_version`,
    typeArguments: [typeArg],
    arguments: [obj(txb, display)],
  })
}
