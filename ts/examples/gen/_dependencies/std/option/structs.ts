/** This module defines the Option type and its methods to represent and handle an optional value. */

import { bcs, BcsType } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import {
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  toBcs,
  ToField,
  ToJSON,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  vector,
} from '../../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  parseTypeName,
  SupportedSuiClient,
} from '../../../_framework/util'
import { Vector } from '../../../_framework/vector'

/* ============================== Option =============================== */

export function isOption(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x1::option::Option` + '<')
}

export interface OptionFields<Element extends TypeArgument> {
  vec: ToField<Vector<Element>>
}

export type OptionReified<Element extends TypeArgument> = Reified<
  Option<Element>,
  OptionFields<Element>
>

export type OptionJSONField<Element extends TypeArgument> = {
  vec: ToJSON<Element>[]
}

export type OptionJSON<Element extends TypeArgument> = {
  $typeName: typeof Option.$typeName
  $typeArgs: [ToTypeStr<Element>]
} & OptionJSONField<Element>

/**
 * Abstraction of a value that may or may not be present. Implemented with a vector of size
 * zero or one because Move bytecode does not have ADTs.
 */
export class Option<Element extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x1::option::Option` = `0x1::option::Option` as const
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  __inner: Element = null as unknown as Element // for type checking in reified.ts

  readonly $typeName: typeof Option.$typeName = Option.$typeName
  readonly $fullTypeName: `0x1::option::Option<${ToTypeStr<Element>}>`
  readonly $typeArgs: [ToTypeStr<Element>]
  readonly $isPhantom: typeof Option.$isPhantom = Option.$isPhantom

  readonly vec: ToField<Vector<Element>>

  private constructor(typeArgs: [ToTypeStr<Element>], fields: OptionFields<Element>) {
    this.$fullTypeName = composeSuiType(
      Option.$typeName,
      ...typeArgs,
    ) as `0x1::option::Option<${ToTypeStr<Element>}>`
    this.$typeArgs = typeArgs

    this.vec = fields.vec
  }

  static reified<Element extends Reified<TypeArgument, any>>(
    Element: Element,
  ): OptionReified<ToTypeArgument<Element>> {
    const reifiedBcs = Option.bcs(toBcs(Element))
    return {
      typeName: Option.$typeName,
      fullTypeName: composeSuiType(
        Option.$typeName,
        ...[extractType(Element)],
      ) as `0x1::option::Option<${ToTypeStr<ToTypeArgument<Element>>}>`,
      typeArgs: [extractType(Element)] as [ToTypeStr<ToTypeArgument<Element>>],
      isPhantom: Option.$isPhantom,
      reifiedTypeArgs: [Element],
      fromFields: (fields: Record<string, any>) => Option.fromFields(Element, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Option.fromFieldsWithTypes(Element, item),
      fromBcs: (data: Uint8Array) => Option.fromFields(Element, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Option.fromJSONField(Element, field),
      fromJSON: (json: Record<string, any>) => Option.fromJSON(Element, json),
      fromSuiParsedData: (content: SuiParsedData) => Option.fromSuiParsedData(Element, content),
      fromSuiObjectData: (content: SuiObjectData) => Option.fromSuiObjectData(Element, content),
      fetch: async (client: SupportedSuiClient, id: string) => Option.fetch(client, Element, id),
      new: (fields: OptionFields<ToTypeArgument<Element>>) => {
        return new Option([extractType(Element)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): typeof Option.reified {
    return Option.reified
  }

  static phantom<Element extends Reified<TypeArgument, any>>(
    Element: Element,
  ): PhantomReified<ToTypeStr<Option<ToTypeArgument<Element>>>> {
    return phantom(Option.reified(Element))
  }

  static get p(): typeof Option.phantom {
    return Option.phantom
  }

  private static instantiateBcs() {
    return <Element extends BcsType<any>>(Element: Element) =>
      bcs.struct(`Option<${Element.name}>`, {
        vec: bcs.vector(Element),
      })
  }

  private static cachedBcs: ReturnType<typeof Option.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Option.instantiateBcs> {
    if (!Option.cachedBcs) {
      Option.cachedBcs = Option.instantiateBcs()
    }
    return Option.cachedBcs
  }

  static fromFields<Element extends Reified<TypeArgument, any>>(
    typeArg: Element,
    fields: Record<string, any>,
  ): Option<ToTypeArgument<Element>> {
    return Option.reified(typeArg).new({
      vec: decodeFromFields(vector(typeArg), fields.vec),
    })
  }

  static fromFieldsWithTypes<Element extends Reified<TypeArgument, any>>(
    typeArg: Element,
    item: FieldsWithTypes,
  ): Option<ToTypeArgument<Element>> {
    if (!isOption(item.type)) {
      throw new Error('not a Option type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Option.reified(typeArg).new({
      vec: decodeFromFieldsWithTypes(vector(typeArg), item.fields.vec),
    })
  }

  static fromBcs<Element extends Reified<TypeArgument, any>>(
    typeArg: Element,
    data: Uint8Array,
  ): Option<ToTypeArgument<Element>> {
    const typeArgs = [typeArg]
    return Option.fromFields(typeArg, Option.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField(): OptionJSONField<Element> {
    return {
      vec: fieldToJSON<Vector<Element>>(`vector<${this.$typeArgs[0]}>`, this.vec),
    }
  }

  toJSON(): OptionJSON<Element> {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<Element extends Reified<TypeArgument, any>>(
    typeArg: Element,
    field: any,
  ): Option<ToTypeArgument<Element>> {
    return Option.reified(typeArg).new({
      vec: decodeFromJSONField(vector(typeArg), field.vec),
    })
  }

  static fromJSON<Element extends Reified<TypeArgument, any>>(
    typeArg: Element,
    json: Record<string, any>,
  ): Option<ToTypeArgument<Element>> {
    if (json.$typeName !== Option.$typeName) {
      throw new Error(
        `not a Option json object: expected '${Option.$typeName}' but got '${json.$typeName}'`,
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Option.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg],
    )

    return Option.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<Element extends Reified<TypeArgument, any>>(
    typeArg: Element,
    content: SuiParsedData,
  ): Option<ToTypeArgument<Element>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isOption(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Option object`)
    }
    return Option.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<Element extends Reified<TypeArgument, any>>(
    typeArg: Element,
    data: SuiObjectData,
  ): Option<ToTypeArgument<Element>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isOption(data.bcs.type)) {
        throw new Error(`object at is not a Option object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
          )
        }
      }

      return Option.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Option.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch<Element extends Reified<TypeArgument, any>>(
    client: SupportedSuiClient,
    typeArg: Element,
    id: string,
  ): Promise<Option<ToTypeArgument<Element>>> {
    const res = await fetchObjectBcs(client, id)
    if (!isOption(res.type)) {
      throw new Error(`object at id ${id} is not a Option object`)
    }

    const gotTypeArgs = parseTypeName(res.type).typeArgs
    if (gotTypeArgs.length !== 1) {
      throw new Error(
        `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`,
      )
    }
    for (let i = 0; i < 1; i++) {
      const gotTypeArg = compressSuiType(gotTypeArgs[i])
      const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
      if (gotTypeArg !== expectedTypeArg) {
        throw new Error(
          `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`,
        )
      }
    }

    return Option.fromBcs(typeArg, res.bcsBytes)
  }
}
