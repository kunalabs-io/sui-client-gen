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
export interface VecSetFields<T0 extends TypeArgument> {
  contents: ToField<Vector<T0>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class VecSet<T0 extends TypeArgument> {
  static readonly $typeName = '0x2::vec_set::VecSet'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::vec_set::VecSet<${ToPhantom<T0>}>`

  readonly $typeName = VecSet.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`VecSet<${T0.name}>`, {
        contents: bcs.vector(T0),
      })
  }

  readonly $typeArg: string

  readonly contents: ToField<Vector<T0>>

  private constructor(typeArg: string, contents: ToField<Vector<T0>>) {
    this.$typeArg = typeArg

    this.contents = contents
  }

  static new<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    contents: ToField<Vector<ToTypeArgument<T0>>>
  ): VecSet<ToTypeArgument<T0>> {
    return new VecSet(extractType(typeArg), contents)
  }

  static reified<T0 extends ReifiedTypeArgument>(T0: T0) {
    return {
      typeName: VecSet.$typeName,
      typeArgs: [T0],
      fullTypeName: composeSuiType(
        VecSet.$typeName,
        ...[extractType(T0)]
      ) as `0x2::vec_set::VecSet<${ToPhantomTypeArgument<T0>}>`,
      fromFields: (fields: Record<string, any>) => VecSet.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => VecSet.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => VecSet.fromBcs(T0, data),
      bcs: VecSet.bcs(toBcs(T0)),
      fromJSONField: (field: any) => VecSet.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof VecSet.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): VecSet<ToTypeArgument<T0>> {
    return VecSet.new(typeArg, decodeFromFields(reified.vector(typeArg), fields.contents))
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): VecSet<ToTypeArgument<T0>> {
    if (!isVecSet(item.type)) {
      throw new Error('not a VecSet type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return VecSet.new(
      typeArg,
      decodeFromFieldsWithTypes(reified.vector(typeArg), item.fields.contents)
    )
  }

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): VecSet<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return VecSet.fromFields(typeArg, VecSet.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      contents: fieldToJSON<Vector<T0>>(`vector<${this.$typeArg}>`, this.contents),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    field: any
  ): VecSet<ToTypeArgument<T0>> {
    return VecSet.new(typeArg, decodeFromJSONField(reified.vector(typeArg), field.contents))
  }

  static fromJSON<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): VecSet<ToTypeArgument<T0>> {
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
