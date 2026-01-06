import { String as String1 } from '../../_dependencies/std/ascii/structs'
import { Option } from '../../_dependencies/std/option/structs'
import { String } from '../../_dependencies/std/string/structs'
import { getPublishedAt } from '../../_envs'
import { GenericArg, generic, obj, option, pure, vector } from '../../_framework/util'
import { ID } from '../../sui/object/structs'
import { Bar, WithTwoGenerics } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function createWithGenericField(tx: Transaction, typeArg: string, genericField: GenericArg) {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::fixture::create_with_generic_field`,
    typeArguments: [typeArg],
    arguments: [generic(tx, `${typeArg}`, genericField)],
  })
}

export function createBar(tx: Transaction, value: bigint | TransactionArgument) {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::fixture::create_bar`,
    arguments: [pure(tx, value, `u64`)],
  })
}

export interface CreateWithTwoGenericsArgs {
  genericField1: GenericArg
  genericField2: GenericArg
}

export function createWithTwoGenerics(
  tx: Transaction,
  typeArgs: [string, string],
  args: CreateWithTwoGenericsArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::fixture::create_with_two_generics`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[0]}`, args.genericField1),
      generic(tx, `${typeArgs[1]}`, args.genericField2),
    ],
  })
}

export interface CreateFooArgs {
  generic: GenericArg
  reifiedPrimitiveVec: Array<bigint | TransactionArgument> | TransactionArgument
  reifiedObjectVec: Array<TransactionObjectInput> | TransactionArgument
  genericVec: Array<GenericArg> | TransactionArgument
  genericVecNested: Array<TransactionObjectInput> | TransactionArgument
  twoGenerics: TransactionObjectInput
  twoGenericsReifiedPrimitive: TransactionObjectInput
  twoGenericsReifiedObject: TransactionObjectInput
  twoGenericsNested: TransactionObjectInput
  twoGenericsReifiedNested: TransactionObjectInput
  twoGenericsNestedVec: Array<TransactionObjectInput> | TransactionArgument
  objRef: TransactionObjectInput
}

export function createFoo(tx: Transaction, typeArgs: [string, string], args: CreateFooArgs) {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::fixture::create_foo`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[0]}`, args.generic),
      pure(tx, args.reifiedPrimitiveVec, `vector<u64>`),
      vector(tx, `${Bar.$typeName}`, args.reifiedObjectVec),
      vector(tx, `${typeArgs[0]}`, args.genericVec),
      vector(tx, `${WithTwoGenerics.$typeName}<${typeArgs[0]}, u8>`, args.genericVecNested),
      obj(tx, args.twoGenerics),
      obj(tx, args.twoGenericsReifiedPrimitive),
      obj(tx, args.twoGenericsReifiedObject),
      obj(tx, args.twoGenericsNested),
      obj(tx, args.twoGenericsReifiedNested),
      vector(
        tx,
        `${WithTwoGenerics.$typeName}<${Bar.$typeName}, vector<${WithTwoGenerics.$typeName}<${typeArgs[0]}, u8>>>`,
        args.twoGenericsNestedVec
      ),
      obj(tx, args.objRef),
    ],
  })
}

export interface CreateSpecialArgs {
  string: string | TransactionArgument
  asciiString: string | TransactionArgument
  url: TransactionObjectInput
  idField: string | TransactionArgument
  uid: TransactionObjectInput
  balance: TransactionObjectInput
  option: bigint | TransactionArgument | null
  optionObj: TransactionObjectInput | null
  optionNone: bigint | TransactionArgument | null
  balanceGeneric: TransactionObjectInput
  optionGeneric: GenericArg | null
  optionGenericNone: GenericArg | null
}

export function createSpecial(
  tx: Transaction,
  typeArgs: [string, string],
  args: CreateSpecialArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::fixture::create_special`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.string, `${String.$typeName}`),
      pure(tx, args.asciiString, `${String1.$typeName}`),
      obj(tx, args.url),
      pure(tx, args.idField, `${ID.$typeName}`),
      obj(tx, args.uid),
      obj(tx, args.balance),
      pure(tx, args.option, `${Option.$typeName}<u64>`),
      option(tx, `${Bar.$typeName}`, args.optionObj),
      pure(tx, args.optionNone, `${Option.$typeName}<u64>`),
      obj(tx, args.balanceGeneric),
      option(tx, `${typeArgs[1]}`, args.optionGeneric),
      option(tx, `${typeArgs[1]}`, args.optionGenericNone),
    ],
  })
}

export interface CreateSpecialAsGenericsArgs {
  string: GenericArg
  asciiString: GenericArg
  url: GenericArg
  idField: GenericArg
  uid: GenericArg
  balance: GenericArg
  option: GenericArg
  optionNone: GenericArg
}

export function createSpecialAsGenerics(
  tx: Transaction,
  typeArgs: [string, string, string, string, string, string, string, string],
  args: CreateSpecialAsGenericsArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::fixture::create_special_as_generics`,
    typeArguments: typeArgs,
    arguments: [
      generic(tx, `${typeArgs[0]}`, args.string),
      generic(tx, `${typeArgs[1]}`, args.asciiString),
      generic(tx, `${typeArgs[2]}`, args.url),
      generic(tx, `${typeArgs[3]}`, args.idField),
      generic(tx, `${typeArgs[4]}`, args.uid),
      generic(tx, `${typeArgs[5]}`, args.balance),
      generic(tx, `${typeArgs[6]}`, args.option),
      generic(tx, `${typeArgs[7]}`, args.optionNone),
    ],
  })
}

export interface CreateSpecialInVectorsArgs {
  string: Array<string | TransactionArgument> | TransactionArgument
  asciiString: Array<string | TransactionArgument> | TransactionArgument
  idField: Array<string | TransactionArgument> | TransactionArgument
  bar: Array<TransactionObjectInput> | TransactionArgument
  option: Array<bigint | TransactionArgument | null> | TransactionArgument
  optionGeneric: Array<GenericArg | null> | TransactionArgument
}

export function createSpecialInVectors(
  tx: Transaction,
  typeArg: string,
  args: CreateSpecialInVectorsArgs
) {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::fixture::create_special_in_vectors`,
    typeArguments: [typeArg],
    arguments: [
      pure(tx, args.string, `vector<${String.$typeName}>`),
      pure(tx, args.asciiString, `vector<${String1.$typeName}>`),
      pure(tx, args.idField, `vector<${ID.$typeName}>`),
      vector(tx, `${Bar.$typeName}`, args.bar),
      pure(tx, args.option, `vector<${Option.$typeName}<u64>>`),
      vector(tx, `${Option.$typeName}<${typeArg}>`, args.optionGeneric),
    ],
  })
}
