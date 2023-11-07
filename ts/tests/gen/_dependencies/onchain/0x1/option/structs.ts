import { Encoding, bcsOnchain as bcs } from '../../../../_framework/bcs'
import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../../../_framework/util'

/* ============================== Option =============================== */

bcs.registerStructType('0x1::option::Option<T0>', {
  vec: `vector<T0>`,
})

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

  static fromBcs<T0>(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): Option<T0> {
    return Option.fromFields(typeArg, bcs.de([Option.$typeName, typeArg], data, encoding))
  }
}
