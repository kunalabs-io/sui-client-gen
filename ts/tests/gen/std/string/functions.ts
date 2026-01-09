import { getPublishedAt } from '../../_envs'
import { pure } from '../../_framework/util'
import { String as String1 } from '../ascii/structs'
import { String } from './structs'
import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'

/**
 * Creates a new string from a sequence of bytes. Aborts if the bytes do
 * not represent valid utf8.
 */
export function utf8(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::utf8`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/** Convert an ASCII string to a UTF8 string */
export function fromAscii(tx: Transaction, s: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::from_ascii`,
    arguments: [pure(tx, s, `${String1.$typeName}`)],
  })
}

/**
 * Convert an UTF8 string to an ASCII string.
 * Aborts if `s` is not valid ASCII
 */
export function toAscii(tx: Transaction, s: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::to_ascii`,
    arguments: [pure(tx, s, `${String.$typeName}`)],
  })
}

/** Tries to create a new string from a sequence of bytes. */
export function tryUtf8(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::try_utf8`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

/** Returns a reference to the underlying byte vector. */
export function asBytes(tx: Transaction, s: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::as_bytes`,
    arguments: [pure(tx, s, `${String.$typeName}`)],
  })
}

/** Unpack the `string` to get its underlying bytes. */
export function intoBytes(tx: Transaction, s: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::into_bytes`,
    arguments: [pure(tx, s, `${String.$typeName}`)],
  })
}

/** Checks whether this string is empty. */
export function isEmpty(tx: Transaction, s: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::is_empty`,
    arguments: [pure(tx, s, `${String.$typeName}`)],
  })
}

/** Returns the length of this string, in bytes. */
export function length(tx: Transaction, s: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::length`,
    arguments: [pure(tx, s, `${String.$typeName}`)],
  })
}

export interface AppendArgs {
  s: string | TransactionArgument
  r: string | TransactionArgument
}

/** Appends a string. */
export function append(tx: Transaction, args: AppendArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::append`,
    arguments: [pure(tx, args.s, `${String.$typeName}`), pure(tx, args.r, `${String.$typeName}`)],
  })
}

export interface AppendUtf8Args {
  s: string | TransactionArgument
  bytes: Array<number | TransactionArgument> | TransactionArgument
}

/** Appends bytes which must be in valid utf8 format. */
export function appendUtf8(tx: Transaction, args: AppendUtf8Args): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::append_utf8`,
    arguments: [pure(tx, args.s, `${String.$typeName}`), pure(tx, args.bytes, `vector<u8>`)],
  })
}

export interface InsertArgs {
  s: string | TransactionArgument
  at: bigint | TransactionArgument
  o: string | TransactionArgument
}

/**
 * Insert the other string at the byte index in given string. The index
 * must be at a valid utf8 char boundary.
 */
export function insert(tx: Transaction, args: InsertArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::insert`,
    arguments: [
      pure(tx, args.s, `${String.$typeName}`),
      pure(tx, args.at, `u64`),
      pure(tx, args.o, `${String.$typeName}`),
    ],
  })
}

export interface SubstringArgs {
  s: string | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

/**
 * Returns a sub-string using the given byte indices, where `i` is the first
 * byte position and `j` is the start of the first byte not included (or the
 * length of the string). The indices must be at valid utf8 char boundaries,
 * guaranteeing that the result is valid utf8.
 */
export function substring(tx: Transaction, args: SubstringArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::substring`,
    arguments: [
      pure(tx, args.s, `${String.$typeName}`),
      pure(tx, args.i, `u64`),
      pure(tx, args.j, `u64`),
    ],
  })
}

export interface IndexOfArgs {
  s: string | TransactionArgument
  r: string | TransactionArgument
}

/**
 * Computes the index of the first occurrence of a string. Returns `s.length()`
 * if no occurrence found.
 */
export function indexOf(tx: Transaction, args: IndexOfArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::index_of`,
    arguments: [pure(tx, args.s, `${String.$typeName}`), pure(tx, args.r, `${String.$typeName}`)],
  })
}

export function internalCheckUtf8(
  tx: Transaction,
  v: Array<number | TransactionArgument> | TransactionArgument
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::internal_check_utf8`,
    arguments: [pure(tx, v, `vector<u8>`)],
  })
}

export interface InternalIsCharBoundaryArgs {
  v: Array<number | TransactionArgument> | TransactionArgument
  i: bigint | TransactionArgument
}

export function internalIsCharBoundary(
  tx: Transaction,
  args: InternalIsCharBoundaryArgs
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::internal_is_char_boundary`,
    arguments: [pure(tx, args.v, `vector<u8>`), pure(tx, args.i, `u64`)],
  })
}

export interface InternalSubStringArgs {
  v: Array<number | TransactionArgument> | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function internalSubString(tx: Transaction, args: InternalSubStringArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::internal_sub_string`,
    arguments: [pure(tx, args.v, `vector<u8>`), pure(tx, args.i, `u64`), pure(tx, args.j, `u64`)],
  })
}

export interface InternalIndexOfArgs {
  v: Array<number | TransactionArgument> | TransactionArgument
  r: Array<number | TransactionArgument> | TransactionArgument
}

export function internalIndexOf(tx: Transaction, args: InternalIndexOfArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::internal_index_of`,
    arguments: [pure(tx, args.v, `vector<u8>`), pure(tx, args.r, `vector<u8>`)],
  })
}

/** @deprecated Use `std::string::as_bytes` instead. */
export function bytes(tx: Transaction, s: string | TransactionArgument): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::bytes`,
    arguments: [pure(tx, s, `${String.$typeName}`)],
  })
}

export interface SubStringArgs {
  s: string | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

/** @deprecated Use `std::string::substring` instead. */
export function subString(tx: Transaction, args: SubStringArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('std')}::string::sub_string`,
    arguments: [
      pure(tx, args.s, `${String.$typeName}`),
      pure(tx, args.i, `u64`),
      pure(tx, args.j, `u64`),
    ],
  })
}
