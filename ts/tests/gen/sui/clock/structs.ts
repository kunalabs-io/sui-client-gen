import {
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
} from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Clock =============================== */

export function isClock(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::clock::Clock'
}

export interface ClockFields {
  id: ToField<UID>
  timestampMs: ToField<'u64'>
}

export class Clock {
  static readonly $typeName = '0x2::clock::Clock'
  static readonly $numTypeParams = 0

  readonly $typeName = Clock.$typeName

  static get bcs() {
    return bcs.struct('Clock', {
      id: UID.bcs,
      timestamp_ms: bcs.u64(),
    })
  }

  readonly id: ToField<UID>
  readonly timestampMs: ToField<'u64'>

  private constructor(fields: ClockFields) {
    this.id = fields.id
    this.timestampMs = fields.timestampMs
  }

  static new(fields: ClockFields): Clock {
    return new Clock(fields)
  }

  static reified() {
    return {
      typeName: Clock.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Clock.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Clock.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Clock.fromBcs(data),
      bcs: Clock.bcs,
      fromJSONField: (field: any) => Clock.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof Clock.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Clock {
    return Clock.new({
      id: decodeFromFields(UID.reified(), fields.id),
      timestampMs: decodeFromFields('u64', fields.timestamp_ms),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Clock {
    if (!isClock(item.type)) {
      throw new Error('not a Clock type')
    }

    return Clock.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      timestampMs: decodeFromFieldsWithTypes('u64', item.fields.timestamp_ms),
    })
  }

  static fromBcs(data: Uint8Array): Clock {
    return Clock.fromFields(Clock.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      timestampMs: this.timestampMs.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Clock {
    return Clock.new({
      id: decodeFromJSONField(UID.reified(), field.id),
      timestampMs: decodeFromJSONField('u64', field.timestampMs),
    })
  }

  static fromJSON(json: Record<string, any>): Clock {
    if (json.$typeName !== Clock.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Clock.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Clock {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isClock(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Clock object`)
    }
    return Clock.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Clock> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Clock object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isClock(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Clock object`)
    }
    return Clock.fromFieldsWithTypes(res.data.content)
  }
}
