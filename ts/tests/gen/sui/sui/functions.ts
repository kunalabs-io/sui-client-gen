import { PUBLISHED_AT } from '..'
import { ObjectArg, obj, pure } from '../../_framework/util'
import { TransactionArgument, TransactionBlock } from '@mysten/sui.js/transactions'

export function new_(txb: TransactionBlock) {
  return txb.moveCall({ target: `${PUBLISHED_AT}::sui::new`, arguments: [] })
}

export interface TransferArgs {
  c: ObjectArg
  recipient: string | TransactionArgument
}

export function transfer(txb: TransactionBlock, args: TransferArgs) {
  return txb.moveCall({
    target: `${PUBLISHED_AT}::sui::transfer`,
    arguments: [obj(txb, args.c), pure(txb, args.recipient, `address`)],
  })
}
