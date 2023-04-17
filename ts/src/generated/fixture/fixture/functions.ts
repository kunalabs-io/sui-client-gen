import { TransactionBlock } from '@mysten/sui.js'
import { Type } from 'framework/type'
import { ObjectArg, obj } from 'framework/util'
import { PACKAGE_ID } from '..'

export function createWithGenericField(
  tx: TransactionBlock,
  typeArg: Type,
  genericField: ObjectArg
) {
  return tx.moveCall({
    target: `${PACKAGE_ID}::fixture::create_with_generic_field`,
    typeArguments: [typeArg],
    arguments: [obj(tx, genericField)],
  })
}
