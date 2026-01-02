import { PUBLISHED_AT } from '..'
import { obj, pure, vector } from '../../_framework/util'
import { String as String1 } from '../../move-stdlib-chain/ascii/structs'
import { Option } from '../../move-stdlib-chain/option/structs'
import { String } from '../../move-stdlib-chain/string/structs'
import { ID } from '../../sui-chain/object/structs'
import { ExampleStruct } from './structs'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export function createExampleStruct(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::examples::create_example_struct`,
    arguments: [],
  })
}

export interface SpecialTypesArgs {
  string1: string | TransactionArgument
  string2: string | TransactionArgument
  vecU64: Array<bigint | TransactionArgument> | TransactionArgument
  vecExampleStruct: Array<TransactionObjectInput> | TransactionArgument
  id: string | TransactionArgument
  address: string | TransactionArgument
  option1: bigint | TransactionArgument | null
  option2: bigint | TransactionArgument | null
}

export function specialTypes(tx: Transaction, args: SpecialTypesArgs) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::examples::special_types`,
    arguments: [
      pure(tx, args.string1, `${String1.$typeName}`),
      pure(tx, args.string2, `${String.$typeName}`),
      pure(tx, args.vecU64, `vector<u64>`),
      vector(tx, `${ExampleStruct.$typeName}`, args.vecExampleStruct),
      pure(tx, args.id, `${ID.$typeName}`),
      pure(tx, args.address, `address`),
      pure(tx, args.option1, `${Option.$typeName}<u64>`),
      pure(tx, args.option2, `${Option.$typeName}<u64>`),
    ],
  })
}
