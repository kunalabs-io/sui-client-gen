/**
 * The `ASCII` module defines basic string and char newtypes in Move that verify
 * that characters are valid ASCII, and that strings consist of only valid ASCII characters.
 */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
  vector,
} from '../../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  SupportedSuiClient,
} from '../../../_framework/util'
import { Vector } from '../../../_framework/vector'

/* ============================== String =============================== */

export function isString(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x1::ascii::String`
}

export interface StringFields {
  bytes: ToField<Vector<'u8'>>
}

export type StringReified = Reified<String, StringFields>

export type StringJSONField = {
  bytes: number[]
}

export type StringJSON = {
  $typeName: typeof String.$typeName
  $typeArgs: []
} & StringJSONField

/**
 * The `String` struct holds a vector of bytes that all represent
 * valid ASCII characters. Note that these ASCII characters may not all
 * be printable. To determine if a `String` contains only "printable"
 * characters you should use the `all_characters_printable` predicate
 * defined in this module.
 */
export class String implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x1::ascii::String` = `0x1::ascii::String` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof String.$typeName = String.$typeName
  readonly $fullTypeName: `0x1::ascii::String`
  readonly $typeArgs: []
  readonly $isPhantom: typeof String.$isPhantom = String.$isPhantom

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: StringFields) {
    this.$fullTypeName = composeSuiType(
      String.$typeName,
      ...typeArgs,
    ) as `0x1::ascii::String`
    this.$typeArgs = typeArgs

    this.bytes = fields.bytes
  }

  static reified(): StringReified {
    const reifiedBcs = String.bcs
    return {
      typeName: String.$typeName,
      fullTypeName: composeSuiType(
        String.$typeName,
        ...[],
      ) as `0x1::ascii::String`,
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
      fetch: async (client: SupportedSuiClient, id: string) => String.fetch(client, id),
      new: (fields: StringFields) => {
        return new String([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): StringReified {
    return String.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<String>> {
    return phantom(String.reified())
  }

  static get p(): PhantomReified<ToTypeStr<String>> {
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

  toJSONField(): StringJSONField {
    return {
      bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bytes),
    }
  }

  toJSON(): StringJSON {
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
        `not a String json object: expected '${String.$typeName}' but got '${json.$typeName}'`,
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
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<String> {
    const res = await fetchObjectBcs(client, id)
    if (!isString(res.type)) {
      throw new Error(`object at id ${id} is not a String object`)
    }

    return String.fromBcs(res.bcsBytes)
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

export type CharJSONField = {
  byte: number
}

export type CharJSON = {
  $typeName: typeof Char.$typeName
  $typeArgs: []
} & CharJSONField

/** An ASCII character. */
export class Char implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x1::ascii::Char` = `0x1::ascii::Char` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof Char.$typeName = Char.$typeName
  readonly $fullTypeName: `0x1::ascii::Char`
  readonly $typeArgs: []
  readonly $isPhantom: typeof Char.$isPhantom = Char.$isPhantom

  readonly byte: ToField<'u8'>

  private constructor(typeArgs: [], fields: CharFields) {
    this.$fullTypeName = composeSuiType(
      Char.$typeName,
      ...typeArgs,
    ) as `0x1::ascii::Char`
    this.$typeArgs = typeArgs

    this.byte = fields.byte
  }

  static reified(): CharReified {
    const reifiedBcs = Char.bcs
    return {
      typeName: Char.$typeName,
      fullTypeName: composeSuiType(
        Char.$typeName,
        ...[],
      ) as `0x1::ascii::Char`,
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
      fetch: async (client: SupportedSuiClient, id: string) => Char.fetch(client, id),
      new: (fields: CharFields) => {
        return new Char([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): CharReified {
    return Char.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Char>> {
    return phantom(Char.reified())
  }

  static get p(): PhantomReified<ToTypeStr<Char>> {
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

  toJSONField(): CharJSONField {
    return {
      byte: this.byte,
    }
  }

  toJSON(): CharJSON {
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
        `not a Char json object: expected '${Char.$typeName}' but got '${json.$typeName}'`,
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
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Char> {
    const res = await fetchObjectBcs(client, id)
    if (!isChar(res.type)) {
      throw new Error(`object at id ${id} is not a Char object`)
    }

    return Char.fromBcs(res.bcsBytes)
  }
}
