import { Encoding, bcsOnchain as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../../../_framework/util'

/* ============================== TxContext =============================== */

bcs.registerStructType('0x2::tx_context::TxContext', {
  sender: `address`,
  tx_hash: `vector<u8>`,
  epoch: `u64`,
  epoch_timestamp_ms: `u64`,
  ids_created: `u64`,
})

export function isTxContext(type: Type): boolean {
  return type === '0x2::tx_context::TxContext'
}

export interface TxContextFields {
  sender: string
  txHash: Array<number>
  epoch: bigint
  epochTimestampMs: bigint
  idsCreated: bigint
}

export class TxContext {
  static readonly $typeName = '0x2::tx_context::TxContext'
  static readonly $numTypeParams = 0

  readonly sender: string
  readonly txHash: Array<number>
  readonly epoch: bigint
  readonly epochTimestampMs: bigint
  readonly idsCreated: bigint

  constructor(fields: TxContextFields) {
    this.sender = fields.sender
    this.txHash = fields.txHash
    this.epoch = fields.epoch
    this.epochTimestampMs = fields.epochTimestampMs
    this.idsCreated = fields.idsCreated
  }

  static fromFields(fields: Record<string, any>): TxContext {
    return new TxContext({
      sender: `0x${fields.sender}`,
      txHash: fields.tx_hash.map((item: any) => item),
      epoch: BigInt(fields.epoch),
      epochTimestampMs: BigInt(fields.epoch_timestamp_ms),
      idsCreated: BigInt(fields.ids_created),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TxContext {
    if (!isTxContext(item.type)) {
      throw new Error('not a TxContext type')
    }
    return new TxContext({
      sender: `0x${item.fields.sender}`,
      txHash: item.fields.tx_hash.map((item: any) => item),
      epoch: BigInt(item.fields.epoch),
      epochTimestampMs: BigInt(item.fields.epoch_timestamp_ms),
      idsCreated: BigInt(item.fields.ids_created),
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): TxContext {
    return TxContext.fromFields(bcs.de([TxContext.$typeName], data, encoding))
  }
}
