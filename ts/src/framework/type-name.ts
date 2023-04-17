import { Type } from './type'
import { BCS } from '@mysten/bcs'
import { bcs } from './bcs'
import { FieldsWithTypes } from './util'

/* ================================== TypeName =================================== */

bcs.registerStructType('0x1::type_name::TypeName', {
  name: BCS.STRING,
})

export function isTypeName(type: Type): boolean {
  return type === '0x1::type_name::TypeName'
}

export interface TypeNameFields {
  name: string
}

export class TypeName {
  static readonly $typeName = '0x1::type_name::TypeName'
  static readonly $numTypeParams = 0

  readonly name: string

  constructor(fields: TypeNameFields) {
    this.name = fields.name
  }

  static fromFields(fields: Record<string, any>): TypeName {
    return new TypeName({
      name: fields.name,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TypeName {
    if (!isTypeName(item.type)) {
      throw new Error(`not a TypeName type`)
    }
    return new TypeName({
      name: item.fields.name,
    })
  }
}
