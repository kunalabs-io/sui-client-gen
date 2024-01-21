import * as reified from '../../_framework/reified'
import {
  ReifiedTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeArgument,
  TypeArgument,
  Vector,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  toBcs,
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== VecSet =============================== */

export function isVecSet(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::vec_set::VecSet<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface VecSetFields<K extends TypeArgument> {
  contents: ToField<Vector<K>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class VecSet<K extends TypeArgument> {
  static readonly $typeName = '0x2::vec_set::VecSet'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::vec_set::VecSet<${ToPhantom<K>}>`

  readonly $typeName = VecSet.$typeName

  static get bcs() {
    return <K extends BcsType<any>>(K: K) =>
      bcs.struct(`VecSet<${K.name}>`, {
        contents: bcs.vector(K),
      })
  }

  readonly $typeArg: string

  readonly contents: ToField<Vector<K>>

  private constructor(typeArg: string, contents: ToField<Vector<K>>) {
    this.$typeArg = typeArg

    this.contents = contents
  }

  static new<K extends ReifiedTypeArgument>(
    typeArg: K,
    contents: ToField<Vector<ToTypeArgument<K>>>
  ): VecSet<ToTypeArgument<K>> {
    return new VecSet(extractType(typeArg), contents)
  }

  static reified<K extends ReifiedTypeArgument>(K: K) {
    return {
      typeName: VecSet.$typeName,
      typeArgs: [K],
      fullTypeName: composeSuiType(
        VecSet.$typeName,
        ...[extractType(K)]
      ) as `0x2::vec_set::VecSet<${ToPhantomTypeArgument<K>}>`,
      fromFields: (fields: Record<string, any>) => VecSet.fromFields(K, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecSet.fromFieldsWithTypes(K, item),
      fromBcs: (data: Uint8Array) => VecSet.fromBcs(K, data),
      bcs: VecSet.bcs(toBcs(K)),
      fromJSONField: (field: any) => VecSet.fromJSONField(K, field),
      __class: null as unknown as ReturnType<typeof VecSet.new<ToTypeArgument<K>>>,
    }
  }

  static fromFields<K extends ReifiedTypeArgument>(
    typeArg: K,
    fields: Record<string, any>
  ): VecSet<ToTypeArgument<K>> {
    return VecSet.new(typeArg, decodeFromFields(reified.vector(typeArg), fields.contents))
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
      decodeFromFieldsWithTypes(reified.vector(typeArg), item.fields.contents)
    )
  }

  static fromBcs<K extends ReifiedTypeArgument>(
    typeArg: K,
    data: Uint8Array
  ): VecSet<ToTypeArgument<K>> {
    const typeArgs = [typeArg]

    return VecSet.fromFields(typeArg, VecSet.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      contents: fieldToJSON<Vector<K>>(`vector<${this.$typeArg}>`, this.contents),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<K extends ReifiedTypeArgument>(
    typeArg: K,
    field: any
  ): VecSet<ToTypeArgument<K>> {
    return VecSet.new(typeArg, decodeFromJSONField(reified.vector(typeArg), field.contents))
  }

  static fromJSON<K extends ReifiedTypeArgument>(
    typeArg: K,
    json: Record<string, any>
  ): VecSet<ToTypeArgument<K>> {
    if (json.$typeName !== VecSet.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(VecSet.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return VecSet.fromJSONField(typeArg, json)
  }
}
