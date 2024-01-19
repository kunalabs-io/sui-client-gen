import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, Type, generic, obj, option, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function balance(txb: TransactionBlock, typeArg: Type, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export function value(txb: TransactionBlock, typeArg: Type, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::value`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export function zero(txb: TransactionBlock, typeArg: Type) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export interface JoinArgs {
  coin1: ObjectArg
  coin2: ObjectArg
}

export function join(txb: TransactionBlock, typeArg: Type, args: JoinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::join`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.coin1), obj(txb, args.coin2)],
  })
}

export interface SplitArgs {
  coin: ObjectArg
  u64: bigint | TransactionArgument
}

export function split(txb: TransactionBlock, typeArg: Type, args: SplitArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::split`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.coin), pure(txb, args.u64, `u64`)],
  })
}

export function destroyZero(txb: TransactionBlock, typeArg: Type, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export function totalSupply(txb: TransactionBlock, typeArg: Type, treasuryCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::total_supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasuryCap)],
  })
}

export function treasuryIntoSupply(txb: TransactionBlock, typeArg: Type, treasuryCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::treasury_into_supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasuryCap)],
  })
}

export function supplyImmut(txb: TransactionBlock, typeArg: Type, treasuryCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::supply_immut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasuryCap)],
  })
}

export function supplyMut(txb: TransactionBlock, typeArg: Type, treasuryCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::supply_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasuryCap)],
  })
}

export function balanceMut(txb: TransactionBlock, typeArg: Type, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::balance_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export function fromBalance(txb: TransactionBlock, typeArg: Type, balance: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::from_balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, balance)],
  })
}

export function intoBalance(txb: TransactionBlock, typeArg: Type, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::into_balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export interface TakeArgs {
  balance: ObjectArg
  u64: bigint | TransactionArgument
}

export function take(txb: TransactionBlock, typeArg: Type, args: TakeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::take`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.balance), pure(txb, args.u64, `u64`)],
  })
}

export interface PutArgs {
  balance: ObjectArg
  coin: ObjectArg
}

export function put(txb: TransactionBlock, typeArg: Type, args: PutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::put`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.balance), obj(txb, args.coin)],
  })
}

export interface DivideIntoNArgs {
  coin: ObjectArg
  u64: bigint | TransactionArgument
}

export function divideIntoN(txb: TransactionBlock, typeArg: Type, args: DivideIntoNArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::divide_into_n`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.coin), pure(txb, args.u64, `u64`)],
  })
}

export interface CreateCurrencyArgs {
  t0: GenericArg
  u8: number | TransactionArgument
  vecU81: Array<number | TransactionArgument> | TransactionArgument
  vecU82: Array<number | TransactionArgument> | TransactionArgument
  vecU83: Array<number | TransactionArgument> | TransactionArgument
  option: ObjectArg | TransactionArgument | null
}

export function createCurrency(txb: TransactionBlock, typeArg: Type, args: CreateCurrencyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::create_currency`,
    typeArguments: [typeArg],
    arguments: [
      generic(txb, `${typeArg}`, args.t0),
      pure(txb, args.u8, `u8`),
      pure(txb, args.vecU81, `vector<u8>`),
      pure(txb, args.vecU82, `vector<u8>`),
      pure(txb, args.vecU83, `vector<u8>`),
      option(txb, `0x2::url::Url`, args.option),
    ],
  })
}

export interface MintArgs {
  treasuryCap: ObjectArg
  u64: bigint | TransactionArgument
}

export function mint(txb: TransactionBlock, typeArg: Type, args: MintArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::mint`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.treasuryCap), pure(txb, args.u64, `u64`)],
  })
}

export interface MintBalanceArgs {
  treasuryCap: ObjectArg
  u64: bigint | TransactionArgument
}

export function mintBalance(txb: TransactionBlock, typeArg: Type, args: MintBalanceArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::mint_balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.treasuryCap), pure(txb, args.u64, `u64`)],
  })
}

export interface BurnArgs {
  treasuryCap: ObjectArg
  coin: ObjectArg
}

export function burn(txb: TransactionBlock, typeArg: Type, args: BurnArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::burn`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.treasuryCap), obj(txb, args.coin)],
  })
}

export interface MintAndTransferArgs {
  treasuryCap: ObjectArg
  u64: bigint | TransactionArgument
  address: string | TransactionArgument
}

export function mintAndTransfer(txb: TransactionBlock, typeArg: Type, args: MintAndTransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::mint_and_transfer`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.treasuryCap),
      pure(txb, args.u64, `u64`),
      pure(txb, args.address, `address`),
    ],
  })
}

export interface UpdateNameArgs {
  treasuryCap: ObjectArg
  coinMetadata: ObjectArg
  string: string | TransactionArgument
}

export function updateName(txb: TransactionBlock, typeArg: Type, args: UpdateNameArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::update_name`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.treasuryCap),
      obj(txb, args.coinMetadata),
      pure(txb, args.string, `0x1::string::String`),
    ],
  })
}

export interface UpdateSymbolArgs {
  treasuryCap: ObjectArg
  coinMetadata: ObjectArg
  string: string | TransactionArgument
}

export function updateSymbol(txb: TransactionBlock, typeArg: Type, args: UpdateSymbolArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::update_symbol`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.treasuryCap),
      obj(txb, args.coinMetadata),
      pure(txb, args.string, `0x1::ascii::String`),
    ],
  })
}

export interface UpdateDescriptionArgs {
  treasuryCap: ObjectArg
  coinMetadata: ObjectArg
  string: string | TransactionArgument
}

export function updateDescription(
  txb: TransactionBlock,
  typeArg: Type,
  args: UpdateDescriptionArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::update_description`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.treasuryCap),
      obj(txb, args.coinMetadata),
      pure(txb, args.string, `0x1::string::String`),
    ],
  })
}

export interface UpdateIconUrlArgs {
  treasuryCap: ObjectArg
  coinMetadata: ObjectArg
  string: string | TransactionArgument
}

export function updateIconUrl(txb: TransactionBlock, typeArg: Type, args: UpdateIconUrlArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::update_icon_url`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.treasuryCap),
      obj(txb, args.coinMetadata),
      pure(txb, args.string, `0x1::ascii::String`),
    ],
  })
}

export function getDecimals(txb: TransactionBlock, typeArg: Type, coinMetadata: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::get_decimals`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coinMetadata)],
  })
}

export function getName(txb: TransactionBlock, typeArg: Type, coinMetadata: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::get_name`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coinMetadata)],
  })
}

export function getSymbol(txb: TransactionBlock, typeArg: Type, coinMetadata: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::get_symbol`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coinMetadata)],
  })
}

export function getDescription(txb: TransactionBlock, typeArg: Type, coinMetadata: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::get_description`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coinMetadata)],
  })
}

export function getIconUrl(txb: TransactionBlock, typeArg: Type, coinMetadata: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::get_icon_url`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coinMetadata)],
  })
}

export function supply(txb: TransactionBlock, typeArg: Type, treasuryCap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasuryCap)],
  })
}
