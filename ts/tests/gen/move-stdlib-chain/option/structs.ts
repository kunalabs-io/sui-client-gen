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

/* ============================== Option =============================== */

export function isOption(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x1::option::Option<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface OptionFields<T0 extends TypeArgument> {
  vec: ToField<Vector<T0>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Option<T0 extends TypeArgument> {
  static readonly $typeName = '0x1::option::Option'
  static readonly $numTypeParams = 1

  __inner: T0 = null as unknown as T0 // for type checking in reified.ts

  __reifiedFullTypeString = null as unknown as `0x1::option::Option<${ToPhantom<T0>}>`

  readonly $typeName = Option.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Option<${T0.name}>`, {
        vec: bcs.vector(T0),
      })
  }

  readonly $typeArg: string

  readonly vec: ToField<Vector<T0>>

  private constructor(typeArg: string, vec: ToField<Vector<T0>>) {
    this.$typeArg = typeArg

    this.vec = vec
  }

  static new<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    vec: ToField<Vector<ToTypeArgument<T0>>>
  ): Option<ToTypeArgument<T0>> {
    return new Option(extractType(typeArg), vec)
  }

  static reified<T0 extends ReifiedTypeArgument>(T0: T0) {
    return {
      typeName: Option.$typeName,
      typeArgs: [T0],
      fullTypeName: composeSuiType(
        Option.$typeName,
        ...[extractType(T0)]
      ) as `0x1::option::Option<${ToPhantomTypeArgument<T0>}>`,
      fromFields: (fields: Record<string, any>) => Option.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Option.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Option.fromBcs(T0, data),
      bcs: Option.bcs(toBcs(T0)),
      fromJSONField: (field: any) => Option.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof Option.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): Option<ToTypeArgument<T0>> {
    return Option.new(typeArg, decodeFromFields(reified.vector(typeArg), fields.vec))
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Option<ToTypeArgument<T0>> {
    if (!isOption(item.type)) {
      throw new Error('not a Option type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Option.new(typeArg, decodeFromFieldsWithTypes(reified.vector(typeArg), item.fields.vec))
  }

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): Option<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return Option.fromFields(typeArg, Option.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      vec: fieldToJSON<Vector<T0>>(`vector<${this.$typeArg}>`, this.vec),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    field: any
  ): Option<ToTypeArgument<T0>> {
    return Option.new(typeArg, decodeFromJSONField(reified.vector(typeArg), field.vec))
  }

  static fromJSON<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): Option<ToTypeArgument<T0>> {
    if (json.$typeName !== Option.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Option.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Option.fromJSONField(typeArg, json)
  }
}
