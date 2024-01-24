import {
  Reified,
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
} from '../../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../../_framework/util'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== FixedPoint32 =============================== */

export function isFixedPoint32(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x1::fixed_point32::FixedPoint32'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FixedPoint32Fields {
  value: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class FixedPoint32 {
  static readonly $typeName = '0x1::fixed_point32::FixedPoint32'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x1::fixed_point32::FixedPoint32'

  readonly $typeName = FixedPoint32.$typeName

  static get bcs() {
    return bcs.struct('FixedPoint32', {
      value: bcs.u64(),
    })
  }

  readonly value: ToField<'u64'>

  private constructor(value: ToField<'u64'>) {
    this.value = value
  }

  static new(value: ToField<'u64'>): FixedPoint32 {
    return new FixedPoint32(value)
  }

  static reified(): Reified<FixedPoint32> {
    return {
      typeName: FixedPoint32.$typeName,
      fullTypeName: composeSuiType(
        FixedPoint32.$typeName,
        ...[]
      ) as '0x1::fixed_point32::FixedPoint32',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => FixedPoint32.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => FixedPoint32.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => FixedPoint32.fromBcs(data),
      bcs: FixedPoint32.bcs,
      fromJSONField: (field: any) => FixedPoint32.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => FixedPoint32.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return FixedPoint32.reified()
  }

  static fromFields(fields: Record<string, any>): FixedPoint32 {
    return FixedPoint32.new(decodeFromFields('u64', fields.value))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): FixedPoint32 {
    if (!isFixedPoint32(item.type)) {
      throw new Error('not a FixedPoint32 type')
    }

    return FixedPoint32.new(decodeFromFieldsWithTypes('u64', item.fields.value))
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
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): FixedPoint32 {
    return FixedPoint32.new(decodeFromJSONField('u64', field.value))
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

  static async fetch(client: SuiClient, id: string): Promise<FixedPoint32> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching FixedPoint32 object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isFixedPoint32(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a FixedPoint32 object`)
    }
    return FixedPoint32.fromFieldsWithTypes(res.data.content)
  }
}
