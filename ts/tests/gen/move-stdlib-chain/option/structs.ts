import * as reified from '../../_framework/reified'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeArgument,
  ToTypeStr,
  TypeArgument,
  Vector,
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
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { BcsType, bcs, fromB64 } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Option =============================== */

export function isOption(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x1::option::Option<')
}

export interface OptionFields<T0 extends TypeArgument> {
  vec: ToField<Vector<T0>>
}

export type OptionReified<T0 extends TypeArgument> = Reified<Option<T0>, OptionFields<T0>>

export class Option<T0 extends TypeArgument> implements StructClass {
  static readonly $typeName = '0x1::option::Option'
  static readonly $numTypeParams = 1

  __inner: T0 = null as unknown as T0 // for type checking in reified.ts

  readonly $typeName = Option.$typeName

  readonly $fullTypeName: `0x1::option::Option<${ToTypeStr<T0>}>`

  readonly $typeArg: string

  readonly vec: ToField<Vector<T0>>

  private constructor(typeArg: string, fields: OptionFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Option.$typeName,
      typeArg
    ) as `0x1::option::Option<${ToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.vec = fields.vec
  }

  static reified<T0 extends Reified<TypeArgument, any>>(T0: T0): OptionReified<ToTypeArgument<T0>> {
    return {
      typeName: Option.$typeName,
      fullTypeName: composeSuiType(
        Option.$typeName,
        ...[extractType(T0)]
      ) as `0x1::option::Option<${ToTypeStr<ToTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Option.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Option.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Option.fromBcs(T0, data),
      bcs: Option.bcs(toBcs(T0)),
      fromJSONField: (field: any) => Option.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Option.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => Option.fetch(client, T0, id),
      new: (fields: OptionFields<ToTypeArgument<T0>>) => {
        return new Option(extractType(T0), fields)
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

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Option<${T0.name}>`, {
        vec: bcs.vector(T0),
      })
  }

  static fromFields<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Option<ToTypeArgument<T0>> {
    return Option.reified(typeArg).new({
      vec: decodeFromFields(reified.vector(typeArg), fields.vec),
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
      vec: decodeFromFieldsWithTypes(reified.vector(typeArg), item.fields.vec),
    })
  }

  static fromBcs<T0 extends Reified<TypeArgument, any>>(
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

  static fromJSONField<T0 extends Reified<TypeArgument, any>>(
    typeArg: T0,
    field: any
  ): Option<ToTypeArgument<T0>> {
    return Option.reified(typeArg).new({
      vec: decodeFromJSONField(reified.vector(typeArg), field.vec),
    })
  }

  static fromJSON<T0 extends Reified<TypeArgument, any>>(
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
    return Option.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}
