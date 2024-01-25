import * as reified from '../../../../_framework/reified'
import {
  Reified,
  ToField,
  Vector,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
} from '../../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../../_framework/util'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Char =============================== */

export function isChar(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x1::ascii::Char'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CharFields {
  byte: ToField<'u8'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Char {
  static readonly $typeName = '0x1::ascii::Char'
  static readonly $numTypeParams = 0

  readonly $typeName = Char.$typeName

  readonly $fullTypeName: '0x1::ascii::Char'

  readonly byte: ToField<'u8'>

  private constructor(fields: CharFields) {
    this.$fullTypeName = Char.$typeName

    this.byte = fields.byte
  }

  static reified(): Reified<Char, CharFields> {
    return {
      typeName: Char.$typeName,
      fullTypeName: composeSuiType(Char.$typeName, ...[]) as '0x1::ascii::Char',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Char.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Char.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Char.fromBcs(data),
      bcs: Char.bcs,
      fromJSONField: (field: any) => Char.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => Char.fetch(client, id),
      new: (fields: CharFields) => {
        return new Char(fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Char.reified()
  }

  static get bcs() {
    return bcs.struct('Char', {
      byte: bcs.u8(),
    })
  }

  static fromFields(fields: Record<string, any>): Char {
    return Char.reified().new({ byte: decodeFromFields('u8', fields.byte) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Char {
    if (!isChar(item.type)) {
      throw new Error('not a Char type')
    }

    return Char.reified().new({ byte: decodeFromFieldsWithTypes('u8', item.fields.byte) })
  }

  static fromBcs(data: Uint8Array): Char {
    return Char.fromFields(Char.bcs.parse(data))
  }

  toJSONField() {
    return {
      byte: this.byte,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Char {
    return Char.reified().new({ byte: decodeFromJSONField('u8', field.byte) })
  }

  static fromJSON(json: Record<string, any>): Char {
    if (json.$typeName !== Char.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Char.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): Char {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isChar(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Char object`)
    }
    return Char.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Char> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Char object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isChar(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Char object`)
    }
    return Char.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== String =============================== */

export function isString(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x1::ascii::String'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface StringFields {
  bytes: ToField<Vector<'u8'>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class String {
  static readonly $typeName = '0x1::ascii::String'
  static readonly $numTypeParams = 0

  readonly $typeName = String.$typeName

  readonly $fullTypeName: '0x1::ascii::String'

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(fields: StringFields) {
    this.$fullTypeName = String.$typeName

    this.bytes = fields.bytes
  }

  static reified(): Reified<String, StringFields> {
    return {
      typeName: String.$typeName,
      fullTypeName: composeSuiType(String.$typeName, ...[]) as '0x1::ascii::String',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => String.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => String.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => String.fromBcs(data),
      bcs: String.bcs,
      fromJSONField: (field: any) => String.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => String.fetch(client, id),
      new: (fields: StringFields) => {
        return new String(fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return String.reified()
  }

  static get bcs() {
    return bcs.struct('String', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  static fromFields(fields: Record<string, any>): String {
    return String.reified().new({ bytes: decodeFromFields(reified.vector('u8'), fields.bytes) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): String {
    if (!isString(item.type)) {
      throw new Error('not a String type')
    }

    return String.reified().new({
      bytes: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.bytes),
    })
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
    return String.reified().new({ bytes: decodeFromJSONField(reified.vector('u8'), field.bytes) })
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
