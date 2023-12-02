import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Wrapper =============================== */

export function isWrapper(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::dynamic_object_field::Wrapper<')
}

export interface WrapperFields<Name> {
  name: Name
}

export class Wrapper<Name> {
  static readonly $typeName = '0x2::dynamic_object_field::Wrapper'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <Name extends BcsType<any>>(Name: Name) =>
      bcs.struct(`Wrapper<${Name.name}>`, {
        name: Name,
      })
  }

  readonly $typeArg: Type

  readonly name: Name

  constructor(typeArg: Type, name: Name) {
    this.$typeArg = typeArg

    this.name = name
  }

  static fromFields<Name>(typeArg: Type, fields: Record<string, any>): Wrapper<Name> {
    initLoaderIfNeeded()

    return new Wrapper(typeArg, structClassLoaderSource.fromFields(typeArg, fields.name))
  }

  static fromFieldsWithTypes<Name>(item: FieldsWithTypes): Wrapper<Name> {
    initLoaderIfNeeded()

    if (!isWrapper(item.type)) {
      throw new Error('not a Wrapper type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Wrapper(
      typeArgs[0],
      structClassLoaderSource.fromFieldsWithTypes(typeArgs[0], item.fields.name)
    )
  }

  static fromBcs<Name>(typeArg: Type, data: Uint8Array): Wrapper<Name> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return Wrapper.fromFields(
      typeArg,
      Wrapper.bcs(structClassLoaderSource.getBcsType(typeArgs[0])).parse(data)
    )
  }
}
