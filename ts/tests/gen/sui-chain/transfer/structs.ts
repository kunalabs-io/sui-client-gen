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
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { PKG_V32 } from '../index'
import { ID } from '../object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== Receiving =============================== */

export function isReceiving(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith(`${PKG_V32}::transfer::Receiving` + '<')
}

export interface ReceivingFields<T0 extends PhantomTypeArgument> {
  id: ToField<ID>
  version: ToField<'u64'>
}

export type ReceivingReified<T0 extends PhantomTypeArgument> = Reified<
  Receiving<T0>,
  ReceivingFields<T0>
>

export class Receiving<T0 extends PhantomTypeArgument> implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V32}::transfer::Receiving`
  static readonly $numTypeParams = 1
  static readonly $isPhantom = [true] as const

  readonly $typeName = Receiving.$typeName
  readonly $fullTypeName: `${typeof PKG_V32}::transfer::Receiving<${PhantomToTypeStr<T0>}>`
  readonly $typeArgs: [PhantomToTypeStr<T0>]
  readonly $isPhantom = Receiving.$isPhantom

  readonly id: ToField<ID>
  readonly version: ToField<'u64'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: ReceivingFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Receiving.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V32}::transfer::Receiving<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.version = fields.version
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): ReceivingReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: Receiving.$typeName,
      fullTypeName: composeSuiType(
        Receiving.$typeName,
        ...[extractType(T0)]
      ) as `${typeof PKG_V32}::transfer::Receiving<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      isPhantom: Receiving.$isPhantom,
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Receiving.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Receiving.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Receiving.fromBcs(T0, data),
      bcs: Receiving.bcs,
      fromJSONField: (field: any) => Receiving.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Receiving.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Receiving.fromSuiParsedData(T0, content),
      fromSuiObjectData: (content: SuiObjectData) => Receiving.fromSuiObjectData(T0, content),
      fetch: async (client: SuiClient, id: string) => Receiving.fetch(client, T0, id),
      new: (fields: ReceivingFields<ToPhantomTypeArgument<T0>>) => {
        return new Receiving([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Receiving.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Receiving<ToPhantomTypeArgument<T0>>>> {
    return phantom(Receiving.reified(T0))
  }
  static get p() {
    return Receiving.phantom
  }

  static get bcs() {
    return bcs.struct('Receiving', {
      id: ID.bcs,
      version: bcs.u64(),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Receiving<ToPhantomTypeArgument<T0>> {
    return Receiving.reified(typeArg).new({
      id: decodeFromFields(ID.reified(), fields.id),
      version: decodeFromFields('u64', fields.version),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Receiving<ToPhantomTypeArgument<T0>> {
    if (!isReceiving(item.type)) {
      throw new Error('not a Receiving type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Receiving.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(ID.reified(), item.fields.id),
      version: decodeFromFieldsWithTypes('u64', item.fields.version),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Receiving<ToPhantomTypeArgument<T0>> {
    return Receiving.fromFields(typeArg, Receiving.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      version: this.version.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Receiving<ToPhantomTypeArgument<T0>> {
    return Receiving.reified(typeArg).new({
      id: decodeFromJSONField(ID.reified(), field.id),
      version: decodeFromJSONField('u64', field.version),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Receiving<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Receiving.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Receiving.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return Receiving.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Receiving<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isReceiving(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Receiving object`)
    }
    return Receiving.fromFieldsWithTypes(typeArg, content)
  }

  static fromSuiObjectData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: SuiObjectData
  ): Receiving<ToPhantomTypeArgument<T0>> {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isReceiving(data.bcs.type)) {
        throw new Error(`object at is not a Receiving object`)
      }

      const gotTypeArgs = parseTypeName(data.bcs.type).typeArgs
      if (gotTypeArgs.length !== 1) {
        throw new Error(
          `type argument mismatch: expected 1 type argument but got '${gotTypeArgs.length}'`
        )
      }
      const gotTypeArg = compressSuiType(gotTypeArgs[0])
      const expectedTypeArg = compressSuiType(extractType(typeArg))
      if (gotTypeArg !== compressSuiType(extractType(typeArg))) {
        throw new Error(
          `type argument mismatch: expected '${expectedTypeArg}' but got '${gotTypeArg}'`
        )
      }

      return Receiving.fromBcs(typeArg, fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Receiving.fromSuiParsedData(typeArg, data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Receiving<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Receiving object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isReceiving(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Receiving object`)
    }

    return Receiving.fromSuiObjectData(typeArg, res.data)
  }
}
