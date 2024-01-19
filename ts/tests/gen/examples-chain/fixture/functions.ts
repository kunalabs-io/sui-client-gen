import { PUBLISHED_AT } from '..'
import { GenericArg, ObjectArg, generic, obj, option, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function createWithGenericField(txb: TransactionBlock, typeArg: string, t0: GenericArg) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_with_generic_field`,
    typeArguments: [typeArg],
    arguments: [generic(txb, `${typeArg}`, t0)],
  })
}

export function createBar(txb: TransactionBlock, u64: bigint | TransactionArgument) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_bar`,
    arguments: [pure(txb, u64, `u64`)],
  })
}

export interface CreateWithTwoGenericsArgs {
  t0: GenericArg
  t1: GenericArg
}

export function createWithTwoGenerics(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: CreateWithTwoGenericsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_with_two_generics`,
    typeArguments: typeArgs,
    arguments: [generic(txb, `${typeArgs[0]}`, args.t0), generic(txb, `${typeArgs[1]}`, args.t1)],
  })
}

export interface CreateFooArgs {
  t0: GenericArg
  vecU64: Array<bigint | TransactionArgument> | TransactionArgument
  vecBar: Array<ObjectArg> | TransactionArgument
  vecT0: Array<GenericArg> | TransactionArgument
  vecWithTwoGenerics1: Array<ObjectArg> | TransactionArgument
  withTwoGenerics1: ObjectArg
  withTwoGenerics2: ObjectArg
  withTwoGenerics3: ObjectArg
  withTwoGenerics4: ObjectArg
  withTwoGenerics5: ObjectArg
  vecWithTwoGenerics2: Array<ObjectArg> | TransactionArgument
  bar: ObjectArg
}

export function createFoo(txb: TransactionBlock, typeArgs: [string, string], args: CreateFooArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_foo`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[0]}`, args.t0),
      pure(txb, args.vecU64, `vector<u64>`),
      vector(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
        args.vecBar
      ),
      vector(txb, `${typeArgs[0]}`, args.vecT0),
      vector(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<${typeArgs[0]}, u8>`,
        args.vecWithTwoGenerics1
      ),
      obj(txb, args.withTwoGenerics1),
      obj(txb, args.withTwoGenerics2),
      obj(txb, args.withTwoGenerics3),
      obj(txb, args.withTwoGenerics4),
      obj(txb, args.withTwoGenerics5),
      vector(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar, vector<0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::WithTwoGenerics<${typeArgs[0]}, u8>>>`,
        args.vecWithTwoGenerics2
      ),
      obj(txb, args.bar),
    ],
  })
}

export interface CreateSpecialArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
  url: ObjectArg
  id: string | TransactionArgument
  uid: ObjectArg
  balance1: ObjectArg
  option1: bigint | TransactionArgument | TransactionArgument | null
  option2: ObjectArg | TransactionArgument | null
  option3: bigint | TransactionArgument | TransactionArgument | null
  balance2: ObjectArg
  option4: GenericArg | TransactionArgument | null
  option5: GenericArg | TransactionArgument | null
}

export function createSpecial(
  txb: TransactionBlock,
  typeArgs: [string, string],
  args: CreateSpecialArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_special`,
    typeArguments: typeArgs,
    arguments: [
      pure(txb, args.string1, `0x1::string::String`),
      pure(txb, args.string2, `0x1::ascii::String`),
      obj(txb, args.url),
      pure(txb, args.id, `0x2::object::ID`),
      obj(txb, args.uid),
      obj(txb, args.balance1),
      pure(txb, args.option1, `0x1::option::Option<u64>`),
      option(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
        args.option2
      ),
      pure(txb, args.option3, `0x1::option::Option<u64>`),
      obj(txb, args.balance2),
      option(txb, `${typeArgs[1]}`, args.option4),
      option(txb, `${typeArgs[1]}`, args.option5),
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
  txb: TransactionBlock,
  typeArgs: [string, string, string, string, string, string, string, string],
  args: CreateSpecialAsGenericsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_special_as_generics`,
    typeArguments: typeArgs,
    arguments: [
      generic(txb, `${typeArgs[0]}`, args.t0),
      generic(txb, `${typeArgs[1]}`, args.t1),
      generic(txb, `${typeArgs[2]}`, args.t2),
      generic(txb, `${typeArgs[3]}`, args.t3),
      generic(txb, `${typeArgs[4]}`, args.t4),
      generic(txb, `${typeArgs[5]}`, args.t5),
      generic(txb, `${typeArgs[6]}`, args.t6),
      generic(txb, `${typeArgs[7]}`, args.t7),
    ],
  })
}

export interface CreateSpecialInVectorsArgs {
  vecString1: Array<string | TransactionArgument> | TransactionArgument
  vecString2: Array<string | TransactionArgument> | TransactionArgument
  vecId: Array<string | TransactionArgument> | TransactionArgument
  vecBar: Array<ObjectArg> | TransactionArgument
  vecOption1: Array<bigint | TransactionArgument | TransactionArgument | null> | TransactionArgument
  vecOption2: Array<GenericArg | TransactionArgument | null> | TransactionArgument
}

export function createSpecialInVectors(
  txb: TransactionBlock,
  typeArg: string,
  args: CreateSpecialInVectorsArgs
) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::fixture::create_special_in_vectors`,
    typeArguments: [typeArg],
    arguments: [
      pure(txb, args.vecString1, `vector<0x1::string::String>`),
      pure(txb, args.vecString2, `vector<0x1::ascii::String>`),
      pure(txb, args.vecId, `vector<0x2::object::ID>`),
      vector(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::fixture::Bar`,
        args.vecBar
      ),
      pure(txb, args.vecOption1, `vector<0x1::option::Option<u64>>`),
      vector(txb, `0x1::option::Option<${typeArg}>`, args.vecOption2),
    ],
  })
}
