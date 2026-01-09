/**
 * Defines an unsigned, fixed-point numeric type with a 64-bit integer part and a 64-bit fractional
 * part. The notation `uq64_64` and `UQ64_64` is based on
 * [Q notation](https://en.wikipedia.org/wiki/Q_(number_format)). `q` indicates it a fixed-point
 * number. The `u` prefix indicates it is unsigned. The `64_64` suffix indicates the number of
 * bits, where the first number indicates the number of bits in the integer part, and the second
 * the number of bits in the fractional part--in this case 64 bits for each.
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

/* ============================== UQ64_64 =============================== */

export function isUQ64_64(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x1::uq64_64::UQ64_64`
}

export interface UQ64_64Fields {
  pos0: ToField<'u128'>
}

export type UQ64_64Reified = Reified<UQ64_64, UQ64_64Fields>

export type UQ64_64JSONField = {
  pos0: string
}

export type UQ64_64JSON = {
  $typeName: typeof UQ64_64.$typeName
  $typeArgs: []
} & UQ64_64JSONField

/**
 * A fixed-point numeric type with 64 integer bits and 64 fractional bits, represented by an
 * underlying 128 bit value. This is a binary representation, so decimal values may not be exactly
 * representable, but it provides more than 19 decimal digits of precision both before and after
 * the decimal point (38 digits total).
 */
export class UQ64_64 implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x1::uq64_64::UQ64_64` = `0x1::uq64_64::UQ64_64` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof UQ64_64.$typeName = UQ64_64.$typeName
  readonly $fullTypeName: `0x1::uq64_64::UQ64_64`
  readonly $typeArgs: []
  readonly $isPhantom: typeof UQ64_64.$isPhantom = UQ64_64.$isPhantom

  readonly pos0: ToField<'u128'>

  private constructor(typeArgs: [], fields: UQ64_64Fields) {
    this.$fullTypeName = composeSuiType(
      UQ64_64.$typeName,
      ...typeArgs,
    ) as `0x1::uq64_64::UQ64_64`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  static reified(): UQ64_64Reified {
    const reifiedBcs = UQ64_64.bcs
    return {
      typeName: UQ64_64.$typeName,
      fullTypeName: composeSuiType(
        UQ64_64.$typeName,
        ...[],
      ) as `0x1::uq64_64::UQ64_64`,
      typeArgs: [] as [],
      isPhantom: UQ64_64.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UQ64_64.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UQ64_64.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UQ64_64.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UQ64_64.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UQ64_64.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => UQ64_64.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => UQ64_64.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => UQ64_64.fetch(client, id),
      new: (fields: UQ64_64Fields) => {
        return new UQ64_64([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): UQ64_64Reified {
    return UQ64_64.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UQ64_64>> {
    return phantom(UQ64_64.reified())
  }

  static get p(): PhantomReified<ToTypeStr<UQ64_64>> {
    return UQ64_64.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('UQ64_64', {
      pos0: bcs.u128(),
    })
  }

  private static cachedBcs: ReturnType<typeof UQ64_64.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof UQ64_64.instantiateBcs> {
    if (!UQ64_64.cachedBcs) {
      UQ64_64.cachedBcs = UQ64_64.instantiateBcs()
    }
    return UQ64_64.cachedBcs
  }

  static fromFields(fields: Record<string, any>): UQ64_64 {
    return UQ64_64.reified().new({
      pos0: decodeFromFields('u128', fields.pos0),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UQ64_64 {
    if (!isUQ64_64(item.type)) {
      throw new Error('not a UQ64_64 type')
    }

    return UQ64_64.reified().new({
      pos0: decodeFromFieldsWithTypes('u128', item.fields.pos0),
    })
  }

  static fromBcs(data: Uint8Array): UQ64_64 {
    return UQ64_64.fromFields(UQ64_64.bcs.parse(data))
  }

  toJSONField(): UQ64_64JSONField {
    return {
      pos0: this.pos0.toString(),
    }
  }

  toJSON(): UQ64_64JSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UQ64_64 {
    return UQ64_64.reified().new({
      pos0: decodeFromJSONField('u128', field.pos0),
    })
  }

  static fromJSON(json: Record<string, any>): UQ64_64 {
    if (json.$typeName !== UQ64_64.$typeName) {
      throw new Error(
        `not a UQ64_64 json object: expected '${UQ64_64.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return UQ64_64.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): UQ64_64 {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isUQ64_64(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a UQ64_64 object`)
    }
    return UQ64_64.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): UQ64_64 {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isUQ64_64(data.bcs.type)) {
        throw new Error(`object at is not a UQ64_64 object`)
      }

      return UQ64_64.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return UQ64_64.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<UQ64_64> {
    const res = await fetchObjectBcs(client, id)
    if (!isUQ64_64(res.type)) {
      throw new Error(`object at id ${id} is not a UQ64_64 object`)
    }

    return UQ64_64.fromBcs(res.bcsBytes)
  }
}
