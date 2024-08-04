import { PUBLISHED_AT } from '..'
import { obj, pure } from '../../_framework/util'
import { String } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function length(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::length`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export interface AppendArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function append(tx: Transaction, args: AppendArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::append`,
    arguments: [
      pure(tx, args.string1, `${String.$typeName}`),
      pure(tx, args.string2, `${String.$typeName}`),
    ],
  })
}

export function isEmpty(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::is_empty`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export interface IndexOfArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function indexOf(tx: Transaction, args: IndexOfArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::index_of`,
    arguments: [
      pure(tx, args.string1, `${String.$typeName}`),
      pure(tx, args.string2, `${String.$typeName}`),
    ],
  })
}

export interface InsertArgs {
  string1: string | TransactionArgument
  u64: bigint | TransactionArgument
  string2: string | TransactionArgument
}

export function insert(tx: Transaction, args: InsertArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::insert`,
    arguments: [
      pure(tx, args.string1, `${String.$typeName}`),
      pure(tx, args.u64, `u64`),
      pure(tx, args.string2, `${String.$typeName}`),
    ],
  })
}

export function char_(tx: Transaction, u8: number | TransactionArgument) {
  return tx.moveCall({ target: `${PUBLISHED_AT}::ascii::char`, arguments: [pure(tx, u8, `u8`)] })
}

export function string(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::string`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function tryString(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::try_string`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
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

export interface SubstringArgs {
  string: string | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function substring(tx: Transaction, args: SubstringArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::substring`,
    arguments: [
      pure(tx, args.string, `${String.$typeName}`),
      pure(tx, args.u641, `u64`),
      pure(tx, args.u642, `u64`),
    ],
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

export function isValidChar(tx: Transaction, u8: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::is_valid_char`,
    arguments: [pure(tx, u8, `u8`)],
  })
}

export function isPrintableChar(tx: Transaction, u8: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::is_printable_char`,
    arguments: [pure(tx, u8, `u8`)],
  })
}

export function toUppercase(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::to_uppercase`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export function toLowercase(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::to_lowercase`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export function charToUppercase(tx: Transaction, u8: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::char_to_uppercase`,
    arguments: [pure(tx, u8, `u8`)],
  })
}

export function charToLowercase(tx: Transaction, u8: number | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::ascii::char_to_lowercase`,
    arguments: [pure(tx, u8, `u8`)],
  })
}
