import { PUBLISHED_AT } from '..'
import { ObjectArg, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function createExampleStruct(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::examples::create_example_struct`, arguments: [] })
}

export interface SpecialTypesArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
  vecU64: Array<bigint | TransactionArgument> | TransactionArgument
  vecExampleStruct: Array<ObjectArg> | TransactionArgument
  id: string | TransactionArgument
  address: string | TransactionArgument
  option1: bigint | TransactionArgument | TransactionArgument | null
  option2: bigint | TransactionArgument | TransactionArgument | null
}

export function specialTypes(txb: TransactionBlock, args: SpecialTypesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::examples::special_types`,
    arguments: [
      pure(txb, args.string1, `0x1::ascii::String`),
      pure(txb, args.string2, `0x1::string::String`),
      pure(txb, args.vecU64, `vector<u64>`),
      vector(
        txb,
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::examples::ExampleStruct`,
        args.vecExampleStruct
      ),
      pure(txb, args.id, `0x2::object::ID`),
      pure(txb, args.address, `address`),
      pure(txb, args.option1, `0x1::option::Option<u64>`),
      pure(txb, args.option2, `0x1::option::Option<u64>`),
    ],
  })
}
