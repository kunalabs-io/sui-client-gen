import {
  ToField,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
} from '../../_framework/types'
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
      __class: null as unknown as ReturnType<typeof TypeName.new>,
    }
  }

  static fromFields(fields: Record<string, any>): TypeName {
    return TypeName.new(decodeFromFieldsGenericOrSpecial(String.reified(), fields.name))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TypeName {
    if (!isTypeName(item.type)) {
      throw new Error('not a TypeName type')
    }

    return TypeName.new(
      decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.name)
    )
  }

  static fromBcs(data: Uint8Array): TypeName {
    return TypeName.fromFields(TypeName.bcs.parse(data))
  }

  toJSON() {
    return {
      name: this.name,
    }
  }
}
