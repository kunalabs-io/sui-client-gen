import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  phantom,
  toBcs,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Wrapper =============================== */

export function isWrapper(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x2::dynamic_object_field::Wrapper` + '<')
}

export interface WrapperFields<T0 extends TypeArgument> {
  name: ToField<T0>
}

export type WrapperReified<T0 extends TypeArgument> = Reified<Wrapper<T0>, WrapperFields<T0>>

export class Wrapper<T0 extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::dynamic_object_field::Wrapper`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  readonly $typeName = Wrapper.$typeName
  readonly $fullTypeName: `0x2::dynamic_object_field::Wrapper<${ToTypeStr<T0>}>`
  readonly $typeArgs: [ToTypeStr<T0>]
  readonly $isPhantom = Wrapper.$isPhantom

  readonly name: ToField<T0>

  private constructor(typeArgs: [ToTypeStr<T0>], fields: WrapperFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Wrapper.$typeName,
      ...typeArgs
    ) as `0x2::dynamic_object_field::Wrapper<${ToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.name = fields.name
  }

  static reified<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): WrapperReified<ToTypeArgument<T0>> {
    const reifiedBcs = Wrapper.bcs(toBcs(T0))
    return {
      typeName: Wrapper.$typeName,
      fullTypeName: composeSuiType(
        Wrapper.$typeName,
        ...[extractType(T0)]
      ) as `0x2::dynamic_object_field::Wrapper<${ToTypeStr<ToTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [ToTypeStr<ToTypeArgument<T0>>],
      isPhantom: Wrapper.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Wrapper.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Wrapper.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Wrapper.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Wrapper.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Wrapper.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Wrapper.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Wrapper.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Wrapper.fetch(client, T0, id),
      new: (fields: WrapperFields<ToTypeArgument<T0>>) => {
        return new Wrapper([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Wrapper.reified
  }

  static phantom<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Wrapper<ToTypeArgument<T0>>>> {
    return phantom(Wrapper.reified(T0))
  }

  static get p() {
    return Wrapper.phantom
  }

  private static instantiateBcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Wrapper<${T0.name}>`, {
        name: T0,
      })
  }

  private static cachedBcs: ReturnType<typeof Wrapper.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Wrapper.instantiateBcs> {
    if (!Wrapper.cachedBcs) {
      Wrapper.cachedBcs = Wrapper.instantiateBcs()
    }
    return Wrapper.cachedBcs
  }

  static fromFields<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Wrapper<ToTypeArgument<T0>> {
    return Wrapper.reified(typeArg).new({
      name: decodeFromFields(typeArg, fields.name),
    })
  }

  static fromFieldsWithTypes<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Wrapper<ToTypeArgument<T0>> {
    if (!isWrapper(item.type)) {
      throw new Error('not a Wrapper type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Wrapper.reified(typeArg).new({
      name: decodeFromFieldsWithTypes(typeArg, item.fields.name),
    })
  }

  static fromBcs<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    data: Uint8Array
  ): Wrapper<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]
    return Wrapper.fromFields(typeArg, Wrapper.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField() {
    return {
      name: fieldToJSON<T0>(`${this.$typeArgs[0]}`, this.name),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    field: any
  ): Wrapper<ToTypeArgument<T0>> {
    return Wrapper.reified(typeArg).new({
      name: decodeFromJSONField(typeArg, field.name),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    json: Record<string, any>
  ): Wrapper<ToTypeArgument<T0>> {
    if (json.$typeName !== Wrapper.$typeName) {
      throw new Error(
        `not a Wrapper json object: expected '${Wrapper.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Wrapper.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Wrapper.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    content: SuiParsedData
  ): Wrapper<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isWrapper(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Wrapper object`)
    }
    return Wrapper.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    data: SuiObjectData
  ): Wrapper<ToTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isWrapper(data.bcs.type)) {
        throw new Error(`object at is not a Wrapper object`)
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

      return Wrapper.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Wrapper.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Wrapper<ToTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Wrapper object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isWrapper(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Wrapper object`)
    }

    return Wrapper.fromSuiObjectData(typeArg, res.data)
  }
}
