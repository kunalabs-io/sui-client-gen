import {
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
} from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { String } from '../ascii/structs'
import { bcs } from '@mysten/bcs'

/* ============================== TypeName =============================== */

export function isTypeName(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x1::type_name::TypeName'
}

export interface TypeNameFields {
  name: ToField<String>
}

export class TypeName {
  static readonly $typeName = '0x1::type_name::TypeName'
  static readonly $numTypeParams = 0

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

  static reified() {
    return {
      typeName: TypeName.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => TypeName.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TypeName.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => TypeName.fromBcs(data),
      bcs: TypeName.bcs,
      fromJSONField: (field: any) => TypeName.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof TypeName.new>,
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
}
