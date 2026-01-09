import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { String as String1 } from '../../_dependencies/std/ascii/structs'
import { Option } from '../../_dependencies/std/option/structs'
import { String } from '../../_dependencies/std/string/structs'
import { getPublishedAt } from '../../_envs'
import { obj, pure, vector } from '../../_framework/util'
import { ID } from '../../sui/object/structs'
import { ExampleStruct } from './structs'

export function createExampleStruct(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::examples::create_example_struct`,
    arguments: [],
  })
}

export interface SpecialTypesArgs {
  asciiString: string | TransactionArgument
  utf8String: string | TransactionArgument
  vectorOfU64: Array<bigint | TransactionArgument> | TransactionArgument
  vectorOfObjects: Array<TransactionObjectInput> | TransactionArgument
  idField: string | TransactionArgument
  address: string | TransactionArgument
  optionSome: bigint | TransactionArgument | null
  optionNone: bigint | TransactionArgument | null
}

export function specialTypes(tx: Transaction, args: SpecialTypesArgs): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::examples::special_types`,
    arguments: [
      pure(tx, args.asciiString, `${String1.$typeName}`),
      pure(tx, args.utf8String, `${String.$typeName}`),
      pure(tx, args.vectorOfU64, `vector<u64>`),
      vector(tx, `${ExampleStruct.$typeName}`, args.vectorOfObjects),
      pure(tx, args.idField, `${ID.$typeName}`),
      pure(tx, args.address, `address`),
      pure(tx, args.optionSome, `${Option.$typeName}<u64>`),
      pure(tx, args.optionNone, `${Option.$typeName}<u64>`),
    ],
  })
}
