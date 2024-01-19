import {
  ToField,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  reified,
} from '../../_framework/types'
import { FieldsWithTypes, compressSuiType, genericToJSON } from '../../_framework/util'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'

/* ============================== TxContext =============================== */

export function isTxContext(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::tx_context::TxContext'
}

export interface TxContextFields {
  sender: ToField<'address'>
  txHash: Array<ToField<'u8'>>
  epoch: ToField<'u64'>
  epochTimestampMs: ToField<'u64'>
  idsCreated: ToField<'u64'>
}

export class TxContext {
  static readonly $typeName = '0x2::tx_context::TxContext'
  static readonly $numTypeParams = 0

  readonly $typeName = TxContext.$typeName

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

  readonly sender: ToField<'address'>
  readonly txHash: Array<ToField<'u8'>>
  readonly epoch: ToField<'u64'>
  readonly epochTimestampMs: ToField<'u64'>
  readonly idsCreated: ToField<'u64'>

  private constructor(fields: TxContextFields) {
    this.sender = fields.sender
    this.txHash = fields.txHash
    this.epoch = fields.epoch
    this.epochTimestampMs = fields.epochTimestampMs
    this.idsCreated = fields.idsCreated
  }

  static new(fields: TxContextFields): TxContext {
    return new TxContext(fields)
  }

  static reified() {
    return {
      typeName: TxContext.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => TxContext.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TxContext.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TxContext.fromBcs(data),
      bcs: TxContext.bcs,
      __class: null as unknown as ReturnType<typeof TxContext.new>,
    }
  }

  static fromFields(fields: Record<string, any>): TxContext {
    return TxContext.new({
      sender: decodeFromFieldsGenericOrSpecial('address', fields.sender),
      txHash: decodeFromFieldsGenericOrSpecial(reified.vector('u8'), fields.tx_hash),
      epoch: decodeFromFieldsGenericOrSpecial('u64', fields.epoch),
      epochTimestampMs: decodeFromFieldsGenericOrSpecial('u64', fields.epoch_timestamp_ms),
      idsCreated: decodeFromFieldsGenericOrSpecial('u64', fields.ids_created),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TxContext {
    if (!isTxContext(item.type)) {
      throw new Error('not a TxContext type')
    }

    return TxContext.new({
      sender: decodeFromFieldsWithTypesGenericOrSpecial('address', item.fields.sender),
      txHash: decodeFromFieldsWithTypesGenericOrSpecial(reified.vector('u8'), item.fields.tx_hash),
      epoch: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.epoch),
      epochTimestampMs: decodeFromFieldsWithTypesGenericOrSpecial(
        'u64',
        item.fields.epoch_timestamp_ms
      ),
      idsCreated: decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.ids_created),
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
