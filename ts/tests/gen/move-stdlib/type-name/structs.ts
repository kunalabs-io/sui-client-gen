import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'
import { String } from '../ascii/structs'
import { bcs } from '@mysten/bcs'

/* ============================== TypeName =============================== */

export function isTypeName(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x1::type_name::TypeName'
}

export interface TypeNameFields {
  name: string
}

export class TypeName {
  static readonly $typeName = '0x1::type_name::TypeName'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('TypeName', {
      name: String.bcs,
    })
  }

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

  static fromBcs(data: Uint8Array): TypeName {
    return TypeName.fromFields(TypeName.bcs.parse(data))
  }

  toJSON() {
    return {
      name: this.name,
    }
  }
}
