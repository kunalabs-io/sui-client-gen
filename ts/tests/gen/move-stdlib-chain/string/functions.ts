import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function bytes(txb: TransactionBlock, string: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::bytes`,
    arguments: [pure(txb, string, `0x1::string::String`)],
  })
}

export function length(txb: TransactionBlock, string: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::length`,
    arguments: [pure(txb, string, `0x1::string::String`)],
  })
}

export interface AppendArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function append(txb: TransactionBlock, args: AppendArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::append`,
    arguments: [
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::string::String`),
    ],
  })
}

export function isEmpty(txb: TransactionBlock, string: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::is_empty`,
    arguments: [pure(txb, string, `0x1::string::String`)],
  })
}

export interface IndexOfArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
}

export function indexOf(txb: TransactionBlock, args: IndexOfArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::index_of`,
    arguments: [
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::string::String`),
    ],
  })
}

export interface InsertArgs {
  string1: string | TransactionArgument
  u64: bigint | TransactionArgument
  string2: string | TransactionArgument
}

export function insert(txb: TransactionBlock, args: InsertArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::insert`,
    arguments: [
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.u64, `u64`),
      pure(txb, args.string2, `0x1::string::String`),
    ],
  })
}

export function utf8(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::utf8`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export function fromAscii(txb: TransactionBlock, string: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::from_ascii`,
    arguments: [pure(txb, string, `0x1::ascii::String`)],
  })
}

export function toAscii(txb: TransactionBlock, string: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::to_ascii`,
    arguments: [pure(txb, string, `0x1::string::String`)],
  })
}

export function tryUtf8(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::try_utf8`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export interface AppendUtf8Args {
  string: string | TransactionArgument
  vecU8: Array<number | TransactionArgument> | TransactionArgument
}

export function appendUtf8(txb: TransactionBlock, args: AppendUtf8Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::append_utf8`,
    arguments: [pure(txb, args.string, `0x1::string::String`), pure(txb, args.vecU8, `vector<u8>`)],
  })
}

export interface SubStringArgs {
  string: string | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function subString(txb: TransactionBlock, args: SubStringArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::sub_string`,
    arguments: [
      pure(txb, args.string, `0x1::string::String`),
      pure(txb, args.u641, `u64`),
      pure(txb, args.u642, `u64`),
    ],
  })
}

export function internalCheckUtf8(
  txb: TransactionBlock,
  vecU8: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::internal_check_utf8`,
    arguments: [pure(txb, vecU8, `vector<u8>`)],
  })
}

export interface InternalIsCharBoundaryArgs {
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  u64: bigint | TransactionArgument
}

export function internalIsCharBoundary(txb: TransactionBlock, args: InternalIsCharBoundaryArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::internal_is_char_boundary`,
    arguments: [pure(txb, args.vecU8, `vector<u8>`), pure(txb, args.u64, `u64`)],
  })
}

export interface InternalSubStringArgs {
  vecU8: Array<number | TransactionArgument> | TransactionArgument
  u641: bigint | TransactionArgument
  u642: bigint | TransactionArgument
}

export function internalSubString(txb: TransactionBlock, args: InternalSubStringArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::internal_sub_string`,
    arguments: [
      pure(txb, args.vecU8, `vector<u8>`),
      pure(txb, args.u641, `u64`),
      pure(txb, args.u642, `u64`),
    ],
  })
}

export interface InternalIndexOfArgs {
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
}

export function internalIndexOf(txb: TransactionBlock, args: InternalIndexOfArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::internal_index_of`,
    arguments: [pure(txb, args.vecU81, `vector<u8>`), pure(txb, args.vecU82, `vector<u8>`)],
  })
}
