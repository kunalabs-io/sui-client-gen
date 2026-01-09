/**
 * Defines a fixed-point numeric type with a 32-bit integer part and
 * a 32-bit fractional part.
 */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
} from '../../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  SupportedSuiClient,
} from '../../../_framework/util'

/* ============================== FixedPoint32 =============================== */

export function isFixedPoint32(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x1::fixed_point32::FixedPoint32`
}

export interface FixedPoint32Fields {
  value: ToField<'u64'>
}

export type FixedPoint32Reified = Reified<FixedPoint32, FixedPoint32Fields>

export type FixedPoint32JSONField = {
  value: string
}

export type FixedPoint32JSON = {
  $typeName: typeof FixedPoint32.$typeName
  $typeArgs: []
} & FixedPoint32JSONField

/**
 * Define a fixed-point numeric type with 32 fractional bits.
 * This is just a u64 integer but it is wrapped in a struct to
 * make a unique type. This is a binary representation, so decimal
 * values may not be exactly representable, but it provides more
 * than 9 decimal digits of precision both before and after the
 * decimal point (18 digits total). For comparison, double precision
 * floating-point has less than 16 decimal digits of precision, so
 * be careful about using floating-point to convert these values to
 * decimal.
 */
export class FixedPoint32 implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x1::fixed_point32::FixedPoint32` =
    `0x1::fixed_point32::FixedPoint32` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof FixedPoint32.$typeName = FixedPoint32.$typeName
  readonly $fullTypeName: `0x1::fixed_point32::FixedPoint32`
  readonly $typeArgs: []
  readonly $isPhantom: typeof FixedPoint32.$isPhantom = FixedPoint32.$isPhantom

  readonly value: ToField<'u64'>

  private constructor(typeArgs: [], fields: FixedPoint32Fields) {
    this.$fullTypeName = composeSuiType(
      FixedPoint32.$typeName,
      ...typeArgs,
    ) as `0x1::fixed_point32::FixedPoint32`
    this.$typeArgs = typeArgs

    this.value = fields.value
  }

  static reified(): FixedPoint32Reified {
    const reifiedBcs = FixedPoint32.bcs
    return {
      typeName: FixedPoint32.$typeName,
      fullTypeName: composeSuiType(
        FixedPoint32.$typeName,
        ...[],
      ) as `0x1::fixed_point32::FixedPoint32`,
      typeArgs: [] as [],
      isPhantom: FixedPoint32.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => FixedPoint32.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => FixedPoint32.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => FixedPoint32.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => FixedPoint32.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => FixedPoint32.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => FixedPoint32.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => FixedPoint32.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => FixedPoint32.fetch(client, id),
      new: (fields: FixedPoint32Fields) => {
        return new FixedPoint32([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): FixedPoint32Reified {
    return FixedPoint32.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<FixedPoint32>> {
    return phantom(FixedPoint32.reified())
  }

  static get p(): PhantomReified<ToTypeStr<FixedPoint32>> {
    return FixedPoint32.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('FixedPoint32', {
      value: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof FixedPoint32.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof FixedPoint32.instantiateBcs> {
    if (!FixedPoint32.cachedBcs) {
      FixedPoint32.cachedBcs = FixedPoint32.instantiateBcs()
    }
    return FixedPoint32.cachedBcs
  }

  static fromFields(fields: Record<string, any>): FixedPoint32 {
    return FixedPoint32.reified().new({
      value: decodeFromFields('u64', fields.value),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): FixedPoint32 {
    if (!isFixedPoint32(item.type)) {
      throw new Error('not a FixedPoint32 type')
    }

    return FixedPoint32.reified().new({
      value: decodeFromFieldsWithTypes('u64', item.fields.value),
    })
  }

  static fromBcs(data: Uint8Array): FixedPoint32 {
    return FixedPoint32.fromFields(FixedPoint32.bcs.parse(data))
  }

  toJSONField(): FixedPoint32JSONField {
    return {
      value: this.value.toString(),
    }
  }

  toJSON(): FixedPoint32JSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): FixedPoint32 {
    return FixedPoint32.reified().new({
      value: decodeFromJSONField('u64', field.value),
    })
  }

  static fromJSON(json: Record<string, any>): FixedPoint32 {
    if (json.$typeName !== FixedPoint32.$typeName) {
      throw new Error(
        `not a FixedPoint32 json object: expected '${FixedPoint32.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return FixedPoint32.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): FixedPoint32 {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isFixedPoint32(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a FixedPoint32 object`)
    }
    return FixedPoint32.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): FixedPoint32 {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isFixedPoint32(data.bcs.type)) {
        throw new Error(`object at is not a FixedPoint32 object`)
      }

      return FixedPoint32.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return FixedPoint32.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<FixedPoint32> {
    const res = await fetchObjectBcs(client, id)
    if (!isFixedPoint32(res.type)) {
      throw new Error(`object at id ${id} is not a FixedPoint32 object`)
    }

    return FixedPoint32.fromBcs(res.bcsBytes)
  }
}
