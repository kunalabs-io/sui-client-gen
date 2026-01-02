import { PUBLISHED_AT } from '..'
import { GenericArg, generic, obj, option, pure, vector } from '../../_framework/util'
import { String as String1 } from '../../move-stdlib-chain/ascii/structs'
import { Option } from '../../move-stdlib-chain/option/structs'
import { String } from '../../move-stdlib-chain/string/structs'
import { ID } from '../../sui-chain/object/structs'
import { Bar, WithTwoGenerics } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function createWithGenericField(tx: Transaction, typeArg: string, t0: GenericArg) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_with_generic_field`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, t0)],
  })
}

export function createBar(tx: Transaction, u64: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_bar`,
    arguments: [pure(tx, u64, `u64`)],
  })
}

export interface CreateWithTwoGenericsArgs {
  t0: GenericArg
  t1: GenericArg
}

export function createWithTwoGenerics(
  tx: Transaction,
  typeArgs: [string, string],
  args: CreateWithTwoGenericsArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_with_two_generics`,
    typeArguments: typeArgs,
    arguments: [generic(tx, `${typeArgs[0]}`, args.t0), generic(tx, `${typeArgs[1]}`, args.t1)],
  })
}

export interface CreateFooArgs {
  t0: GenericArg
  vecU64: Array<bigint | TransactionArgument> | TransactionArgument
  vecBar: Array<TransactionObjectInput> | TransactionArgument
  vecT0: Array<GenericArg> | TransactionArgument
  vecWithTwoGenerics1: Array<TransactionObjectInput> | TransactionArgument
  withTwoGenerics1: TransactionObjectInput
  withTwoGenerics2: TransactionObjectInput
  withTwoGenerics3: TransactionObjectInput
  withTwoGenerics4: TransactionObjectInput
  withTwoGenerics5: TransactionObjectInput
  vecWithTwoGenerics2: Array<TransactionObjectInput> | TransactionArgument
  bar: TransactionObjectInput
}

export function createFoo(tx: Transaction, typeArgs: [string, string], args: CreateFooArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_foo`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[0]}`, args.t0),
      pure(tx, args.vecU64, `vector<u64>`),
      vector(tx, `${Bar.$typeName}`, args.vecBar),
      vector(tx, `${typeArgs[0]}`, args.vecT0),
      vector(tx, `${WithTwoGenerics.$typeName}<${typeArgs[0]}, u8>`, args.vecWithTwoGenerics1),
      obj(tx, args.withTwoGenerics1),
      obj(tx, args.withTwoGenerics2),
      obj(tx, args.withTwoGenerics3),
      obj(tx, args.withTwoGenerics4),
      obj(tx, args.withTwoGenerics5),
      vector(
        tx,
        `${WithTwoGenerics.$typeName}<${Bar.$typeName}, vector<${WithTwoGenerics.$typeName}<${typeArgs[0]}, u8>>>`,
        args.vecWithTwoGenerics2
      ),
      obj(tx, args.bar),
    ],
  })
}

export interface CreateSpecialArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
  url: TransactionObjectInput
  id: string | TransactionArgument
  uid: TransactionObjectInput
  balance1: TransactionObjectInput
  option1: bigint | TransactionArgument | null
  option2: TransactionObjectInput | null
  option3: bigint | TransactionArgument | null
  balance2: TransactionObjectInput
  option4: GenericArg | null
  option5: GenericArg | null
}

export function createSpecial(
  tx: Transaction,
  typeArgs: [string, string],
  args: CreateSpecialArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_special`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.string1, `${String.$typeName}`),
      pure(tx, args.string2, `${String1.$typeName}`),
      obj(tx, args.url),
      pure(tx, args.id, `${ID.$typeName}`),
      obj(tx, args.uid),
      obj(tx, args.balance1),
      pure(tx, args.option1, `${Option.$typeName}<u64>`),
      option(tx, `${Bar.$typeName}`, args.option2),
      pure(tx, args.option3, `${Option.$typeName}<u64>`),
      obj(tx, args.balance2),
      option(tx, `${typeArgs[1]}`, args.option4),
      option(tx, `${typeArgs[1]}`, args.option5),
    ],
  })
}

export interface CreateSpecialAsGenericsArgs {
  t0: GenericArg
  t1: GenericArg
  t2: GenericArg
  t3: GenericArg
  t4: GenericArg
  t5: GenericArg
  t6: GenericArg
  t7: GenericArg
}

export function createSpecialAsGenerics(
  tx: Transaction,
  typeArgs: [string, string, string, string, string, string, string, string],
  args: CreateSpecialAsGenericsArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_special_as_generics`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[0]}`, args.t0),
      generic(tx, `${typeArgs[1]}`, args.t1),
      generic(tx, `${typeArgs[2]}`, args.t2),
      generic(tx, `${typeArgs[3]}`, args.t3),
      generic(tx, `${typeArgs[4]}`, args.t4),
      generic(tx, `${typeArgs[5]}`, args.t5),
      generic(tx, `${typeArgs[6]}`, args.t6),
      generic(tx, `${typeArgs[7]}`, args.t7),
    ],
  })
}

export interface CreateSpecialInVectorsArgs {
  vecString1: Array<string | TransactionArgument> | TransactionArgument
  vecString2: Array<string | TransactionArgument> | TransactionArgument
  vecId: Array<string | TransactionArgument> | TransactionArgument
  vecBar: Array<TransactionObjectInput> | TransactionArgument
  vecOption1: Array<bigint | TransactionArgument | null> | TransactionArgument
  vecOption2: Array<GenericArg | null> | TransactionArgument
}

export function createSpecialInVectors(
  tx: Transaction,
  typeArg: string,
  args: CreateSpecialInVectorsArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_special_in_vectors`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.vecString1, `vector<${String.$typeName}>`),
      pure(tx, args.vecString2, `vector<${String1.$typeName}>`),
      pure(tx, args.vecId, `vector<${ID.$typeName}>`),
      vector(tx, `${Bar.$typeName}`, args.vecBar),
      pure(tx, args.vecOption1, `vector<${Option.$typeName}<u64>>`),
      vector(tx, `${Option.$typeName}<${typeArg}>`, args.vecOption2),
    ],
  })
}
