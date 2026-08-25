/**
 * Defines an unsigned, fixed-point numeric type with a 64-bit integer part and a 64-bit fractional
 * part. The notation `uq64_64` and `UQ64_64` is based on
 * [Q notation](https://en.wikipedia.org/wiki/Q_(number_format)). `q` indicates it a fixed-point
 * number. The `u` prefix indicates it is unsigned. The `64_64` suffix indicates the number of
 * bits, where the first number indicates the number of bits in the integer part, and the second
 * the number of bits in the fractional part--in this case 64 bits for each.
 */

import { bcs } from '@mysten/sui/bcs'
import type { ClientWithCoreApi, SuiClientTypes } from '@mysten/sui/client'
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
} from '../../_framework/reified'
import { composeSuiType, compressSuiType, FieldsWithTypes } from '../../_framework/util'

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
      get typeName() {
        return UQ64_64.$typeName
      },
      get fullTypeName() {
        return composeSuiType(
          UQ64_64.$typeName,
          ...[],
        ) as `0x1::uq64_64::UQ64_64`
      },
      typeArgs: [] as [],
      isPhantom: UQ64_64.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => UQ64_64.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UQ64_64.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UQ64_64.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => UQ64_64.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => UQ64_64.fromJSON(json),
      fromCoreObject: (obj: SuiClientTypes.Object<{ content: true }>) =>
        UQ64_64.fromCoreObject(obj),
      fetch: async (client: ClientWithCoreApi, id: string) => UQ64_64.fetch(client, id),
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

  static fromCoreObject(obj: SuiClientTypes.Object<{ content: true }>): UQ64_64 {
    if (!isUQ64_64(obj.type)) {
      throw new Error(`object at ${obj.objectId} is not a UQ64_64 object`)
    }
    return UQ64_64.fromBcs(obj.content)
  }

  static async fetch(client: ClientWithCoreApi, id: string): Promise<UQ64_64> {
    const { object } = await client.core.getObject({
      objectId: id,
      include: { content: true },
    })
    if (!isUQ64_64(object.type)) {
      throw new Error(`object at id ${id} is not a UQ64_64 object`)
    }
    return UQ64_64.fromBcs(object.content)
  }
}
