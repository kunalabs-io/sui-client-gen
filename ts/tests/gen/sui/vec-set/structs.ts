import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import {
  FieldsWithTypes,
  Type,
  compressSuiType,
  genericToJSON,
  parseTypeName,
} from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== VecSet =============================== */

export function isVecSet(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_set::VecSet<')
}

export interface VecSetFields<K> {
  contents: Array<K>
}

export class VecSet<K> {
  static readonly $typeName = '0x2::vec_set::VecSet'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <K extends BcsType<any>>(K: K) =>
      bcs.struct(`VecSet<${K.name}>`, {
        contents: bcs.vector(K),
      })
  }

  readonly $typeArg: Type

  readonly contents: Array<K>

  constructor(typeArg: Type, contents: Array<K>) {
    this.$typeArg = typeArg

    this.contents = contents
  }

  static fromFields<K>(typeArg: Type, fields: Record<string, any>): VecSet<K> {
    initLoaderIfNeeded()

    return new VecSet(
      typeArg,
      fields.contents.map((item: any) => structClassLoaderSource.fromFields(typeArg, item))
    )
  }

  static fromFieldsWithTypes<K>(item: FieldsWithTypes): VecSet<K> {
    initLoaderIfNeeded()

    if (!isVecSet(item.type)) {
      throw new Error('not a VecSet type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new VecSet(
      typeArgs[0],
      item.fields.contents.map((item: any) =>
        structClassLoaderSource.fromFieldsWithTypes(typeArgs[0], item)
      )
    )
  }

  static fromBcs<K>(typeArg: Type, data: Uint8Array): VecSet<K> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return VecSet.fromFields(
      typeArg,
      VecSet.bcs(structClassLoaderSource.getBcsType(typeArgs[0])).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      contents: genericToJSON(`vector<${this.$typeArg}>`, this.contents),
    }
  }
}
