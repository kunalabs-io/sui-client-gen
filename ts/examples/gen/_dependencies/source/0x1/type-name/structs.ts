import { Encoding, bcsSource as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../../../_framework/util'
import { String } from '../ascii/structs'

/* ============================== TypeName =============================== */

bcs.registerStructType('0x1::type_name::TypeName', {
  name: `0x1::ascii::String`,
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

  constructor(name: string) {
    this.name = name
  }

  static fromFields(fields: Record<string, any>): TypeName {
    return new TypeName(
      new TextDecoder().decode(Uint8Array.from(String.fromFields(fields.name).bytes)).toString()
    )
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TypeName {
    if (!isTypeName(item.type)) {
      throw new Error('not a TypeName type')
    }
    return new TypeName(item.fields.name)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): TypeName {
    return TypeName.fromFields(bcs.de([TypeName.$typeName], data, encoding))
  }
}
