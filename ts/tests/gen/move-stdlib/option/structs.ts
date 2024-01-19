import * as reified from '../../_framework/reified'
import {
  ReifiedTypeArgument,
  ToField,
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
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { BcsType, bcs } from '@mysten/bcs'

/* ============================== Option =============================== */

export function isOption(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x1::option::Option<')
}

export interface OptionFields<Element extends TypeArgument> {
  vec: Array<ToField<Element>>
}

export class Option<Element extends TypeArgument> {
  static readonly $typeName = '0x1::option::Option'
  static readonly $numTypeParams = 1

  readonly $typeName = Option.$typeName

  static get bcs() {
    return <Element extends BcsType<any>>(Element: Element) =>
      bcs.struct(`Option<${Element.name}>`, {
        vec: bcs.vector(Element),
      })
  }

  readonly $typeArg: string

  readonly vec: Array<ToField<Element>>

  private constructor(typeArg: string, vec: Array<ToField<Element>>) {
    this.$typeArg = typeArg

    this.vec = vec
  }

  static new<Element extends ReifiedTypeArgument>(
    typeArg: Element,
    vec: Array<ToField<ToTypeArgument<Element>>>
  ): Option<ToTypeArgument<Element>> {
    return new Option(extractType(typeArg), vec)
  }

  static reified<Element extends ReifiedTypeArgument>(Element: Element) {
    return {
      typeName: Option.$typeName,
      typeArgs: [Element],
      fromFields: (fields: Record<string, any>) => Option.fromFields(Element, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Option.fromFieldsWithTypes(Element, item),
      fromBcs: (data: Uint8Array) => Option.fromBcs(Element, data),
      bcs: Option.bcs(toBcs(Element)),
      fromJSONField: (field: any) => Option.fromJSONField(Element, field),
      __class: null as unknown as ReturnType<typeof Option.new<ToTypeArgument<Element>>>,
    }
  }

  static fromFields<Element extends ReifiedTypeArgument>(
    typeArg: Element,
    fields: Record<string, any>
  ): Option<ToTypeArgument<Element>> {
    return Option.new(typeArg, decodeFromFields(reified.vector(typeArg), fields.vec))
  }

  static fromFieldsWithTypes<Element extends ReifiedTypeArgument>(
    typeArg: Element,
    item: FieldsWithTypes
  ): Option<ToTypeArgument<Element>> {
    if (!isOption(item.type)) {
      throw new Error('not a Option type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Option.new(typeArg, decodeFromFieldsWithTypes(reified.vector(typeArg), item.fields.vec))
  }

  static fromBcs<Element extends ReifiedTypeArgument>(
    typeArg: Element,
    data: Uint8Array
  ): Option<ToTypeArgument<Element>> {
    const typeArgs = [typeArg]

    return Option.fromFields(typeArg, Option.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      vec: fieldToJSON<Array<Element>>(`vector<${this.$typeArg}>`, this.vec),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<Element extends ReifiedTypeArgument>(
    typeArg: Element,
    field: any
  ): Option<ToTypeArgument<Element>> {
    return Option.new(typeArg, decodeFromJSONField(reified.vector(typeArg), field.vec))
  }

  static fromJSON<Element extends ReifiedTypeArgument>(
    typeArg: Element,
    json: Record<string, any>
  ): Option<ToTypeArgument<Element>> {
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
