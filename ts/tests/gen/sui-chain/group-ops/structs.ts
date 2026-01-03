import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  StructClass,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  phantom,
  vector,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Element =============================== */

export function isElement(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::group_ops::Element` + '<')
}

export interface ElementFields<T0 extends PhantomTypeArgument> {
  bytes: ToField<Vector<'u8'>>
}

export type ElementReified<T0 extends PhantomTypeArgument> = Reified<Element<T0>, ElementFields<T0>>

export class Element<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::group_ops::Element`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Element.$typeName
  readonly $fullTypeName: `0x2::group_ops::Element<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = Element.$isPhantom

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: ElementFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Element.$typeName,
      ...typeArgs
    ) as `0x2::group_ops::Element<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.bytes = fields.bytes
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): ElementReified<ToPhantomTypeArgument<T0>> {
    const reifiedBcs = Element.bcs
    return {
      typeName: Element.$typeName,
      fullTypeName: composeSuiType(
        Element.$typeName,
        ...[extractType(T0)]
      ) as `0x2::group_ops::Element<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: Element.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Element.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Element.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Element.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Element.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Element.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Element.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Element.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Element.fetch(client, T0, id),
      new: (fields: ElementFields<ToPhantomTypeArgument<T0>>) => {
        return new Element([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Element.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Element<ToPhantomTypeArgument<T0>>>> {
    return phantom(Element.reified(T0))
  }

  static get p() {
    return Element.phantom
  }

  private static instantiateBcs() {
    return bcs.struct('Element', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof Element.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Element.instantiateBcs> {
    if (!Element.cachedBcs) {
      Element.cachedBcs = Element.instantiateBcs()
    }
    return Element.cachedBcs
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Element<ToPhantomTypeArgument<T0>> {
    return Element.reified(typeArg).new({
      bytes: decodeFromFields(vector('u8'), fields.bytes),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Element<ToPhantomTypeArgument<T0>> {
    if (!isElement(item.type)) {
      throw new Error('not a Element type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Element.reified(typeArg).new({
      bytes: decodeFromFieldsWithTypes(vector('u8'), item.fields.bytes),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Element<ToPhantomTypeArgument<T0>> {
    return Element.fromFields(typeArg, Element.bcs.parse(data))
  }

  toJSONField() {
    return {
      bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bytes),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Element<ToPhantomTypeArgument<T0>> {
    return Element.reified(typeArg).new({
      bytes: decodeFromJSONField(vector('u8'), field.bytes),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Element<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Element.$typeName) {
      throw new Error(
        `not a Element json object: expected '${Element.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Element.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Element.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Element<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isElement(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Element object`)
    }
    return Element.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): Element<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isElement(data.bcs.type)) {
        throw new Error(`object at is not a Element object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type arguments but got '${gotTypeArgs.length}'`
        )
      }
      for (let i = 0; i < 1; i++) {
        const gotTypeArg = compressSuiType(gotTypeArgs[i])
        const expectedTypeArg = compressSuiType(extractType([typeArg][i]))
        if (gotTypeArg !== expectedTypeArg) {
          throw new Error(
            `type argument mismatch at position ${i}: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
          )
        }
      }

      return Element.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Element.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Element<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Element object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isElement(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Element object`)
    }

    return Element.fromSuiObjectData(typeArg, res.data)
  }
}
