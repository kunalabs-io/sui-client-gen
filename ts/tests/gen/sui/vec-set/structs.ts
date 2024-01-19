import {
  ReifiedTypeArgument,
  ToField,
  ToTypeArgument,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  extractType,
  reified,
  toBcs,
} from '../../_framework/types'
import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== VecSet =============================== */

export function isVecSet(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_set::VecSet<')
}

export interface VecSetFields<K extends TypeArgument> {
  contents: Array<ToField<K>>
}

export class VecSet<K extends TypeArgument> {
  static readonly $typeName = '0x2::vec_set::VecSet'
  static readonly $numTypeParams = 1

  readonly $typeName = VecSet.$typeName

  static get bcs() {
    return <K extends BcsType<any>>(K: K) =>
      bcs.struct(`VecSet<${K.name}>`, {
        contents: bcs.vector(K),
      })
  }

  readonly $typeArg: string

  readonly contents: Array<ToField<K>>

  private constructor(typeArg: string, contents: Array<ToField<K>>) {
    this.$typeArg = typeArg

    this.contents = contents
  }

  static new<K extends ReifiedTypeArgument>(
    typeArg: K,
    contents: Array<ToField<ToTypeArgument<K>>>
  ): VecSet<ToTypeArgument<K>> {
    return new VecSet(extractType(typeArg), contents)
  }

  static reified<K extends ReifiedTypeArgument>(K: K) {
    return {
      typeName: VecSet.$typeName,
      typeArgs: [K],
      fromFields: (fields: Record<string, any>) => VecSet.fromFields(K, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecSet.fromFieldsWithTypes(K, item),
      fromBcs: (data: Uint8Array) => VecSet.fromBcs(K, data),
      bcs: VecSet.bcs(toBcs(K)),
      __class: null as unknown as ReturnType<typeof VecSet.new<ToTypeArgument<K>>>,
    }
  }

  static fromFields<K extends ReifiedTypeArgument>(
    typeArg: K,
    fields: Record<string, any>
  ): VecSet<ToTypeArgument<K>> {
    return VecSet.new(
      typeArg,
      decodeFromFieldsGenericOrSpecial(reified.vector(typeArg), fields.contents)
    )
  }

  static fromFieldsWithTypes<K extends ReifiedTypeArgument>(
    typeArg: K,
    item: FieldsWithTypes
  ): VecSet<ToTypeArgument<K>> {
    if (!isVecSet(item.type)) {
      throw new Error('not a VecSet type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return VecSet.new(
      typeArg,
      decodeFromFieldsWithTypesGenericOrSpecial(reified.vector(typeArg), item.fields.contents)
    )
  }

  static fromBcs<K extends ReifiedTypeArgument>(
    typeArg: K,
    data: Uint8Array
  ): VecSet<ToTypeArgument<K>> {
    const typeArgs = [typeArg]

    return VecSet.fromFields(typeArg, VecSet.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      contents: genericToJSON(`vector<${this.$typeArg}>`, this.contents),
    }
  }
}
