import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj, option, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function value(txb: TransactionBlock, typeArg: string, self: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::value`,
    typeArguments: [typeArg],
    arguments: [obj(txb, self)],
  })
}

export function balance(txb: TransactionBlock, typeArg: string, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export function destroyZero(txb: TransactionBlock, typeArg: string, c: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(txb, c)],
  })
}

export interface JoinArgs {
  self: ObjectArg
  c: ObjectArg
}

export function join(txb: TransactionBlock, typeArg: string, args: JoinArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::join`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), obj(txb, args.c)],
  })
}

export interface SplitArgs {
  self: ObjectArg
  splitAmount: bigint | TransactionArgument
}

export function split(txb: TransactionBlock, typeArg: string, args: SplitArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::split`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.splitAmount, `u64`)],
  })
}

export function supply(txb: TransactionBlock, typeArg: string, treasury: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasury)],
  })
}

export function zero(txb: TransactionBlock, typeArg: string) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function balanceMut(txb: TransactionBlock, typeArg: string, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::balance_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export interface BurnArgs {
  cap: ObjectArg
  c: ObjectArg
}

export function burn(txb: TransactionBlock, typeArg: string, args: BurnArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::burn`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.cap), obj(txb, args.c)],
  })
}

export interface CreateCurrencyArgs {
  witness: GenericArg
  decimals: number | TransactionArgument
  symbol: Array<number | TransactionArgument> | TransactionArgument
  name: Array<number | TransactionArgument> | TransactionArgument
  description: Array<number | TransactionArgument> | TransactionArgument
  iconUrl: ObjectArg | TransactionArgument | null
}

export function createCurrency(txb: TransactionBlock, typeArg: string, args: CreateCurrencyArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::create_currency`,
    typeArguments: [typeArg],
    arguments: [
      generic(txb, `${typeArg}`, args.witness),
      pure(txb, args.decimals, `u8`),
      pure(txb, args.symbol, `vector<u8>`),
      pure(txb, args.name, `vector<u8>`),
      pure(txb, args.description, `vector<u8>`),
      option(txb, `0x2::url::Url`, args.iconUrl),
    ],
  })
}

export interface CreateRegulatedCurrencyArgs {
  witness: GenericArg
  decimals: number | TransactionArgument
  symbol: Array<number | TransactionArgument> | TransactionArgument
  name: Array<number | TransactionArgument> | TransactionArgument
  description: Array<number | TransactionArgument> | TransactionArgument
  iconUrl: ObjectArg | TransactionArgument | null
}

export function createRegulatedCurrency(
  txb: TransactionBlock,
  typeArg: string,
  args: CreateRegulatedCurrencyArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::create_regulated_currency`,
    typeArguments: [typeArg],
    arguments: [
      generic(txb, `${typeArg}`, args.witness),
      pure(txb, args.decimals, `u8`),
      pure(txb, args.symbol, `vector<u8>`),
      pure(txb, args.name, `vector<u8>`),
      pure(txb, args.description, `vector<u8>`),
      option(txb, `0x2::url::Url`, args.iconUrl),
    ],
  })
}

export interface DenyListAddArgs {
  denyList: ObjectArg
  denyCap: ObjectArg
  addr: string | TransactionArgument
}

export function denyListAdd(txb: TransactionBlock, typeArg: string, args: DenyListAddArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_add`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.denyList), obj(txb, args.denyCap), pure(txb, args.addr, `address`)],
  })
}

export interface DenyListContainsArgs {
  freezer: ObjectArg
  addr: string | TransactionArgument
}

export function denyListContains(
  txb: TransactionBlock,
  typeArg: string,
  args: DenyListContainsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_contains`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.freezer), pure(txb, args.addr, `address`)],
  })
}

export interface DenyListRemoveArgs {
  denyList: ObjectArg
  denyCap: ObjectArg
  addr: string | TransactionArgument
}

export function denyListRemove(txb: TransactionBlock, typeArg: string, args: DenyListRemoveArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_remove`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.denyList), obj(txb, args.denyCap), pure(txb, args.addr, `address`)],
  })
}

export interface DivideIntoNArgs {
  self: ObjectArg
  n: bigint | TransactionArgument
}

export function divideIntoN(txb: TransactionBlock, typeArg: string, args: DivideIntoNArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::divide_into_n`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.self), pure(txb, args.n, `u64`)],
  })
}

export function fromBalance(txb: TransactionBlock, typeArg: string, balance: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::from_balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, balance)],
  })
}

export function getDecimals(txb: TransactionBlock, typeArg: string, metadata: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::get_decimals`,
    typeArguments: [typeArg],
    arguments: [obj(txb, metadata)],
  })
}

export function getDescription(txb: TransactionBlock, typeArg: string, metadata: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::get_description`,
    typeArguments: [typeArg],
    arguments: [obj(txb, metadata)],
  })
}

export function getIconUrl(txb: TransactionBlock, typeArg: string, metadata: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::get_icon_url`,
    typeArguments: [typeArg],
    arguments: [obj(txb, metadata)],
  })
}

export function getName(txb: TransactionBlock, typeArg: string, metadata: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::get_name`,
    typeArguments: [typeArg],
    arguments: [obj(txb, metadata)],
  })
}

export function getSymbol(txb: TransactionBlock, typeArg: string, metadata: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::get_symbol`,
    typeArguments: [typeArg],
    arguments: [obj(txb, metadata)],
  })
}

export function intoBalance(txb: TransactionBlock, typeArg: string, coin: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::into_balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, coin)],
  })
}

export interface MintArgs {
  cap: ObjectArg
  value: bigint | TransactionArgument
}

export function mint(txb: TransactionBlock, typeArg: string, args: MintArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::mint`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.cap), pure(txb, args.value, `u64`)],
  })
}

export interface MintAndTransferArgs {
  c: ObjectArg
  amount: bigint | TransactionArgument
  recipient: string | TransactionArgument
}

export function mintAndTransfer(txb: TransactionBlock, typeArg: string, args: MintAndTransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::mint_and_transfer`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.c),
      pure(txb, args.amount, `u64`),
      pure(txb, args.recipient, `address`),
    ],
  })
}

export interface MintBalanceArgs {
  cap: ObjectArg
  value: bigint | TransactionArgument
}

export function mintBalance(txb: TransactionBlock, typeArg: string, args: MintBalanceArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::mint_balance`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.cap), pure(txb, args.value, `u64`)],
  })
}

export interface PutArgs {
  balance: ObjectArg
  coin: ObjectArg
}

export function put(txb: TransactionBlock, typeArg: string, args: PutArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::put`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.balance), obj(txb, args.coin)],
  })
}

export function supplyImmut(txb: TransactionBlock, typeArg: string, treasury: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::supply_immut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasury)],
  })
}

export function supplyMut(txb: TransactionBlock, typeArg: string, treasury: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::supply_mut`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasury)],
  })
}

export interface TakeArgs {
  balance: ObjectArg
  value: bigint | TransactionArgument
}

export function take(txb: TransactionBlock, typeArg: string, args: TakeArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::take`,
    typeArguments: [typeArg],
    arguments: [obj(txb, args.balance), pure(txb, args.value, `u64`)],
  })
}

export function totalSupply(txb: TransactionBlock, typeArg: string, cap: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::total_supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, cap)],
  })
}

export function treasuryIntoSupply(txb: TransactionBlock, typeArg: string, treasury: ObjectArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::treasury_into_supply`,
    typeArguments: [typeArg],
    arguments: [obj(txb, treasury)],
  })
}

export interface UpdateDescriptionArgs {
  treasury: ObjectArg
  metadata: ObjectArg
  description: string | TransactionArgument
}

export function updateDescription(
  txb: TransactionBlock,
  typeArg: string,
  args: UpdateDescriptionArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::update_description`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.treasury),
      obj(txb, args.metadata),
      pure(txb, args.description, `0x1::string::String`),
    ],
  })
}

export interface UpdateIconUrlArgs {
  treasury: ObjectArg
  metadata: ObjectArg
  url: string | TransactionArgument
}

export function updateIconUrl(txb: TransactionBlock, typeArg: string, args: UpdateIconUrlArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::update_icon_url`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.treasury),
      obj(txb, args.metadata),
      pure(txb, args.url, `0x1::ascii::String`),
    ],
  })
}

export interface UpdateNameArgs {
  treasury: ObjectArg
  metadata: ObjectArg
  name: string | TransactionArgument
}

export function updateName(txb: TransactionBlock, typeArg: string, args: UpdateNameArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::update_name`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.treasury),
      obj(txb, args.metadata),
      pure(txb, args.name, `0x1::string::String`),
    ],
  })
}

export interface UpdateSymbolArgs {
  treasury: ObjectArg
  metadata: ObjectArg
  symbol: string | TransactionArgument
}

export function updateSymbol(txb: TransactionBlock, typeArg: string, args: UpdateSymbolArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::coin::update_symbol`,
    typeArguments: [typeArg],
    arguments: [
      obj(txb, args.treasury),
      obj(txb, args.metadata),
      pure(txb, args.symbol, `0x1::ascii::String`),
    ],
  })
}
