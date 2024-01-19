import {
  ReifiedTypeArgument,
  ToField,
  ToTypeArgument,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  extractType,
  toBcs,
} from '../../_framework/types'
import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Wrapper =============================== */

export function isWrapper(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::dynamic_object_field::Wrapper<')
}

export interface WrapperFields<T0 extends TypeArgument> {
  name: ToField<T0>
}

export class Wrapper<T0 extends TypeArgument> {
  static readonly $typeName = '0x2::dynamic_object_field::Wrapper'
  static readonly $numTypeParams = 1

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
      fromFields: (fields: Record<string, any>) => Wrapper.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Wrapper.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Wrapper.fromBcs(T0, data),
      bcs: Wrapper.bcs(toBcs(T0)),
      __class: null as unknown as ReturnType<typeof Wrapper.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): Wrapper<ToTypeArgument<T0>> {
    return Wrapper.new(typeArg, decodeFromFieldsGenericOrSpecial(typeArg, fields.name))
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Wrapper<ToTypeArgument<T0>> {
    if (!isWrapper(item.type)) {
      throw new Error('not a Wrapper type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Wrapper.new(
      typeArg,
      decodeFromFieldsWithTypesGenericOrSpecial(typeArg, item.fields.name)
    )
  }

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): Wrapper<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return Wrapper.fromFields(typeArg, Wrapper.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      name: genericToJSON(this.$typeArg, this.name),
    }
  }
}
