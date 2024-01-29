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
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs, fromB64 } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Supply =============================== */

export function isSupply(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Supply<')
}

export interface SupplyFields<T0 extends PhantomTypeArgument> {
  value: ToField<'u64'>
}

export type SupplyReified<T0 extends PhantomTypeArgument> = Reified<Supply<T0>, SupplyFields<T0>>

export class Supply<T0 extends PhantomTypeArgument> implements StructClass {
  static readonly $typeName = '0x2::balance::Supply'
  static readonly $numTypeParams = 1

  readonly $typeName = Supply.$typeName

  readonly $fullTypeName: `0x2::balance::Supply<${PhantomToTypeStr<T0>}>`

  readonly $typeArgs: [PhantomToTypeStr<T0>]

  readonly value: ToField<'u64'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: SupplyFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Supply.$typeName,
      ...typeArgs
    ) as `0x2::balance::Supply<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.value = fields.value
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): SupplyReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: Supply.$typeName,
      fullTypeName: composeSuiType(
        Supply.$typeName,
        ...[extractType(T0)]
      ) as `0x2::balance::Supply<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Supply.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Supply.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Supply.fromBcs(T0, data),
      bcs: Supply.bcs,
      fromJSONField: (field: any) => Supply.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Supply.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Supply.fromSuiParsedData(T0, content),
      fetch: async (client: SuiClient, id: string) => Supply.fetch(client, T0, id),
      new: (fields: SupplyFields<ToPhantomTypeArgument<T0>>) => {
        return new Supply([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Supply.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Supply<ToPhantomTypeArgument<T0>>>> {
    return phantom(Supply.reified(T0))
  }
  static get p() {
    return Supply.phantom
  }

  static get bcs() {
    return bcs.struct('Supply', {
      value: bcs.u64(),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Supply<ToPhantomTypeArgument<T0>> {
    return Supply.reified(typeArg).new({ value: decodeFromFields('u64', fields.value) })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Supply<ToPhantomTypeArgument<T0>> {
    if (!isSupply(item.type)) {
      throw new Error('not a Supply type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Supply.reified(typeArg).new({
      value: decodeFromFieldsWithTypes('u64', item.fields.value),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Supply<ToPhantomTypeArgument<T0>> {
    return Supply.fromFields(typeArg, Supply.bcs.parse(data))
  }

  toJSONField() {
    return {
      value: this.value.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Supply<ToPhantomTypeArgument<T0>> {
    return Supply.reified(typeArg).new({ value: decodeFromJSONField('u64', field.value) })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Supply<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Supply.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Supply.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return Supply.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Supply<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isSupply(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Supply object`)
    }
    return Supply.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Supply<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Supply object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isSupply(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Supply object`)
    }
    return Supply.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== Balance =============================== */

export function isBalance(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Balance<')
}

export interface BalanceFields<T0 extends PhantomTypeArgument> {
  value: ToField<'u64'>
}

export type BalanceReified<T0 extends PhantomTypeArgument> = Reified<Balance<T0>, BalanceFields<T0>>

export class Balance<T0 extends PhantomTypeArgument> implements StructClass {
  static readonly $typeName = '0x2::balance::Balance'
  static readonly $numTypeParams = 1

  readonly $typeName = Balance.$typeName

  readonly $fullTypeName: `0x2::balance::Balance<${PhantomToTypeStr<T0>}>`

  readonly $typeArgs: [PhantomToTypeStr<T0>]

  readonly value: ToField<'u64'>

  private constructor(typeArgs: [PhantomToTypeStr<T0>], fields: BalanceFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Balance.$typeName,
      ...typeArgs
    ) as `0x2::balance::Balance<${PhantomToTypeStr<T0>}>`
    this.$typeArgs = typeArgs

    this.value = fields.value
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): BalanceReified<ToPhantomTypeArgument<T0>> {
    return {
      typeName: Balance.$typeName,
      fullTypeName: composeSuiType(
        Balance.$typeName,
        ...[extractType(T0)]
      ) as `0x2::balance::Balance<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [extractType(T0)] as [PhantomToTypeStr<ToPhantomTypeArgument<T0>>],
      reifiedTypeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Balance.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Balance.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Balance.fromBcs(T0, data),
      bcs: Balance.bcs,
      fromJSONField: (field: any) => Balance.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Balance.fromJSON(T0, json),
      fromSuiParsedData: (content: SuiParsedData) => Balance.fromSuiParsedData(T0, content),
      fetch: async (client: SuiClient, id: string) => Balance.fetch(client, T0, id),
      new: (fields: BalanceFields<ToPhantomTypeArgument<T0>>) => {
        return new Balance([extractType(T0)], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Balance.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Balance<ToPhantomTypeArgument<T0>>>> {
    return phantom(Balance.reified(T0))
  }
  static get p() {
    return Balance.phantom
  }

  static get bcs() {
    return bcs.struct('Balance', {
      value: bcs.u64(),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Balance<ToPhantomTypeArgument<T0>> {
    return Balance.reified(typeArg).new({ value: decodeFromFields('u64', fields.value) })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Balance<ToPhantomTypeArgument<T0>> {
    if (!isBalance(item.type)) {
      throw new Error('not a Balance type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Balance.reified(typeArg).new({
      value: decodeFromFieldsWithTypes('u64', item.fields.value),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Balance<ToPhantomTypeArgument<T0>> {
    return Balance.fromFields(typeArg, Balance.bcs.parse(data))
  }

  toJSONField() {
    return {
      value: this.value.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Balance<ToPhantomTypeArgument<T0>> {
    return Balance.reified(typeArg).new({ value: decodeFromJSONField('u64', field.value) })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Balance<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Balance.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Balance.$typeName, extractType(typeArg)),
      json.$typeArgs,
      [typeArg]
    )

    return Balance.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Balance<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBalance(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Balance object`)
    }
    return Balance.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Balance<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Balance object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBalance(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Balance object`)
    }
    return Balance.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}
