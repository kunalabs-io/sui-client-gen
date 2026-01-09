import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import { Option } from '../../_dependencies/std/option/structs'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure } from '../../_framework/util'

export interface CreateStopActionArgs {
  duration: number | TransactionArgument
  genericField: GenericArg
  phantomField: TransactionObjectInput
  reifiedField: bigint | TransactionArgument | null
}

export function createStopAction(
  tx: Transaction,
  typeArgs: [string, string],
  args: CreateStopActionArgs,
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::enums::create_stop_action`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.duration, `u32`),
      generic(tx, `${typeArgs[0]}`, args.genericField),
      obj(tx, args.phantomField),
      pure(tx, args.reifiedField, `${Option.$typeName}<u64>`),
    ],
  })
}

export function createActions(tx: Transaction): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples')}::enums::create_actions`,
    arguments: [],
  })
}
