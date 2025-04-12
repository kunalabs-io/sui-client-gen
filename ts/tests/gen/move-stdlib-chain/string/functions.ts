import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { String } from '../ascii/structs'
import { String as String1 } from './structs'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function utf8(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::utf8`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function fromAscii(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::from_ascii`,
    arguments: [pure(tx, string, `${String.$typeName}`)],
  })
}

export function toAscii(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::to_ascii`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

export function tryUtf8(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::try_utf8`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export function asBytes(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::as_bytes`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

export function intoBytes(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::into_bytes`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

export function isEmpty(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::is_empty`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

export function length(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::length`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

export interface AppendArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function append(tx: Transaction, args: AppendArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::append`,
    arguments: [
      pure(tx, args.string1, `${String1.$typeName}`),
      pure(tx, args.string2, `${String1.$typeName}`),
    ],
  })
}

export interface AppendUtf8Args {
  string: string | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function appendUtf8(tx: Transaction, args: AppendUtf8Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::append_utf8`,
    arguments: [pure(tx, args.string, `${String1.$typeName}`), pure(tx, args.vecU8, `vector<u8>`)],
  })
}

export interface InsertArgs {
  string1: string | TransactionArgument
  u64: bigint | TransactionArgument
  string2: string | TransactionArgument
}

export function insert(tx: Transaction, args: InsertArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::insert`,
    arguments: [
      pure(tx, args.string1, `${String1.$typeName}`),
      pure(tx, args.u64, `u64`),
      pure(tx, args.string2, `${String1.$typeName}`),
    ],
  })
}

export interface SubstringArgs {
  string: string | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function substring(tx: Transaction, args: SubstringArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::substring`,
    arguments: [
      pure(tx, args.string, `${String1.$typeName}`),
      pure(tx, args.u641, `u64`),
      pure(tx, args.u642, `u64`),
    ],
  })
}

export interface IndexOfArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function indexOf(tx: Transaction, args: IndexOfArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::index_of`,
    arguments: [
      pure(tx, args.string1, `${String1.$typeName}`),
      pure(tx, args.string2, `${String1.$typeName}`),
    ],
  })
}

export function internalCheckUtf8(
  tx: Transaction,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::internal_check_utf8`,
    arguments: [pure(tx, vecU8, `vector<u8>`)],
  })
}

export interface InternalIsCharBoundaryArgs {
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function internalIsCharBoundary(tx: Transaction, args: InternalIsCharBoundaryArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::internal_is_char_boundary`,
    arguments: [pure(tx, args.vecU8, `vector<u8>`), pure(tx, args.u64, `u64`)],
  })
}

export interface InternalSubStringArgs {
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function internalSubString(tx: Transaction, args: InternalSubStringArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::internal_sub_string`,
    arguments: [
      pure(tx, args.vecU8, `vector<u8>`),
      pure(tx, args.u641, `u64`),
      pure(tx, args.u642, `u64`),
    ],
  })
}

export interface InternalIndexOfArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalIndexOf(tx: Transaction, args: InternalIndexOfArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::internal_index_of`,
    arguments: [pure(tx, args.vecU81, `vector<u8>`), pure(tx, args.vecU82, `vector<u8>`)],
  })
}

export function bytes(tx: Transaction, string: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::bytes`,
    arguments: [pure(tx, string, `${String1.$typeName}`)],
  })
}

export interface SubStringArgs {
  string: string | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function subString(tx: Transaction, args: SubStringArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::sub_string`,
    arguments: [
      pure(tx, args.string, `${String1.$typeName}`),
      pure(tx, args.u641, `u64`),
      pure(tx, args.u642, `u64`),
    ],
  })
}
