import {
  Reified,
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { String } from '../ascii/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== TypeName =============================== */

export function isTypeName(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x1::type_name::TypeName'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TypeNameFields {
  name: ToField<String>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TypeName {
  static readonly $typeName = '0x1::type_name::TypeName'
  static readonly $numTypeParams = 0

  readonly $fullTypeName = null as unknown as '0x1::type_name::TypeName'

  readonly $typeName = TypeName.$typeName

  static get bcs() {
    return bcs.struct('TypeName', {
      name: String.bcs,
    })
  }

  readonly name: ToField<String>

  private constructor(name: ToField<String>) {
    this.name = name
  }

  static new(name: ToField<String>): TypeName {
    return new TypeName(name)
  }

  static reified(): Reified<TypeName> {
    return {
      typeName: TypeName.$typeName,
      fullTypeName: composeSuiType(TypeName.$typeName, ...[]) as '0x1::type_name::TypeName',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => TypeName.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TypeName.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TypeName.fromBcs(data),
      bcs: TypeName.bcs,
      fromJSONField: (field: any) => TypeName.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => TypeName.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields(fields: Record<string, any>): TypeName {
    return TypeName.new(decodeFromFields(String.reified(), fields.name))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TypeName {
    if (!isTypeName(item.type)) {
      throw new Error('not a TypeName type')
    }

    return TypeName.new(decodeFromFieldsWithTypes(String.reified(), item.fields.name))
  }

  static fromBcs(data: Uint8Array): TypeName {
    return TypeName.fromFields(TypeName.bcs.parse(data))
  }

  toJSONField() {
    return {
      name: this.name,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): TypeName {
    return TypeName.new(decodeFromJSONField(String.reified(), field.name))
  }

  static fromJSON(json: Record<string, any>): TypeName {
    if (json.$typeName !== TypeName.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
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

  static async fetch(client: SuiClient, id: string): Promise<TypeName> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TypeName object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTypeName(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TypeName object`)
    }
    return TypeName.fromFieldsWithTypes(res.data.content)
  }
}
