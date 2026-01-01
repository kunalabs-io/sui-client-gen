import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { String } from '../ascii/structs'
import { String as String1 } from './structs'
import { Transaction, TransactionArgument } from '@mysten/sui/transactions'

export function utf8(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::utf8`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function fromAscii(tx: Transaction, s: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::from_ascii`,
    arguments: [pure(tx, s, `${String.$typeName}`)],
  })
}

export function toAscii(tx: Transaction, s: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::to_ascii`,
    arguments: [pure(tx, s, `${String1.$typeName}`)],
  })
}

export function tryUtf8(
  tx: Transaction,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::try_utf8`,
    arguments: [pure(tx, bytes, `vector<u8>`)],
  })
}

export function asBytes(tx: Transaction, s: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::as_bytes`,
    arguments: [pure(tx, s, `${String1.$typeName}`)],
  })
}

export function intoBytes(tx: Transaction, s: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::into_bytes`,
    arguments: [pure(tx, s, `${String1.$typeName}`)],
  })
}

export function isEmpty(tx: Transaction, s: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::is_empty`,
    arguments: [pure(tx, s, `${String1.$typeName}`)],
  })
}

export function length(tx: Transaction, s: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::length`,
    arguments: [pure(tx, s, `${String1.$typeName}`)],
  })
}

export interface AppendArgs {
  s: string | TransactionArgument
  r: string | TransactionArgument
}

export function append(tx: Transaction, args: AppendArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::append`,
    arguments: [pure(tx, args.s, `${String1.$typeName}`), pure(tx, args.r, `${String1.$typeName}`)],
  })
}

export interface AppendUtf8Args {
  s: string | TransactionArgument
  bytes: Array<number | TransactionArgument> | TransactionArgument
}

export function appendUtf8(tx: Transaction, args: AppendUtf8Args) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::append_utf8`,
    arguments: [pure(tx, args.s, `${String1.$typeName}`), pure(tx, args.bytes, `vector<u8>`)],
  })
}

export interface InsertArgs {
  s: string | TransactionArgument
  at: bigint | TransactionArgument
  o: string | TransactionArgument
}

export function insert(tx: Transaction, args: InsertArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::insert`,
    arguments: [
      pure(tx, args.s, `${String1.$typeName}`),
      pure(tx, args.at, `u64`),
      pure(tx, args.o, `${String1.$typeName}`),
    ],
  })
}

export interface SubstringArgs {
  s: string | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function substring(tx: Transaction, args: SubstringArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::substring`,
    arguments: [
      pure(tx, args.s, `${String1.$typeName}`),
      pure(tx, args.i, `u64`),
      pure(tx, args.j, `u64`),
    ],
  })
}

export interface IndexOfArgs {
  s: string | TransactionArgument
  r: string | TransactionArgument
}

export function indexOf(tx: Transaction, args: IndexOfArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::index_of`,
    arguments: [pure(tx, args.s, `${String1.$typeName}`), pure(tx, args.r, `${String1.$typeName}`)],
  })
}

export function internalCheckUtf8(
  tx: Transaction,
  v: Array<number | TransactionArgument> | TransactionArgument
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::internal_check_utf8`,
    arguments: [pure(tx, v, `vector<u8>`)],
  })
}

export interface InternalIsCharBoundaryArgs {
  v: Array<number | TransactionArgument> | TransactionArgument
  i: bigint | TransactionArgument
}

export function internalIsCharBoundary(tx: Transaction, args: InternalIsCharBoundaryArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::internal_is_char_boundary`,
    arguments: [pure(tx, args.v, `vector<u8>`), pure(tx, args.i, `u64`)],
  })
}

export interface InternalSubStringArgs {
  v: Array<number | TransactionArgument> | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function internalSubString(tx: Transaction, args: InternalSubStringArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::internal_sub_string`,
    arguments: [pure(tx, args.v, `vector<u8>`), pure(tx, args.i, `u64`), pure(tx, args.j, `u64`)],
  })
}

export interface InternalIndexOfArgs {
  v: Array<number | TransactionArgument> | TransactionArgument
  r: Array<number | TransactionArgument> | TransactionArgument
}

export function internalIndexOf(tx: Transaction, args: InternalIndexOfArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::internal_index_of`,
    arguments: [pure(tx, args.v, `vector<u8>`), pure(tx, args.r, `vector<u8>`)],
  })
}

export function bytes(tx: Transaction, s: string | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::bytes`,
    arguments: [pure(tx, s, `${String1.$typeName}`)],
  })
}

export interface SubStringArgs {
  s: string | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function subString(tx: Transaction, args: SubStringArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::string::sub_string`,
    arguments: [
      pure(tx, args.s, `${String1.$typeName}`),
      pure(tx, args.i, `u64`),
      pure(tx, args.j, `u64`),
    ],
  })
}
