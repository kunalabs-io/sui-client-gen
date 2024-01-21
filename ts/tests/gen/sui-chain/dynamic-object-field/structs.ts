import {
  ReifiedTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeArgument,
  TypeArgument,
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

/* ============================== Wrapper =============================== */

export function isWrapper(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::dynamic_object_field::Wrapper<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface WrapperFields<T0 extends TypeArgument> {
  name: ToField<T0>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Wrapper<T0 extends TypeArgument> {
  static readonly $typeName = '0x2::dynamic_object_field::Wrapper'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString =
    null as unknown as `0x2::dynamic_object_field::Wrapper<${ToPhantom<T0>}>`

  readonly $typeName = Wrapper.$typeName

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Wrapper<${T0.name}>`, {
        name: T0,
      })
  }

  readonly $typeArg: string

  readonly name: ToField<T0>

  private constructor(typeArg: string, name: ToField<T0>) {
    this.$typeArg = typeArg

    this.name = name
  }

  static new<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    name: ToField<ToTypeArgument<T0>>
  ): Wrapper<ToTypeArgument<T0>> {
    return new Wrapper(extractType(typeArg), name)
  }

  static reified<T0 extends ReifiedTypeArgument>(T0: T0) {
    return {
      typeName: Wrapper.$typeName,
      typeArgs: [T0],
      fullTypeName: composeSuiType(
        Wrapper.$typeName,
        ...[extractType(T0)]
      ) as `0x2::dynamic_object_field::Wrapper<${ToPhantomTypeArgument<T0>}>`,
      fromFields: (fields: Record<string, any>) => Wrapper.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Wrapper.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Wrapper.fromBcs(T0, data),
      bcs: Wrapper.bcs(toBcs(T0)),
      fromJSONField: (field: any) => Wrapper.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof Wrapper.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): Wrapper<ToTypeArgument<T0>> {
    return Wrapper.new(typeArg, decodeFromFields(typeArg, fields.name))
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Wrapper<ToTypeArgument<T0>> {
    if (!isWrapper(item.type)) {
      throw new Error('not a Wrapper type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Wrapper.new(typeArg, decodeFromFieldsWithTypes(typeArg, item.fields.name))
  }

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): Wrapper<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return Wrapper.fromFields(typeArg, Wrapper.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      name: fieldToJSON<T0>(this.$typeArg, this.name),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    field: any
  ): Wrapper<ToTypeArgument<T0>> {
    return Wrapper.new(typeArg, decodeFromJSONField(typeArg, field.name))
  }

  static fromJSON<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): Wrapper<ToTypeArgument<T0>> {
    if (json.$typeName !== Wrapper.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Wrapper.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Wrapper.fromJSONField(typeArg, json)
  }
}
