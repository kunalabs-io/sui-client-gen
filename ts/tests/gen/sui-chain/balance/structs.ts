import {
  PhantomTypeArgument,
  Reified,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeStr,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Supply =============================== */

export function isSupply(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Supply<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SupplyFields<T0 extends PhantomTypeArgument> {
  value: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Supply<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::balance::Supply'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::balance::Supply<${ToTypeStr<T0>}>`

  readonly $typeName = Supply.$typeName

  static get bcs() {
    return bcs.struct('Supply', {
      value: bcs.u64(),
    })
  }

  readonly $typeArg: string

  readonly value: ToField<'u64'>

  private constructor(typeArg: string, value: ToField<'u64'>) {
    this.$typeArg = typeArg

    this.value = value
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    value: ToField<'u64'>
  ): Supply<ToPhantomTypeArgument<T0>> {
    return new Supply(extractType(typeArg), value)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<Supply<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: Supply.$typeName,
      fullTypeName: composeSuiType(
        Supply.$typeName,
        ...[extractType(T0)]
      ) as `0x2::balance::Supply<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Supply.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Supply.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Supply.fromBcs(T0, data),
      bcs: Supply.bcs,
      fromJSONField: (field: any) => Supply.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => Supply.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Supply.reified
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): Supply<ToPhantomTypeArgument<T0>> {
    return Supply.new(typeArg, decodeFromFields('u64', fields.value))
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Supply<ToPhantomTypeArgument<T0>> {
    if (!isSupply(item.type)) {
      throw new Error('not a Supply type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Supply.new(typeArg, decodeFromFieldsWithTypes('u64', item.fields.value))
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
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
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): Supply<ToPhantomTypeArgument<T0>> {
    return Supply.new(typeArg, decodeFromJSONField('u64', field.value))
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): Supply<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Supply.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Supply.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Supply.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
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

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Supply<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Supply object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isSupply(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Supply object`)
    }
    return Supply.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== Balance =============================== */

export function isBalance(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Balance<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BalanceFields<T0 extends PhantomTypeArgument> {
  value: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Balance<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::balance::Balance'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::balance::Balance<${ToTypeStr<T0>}>`

  readonly $typeName = Balance.$typeName

  static get bcs() {
    return bcs.struct('Balance', {
      value: bcs.u64(),
    })
  }

  readonly $typeArg: string

  readonly value: ToField<'u64'>

  private constructor(typeArg: string, value: ToField<'u64'>) {
    this.$typeArg = typeArg

    this.value = value
  }

  static new<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    value: ToField<'u64'>
  ): Balance<ToPhantomTypeArgument<T0>> {
    return new Balance(extractType(typeArg), value)
  }

  static reified<T0 extends ReifiedPhantomTypeArgument>(
    T0: T0
  ): Reified<Balance<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: Balance.$typeName,
      fullTypeName: composeSuiType(
        Balance.$typeName,
        ...[extractType(T0)]
      ) as `0x2::balance::Balance<${ToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Balance.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Balance.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Balance.fromBcs(T0, data),
      bcs: Balance.bcs,
      fromJSONField: (field: any) => Balance.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => Balance.fetch(client, T0, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Balance.reified
  }

  static fromFields<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): Balance<ToPhantomTypeArgument<T0>> {
    return Balance.new(typeArg, decodeFromFields('u64', fields.value))
  }

  static fromFieldsWithTypes<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Balance<ToPhantomTypeArgument<T0>> {
    if (!isBalance(item.type)) {
      throw new Error('not a Balance type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Balance.new(typeArg, decodeFromFieldsWithTypes('u64', item.fields.value))
  }

  static fromBcs<T0 extends ReifiedPhantomTypeArgument>(
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
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    field: any
  ): Balance<ToPhantomTypeArgument<T0>> {
    return Balance.new(typeArg, decodeFromJSONField('u64', field.value))
  }

  static fromJSON<T0 extends ReifiedPhantomTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): Balance<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== Balance.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Balance.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Balance.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends ReifiedPhantomTypeArgument>(
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

  static async fetch<T0 extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Balance<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Balance object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isBalance(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Balance object`)
    }
    return Balance.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
