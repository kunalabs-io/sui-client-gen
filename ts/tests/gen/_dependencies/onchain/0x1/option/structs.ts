import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Option =============================== */

export function isOption(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x1::option::Option<')
}

export interface OptionFields<T0> {
  vec: Array<T0>
}

export class Option<T0> {
  static readonly $typeName = '0x1::option::Option'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Option<${T0.name}>`, {
        vec: bcs.vector(T0),
      })
  }

  readonly $typeArg: Type

  readonly vec: Array<T0>

  constructor(typeArg: Type, vec: Array<T0>) {
    this.$typeArg = typeArg

    this.vec = vec
  }

  static fromFields<T0>(typeArg: Type, fields: Record<string, any>): Option<T0> {
    initLoaderIfNeeded()

    return new Option(
      typeArg,
      fields.vec.map((item: any) => structClassLoaderOnchain.fromFields(typeArg, item))
    )
  }

  static fromFieldsWithTypes<T0>(item: FieldsWithTypes): Option<T0> {
    initLoaderIfNeeded()

    if (!isOption(item.type)) {
      throw new Error('not a Option type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Option(
      typeArgs[0],
      item.fields.vec.map((item: any) =>
        structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[0], item)
      )
    )
  }

  static fromBcs<T0>(typeArg: Type, data: Uint8Array): Option<T0> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return Option.fromFields(
      typeArg,
      Option.bcs(structClassLoaderOnchain.getBcsType(typeArgs[0])).parse(data)
    )
  }
}
