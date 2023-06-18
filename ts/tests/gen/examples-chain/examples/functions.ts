import { PUBLISHED_AT } from '..'
import { ObjectArg, pure, vector } from '../../_framework/util'
import { ObjectId, TransactionArgument, TransactionBlock } from '@mysten/sui.js'

export function createExampleStruct(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::examples::create_example_struct`, arguments: [] })
}

export interface SpecialTypesArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
  vecU64: Array<bigint | TransactionArgument>
  vecExampleStruct: Array<ObjectArg>
  id: ObjectId | TransactionArgument
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
        `0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::examples::ExampleStruct`,
        args.vecExampleStruct
      ),
      pure(txb, args.id, `0x2::object::ID`),
      pure(txb, args.address, `address`),
      pure(txb, args.option1, `0x1::option::Option<u64>`),
      pure(txb, args.option2, `0x1::option::Option<u64>`),
    ],
  })
}
