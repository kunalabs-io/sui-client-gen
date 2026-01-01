import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Clock =============================== */

export function isClock(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::clock::Clock`
}

export interface ClockFields {
  id: ToField<UID>
  timestampMs: ToField<'u64'>
}

export type ClockReified = Reified<Clock, ClockFields>

export class Clock implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::clock::Clock`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Clock.$typeName
  readonly $fullTypeName: `0x2::clock::Clock`
  readonly $typeArgs: []
  readonly $isPhantom = Clock.$isPhantom

  readonly id: ToField<UID>
  readonly timestampMs: ToField<'u64'>

  private constructor(typeArgs: [], fields: ClockFields) {
    this.$fullTypeName = composeSuiType(Clock.$typeName, ...typeArgs) as `0x2::clock::Clock`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.timestampMs = fields.timestampMs
  }

  static reified(): ClockReified {
    const reifiedBcs = Clock.bcs
    return {
      typeName: Clock.$typeName,
      fullTypeName: composeSuiType(Clock.$typeName, ...[]) as `0x2::clock::Clock`,
      typeArgs: [] as [],
      isPhantom: Clock.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Clock.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Clock.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Clock.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Clock.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Clock.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Clock.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Clock.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Clock.fetch(client, id),
      new: (fields: ClockFields) => {
        return new Clock([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Clock.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Clock>> {
    return phantom(Clock.reified())
  }

  static get p() {
    return Clock.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Clock', {
      id: UID.bcs,
      timestamp_ms: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof Clock.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Clock.instantiateBcs> {
    if (!Clock.cachedBcs) {
      Clock.cachedBcs = Clock.instantiateBcs()
    }
    return Clock.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Clock {
    return Clock.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      timestampMs: decodeFromFields('u64', fields.timestamp_ms),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Clock {
    if (!isClock(item.type)) {
      throw new Error('not a Clock type')
    }

    return Clock.reified().new({
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Clock {
    return Clock.reified().new({
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

  static fromSuiObjectData(data: SuiObjectData): Clock {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isClock(data.bcs.type)) {
        throw new Error(`object at is not a Clock object`)
      }

      return Clock.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Clock.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Clock> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Clock object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isClock(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Clock object`)
    }

    return Clock.fromSuiObjectData(res.data)
  }
}
