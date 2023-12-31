import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../_framework/util'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'

/* ============================== TxContext =============================== */

export function isTxContext(type: Type): boolean {
  type = compressSuiType(type)
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

  static get bcs() {
    return bcs.struct('TxContext', {
      sender: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      tx_hash: bcs.vector(bcs.u8()),
      epoch: bcs.u64(),
      epoch_timestamp_ms: bcs.u64(),
      ids_created: bcs.u64(),
    })
  }

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
      sender: item.fields.sender,
      txHash: item.fields.tx_hash.map((item: any) => item),
      epoch: BigInt(item.fields.epoch),
      epochTimestampMs: BigInt(item.fields.epoch_timestamp_ms),
      idsCreated: BigInt(item.fields.ids_created),
    })
  }

  static fromBcs(data: Uint8Array): TxContext {
    return TxContext.fromFields(TxContext.bcs.parse(data))
  }

  toJSON() {
    return {
      sender: this.sender,
      txHash: genericToJSON(`vector<u8>`, this.txHash),
      epoch: this.epoch.toString(),
      epochTimestampMs: this.epochTimestampMs.toString(),
      idsCreated: this.idsCreated.toString(),
    }
  }
}
