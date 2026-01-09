/**
 * APIs for accessing time from move calls, via the `Clock`: a unique
 * shared object that is created at 0x6 during genesis.
 */

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
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
} from '../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Clock =============================== */

export function isClock(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::clock::Clock`
}

export interface ClockFields {
  id: ToField<UID>
  /**
   * The clock's timestamp, which is set automatically by a
   * system transaction every time consensus commits a
   * schedule, or by `sui::clock::increment_for_testing` during
   * testing.
   */
  timestampMs: ToField<'u64'>
}

export type ClockReified = Reified<Clock, ClockFields>

/**
 * Singleton shared object that exposes time to Move calls.  This
 * object is found at address 0x6, and can only be read (accessed
 * via an immutable reference) by entry functions.
 *
 * Entry Functions that attempt to accept `Clock` by mutable
 * reference or value will fail to verify, and honest validators
 * will not sign or execute transactions that use `Clock` as an
 * input parameter, unless it is passed by immutable reference.
 */
export class Clock implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::clock::Clock` = `0x2::clock::Clock` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof Clock.$typeName = Clock.$typeName
  readonly $fullTypeName: `0x2::clock::Clock`
  readonly $typeArgs: []
  readonly $isPhantom: typeof Clock.$isPhantom = Clock.$isPhantom

  readonly id: ToField<UID>
  /**
   * The clock's timestamp, which is set automatically by a
   * system transaction every time consensus commits a
   * schedule, or by `sui::clock::increment_for_testing` during
   * testing.
   */
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
      fetch: async (client: SupportedSuiClient, id: string) => Clock.fetch(client, id),
      new: (fields: ClockFields) => {
        return new Clock([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): ClockReified {
    return Clock.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Clock>> {
    return phantom(Clock.reified())
  }

  static get p(): PhantomReified<ToTypeStr<Clock>> {
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

  toJSONField(): Record<string, any> {
    return {
      id: this.id,
      timestampMs: this.timestampMs.toString(),
    }
  }

  toJSON(): Record<string, any> {
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
      throw new Error(
        `not a Clock json object: expected '${Clock.$typeName}' but got '${json.$typeName}'`
      )
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

      return Clock.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Clock.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Clock> {
    const res = await fetchObjectBcs(client, id)
    if (!isClock(res.type)) {
      throw new Error(`object at id ${id} is not a Clock object`)
    }

    return Clock.fromBcs(res.bcsBytes)
  }
}
