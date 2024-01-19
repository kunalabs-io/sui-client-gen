import { PUBLISHED_AT } from '..'
import { ObjectArg, Type, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock, typeArg: Type, publisher: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::new`,
    typeArguments: [typeArg],
    arguments: [obj(txb, publisher)],
  })
}

export interface RemoveArgs {
  display: ObjectArg
  string: string | TransactionArgument
}

export function remove(txb: TransactionBlock, typeArg: Type, args: RemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::remove`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.display), pure(txb, args.string, `0x1::string::String`)],
  })
}

export function version(txb: TransactionBlock, typeArg: Type, display: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::version`,
    typeArguments: [typeArg],
    arguments: [obj(txb, display)],
  })
}

export interface AddArgs {
  display: ObjectArg
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function add(txb: TransactionBlock, typeArg: Type, args: AddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::add`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.display),
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::string::String`),
    ],
  })
}

export interface NewWithFieldsArgs {
  publisher: ObjectArg
  vecString1: Array<string | TransactionArgument> | TransactionArgument
  vecString2: Array<string | TransactionArgument> | TransactionArgument
}

export function newWithFields(txb: TransactionBlock, typeArg: Type, args: NewWithFieldsArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::new_with_fields`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.publisher),
      pure(txb, args.vecString1, `vector<0x1::string::String>`),
      pure(txb, args.vecString2, `vector<0x1::string::String>`),
    ],
  })
}

export function createAndKeep(txb: TransactionBlock, typeArg: Type, publisher: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::create_and_keep`,
    typeArguments: [typeArg],
    arguments: [obj(txb, publisher)],
  })
}

export function updateVersion(txb: TransactionBlock, typeArg: Type, display: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::update_version`,
    typeArguments: [typeArg],
    arguments: [obj(txb, display)],
  })
}

export interface AddMultipleArgs {
  display: ObjectArg
  vecString1: Array<string | TransactionArgument> | TransactionArgument
  vecString2: Array<string | TransactionArgument> | TransactionArgument
}

export function addMultiple(txb: TransactionBlock, typeArg: Type, args: AddMultipleArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::add_multiple`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.display),
      pure(txb, args.vecString1, `vector<0x1::string::String>`),
      pure(txb, args.vecString2, `vector<0x1::string::String>`),
    ],
  })
}

export interface EditArgs {
  display: ObjectArg
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function edit(txb: TransactionBlock, typeArg: Type, args: EditArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::edit`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.display),
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::string::String`),
    ],
  })
}

export function isAuthorized(txb: TransactionBlock, typeArg: Type, publisher: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::is_authorized`,
    typeArguments: [typeArg],
    arguments: [obj(txb, publisher)],
  })
}

export function fields(txb: TransactionBlock, typeArg: Type, display: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::fields`,
    typeArguments: [typeArg],
    arguments: [obj(txb, display)],
  })
}

export function createInternal(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::create_internal`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface AddInternalArgs {
  display: ObjectArg
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function addInternal(txb: TransactionBlock, typeArg: Type, args: AddInternalArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::display::add_internal`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.display),
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::string::String`),
    ],
  })
}
