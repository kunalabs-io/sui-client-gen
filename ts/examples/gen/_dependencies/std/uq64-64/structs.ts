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
} from '../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../_framework/util'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== UQ64_64 =============================== */

export function isUQ64_64(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x1::uq64_64::UQ64_64`
}

export interface UQ64_64Fields {
  pos0: ToField<'u128'>
}

export type UQ64_64Reified = Reified<UQ64_64, UQ64_64Fields>

export class UQ64_64 implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x1::uq64_64::UQ64_64` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = UQ64_64.$typeName
  readonly $fullTypeName: `0x1::uq64_64::UQ64_64`
  readonly $typeArgs: []
  readonly $isPhantom = UQ64_64.$isPhantom

  readonly pos0: ToField<'u128'>

  private constructor(typeArgs: [], fields: UQ64_64Fields) {
    this.$fullTypeName = composeSuiType(UQ64_64.$typeName, ...typeArgs) as `0x1::uq64_64::UQ64_64`
    this.$typeArgs = typeArgs

    this.pos0 = fields.pos0
  }

  static reified(): UQ64_64Reified {
    const reifiedBcs = UQ64_64.bcs
    return {
      typeName: UQ64_64.$typeName,
      fullTypeName: composeSuiType(UQ64_64.$typeName, ...[]) as `0x1::uq64_64::UQ64_64`,
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
      fetch: async (client: SuiClient, id: string) => UQ64_64.fetch(client, id),
      new: (fields: UQ64_64Fields) => {
        return new UQ64_64([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return UQ64_64.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<UQ64_64>> {
    return phantom(UQ64_64.reified())
  }

  static get p() {
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

  toJSONField() {
    return {
      pos0: this.pos0.toString(),
    }
  }

  toJSON() {
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
        `not a UQ64_64 json object: expected '${UQ64_64.$typeName}' but got '${json.$typeName}'`
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
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<UQ64_64> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching UQ64_64 object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isUQ64_64(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a UQ64_64 object`)
    }

    return UQ64_64.fromSuiObjectData(res.data)
  }
}
