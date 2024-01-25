import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
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
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { ID } from '../object/structs'
import { bcs, fromB64 } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Receiving =============================== */

export function isReceiving(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::transfer::Receiving<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ReceivingFields<T0 extends PhantomTypeArgument> {
  id: ToField<ID>
  version: ToField<'u64'>
}

export type ReceivingReified<T0 extends PhantomTypeArgument> = Reified<
  Receiving<T0>,
  ReceivingFields<T0>
>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Receiving<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::transfer::Receiving'
  static readonly $numTypeParams = 1

  readonly $typeName = Receiving.$typeName

  readonly $fullTypeName: `0x2::transfer::Receiving<${string}>`

  readonly $typeArg: string

  readonly id: ToField<ID>
  readonly version: ToField<'u64'>

  private constructor(typeArg: string, fields: ReceivingFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Receiving.$typeName,
      typeArg
    ) as `0x2::transfer::Receiving<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

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
      ) as `0x2::transfer::Receiving<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Receiving.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Receiving.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Receiving.fromBcs(T0, data),
      bcs: Receiving.bcs,
      fromJSONField: (field: any) => Receiving.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Receiving.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => Receiving.fetch(client, T0, id),
      new: (fields: ReceivingFields<ToPhantomTypeArgument<T0>>) => {
        return new Receiving(extractType(T0), fields)
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
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
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
      [json.$typeArg],
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
    return Receiving.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}
