import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  vector,
} from '../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../_framework/util'
import { Vector } from '../../../_framework/vector'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== String =============================== */

export function isString(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x1::ascii::String`
}

export interface StringFields {
  bytes: ToField<Vector<'u8'>>
}

export type StringReified = Reified<String, StringFields>

export class String implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x1::ascii::String`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = String.$typeName
  readonly $fullTypeName: `0x1::ascii::String`
  readonly $typeArgs: []
  readonly $isPhantom = String.$isPhantom

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: StringFields) {
    this.$fullTypeName = composeSuiType(String.$typeName, ...typeArgs) as `0x1::ascii::String`
    this.$typeArgs = typeArgs

    this.bytes = fields.bytes
  }

  static reified(): StringReified {
    const reifiedBcs = String.bcs
    return {
      typeName: String.$typeName,
      fullTypeName: composeSuiType(String.$typeName, ...[]) as `0x1::ascii::String`,
      typeArgs: [] as [],
      isPhantom: String.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => String.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => String.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => String.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => String.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => String.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => String.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => String.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => String.fetch(client, id),
      new: (fields: StringFields) => {
        return new String([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return String.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<String>> {
    return phantom(String.reified())
  }

  static get p() {
    return String.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('String', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof String.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof String.instantiateBcs> {
    if (!String.cachedBcs) {
      String.cachedBcs = String.instantiateBcs()
    }
    return String.cachedBcs
  }

  static fromFields(fields: Record<string, any>): String {
    return String.reified().new({
      bytes: decodeFromFields(vector('u8'), fields.bytes),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): String {
    if (!isString(item.type)) {
      throw new Error('not a String type')
    }

    return String.reified().new({
      bytes: decodeFromFieldsWithTypes(vector('u8'), item.fields.bytes),
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): String {
    return String.reified().new({
      bytes: decodeFromJSONField(vector('u8'), field.bytes),
    })
  }

  static fromJSON(json: Record<string, any>): String {
    if (json.$typeName !== String.$typeName) {
      throw new Error(
        `not a String json object: expected '${String.$typeName}' but got '${json.$typeName}'`
      )
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

  static fromSuiObjectData(data: SuiObjectData): String {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isString(data.bcs.type)) {
        throw new Error(`object at is not a String object`)
      }

      return String.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return String.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<String> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching String object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isString(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a String object`)
    }

    return String.fromSuiObjectData(res.data)
  }
}

/* ============================== Char =============================== */

export function isChar(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x1::ascii::Char`
}

export interface CharFields {
  byte: ToField<'u8'>
}

export type CharReified = Reified<Char, CharFields>

export class Char implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x1::ascii::Char`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Char.$typeName
  readonly $fullTypeName: `0x1::ascii::Char`
  readonly $typeArgs: []
  readonly $isPhantom = Char.$isPhantom

  readonly byte: ToField<'u8'>

  private constructor(typeArgs: [], fields: CharFields) {
    this.$fullTypeName = composeSuiType(Char.$typeName, ...typeArgs) as `0x1::ascii::Char`
    this.$typeArgs = typeArgs

    this.byte = fields.byte
  }

  static reified(): CharReified {
    const reifiedBcs = Char.bcs
    return {
      typeName: Char.$typeName,
      fullTypeName: composeSuiType(Char.$typeName, ...[]) as `0x1::ascii::Char`,
      typeArgs: [] as [],
      isPhantom: Char.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Char.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Char.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Char.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Char.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Char.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Char.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Char.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Char.fetch(client, id),
      new: (fields: CharFields) => {
        return new Char([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Char.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Char>> {
    return phantom(Char.reified())
  }

  static get p() {
    return Char.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Char', {
      byte: bcs.u8(),
    })
  }

  private static cachedBcs: ReturnType<typeof Char.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Char.instantiateBcs> {
    if (!Char.cachedBcs) {
      Char.cachedBcs = Char.instantiateBcs()
    }
    return Char.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Char {
    return Char.reified().new({
      byte: decodeFromFields('u8', fields.byte),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Char {
    if (!isChar(item.type)) {
      throw new Error('not a Char type')
    }

    return Char.reified().new({
      byte: decodeFromFieldsWithTypes('u8', item.fields.byte),
    })
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Char {
    return Char.reified().new({
      byte: decodeFromJSONField('u8', field.byte),
    })
  }

  static fromJSON(json: Record<string, any>): Char {
    if (json.$typeName !== Char.$typeName) {
      throw new Error(
        `not a Char json object: expected '${Char.$typeName}' but got '${json.$typeName}'`
      )
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

  static fromSuiObjectData(data: SuiObjectData): Char {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isChar(data.bcs.type)) {
        throw new Error(`object at is not a Char object`)
      }

      return Char.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Char.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Char> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Char object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isChar(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Char object`)
    }

    return Char.fromSuiObjectData(res.data)
  }
}
