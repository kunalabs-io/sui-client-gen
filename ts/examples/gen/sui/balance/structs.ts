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

/* ============================== Balance =============================== */

export function isBalance(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Balance<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BalanceFields<T extends PhantomTypeArgument> {
  value: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Balance<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::balance::Balance'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::balance::Balance<${ToTypeStr<T>}>`

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

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    value: ToField<'u64'>
  ): Balance<ToPhantomTypeArgument<T>> {
    return new Balance(extractType(typeArg), value)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(
    T: T
  ): Reified<Balance<ToPhantomTypeArgument<T>>> {
    return {
      typeName: Balance.$typeName,
      fullTypeName: composeSuiType(
        Balance.$typeName,
        ...[extractType(T)]
      ) as `0x2::balance::Balance<${ToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => Balance.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Balance.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Balance.fromBcs(T, data),
      bcs: Balance.bcs,
      fromJSONField: (field: any) => Balance.fromJSONField(T, field),
      fetch: async (client: SuiClient, id: string) => Balance.fetch(client, T, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): Balance<ToPhantomTypeArgument<T>> {
    return Balance.new(typeArg, decodeFromFields('u64', fields.value))
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): Balance<ToPhantomTypeArgument<T>> {
    if (!isBalance(item.type)) {
      throw new Error('not a Balance type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Balance.new(typeArg, decodeFromFieldsWithTypes('u64', item.fields.value))
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): Balance<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): Balance<ToPhantomTypeArgument<T>> {
    return Balance.new(typeArg, decodeFromJSONField('u64', field.value))
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): Balance<ToPhantomTypeArgument<T>> {
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

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): Balance<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBalance(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Balance object`)
    }
    return Balance.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<Balance<ToPhantomTypeArgument<T>>> {
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

/* ============================== Supply =============================== */

export function isSupply(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Supply<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SupplyFields<T extends PhantomTypeArgument> {
  value: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Supply<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::balance::Supply'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::balance::Supply<${ToTypeStr<T>}>`

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

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    value: ToField<'u64'>
  ): Supply<ToPhantomTypeArgument<T>> {
    return new Supply(extractType(typeArg), value)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(
    T: T
  ): Reified<Supply<ToPhantomTypeArgument<T>>> {
    return {
      typeName: Supply.$typeName,
      fullTypeName: composeSuiType(
        Supply.$typeName,
        ...[extractType(T)]
      ) as `0x2::balance::Supply<${ToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => Supply.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Supply.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Supply.fromBcs(T, data),
      bcs: Supply.bcs,
      fromJSONField: (field: any) => Supply.fromJSONField(T, field),
      fetch: async (client: SuiClient, id: string) => Supply.fetch(client, T, id),
      kind: 'StructClassReified',
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): Supply<ToPhantomTypeArgument<T>> {
    return Supply.new(typeArg, decodeFromFields('u64', fields.value))
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): Supply<ToPhantomTypeArgument<T>> {
    if (!isSupply(item.type)) {
      throw new Error('not a Supply type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Supply.new(typeArg, decodeFromFieldsWithTypes('u64', item.fields.value))
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): Supply<ToPhantomTypeArgument<T>> {
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

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): Supply<ToPhantomTypeArgument<T>> {
    return Supply.new(typeArg, decodeFromJSONField('u64', field.value))
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): Supply<ToPhantomTypeArgument<T>> {
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

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): Supply<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isSupply(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Supply object`)
    }
    return Supply.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<Supply<ToPhantomTypeArgument<T>>> {
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
