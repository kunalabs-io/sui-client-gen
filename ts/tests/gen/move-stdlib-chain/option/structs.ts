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
  vector,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { BcsType, bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== Option =============================== */

export function isOption(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`0x1::option::Option` + '<')
}

export interface OptionFields<T0 extends TypeArgument> {
  vec: ToField<Vector<T0>>
}

export type OptionReified<T0 extends TypeArgument> = Reified<Option<T0>, OptionFields<T0>>

export class Option<T0 extends TypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x1::option::Option`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [false] as const

  __inner: T0 = null as unknown as T0 // for type checking in reified.ts

  readonly $typeName = Option.$typeName
  readonly $fullTypeName: `0x1::option::Option<${ToTypeStr<T0>}>`
  readonly $typeArgs: [ToTypeStr<T0>]
  readonly $isPhantom = Option.$isPhantom

  readonly vec: ToField<Vector<T0>>

  private constructor(typeArgs: [ToTypeStr<T0>], fields: OptionFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Option.$typeName,
      ...typeArgs
    ) as `0x1::option::Option<${ToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.vec = fields.vec
  }

  static reified<T0 extends Reified<TypeArgument, any>>(T0: T0): OptionReified<ToTypeArgument<T0>> {
    const reifiedBcs = Option.bcs(toBcs(T0))
    return {
      typeName: Option.$typeName,
      fullTypeName: composeSuiType(
        Option.$typeName,
        ...[extractType(T0)]
      ) as `0x1::option::Option<${ToTypeStr<ToTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [ToTypeStr<ToTypeArgument<T0>>],
      isPhantom: Option.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Option.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Option.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Option.fromFields(T0, reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Option.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Option.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Option.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Option.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Option.fetch(client, T0, id),
      new: (fields: OptionFields<ToTypeArgument<T0>>) => {
        return new Option([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Option.reified
  }

  static phantom<T0 extends Reified<TypeArgument, any>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Option<ToTypeArgument<T0>>>> {
    return phantom(Option.reified(T0))
  }

  static get p() {
    return Option.phantom
  }

  private static instantiateBcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Option<${T0.name}>`, {
        vec: bcs.vector(T0),
      })
  }

  private static cachedBcs: ReturnType<typeof Option.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Option.instantiateBcs> {
    if (!Option.cachedBcs) {
      Option.cachedBcs = Option.instantiateBcs()
    }
    return Option.cachedBcs
  }

  static fromFields<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Option<ToTypeArgument<T0>> {
    return Option.reified(typeArg).new({
      vec: decodeFromFields(vector(typeArg), fields.vec),
    })
  }

  static fromFieldsWithTypes<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Option<ToTypeArgument<T0>> {
    if (!isOption(item.type)) {
      throw new Error('not a Option type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Option.reified(typeArg).new({
      vec: decodeFromFieldsWithTypes(vector(typeArg), item.fields.vec),
    })
  }

  static fromBcs<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    data: Uint8Array
  ): Option<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]
    return Option.fromFields(typeArg, Option.bcs(toBcs(typeArg)).parse(data))
  }

  toJSONField() {
    return {
      vec: fieldToJSON<Vector<T0>>(`vector<${this.$typeArgs[0]}>`, this.vec),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    field: any
  ): Option<ToTypeArgument<T0>> {
    return Option.reified(typeArg).new({
      vec: decodeFromJSONField(vector(typeArg), field.vec),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    json: Record<string, any>
  ): Option<ToTypeArgument<T0>> {
    if (json.$typeName !== Option.$typeName) {
      throw new Error(
        `not a Option json object: expected '${Option.$typeName}' but got '${json.$typeName}'`
      )
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Option.$typeName, ...[extractType(typeArg)]),
      json.$typeArgs,
      [typeArg]
    )

    return Option.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    content: SuiParsedData
  ): Option<ToTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isOption(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Option object`)
    }
    return Option.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    data: SuiObjectData
  ): Option<ToTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isOption(data.bcs.type)) {
        throw new Error(`object at is not a Option object`)
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

      return Option.fromBcs(typeArg, fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Option.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends Reified<TypeArgument, any>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Option<ToTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Option object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isOption(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Option object`)
    }

    return Option.fromSuiObjectData(typeArg, res.data)
  }
}
