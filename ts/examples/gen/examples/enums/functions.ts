import { PUBLISHED_AT } from '..'
import { Option } from '../../_dependencies/0x1/option/structs'
import { GenericArg, generic, obj, pure } from '../../_framework/util'
import { Transaction, TransactionArgument, TransactionObjectInput } from '@mysten/sui/transactions'

export interface CreateStopActionArgs {
  duration: number | TransactionArgument
  genericField: GenericArg
  phantomField: TransactionObjectInput
  reifiedField: bigint | TransactionArgument | null
}

export function createStopAction(
  tx: Transaction,
  typeArgs: [string, string],
  args: CreateStopActionArgs
) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::enums::create_stop_action`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.duration, `u32`),
      generic(tx, `${typeArgs[0]}`, args.genericField),
      obj(tx, args.phantomField),
      pure(tx, args.reifiedField, `${Option.$typeName}<u64>`),
    ],
  })
}

export function createActions(tx: Transaction) {
  return tx.moveCall({
    target: `${PUBLISHED_AT}::enums::create_actions`,
    arguments: [],
  })
}
