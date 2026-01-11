import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { getPublishedAt } from '../../_envs'
import { obj, pure } from '../../_framework/util'
import { String as String1 } from './structs'

/** Convert a `byte` into a `Char` that is checked to make sure it is valid ASCII. */
export function char_(tx: Transaction, byte_: number | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::char`,
    arguments: [pure(tx, byte_, `u8`)],
  })
}

/**
 * Convert a vector of bytes `bytes` into an `String`. Aborts if
 * `bytes` contains non-ASCII characters.
 */
export function string(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::string`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/**
 * Convert a vector of bytes `bytes` into an `String`. Returns
 * `Some(<ascii_string>)` if the `bytes` contains all valid ASCII
 * characters. Otherwise returns `None`.
 */
export function tryString(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::try_string`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/**
 * Returns `true` if all characters in `string` are printable characters
 * Returns `false` otherwise. Not all `String`s are printable strings.
 */
export function allCharactersPrintable(
  tx: Transaction,
  string: string | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::all_characters_printable`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

export interface PushCharArgs {
  string: string | TransactionArgument
  char: TransactionObjectInput
}

/** Push a `Char` to the end of the `string`. */
export function pushChar(tx: Transaction, args: PushCharArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::push_char`,
    arguments: [
      pure(tx, args.string, `${String1.$typeName}`),
      obj(tx, args.char),
    ],
  })
}

/** Pop a `Char` from the end of the `string`. */
export function popChar(tx: Transaction, string: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::pop_char`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

/** Returns the length of the `string` in bytes. */
export function length(tx: Transaction, string: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::length`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

export interface AppendArgs {
  string: string | TransactionArgument
  other: string | TransactionArgument
}

/** Append the `other` string to the end of `string`. */
export function append(tx: Transaction, args: AppendArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::append`,
    arguments: [
      pure(tx, args.string, `${String1.$typeName}`),
      pure(tx, args.other, `${String1.$typeName}`),
    ],
  })
}

export interface InsertArgs {
  s: string | TransactionArgument
  at: bigint | TransactionArgument
  o: string | TransactionArgument
}

/** Insert the `other` string at the `at` index of `string`. */
export function insert(tx: Transaction, args: InsertArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::insert`,
    arguments: [
      pure(tx, args.s, `${String1.$typeName}`),
      pure(tx, args.at, `u64`),
      pure(tx, args.o, `${String1.$typeName}`),
    ],
  })
}

export interface SubstringArgs {
  string: string | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

/** Copy the slice of the `string` from `i` to `j` into a new `String`. */
export function substring(tx: Transaction, args: SubstringArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::substring`,
    arguments: [
      pure(tx, args.string, `${String1.$typeName}`),
      pure(tx, args.i, `u64`),
      pure(tx, args.j, `u64`),
    ],
  })
}

/** Get the inner bytes of the `string` as a reference */
export function asBytes(tx: Transaction, string: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::as_bytes`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

/** Unpack the `string` to get its backing bytes */
export function intoBytes(
  tx: Transaction,
  string: string | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::into_bytes`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

/** Unpack the `char` into its underlying bytes. */
export function byte_(tx: Transaction, char_: TransactionObjectInput): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::byte`,
    arguments: [obj(tx, char_)],
  })
}

/**
 * Returns `true` if `b` is a valid ASCII character.
 * Returns `false` otherwise.
 */
export function isValidChar(tx: Transaction, b: number | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::is_valid_char`,
    arguments: [pure(tx, b, `u8`)],
  })
}

/**
 * Returns `true` if `byte` is a printable ASCII character.
 * Returns `false` otherwise.
 */
export function isPrintableChar(
  tx: Transaction,
  byte_: number | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::is_printable_char`,
    arguments: [pure(tx, byte_, `u8`)],
  })
}

/** Returns `true` if `string` is empty. */
export function isEmpty(tx: Transaction, string: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::is_empty`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

/** Convert a `string` to its uppercase equivalent. */
export function toUppercase(
  tx: Transaction,
  string: string | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::to_uppercase`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

/** Convert a `string` to its lowercase equivalent. */
export function toLowercase(
  tx: Transaction,
  string: string | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::to_lowercase`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

export interface IndexOfArgs {
  string: string | TransactionArgument
  substr: string | TransactionArgument
}

/**
 * Computes the index of the first occurrence of the `substr` in the `string`.
 * Returns the length of the `string` if the `substr` is not found.
 * Returns 0 if the `substr` is empty.
 */
export function indexOf(tx: Transaction, args: IndexOfArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::index_of`,
    arguments: [
      pure(tx, args.string, `${String1.$typeName}`),
      pure(tx, args.substr, `${String1.$typeName}`),
    ],
  })
}

/** Convert a `char` to its lowercase equivalent. */
export function charToUppercase(
  tx: Transaction,
  byte_: number | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::char_to_uppercase`,
    arguments: [pure(tx, byte_, `u8`)],
  })
}

/** Convert a `char` to its lowercase equivalent. */
export function charToLowercase(
  tx: Transaction,
  byte_: number | TransactionArgument,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::ascii::char_to_lowercase`,
    arguments: [pure(tx, byte_, `u8`)],
  })
}
