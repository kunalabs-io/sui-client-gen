import { bcsOnchain as bcs } from '../../../../_framework/bcs'
import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import { FieldsWithTypes, Type, parseTypeName } from '../../../../_framework/util'
import { Encoding } from '@mysten/bcs'

/* ============================== VecSet =============================== */

bcs.registerStructType('0x2::vec_set::VecSet<T0>', {
  contents: `vector<T0>`,
})

export function isVecSet(type: Type): boolean {
  return type.startsWith('0x2::vec_set::VecSet<')
}

export interface VecSetFields<T0> {
  contents: Array<T0>
}

export class VecSet<T0> {
  static readonly $typeName = '0x2::vec_set::VecSet'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly contents: Array<T0>

  constructor(typeArg: Type, contents: Array<T0>) {
    this.$typeArg = typeArg

    this.contents = contents
  }

  static fromFields<T0>(typeArg: Type, fields: Record<string, any>): VecSet<T0> {
    initLoaderIfNeeded()

    return new VecSet(
      typeArg,
      fields.contents.map((item: any) => structClassLoaderOnchain.fromFields(typeArg, item))
    )
  }

  static fromFieldsWithTypes<T0>(item: FieldsWithTypes): VecSet<T0> {
    initLoaderIfNeeded()

    if (!isVecSet(item.type)) {
      throw new Error('not a VecSet type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new VecSet(
      typeArgs[0],
      item.fields.contents.map((item: any) =>
        structClassLoaderOnchain.fromFieldsWithTypes(typeArgs[0], item)
      )
    )
  }

  static fromBcs<T0>(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): VecSet<T0> {
    return VecSet.fromFields(typeArg, bcs.de([VecSet.$typeName, typeArg], data, encoding))
  }
}
