import { PUBLISHED_AT } from '..'
import { ObjectArg, pure, vector } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function createExampleStruct(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::examples::create_example_struct`, arguments: [] })
}

export interface SpecialTypesArgs {
  asciiString: string | TransactionArgument
  utf8String: string | TransactionArgument
  vectorOfU64: Array<bigint | TransactionArgument> | TransactionArgument
  vectorOfObjects: Array<ObjectArg> | TransactionArgument
  idField: string | TransactionArgument
  address: string | TransactionArgument
  optionSome: bigint | TransactionArgument | TransactionArgument | null
  optionNone: bigint | TransactionArgument | TransactionArgument | null
}

export function specialTypes(txb: TransactionBlock, args: SpecialTypesArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::examples::special_types`,
    arguments: [
      pure(txb, args.asciiString, `0x1::ascii::String`),
      pure(txb, args.utf8String, `0x1::string::String`),
      pure(txb, args.vectorOfU64, `vector<u64>`),
      vector(
        txb,
        `0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::examples::ExampleStruct`,
        args.vectorOfObjects
      ),
      pure(txb, args.idField, `0x2::object::ID`),
      pure(txb, args.address, `address`),
      pure(txb, args.optionSome, `0x1::option::Option<u64>`),
      pure(txb, args.optionNone, `0x1::option::Option<u64>`),
    ],
  })
}
