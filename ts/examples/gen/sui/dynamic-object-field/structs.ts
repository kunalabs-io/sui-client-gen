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

export interface WrapperFields<Name extends TypeArgument> {
  name: ToField<Name>
}

export class Wrapper<Name extends TypeArgument> {
  static readonly $typeName = '0x2::dynamic_object_field::Wrapper'
  static readonly $numTypeParams = 1

  readonly $typeName = Wrapper.$typeName

  static get bcs() {
    return <Name extends BcsType<any>>(Name: Name) =>
      bcs.struct(`Wrapper<${Name.name}>`, {
        name: Name,
      })
  }

  readonly $typeArg: string

  readonly name: ToField<Name>

  private constructor(typeArg: string, name: ToField<Name>) {
    this.$typeArg = typeArg

    this.name = name
  }

  static new<Name extends ReifiedTypeArgument>(
    typeArg: Name,
    name: ToField<ToTypeArgument<Name>>
  ): Wrapper<ToTypeArgument<Name>> {
    return new Wrapper(extractType(typeArg), name)
  }

  static reified<Name extends ReifiedTypeArgument>(Name: Name) {
    return {
      typeName: Wrapper.$typeName,
      typeArgs: [Name],
      fromFields: (fields: Record<string, any>) => Wrapper.fromFields(Name, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Wrapper.fromFieldsWithTypes(Name, item),
      fromBcs: (data: Uint8Array) => Wrapper.fromBcs(Name, data),
      bcs: Wrapper.bcs(toBcs(Name)),
      __class: null as unknown as ReturnType<typeof Wrapper.new<ToTypeArgument<Name>>>,
    }
  }

  static fromFields<Name extends ReifiedTypeArgument>(
    typeArg: Name,
    fields: Record<string, any>
  ): Wrapper<ToTypeArgument<Name>> {
    return Wrapper.new(typeArg, decodeFromFieldsGenericOrSpecial(typeArg, fields.name))
  }

  static fromFieldsWithTypes<Name extends ReifiedTypeArgument>(
    typeArg: Name,
    item: FieldsWithTypes
  ): Wrapper<ToTypeArgument<Name>> {
    if (!isWrapper(item.type)) {
      throw new Error('not a Wrapper type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Wrapper.new(
      typeArg,
      decodeFromFieldsWithTypesGenericOrSpecial(typeArg, item.fields.name)
    )
  }

  static fromBcs<Name extends ReifiedTypeArgument>(
    typeArg: Name,
    data: Uint8Array
  ): Wrapper<ToTypeArgument<Name>> {
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
