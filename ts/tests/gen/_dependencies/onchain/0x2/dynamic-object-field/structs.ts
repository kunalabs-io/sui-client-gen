import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Wrapper =============================== */

export function isWrapper(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::dynamic_object_field::Wrapper<')
}

export interface WrapperFields<T0> {
  name: T0
}

export class Wrapper<T0> {
  static readonly $typeName = '0x2::dynamic_object_field::Wrapper'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Wrapper<${T0.name}>`, {
        name: T0,
      })
  }

  readonly $typeArg: Type

  readonly name: T0

  constructor(typeArg: Type, name: T0) {
    this.$typeArg = typeArg

    this.name = name
  }

  static fromFields<T0>(typeArg: Type, fields: Record<string, any>): Wrapper<T0> {
    initLoaderIfNeeded()

    return new Wrapper(typeArg, structClassLoaderOnchain.fromFields(typeArg, fields.name))
  }

  static fromFieldsWithTypes<T0>(item: FieldsWithTypes): Wrapper<T0> {
    initLoaderIfNeeded()

    if (!isWrapper(item.type)) {
      throw new Error('not a Wrapper type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Wrapper(
      typeArgs[0],
      structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[0], item.fields.name)
    )
  }

  static fromBcs<T0>(typeArg: Type, data: Uint8Array): Wrapper<T0> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return Wrapper.fromFields(
      typeArg,
      Wrapper.bcs(structClassLoaderOnchain.getBcsType(typeArgs[0])).parse(data)
    )
  }
}
