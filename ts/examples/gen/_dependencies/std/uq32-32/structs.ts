/**
 * Defines an unsigned, fixed-point numeric type with a 32-bit integer part and a 32-bit fractional
 * part. The notation `uq32_32` and `UQ32_32` is based on
 * [Q notation](https://en.wikipedia.org/wiki/Q_(number_format)). `q` indicates it a fixed-point
 * number. The `u` prefix indicates it is unsigned. The `32_32` suffix indicates the number of
 * bits, where the first number indicates the number of bits in the integer part, and the second
 * the number of bits in the fractional part--in this case 32 bits for each.
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

/* ============================== UQ32_32 =============================== */

export function isUQ32_32(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x1::uq32_32::UQ32_32`
}

export interface UQ32_32Fields {
  pos0: ToField<'u64'>
}

export type UQ32_32Reified = Reified<UQ32_32, UQ32_32Fields>

export type UQ32_32JSONField = {
  pos0: string
}

export type UQ32_32JSON = {
  $typeName: typeof UQ32_32.$typeName
  $typeArgs: []
} & UQ32_32JSONField

/**
 * A fixed-point numeric type with 32 integer bits and 32 fractional bits, represented by an
 * underlying 64 bit value. This is a binary representation, so decimal values may not be exactly
 * representable, but it provides more than 9 decimal digits of precision both before and after the
 * decimal point (18 digits total).
 */
export class UQ32_32 implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x1::uq32_32::UQ32_32` = `0x1::uq32_32::UQ32_32` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof UQ32_32.$typeName = UQ32_32.$typeName
  readonly $fullTypeName: `0x1::uq32_32::UQ32_32`
  readonly $typeArgs: []
  readonly $isPhantom: typeof UQ32_32.$isPhantom = UQ32_32.$isPhantom

  readonly pos0: ToField<'u64'>

  private constructor(typeArgs: [], fields: UQ32_32Fields) {
    this.$fullTypeName = composeSuiType(
      UQ32_32.$typeName,
      ...typeArgs,
    ) as `0x1::uq32_32::UQ32_32`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  static reified(): UQ32_32Reified {
    const reifiedBcs = UQ32_32.bcs
    return {
      typeName: UQ32_32.$typeName,
      fullTypeName: composeSuiType(
        UQ32_32.$typeName,
        ...[],
      ) as `0x1::uq32_32::UQ32_32`,
      typeArgs: [] as [],
      isPhantom: UQ32_32.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UQ32_32.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UQ32_32.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UQ32_32.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UQ32_32.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UQ32_32.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => UQ32_32.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => UQ32_32.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => UQ32_32.fetch(client, id),
      new: (fields: UQ32_32Fields) => {
        return new UQ32_32([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): UQ32_32Reified {
    return UQ32_32.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UQ32_32>> {
    return phantom(UQ32_32.reified())
  }

  static get p(): PhantomReified<ToTypeStr<UQ32_32>> {
    return UQ32_32.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UQ32_32', {
      pos0: bcs.u64(),
    })
  }

  private static cachedBcs: ReturnType<typeof UQ32_32.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UQ32_32.instantiateBcs> {
    if (!UQ32_32.cachedBcs) {
      UQ32_32.cachedBcs = UQ32_32.instantiateBcs()
    }
    return UQ32_32.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UQ32_32 {
    return UQ32_32.reified().new({
      pos0: decodeFromFields('u64', fields.pos0),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UQ32_32 {
    if (!isUQ32_32(item.type)) {
      throw new Error('not a UQ32_32 type')
    }

    return UQ32_32.reified().new({
      pos0: decodeFromFieldsWithTypes('u64', item.fields.pos0),
    })
  }

  static fromBcs(data: Uint8Array): UQ32_32 {
    return UQ32_32.fromFields(UQ32_32.bcs.parse(data))
  }

  toJSONField(): UQ32_32JSONField {
    return {
      pos0: this.pos0.toString(),
    }
  }

  toJSON(): UQ32_32JSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UQ32_32 {
    return UQ32_32.reified().new({
      pos0: decodeFromJSONField('u64', field.pos0),
    })
  }

  static fromJSON(json: Record<string, any>): UQ32_32 {
    if (json.$typeName !== UQ32_32.$typeName) {
      throw new Error(
        `not a UQ32_32 json object: expected '${UQ32_32.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return UQ32_32.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): UQ32_32 {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUQ32_32(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UQ32_32 object`)
    }
    return UQ32_32.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): UQ32_32 {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUQ32_32(data.bcs.type)) {
        throw new Error(`object at is not a UQ32_32 object`)
      }

      return UQ32_32.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UQ32_32.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<UQ32_32> {
    const res = await fetchObjectBcs(client, id)
    if (!isUQ32_32(res.type)) {
      throw new Error(`object at id ${id} is not a UQ32_32 object`)
    }

    return UQ32_32.fromBcs(res.bcsBytes)
  }
}
