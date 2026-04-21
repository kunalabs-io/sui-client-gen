import {
  Transaction,
  TransactionArgument,
  TransactionObjectInput,
  TransactionResult,
} from '@mysten/sui/transactions'
import type { EnvConfig } from '../../_envs'
import { getPublishedAt } from '../../_envs'
import { generic, GenericArg, obj, pure } from '../../_framework/util'
import { Option } from '../../std/option/structs'

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
  options?: { env?: EnvConfig },
): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples', options?.env)}::enums::create_stop_action`,
    typeArguments: typeArgs,
    arguments: [
      pure(tx, args.duration, `u32`),
      generic(tx, `${typeArgs[0]}`, args.genericField),
      obj(tx, args.phantomField),
      pure(tx, args.reifiedField, `${Option.$typeName}<u64>`),
    ],
  })
}

export function createActions(tx: Transaction, options?: { env?: EnvConfig }): TransactionResult {
  return tx.moveCall({
    target: `${getPublishedAt('examples', options?.env)}::enums::create_actions`,
    arguments: [],
  })
}
