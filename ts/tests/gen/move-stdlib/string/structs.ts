import * as reified from '../../_framework/reified'
import {
  Reified,
  ToField,
  Vector,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== String =============================== */

export function isString(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x1::string::String'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface StringFields {
  bytes: ToField<Vector<'u8'>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class String {
  static readonly $typeName = '0x1::string::String'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x1::string::String'

  readonly $typeName = String.$typeName

  static get bcs() {
    return bcs.struct('String', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(bytes: ToField<Vector<'u8'>>) {
    this.bytes = bytes
  }

  static new(bytes: ToField<Vector<'u8'>>): String {
    return new String(bytes)
  }

  static reified(): Reified<String> {
    return {
      typeName: String.$typeName,
      fullTypeName: composeSuiType(String.$typeName, ...[]) as '0x1::string::String',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => String.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => String.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => String.fromBcs(data),
      bcs: String.bcs,
      fromJSONField: (field: any) => String.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => String.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return String.reified()
  }

  static fromFields(fields: Record<string, any>): String {
    return String.new(decodeFromFields(reified.vector('u8'), fields.bytes))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): String {
    if (!isString(item.type)) {
      throw new Error('not a String type')
    }

    return String.new(decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.bytes))
  }

  static fromBcs(data: Uint8Array): String {
    return String.fromFields(String.bcs.parse(data))
  }

  toJSONField() {
    return {
      bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bytes),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): String {
    return String.new(decodeFromJSONField(reified.vector('u8'), field.bytes))
  }

  static fromJSON(json: Record<string, any>): String {
    if (json.$typeName !== String.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return String.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): String {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isString(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a String object`)
    }
    return String.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<String> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching String object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isString(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a String object`)
    }
    return String.fromFieldsWithTypes(res.data.content)
  }
}
