/**
 * The `string` module defines the `String` type which represents UTF8 encoded
 * strings.
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
  return type === `0x1::string::String`
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
 * A `String` holds a sequence of bytes which is guaranteed to be in utf8
 * format.
 */
export class String implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x1::string::String` = `0x1::string::String` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof String.$typeName = String.$typeName
  readonly $fullTypeName: `0x1::string::String`
  readonly $typeArgs: []
  readonly $isPhantom: typeof String.$isPhantom = String.$isPhantom

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: StringFields) {
    this.$fullTypeName = composeSuiType(
      String.$typeName,
      ...typeArgs,
    ) as `0x1::string::String`
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
      ) as `0x1::string::String`,
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
