import * as reified from '../../_framework/reified'
import {
  ToField,
  Vector,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'

/* ============================== TxContext =============================== */

export function isTxContext(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::tx_context::TxContext'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TxContextFields {
  sender: ToField<'address'>
  txHash: ToField<Vector<'u8'>>
  epoch: ToField<'u64'>
  epochTimestampMs: ToField<'u64'>
  idsCreated: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TxContext {
  static readonly $typeName = '0x2::tx_context::TxContext'
  static readonly $numTypeParams = 0

  __reifiedFullTypeString = null as unknown as '0x2::tx_context::TxContext'

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
  readonly txHash: ToField<Vector<'u8'>>
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
      fullTypeName: composeSuiType(TxContext.$typeName, ...[]) as '0x2::tx_context::TxContext',
      fromFields: (fields: Record<string, any>) => TxContext.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TxContext.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TxContext.fromBcs(data),
      bcs: TxContext.bcs,
      fromJSONField: (field: any) => TxContext.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof TxContext.new>,
    }
  }

  static fromFields(fields: Record<string, any>): TxContext {
    return TxContext.new({
      sender: decodeFromFields('address', fields.sender),
      txHash: decodeFromFields(reified.vector('u8'), fields.tx_hash),
      epoch: decodeFromFields('u64', fields.epoch),
      epochTimestampMs: decodeFromFields('u64', fields.epoch_timestamp_ms),
      idsCreated: decodeFromFields('u64', fields.ids_created),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TxContext {
    if (!isTxContext(item.type)) {
      throw new Error('not a TxContext type')
    }

    return TxContext.new({
      sender: decodeFromFieldsWithTypes('address', item.fields.sender),
      txHash: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.tx_hash),
      epoch: decodeFromFieldsWithTypes('u64', item.fields.epoch),
      epochTimestampMs: decodeFromFieldsWithTypes('u64', item.fields.epoch_timestamp_ms),
      idsCreated: decodeFromFieldsWithTypes('u64', item.fields.ids_created),
    })
  }

  static fromBcs(data: Uint8Array): TxContext {
    return TxContext.fromFields(TxContext.bcs.parse(data))
  }

  toJSONField() {
    return {
      sender: this.sender,
      txHash: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.txHash),
      epoch: this.epoch.toString(),
      epochTimestampMs: this.epochTimestampMs.toString(),
      idsCreated: this.idsCreated.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TxContext {
    return TxContext.new({
      sender: decodeFromJSONField('address', field.sender),
      txHash: decodeFromJSONField(reified.vector('u8'), field.txHash),
      epoch: decodeFromJSONField('u64', field.epoch),
      epochTimestampMs: decodeFromJSONField('u64', field.epochTimestampMs),
      idsCreated: decodeFromJSONField('u64', field.idsCreated),
    })
  }

  static fromJSON(json: Record<string, any>): TxContext {
    if (json.$typeName !== TxContext.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return TxContext.fromJSONField(json)
  }
}
