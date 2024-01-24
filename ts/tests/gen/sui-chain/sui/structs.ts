import {
  Reified,
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== SUI =============================== */

export function isSUI(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::sui::SUI'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SUIFields {
  dummyField: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class SUI {
  static readonly $typeName = '0x2::sui::SUI'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x2::sui::SUI'

  readonly $typeName = SUI.$typeName

  static get bcs() {
    return bcs.struct('SUI', {
      dummy_field: bcs.bool(),
    })
  }

  readonly dummyField: ToField<'bool'>

  private constructor(dummyField: ToField<'bool'>) {
    this.dummyField = dummyField
  }

  static new(dummyField: ToField<'bool'>): SUI {
    return new SUI(dummyField)
  }

  static reified(): Reified<SUI> {
    return {
      typeName: SUI.$typeName,
      fullTypeName: composeSuiType(SUI.$typeName, ...[]) as '0x2::sui::SUI',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => SUI.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => SUI.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => SUI.fromBcs(data),
      bcs: SUI.bcs,
      fromJSONField: (field: any) => SUI.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => SUI.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return SUI.reified()
  }

  static fromFields(fields: Record<string, any>): SUI {
    return SUI.new(decodeFromFields('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): SUI {
    if (!isSUI(item.type)) {
      throw new Error('not a SUI type')
    }

    return SUI.new(decodeFromFieldsWithTypes('bool', item.fields.dummy_field))
  }

  static fromBcs(data: Uint8Array): SUI {
    return SUI.fromFields(SUI.bcs.parse(data))
  }

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): SUI {
    return SUI.new(decodeFromJSONField('bool', field.dummyField))
  }

  static fromJSON(json: Record<string, any>): SUI {
    if (json.$typeName !== SUI.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return SUI.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): SUI {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isSUI(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a SUI object`)
    }
    return SUI.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<SUI> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching SUI object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isSUI(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a SUI object`)
    }
    return SUI.fromFieldsWithTypes(res.data.content)
  }
}
