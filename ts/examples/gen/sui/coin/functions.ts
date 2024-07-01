import { PUBLISHED_AT } from '..'
import { String as String1 } from '../../_dependencies/source/0x1/ascii/structs'
import { String } from '../../_dependencies/source/0x1/string/structs'
import { GenericArg, generic, obj, option, pure } from '../../_framework/util'
import { Url } from '../url/structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function value(tx: Transaction, typeArg: string, self: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::value`,
    typeArguments: [typeArg],
    arguments: [obj(tx, self)],
  })
}

export function balance(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export function destroyZero(tx: Transaction, typeArg: string, c: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::destroy_zero`,
    typeArguments: [typeArg],
    arguments: [obj(tx, c)],
  })
}

export interface JoinArgs {
  self: TransactionObjectInput
  c: TransactionObjectInput
}

export function join(tx: Transaction, typeArg: string, args: JoinArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::join`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), obj(tx, args.c)],
  })
}

export interface SplitArgs {
  self: TransactionObjectInput
  splitAmount: bigint | TransactionArgument
}

export function split(tx: Transaction, typeArg: string, args: SplitArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::split`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.splitAmount, `u64`)],
  })
}

export function supply(tx: Transaction, typeArg: string, treasury: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasury)],
  })
}

export function zero(tx: Transaction, typeArg: string) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::zero`,
    typeArguments: [typeArg],
    arguments: [],
  })
}

export function balanceMut(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::balance_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export interface BurnArgs {
  cap: TransactionObjectInput
  c: TransactionObjectInput
}

export function burn(tx: Transaction, typeArg: string, args: BurnArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::burn`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.cap), obj(tx, args.c)],
  })
}

export interface CreateCurrencyArgs {
  witness: GenericArg
  decimals: number | TransactionArgument
  symbol: Array<number | TransactionArgument> | TransactionArgument
  name: Array<number | TransactionArgument> | TransactionArgument
  description: Array<number | TransactionArgument> | TransactionArgument
  iconUrl: TransactionObjectInput | TransactionArgument | null
}

export function createCurrency(tx: Transaction, typeArg: string, args: CreateCurrencyArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::create_currency`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.witness),
      pure(tx, args.decimals, `u8`),
      pure(tx, args.symbol, `vector<u8>`),
      pure(tx, args.name, `vector<u8>`),
      pure(tx, args.description, `vector<u8>`),
      option(tx, `${Url.$typeName}`, args.iconUrl),
    ],
  })
}

export interface CreateRegulatedCurrencyArgs {
  witness: GenericArg
  decimals: number | TransactionArgument
  symbol: Array<number | TransactionArgument> | TransactionArgument
  name: Array<number | TransactionArgument> | TransactionArgument
  description: Array<number | TransactionArgument> | TransactionArgument
  iconUrl: TransactionObjectInput | TransactionArgument | null
}

export function createRegulatedCurrency(
  tx: Transaction,
  typeArg: string,
  args: CreateRegulatedCurrencyArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::create_regulated_currency`,
    typeArguments: [typeArg],
    arguments: [
      generic(tx, `${typeArg}`, args.witness),
      pure(tx, args.decimals, `u8`),
      pure(tx, args.symbol, `vector<u8>`),
      pure(tx, args.name, `vector<u8>`),
      pure(tx, args.description, `vector<u8>`),
      option(tx, `${Url.$typeName}`, args.iconUrl),
    ],
  })
}

export interface DenyListAddArgs {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
  addr: string | TransactionArgument
}

export function denyListAdd(tx: Transaction, typeArg: string, args: DenyListAddArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_add`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), obj(tx, args.denyCap), pure(tx, args.addr, `address`)],
  })
}

export interface DenyListContainsArgs {
  freezer: TransactionObjectInput
  addr: string | TransactionArgument
}

export function denyListContains(tx: Transaction, typeArg: string, args: DenyListContainsArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_contains`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.freezer), pure(tx, args.addr, `address`)],
  })
}

export interface DenyListRemoveArgs {
  denyList: TransactionObjectInput
  denyCap: TransactionObjectInput
  addr: string | TransactionArgument
}

export function denyListRemove(tx: Transaction, typeArg: string, args: DenyListRemoveArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::deny_list_remove`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.denyList), obj(tx, args.denyCap), pure(tx, args.addr, `address`)],
  })
}

export interface DivideIntoNArgs {
  self: TransactionObjectInput
  n: bigint | TransactionArgument
}

export function divideIntoN(tx: Transaction, typeArg: string, args: DivideIntoNArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::divide_into_n`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.self), pure(tx, args.n, `u64`)],
  })
}

export function fromBalance(tx: Transaction, typeArg: string, balance: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::from_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, balance)],
  })
}

export function getDecimals(tx: Transaction, typeArg: string, metadata: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::get_decimals`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function getDescription(tx: Transaction, typeArg: string, metadata: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::get_description`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function getIconUrl(tx: Transaction, typeArg: string, metadata: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::get_icon_url`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function getName(tx: Transaction, typeArg: string, metadata: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::get_name`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function getSymbol(tx: Transaction, typeArg: string, metadata: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::get_symbol`,
    typeArguments: [typeArg],
    arguments: [obj(tx, metadata)],
  })
}

export function intoBalance(tx: Transaction, typeArg: string, coin: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::into_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, coin)],
  })
}

export interface MintArgs {
  cap: TransactionObjectInput
  value: bigint | TransactionArgument
}

export function mint(tx: Transaction, typeArg: string, args: MintArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::mint`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.cap), pure(tx, args.value, `u64`)],
  })
}

export interface MintAndTransferArgs {
  c: TransactionObjectInput
  amount: bigint | TransactionArgument
  recipient: string | TransactionArgument
}

export function mintAndTransfer(tx: Transaction, typeArg: string, args: MintAndTransferArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::mint_and_transfer`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.c), pure(tx, args.amount, `u64`), pure(tx, args.recipient, `address`)],
  })
}

export interface MintBalanceArgs {
  cap: TransactionObjectInput
  value: bigint | TransactionArgument
}

export function mintBalance(tx: Transaction, typeArg: string, args: MintBalanceArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::mint_balance`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.cap), pure(tx, args.value, `u64`)],
  })
}

export interface PutArgs {
  balance: TransactionObjectInput
  coin: TransactionObjectInput
}

export function put(tx: Transaction, typeArg: string, args: PutArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::put`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.balance), obj(tx, args.coin)],
  })
}

export function supplyImmut(tx: Transaction, typeArg: string, treasury: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::supply_immut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasury)],
  })
}

export function supplyMut(tx: Transaction, typeArg: string, treasury: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::supply_mut`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasury)],
  })
}

export interface TakeArgs {
  balance: TransactionObjectInput
  value: bigint | TransactionArgument
}

export function take(tx: Transaction, typeArg: string, args: TakeArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::take`,
    typeArguments: [typeArg],
    arguments: [obj(tx, args.balance), pure(tx, args.value, `u64`)],
  })
}

export function totalSupply(tx: Transaction, typeArg: string, cap: TransactionObjectInput) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::total_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, cap)],
  })
}

export function treasuryIntoSupply(
  tx: Transaction,
  typeArg: string,
  treasury: TransactionObjectInput
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::treasury_into_supply`,
    typeArguments: [typeArg],
    arguments: [obj(tx, treasury)],
  })
}

export interface UpdateDescriptionArgs {
  treasury: TransactionObjectInput
  metadata: TransactionObjectInput
  description: string | TransactionArgument
}

export function updateDescription(tx: Transaction, typeArg: string, args: UpdateDescriptionArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::update_description`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasury),
      obj(tx, args.metadata),
      pure(tx, args.description, `${String.$typeName}`),
    ],
  })
}

export interface UpdateIconUrlArgs {
  treasury: TransactionObjectInput
  metadata: TransactionObjectInput
  url: string | TransactionArgument
}

export function updateIconUrl(tx: Transaction, typeArg: string, args: UpdateIconUrlArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::update_icon_url`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasury),
      obj(tx, args.metadata),
      pure(tx, args.url, `${String1.$typeName}`),
    ],
  })
}

export interface UpdateNameArgs {
  treasury: TransactionObjectInput
  metadata: TransactionObjectInput
  name: string | TransactionArgument
}

export function updateName(tx: Transaction, typeArg: string, args: UpdateNameArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::update_name`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasury),
      obj(tx, args.metadata),
      pure(tx, args.name, `${String.$typeName}`),
    ],
  })
}

export interface UpdateSymbolArgs {
  treasury: TransactionObjectInput
  metadata: TransactionObjectInput
  symbol: string | TransactionArgument
}

export function updateSymbol(tx: Transaction, typeArg: string, args: UpdateSymbolArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::coin::update_symbol`,
    typeArguments: [typeArg],
    arguments: [
      obj(tx, args.treasury),
      obj(tx, args.metadata),
      pure(tx, args.symbol, `${String1.$typeName}`),
    ],
  })
}
