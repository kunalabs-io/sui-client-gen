import { PUBLISHED_AT } from '..'
import { pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export interface IndexOfArgs {
  s: string | TransactionArgument
  r: string | TransactionArgument
}

export function indexOf(txb: TransactionBlock, args: IndexOfArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::index_of`,
    arguments: [pure(txb, args.s, `0x1::string::String`), pure(txb, args.r, `0x1::string::String`)],
  })
}

export interface AppendArgs {
  s: string | TransactionArgument
  r: string | TransactionArgument
}

export function append(txb: TransactionBlock, args: AppendArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::append`,
    arguments: [pure(txb, args.s, `0x1::string::String`), pure(txb, args.r, `0x1::string::String`)],
  })
}

export interface InsertArgs {
  s: string | TransactionArgument
  at: bigint | TransactionArgument
  o: string | TransactionArgument
}

export function insert(txb: TransactionBlock, args: InsertArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::insert`,
    arguments: [
      pure(txb, args.s, `0x1::string::String`),
      pure(txb, args.at, `u64`),
      pure(txb, args.o, `0x1::string::String`),
    ],
  })
}

export function isEmpty(txb: TransactionBlock, s: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::is_empty`,
    arguments: [pure(txb, s, `0x1::string::String`)],
  })
}

export function length(txb: TransactionBlock, s: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::length`,
    arguments: [pure(txb, s, `0x1::string::String`)],
  })
}

export function bytes(txb: TransactionBlock, s: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::bytes`,
    arguments: [pure(txb, s, `0x1::string::String`)],
  })
}

export interface AppendUtf8Args {
  s: string | TransactionArgument
  bytes: Array<number | TransactionArgument> | TransactionArgument
}

export function appendUtf8(txb: TransactionBlock, args: AppendUtf8Args) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::append_utf8`,
    arguments: [pure(txb, args.s, `0x1::string::String`), pure(txb, args.bytes, `vector<u8>`)],
  })
}

export function fromAscii(txb: TransactionBlock, s: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::from_ascii`,
    arguments: [pure(txb, s, `0x1::ascii::String`)],
  })
}

export function internalCheckUtf8(
  txb: TransactionBlock,
  v: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::internal_check_utf8`,
    arguments: [pure(txb, v, `vector<u8>`)],
  })
}

export interface InternalIndexOfArgs {
  v: Array<number | TransactionArgument> | TransactionArgument
  r: Array<number | TransactionArgument> | TransactionArgument
}

export function internalIndexOf(txb: TransactionBlock, args: InternalIndexOfArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::internal_index_of`,
    arguments: [pure(txb, args.v, `vector<u8>`), pure(txb, args.r, `vector<u8>`)],
  })
}

export interface InternalIsCharBoundaryArgs {
  v: Array<number | TransactionArgument> | TransactionArgument
  i: bigint | TransactionArgument
}

export function internalIsCharBoundary(txb: TransactionBlock, args: InternalIsCharBoundaryArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::internal_is_char_boundary`,
    arguments: [pure(txb, args.v, `vector<u8>`), pure(txb, args.i, `u64`)],
  })
}

export interface InternalSubStringArgs {
  v: Array<number | TransactionArgument> | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function internalSubString(txb: TransactionBlock, args: InternalSubStringArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::internal_sub_string`,
    arguments: [
      pure(txb, args.v, `vector<u8>`),
      pure(txb, args.i, `u64`),
      pure(txb, args.j, `u64`),
    ],
  })
}

export interface SubStringArgs {
  s: string | TransactionArgument
  i: bigint | TransactionArgument
  j: bigint | TransactionArgument
}

export function subString(txb: TransactionBlock, args: SubStringArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::sub_string`,
    arguments: [
      pure(txb, args.s, `0x1::string::String`),
      pure(txb, args.i, `u64`),
      pure(txb, args.j, `u64`),
    ],
  })
}

export function toAscii(txb: TransactionBlock, s: string | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::to_ascii`,
    arguments: [pure(txb, s, `0x1::string::String`)],
  })
}

export function tryUtf8(
  txb: TransactionBlock,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::try_utf8`,
    arguments: [pure(txb, bytes, `vector<u8>`)],
  })
}

export function utf8(
  txb: TransactionBlock,
  bytes: Array<number | TransactionArgument> | TransactionArgument
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::string::utf8`,
    arguments: [pure(txb, bytes, `vector<u8>`)],
  })
}
