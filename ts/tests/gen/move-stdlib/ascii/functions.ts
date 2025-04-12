import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { String } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function char_(tx: Transaction, byte: number | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::ascii::char`, arguments: [pure(tx, byte, `u8`)] })
}

export function string(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::string`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function tryString(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::try_string`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function allCharactersPrintable(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::all_characters_printable`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export interface PushCharArgs {
  string: string | TransactionArgument
  char: TransactionObjectInput
}

export function pushChar(tx: Transaction, args: PushCharArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::push_char`,
    arguments: [pure(tx, args.string, `${String.$typeName}`), obj(tx, args.char)],
  })
}

export function popChar(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::pop_char`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export function length(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::length`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export function asBytes(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::as_bytes`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export function intoBytes(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::into_bytes`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export function byte_(tx: Transaction, char: TransactionObjectInput) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::ascii::byte`, arguments: [obj(tx, char)] })
}

export function isValidChar(tx: Transaction, b: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::is_valid_char`,
    arguments: [pure(tx, b, `u8`)],
  })
}

export function isPrintableChar(tx: Transaction, byte: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::is_printable_char`,
    arguments: [pure(tx, byte, `u8`)],
  })
}
