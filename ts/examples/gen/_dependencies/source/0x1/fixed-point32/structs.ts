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
} from '../../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../../_framework/util'
import { PKG_V14 } from '../index'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== FixedPoint32 =============================== */

export function isFixedPoint32(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V14}::fixed_point32::FixedPoint32`
}

export interface FixedPoint32Fields {
  value: ToField<'u64'>
}

export type FixedPoint32Reified = Reified<FixedPoint32, FixedPoint32Fields>

export class FixedPoint32 implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V14}::fixed_point32::FixedPoint32`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = FixedPoint32.$typeName
  readonly $fullTypeName: `${typeof PKG_V14}::fixed_point32::FixedPoint32`
  readonly $typeArgs: []
  readonly $isPhantom = FixedPoint32.$isPhantom

  readonly value: ToField<'u64'>

  private constructor(typeArgs: [], fields: FixedPoint32Fields) {
    this.$fullTypeName = composeSuiType(
      FixedPoint32.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V14}::fixed_point32::FixedPoint32`
    this.$typeArgs = typeArgs

    this.value = fields.value
  }

  static reified(): FixedPoint32Reified {
    return {
      typeName: FixedPoint32.$typeName,
      fullTypeName: composeSuiType(
        FixedPoint32.$typeName,
        ...[]
      ) as `${typeof PKG_V14}::fixed_point32::FixedPoint32`,
      typeArgs: [] as [],
      isPhantom: FixedPoint32.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => FixedPoint32.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => FixedPoint32.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => FixedPoint32.fromBcs(data),
      bcs: FixedPoint32.bcs,
      fromJSONField: (field: any) => FixedPoint32.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => FixedPoint32.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => FixedPoint32.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => FixedPoint32.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => FixedPoint32.fetch(client, id),
      new: (fields: FixedPoint32Fields) => {
        return new FixedPoint32([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return FixedPoint32.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<FixedPoint32>> {
    return phantom(FixedPoint32.reified())
  }
  static get p() {
    return FixedPoint32.phantom()
  }

  static get bcs() {
    return bcs.struct('FixedPoint32', {
      value: bcs.u64(),
    })
  }

  static fromFields(fields: Record<string, any>): FixedPoint32 {
    return FixedPoint32.reified().new({ value: decodeFromFields('u64', fields.value) })
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

  toJSONField() {
    return {
      value: this.value.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): FixedPoint32 {
    return FixedPoint32.reified().new({ value: decodeFromJSONField('u64', field.value) })
  }

  static fromJSON(json: Record<string, any>): FixedPoint32 {
    if (json.$typeName !== FixedPoint32.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

      return FixedPoint32.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return FixedPoint32.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<FixedPoint32> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching FixedPoint32 object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isFixedPoint32(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a FixedPoint32 object`)
    }

    return FixedPoint32.fromSuiObjectData(res.data)
  }
}
