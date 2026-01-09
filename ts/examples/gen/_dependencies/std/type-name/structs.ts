/** Functionality for converting Move types into values. Use with care! */

import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
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
} from '../../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  SupportedSuiClient,
} from '../../../_framework/util'
import { String } from '../ascii/structs'

/* ============================== TypeName =============================== */

export function isTypeName(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x1::type_name::TypeName`
}

export interface TypeNameFields {
  /**
   * String representation of the type. All types are represented
   * using their source syntax:
   * "u8", "u64", "bool", "address", "vector", and so on for primitive types.
   * Struct types are represented as fully qualified type names; e.g.
   * `00000000000000000000000000000001::string::String` or
   * `0000000000000000000000000000000a::module_name1::type_name1<0000000000000000000000000000000a::module_name2::type_name2<u64>>`
   * Addresses are hex-encoded lowercase values of length ADDRESS_LENGTH (16, 20, or 32 depending on the Move platform)
   */
  name: ToField<String>
}

export type TypeNameReified = Reified<TypeName, TypeNameFields>

export type TypeNameJSONField = {
  name: string
}

export type TypeNameJSON = {
  $typeName: typeof TypeName.$typeName
  $typeArgs: []
} & TypeNameJSONField

export class TypeName implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x1::type_name::TypeName` = `0x1::type_name::TypeName` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof TypeName.$typeName = TypeName.$typeName
  readonly $fullTypeName: `0x1::type_name::TypeName`
  readonly $typeArgs: []
  readonly $isPhantom: typeof TypeName.$isPhantom = TypeName.$isPhantom

  /**
   * String representation of the type. All types are represented
   * using their source syntax:
   * "u8", "u64", "bool", "address", "vector", and so on for primitive types.
   * Struct types are represented as fully qualified type names; e.g.
   * `00000000000000000000000000000001::string::String` or
   * `0000000000000000000000000000000a::module_name1::type_name1<0000000000000000000000000000000a::module_name2::type_name2<u64>>`
   * Addresses are hex-encoded lowercase values of length ADDRESS_LENGTH (16, 20, or 32 depending on the Move platform)
   */
  readonly name: ToField<String>

  private constructor(typeArgs: [], fields: TypeNameFields) {
    this.$fullTypeName = composeSuiType(
      TypeName.$typeName,
      ...typeArgs,
    ) as `0x1::type_name::TypeName`
    this.$typeArgs = typeArgs

    this.name = fields.name
  }

  static reified(): TypeNameReified {
    const reifiedBcs = TypeName.bcs
    return {
      typeName: TypeName.$typeName,
      fullTypeName: composeSuiType(
        TypeName.$typeName,
        ...[],
      ) as `0x1::type_name::TypeName`,
      typeArgs: [] as [],
      isPhantom: TypeName.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => TypeName.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TypeName.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TypeName.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => TypeName.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => TypeName.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => TypeName.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => TypeName.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => TypeName.fetch(client, id),
      new: (fields: TypeNameFields) => {
        return new TypeName([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): TypeNameReified {
    return TypeName.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<TypeName>> {
    return phantom(TypeName.reified())
  }

  static get p(): PhantomReified<ToTypeStr<TypeName>> {
    return TypeName.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('TypeName', {
      name: String.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof TypeName.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof TypeName.instantiateBcs> {
    if (!TypeName.cachedBcs) {
      TypeName.cachedBcs = TypeName.instantiateBcs()
    }
    return TypeName.cachedBcs
  }

  static fromFields(fields: Record<string, any>): TypeName {
    return TypeName.reified().new({
      name: decodeFromFields(String.reified(), fields.name),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TypeName {
    if (!isTypeName(item.type)) {
      throw new Error('not a TypeName type')
    }

    return TypeName.reified().new({
      name: decodeFromFieldsWithTypes(String.reified(), item.fields.name),
    })
  }

  static fromBcs(data: Uint8Array): TypeName {
    return TypeName.fromFields(TypeName.bcs.parse(data))
  }

  toJSONField(): TypeNameJSONField {
    return {
      name: this.name,
    }
  }

  toJSON(): TypeNameJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TypeName {
    return TypeName.reified().new({
      name: decodeFromJSONField(String.reified(), field.name),
    })
  }

  static fromJSON(json: Record<string, any>): TypeName {
    if (json.$typeName !== TypeName.$typeName) {
      throw new Error(
        `not a TypeName json object: expected '${TypeName.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return TypeName.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): TypeName {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTypeName(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TypeName object`)
    }
    return TypeName.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): TypeName {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isTypeName(data.bcs.type)) {
        throw new Error(`object at is not a TypeName object`)
      }

      return TypeName.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return TypeName.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<TypeName> {
    const res = await fetchObjectBcs(client, id)
    if (!isTypeName(res.type)) {
      throw new Error(`object at id ${id} is not a TypeName object`)
    }

    return TypeName.fromBcs(res.bcsBytes)
  }
}
