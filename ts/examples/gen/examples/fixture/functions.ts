import { PUBLISHED_AT } from '..'
import {
  GenericArg,
  ObjectArg,
  Type,
  generic,
  obj,
  option,
  pure,
  vector,
} from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function createBar(txb: TransactionBlock, value: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_bar`,
    arguments: [pure(txb, value, `u64`)],
  })
}

export interface CreateFooArgs {
  generic: GenericArg
  reifiedPrimitiveVec: Array<bigint | TransactionArgument> | TransactionArgument
  reifiedObjectVec: Array<ObjectArg> | TransactionArgument
  genericVec: Array<GenericArg> | TransactionArgument
  genericVecNested: Array<ObjectArg> | TransactionArgument
  twoGenerics: ObjectArg
  twoGenericsReifiedPrimitive: ObjectArg
  twoGenericsReifiedObject: ObjectArg
  twoGenericsNested: ObjectArg
  twoGenericsReifiedNested: ObjectArg
  twoGenericsNestedVec: Array<ObjectArg> | TransactionArgument
  objRef: ObjectArg
}

export function createFoo(txb: TransactionBlock, typeArgs: [Type, Type], args: CreateFooArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_foo`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[0]}`, args.generic),
      pure(txb, args.reifiedPrimitiveVec, `vector<u64>`),
      vector(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
        args.reifiedObjectVec
      ),
      vector(txb, `${typeArgs[0]}`, args.genericVec),
      vector(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<${typeArgs[0]}, u8>`,
        args.genericVecNested
      ),
      obj(txb, args.twoGenerics),
      obj(txb, args.twoGenericsReifiedPrimitive),
      obj(txb, args.twoGenericsReifiedObject),
      obj(txb, args.twoGenericsNested),
      obj(txb, args.twoGenericsReifiedNested),
      vector(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar, vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<${typeArgs[0]}, u8>>>`,
        args.twoGenericsNestedVec
      ),
      obj(txb, args.objRef),
    ],
  })
}

export interface CreateSpecialArgs {
  string: string | TransactionArgument
  asciiString: string | TransactionArgument
  url: ObjectArg
  idField: string | TransactionArgument
  uid: ObjectArg
  balance: ObjectArg
  option: bigint | TransactionArgument | TransactionArgument | null
  optionObj: ObjectArg | TransactionArgument | null
  optionNone: bigint | TransactionArgument | TransactionArgument | null
  balanceGeneric: ObjectArg
  optionGeneric: GenericArg | TransactionArgument | null
  optionGenericNone: GenericArg | TransactionArgument | null
}

export function createSpecial(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: CreateSpecialArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_special`,
    typeArguments: typeArgs,
    arguments: [
      pure(txb, args.string, `0x1::string::String`),
      pure(txb, args.asciiString, `0x1::ascii::String`),
      obj(txb, args.url),
      pure(txb, args.idField, `0x2::object::ID`),
      obj(txb, args.uid),
      obj(txb, args.balance),
      pure(txb, args.option, `0x1::option::Option<u64>`),
      option(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
        args.optionObj
      ),
      pure(txb, args.optionNone, `0x1::option::Option<u64>`),
      obj(txb, args.balanceGeneric),
      option(txb, `${typeArgs[1]}`, args.optionGeneric),
      option(txb, `${typeArgs[1]}`, args.optionGenericNone),
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
  txb: TransactionBlock,
  typeArgs: [Type, Type, Type, Type, Type, Type, Type, Type],
  args: CreateSpecialAsGenericsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_special_as_generics`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[0]}`, args.string),
      generic(txb, `${typeArgs[1]}`, args.asciiString),
      generic(txb, `${typeArgs[2]}`, args.url),
      generic(txb, `${typeArgs[3]}`, args.idField),
      generic(txb, `${typeArgs[4]}`, args.uid),
      generic(txb, `${typeArgs[5]}`, args.balance),
      generic(txb, `${typeArgs[6]}`, args.option),
      generic(txb, `${typeArgs[7]}`, args.optionNone),
    ],
  })
}

export interface CreateSpecialInVectorsArgs {
  string: Array<string | TransactionArgument> | TransactionArgument
  asciiString: Array<string | TransactionArgument> | TransactionArgument
  idField: Array<string | TransactionArgument> | TransactionArgument
  bar: Array<ObjectArg> | TransactionArgument
  option: Array<bigint | TransactionArgument | TransactionArgument | null> | TransactionArgument
  optionGeneric: Array<GenericArg | TransactionArgument | null> | TransactionArgument
}

export function createSpecialInVectors(
  txb: TransactionBlock,
  typeArg: Type,
  args: CreateSpecialInVectorsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_special_in_vectors`,
    typeArguments: [typeArg],
    arguments: [
      pure(txb, args.string, `vector<0x1::string::String>`),
      pure(txb, args.asciiString, `vector<0x1::ascii::String>`),
      pure(txb, args.idField, `vector<0x2::object::ID>`),
      vector(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
        args.bar
      ),
      pure(txb, args.option, `vector<0x1::option::Option<u64>>`),
      vector(txb, `0x1::option::Option<${typeArg}>`, args.optionGeneric),
    ],
  })
}

export function createWithGenericField(
  txb: TransactionBlock,
  typeArg: Type,
  genericField: GenericArg
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_with_generic_field`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, genericField)],
  })
}

export interface CreateWithTwoGenericsArgs {
  genericField1: GenericArg
  genericField2: GenericArg
}

export function createWithTwoGenerics(
  txb: TransactionBlock,
  typeArgs: [Type, Type],
  args: CreateWithTwoGenericsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_with_two_generics`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[0]}`, args.genericField1),
      generic(txb, `${typeArgs[1]}`, args.genericField2),
    ],
  })
}
