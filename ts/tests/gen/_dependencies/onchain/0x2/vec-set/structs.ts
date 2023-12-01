import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== VecSet =============================== */

export function isVecSet(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_set::VecSet<')
}

export interface VecSetFields<T0> {
  contents: Array<T0>
}

export class VecSet<T0> {
  static readonly $typeName = '0x2::vec_set::VecSet'
  static readonly $numTypeParams = 1

  static get bcs(): (t0: BcsType<any>) => BcsType<any> {
    return bcs.generic(['T0'], T0 =>
      bcs.struct('VecSet<T0>', {
        contents: bcs.vector(T0),
      })
    )
  }

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

  static fromBcs<T0>(typeArg: Type, data: Uint8Array): VecSet<T0> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return VecSet.fromFields(
      typeArg,
      VecSet.bcs(structClassLoaderOnchain.getBcsType(typeArgs[0])).parse(data)
    )
  }
}
