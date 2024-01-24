import { String as String1 } from '../../_dependencies/source/0x1/ascii/structs'
import { Option } from '../../_dependencies/source/0x1/option/structs'
import { String } from '../../_dependencies/source/0x1/string/structs'
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
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { Balance, Supply } from '../balance/structs'
import { UID } from '../object/structs'
import { Url } from '../url/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Coin =============================== */

export function isCoin(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::Coin<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CoinFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  balance: ToField<Balance<T>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Coin<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::coin::Coin'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::coin::Coin<${ToTypeStr<T>}>`

  readonly $typeName = Coin.$typeName

  static get bcs() {
    return bcs.struct('Coin', {
      id: UID.bcs,
      balance: Balance.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly balance: ToField<Balance<T>>

  private constructor(typeArg: string, fields: CoinFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: CoinFields<ToPhantomTypeArgument<T>>
  ): Coin<ToPhantomTypeArgument<T>> {
    return new Coin(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(
    T: T
  ): Reified<Coin<ToPhantomTypeArgument<T>>> {
    return {
      typeName: Coin.$typeName,
      fullTypeName: composeSuiType(
        Coin.$typeName,
        ...[extractType(T)]
      ) as `0x2::coin::Coin<${ToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => Coin.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Coin.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Coin.fromBcs(T, data),
      bcs: Coin.bcs,
      fromJSONField: (field: any) => Coin.fromJSONField(T, field),
      fetch: async (client: SuiClient, id: string) => Coin.fetch(client, T, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Coin.reified
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): Coin<ToPhantomTypeArgument<T>> {
    return Coin.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(typeArg), fields.balance),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): Coin<ToPhantomTypeArgument<T>> {
    if (!isCoin(item.type)) {
      throw new Error('not a Coin type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Coin.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance),
    })
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): Coin<ToPhantomTypeArgument<T>> {
    return Coin.fromFields(typeArg, Coin.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      balance: this.balance.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): Coin<ToPhantomTypeArgument<T>> {
    return Coin.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      balance: decodeFromJSONField(Balance.reified(typeArg), field.balance),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): Coin<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Coin.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Coin.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Coin.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): Coin<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoin(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Coin object`)
    }
    return Coin.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<Coin<ToPhantomTypeArgument<T>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Coin object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isCoin(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Coin object`)
    }
    return Coin.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== CoinMetadata =============================== */

export function isCoinMetadata(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::CoinMetadata<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CoinMetadataFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  decimals: ToField<'u8'>
  name: ToField<String>
  symbol: ToField<String1>
  description: ToField<String>
  iconUrl: ToField<Option<Url>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CoinMetadata<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::coin::CoinMetadata'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::coin::CoinMetadata<${ToTypeStr<T>}>`

  readonly $typeName = CoinMetadata.$typeName

  static get bcs() {
    return bcs.struct('CoinMetadata', {
      id: UID.bcs,
      decimals: bcs.u8(),
      name: String.bcs,
      symbol: String1.bcs,
      description: String.bcs,
      icon_url: Option.bcs(Url.bcs),
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly decimals: ToField<'u8'>
  readonly name: ToField<String>
  readonly symbol: ToField<String1>
  readonly description: ToField<String>
  readonly iconUrl: ToField<Option<Url>>

  private constructor(typeArg: string, fields: CoinMetadataFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.decimals = fields.decimals
    this.name = fields.name
    this.symbol = fields.symbol
    this.description = fields.description
    this.iconUrl = fields.iconUrl
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: CoinMetadataFields<ToPhantomTypeArgument<T>>
  ): CoinMetadata<ToPhantomTypeArgument<T>> {
    return new CoinMetadata(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(
    T: T
  ): Reified<CoinMetadata<ToPhantomTypeArgument<T>>> {
    return {
      typeName: CoinMetadata.$typeName,
      fullTypeName: composeSuiType(
        CoinMetadata.$typeName,
        ...[extractType(T)]
      ) as `0x2::coin::CoinMetadata<${ToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => CoinMetadata.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CoinMetadata.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => CoinMetadata.fromBcs(T, data),
      bcs: CoinMetadata.bcs,
      fromJSONField: (field: any) => CoinMetadata.fromJSONField(T, field),
      fetch: async (client: SuiClient, id: string) => CoinMetadata.fetch(client, T, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CoinMetadata.reified
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): CoinMetadata<ToPhantomTypeArgument<T>> {
    return CoinMetadata.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      decimals: decodeFromFields('u8', fields.decimals),
      name: decodeFromFields(String.reified(), fields.name),
      symbol: decodeFromFields(String1.reified(), fields.symbol),
      description: decodeFromFields(String.reified(), fields.description),
      iconUrl: decodeFromFields(Option.reified(Url.reified()), fields.icon_url),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): CoinMetadata<ToPhantomTypeArgument<T>> {
    if (!isCoinMetadata(item.type)) {
      throw new Error('not a CoinMetadata type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CoinMetadata.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      decimals: decodeFromFieldsWithTypes('u8', item.fields.decimals),
      name: decodeFromFieldsWithTypes(String.reified(), item.fields.name),
      symbol: decodeFromFieldsWithTypes(String1.reified(), item.fields.symbol),
      description: decodeFromFieldsWithTypes(String.reified(), item.fields.description),
      iconUrl: decodeFromFieldsWithTypes(Option.reified(Url.reified()), item.fields.icon_url),
    })
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): CoinMetadata<ToPhantomTypeArgument<T>> {
    return CoinMetadata.fromFields(typeArg, CoinMetadata.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      decimals: this.decimals,
      name: this.name,
      symbol: this.symbol,
      description: this.description,
      iconUrl: fieldToJSON<Option<Url>>(`0x1::option::Option<0x2::url::Url>`, this.iconUrl),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): CoinMetadata<ToPhantomTypeArgument<T>> {
    return CoinMetadata.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      decimals: decodeFromJSONField('u8', field.decimals),
      name: decodeFromJSONField(String.reified(), field.name),
      symbol: decodeFromJSONField(String1.reified(), field.symbol),
      description: decodeFromJSONField(String.reified(), field.description),
      iconUrl: decodeFromJSONField(Option.reified(Url.reified()), field.iconUrl),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): CoinMetadata<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== CoinMetadata.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(CoinMetadata.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return CoinMetadata.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): CoinMetadata<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoinMetadata(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CoinMetadata object`)
    }
    return CoinMetadata.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<CoinMetadata<ToPhantomTypeArgument<T>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching CoinMetadata object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isCoinMetadata(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a CoinMetadata object`)
    }
    return CoinMetadata.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== CurrencyCreated =============================== */

export function isCurrencyCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::CurrencyCreated<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CurrencyCreatedFields<T extends PhantomTypeArgument> {
  decimals: ToField<'u8'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CurrencyCreated<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::coin::CurrencyCreated'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::coin::CurrencyCreated<${ToTypeStr<T>}>`

  readonly $typeName = CurrencyCreated.$typeName

  static get bcs() {
    return bcs.struct('CurrencyCreated', {
      decimals: bcs.u8(),
    })
  }

  readonly $typeArg: string

  readonly decimals: ToField<'u8'>

  private constructor(typeArg: string, decimals: ToField<'u8'>) {
    this.$typeArg = typeArg

    this.decimals = decimals
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    decimals: ToField<'u8'>
  ): CurrencyCreated<ToPhantomTypeArgument<T>> {
    return new CurrencyCreated(extractType(typeArg), decimals)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(
    T: T
  ): Reified<CurrencyCreated<ToPhantomTypeArgument<T>>> {
    return {
      typeName: CurrencyCreated.$typeName,
      fullTypeName: composeSuiType(
        CurrencyCreated.$typeName,
        ...[extractType(T)]
      ) as `0x2::coin::CurrencyCreated<${ToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => CurrencyCreated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CurrencyCreated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => CurrencyCreated.fromBcs(T, data),
      bcs: CurrencyCreated.bcs,
      fromJSONField: (field: any) => CurrencyCreated.fromJSONField(T, field),
      fetch: async (client: SuiClient, id: string) => CurrencyCreated.fetch(client, T, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CurrencyCreated.reified
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): CurrencyCreated<ToPhantomTypeArgument<T>> {
    return CurrencyCreated.new(typeArg, decodeFromFields('u8', fields.decimals))
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): CurrencyCreated<ToPhantomTypeArgument<T>> {
    if (!isCurrencyCreated(item.type)) {
      throw new Error('not a CurrencyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CurrencyCreated.new(typeArg, decodeFromFieldsWithTypes('u8', item.fields.decimals))
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): CurrencyCreated<ToPhantomTypeArgument<T>> {
    return CurrencyCreated.fromFields(typeArg, CurrencyCreated.bcs.parse(data))
  }

  toJSONField() {
    return {
      decimals: this.decimals,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): CurrencyCreated<ToPhantomTypeArgument<T>> {
    return CurrencyCreated.new(typeArg, decodeFromJSONField('u8', field.decimals))
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): CurrencyCreated<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== CurrencyCreated.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(CurrencyCreated.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return CurrencyCreated.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): CurrencyCreated<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCurrencyCreated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CurrencyCreated object`)
    }
    return CurrencyCreated.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<CurrencyCreated<ToPhantomTypeArgument<T>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching CurrencyCreated object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isCurrencyCreated(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a CurrencyCreated object`)
    }
    return CurrencyCreated.fromFieldsWithTypes(typeArg, res.data.content)
  }
}

/* ============================== TreasuryCap =============================== */

export function isTreasuryCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::TreasuryCap<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TreasuryCapFields<T extends PhantomTypeArgument> {
  id: ToField<UID>
  totalSupply: ToField<Supply<T>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TreasuryCap<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::coin::TreasuryCap'
  static readonly $numTypeParams = 1

  readonly $fullTypeName = null as unknown as `0x2::coin::TreasuryCap<${ToTypeStr<T>}>`

  readonly $typeName = TreasuryCap.$typeName

  static get bcs() {
    return bcs.struct('TreasuryCap', {
      id: UID.bcs,
      total_supply: Supply.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly totalSupply: ToField<Supply<T>>

  private constructor(typeArg: string, fields: TreasuryCapFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.totalSupply = fields.totalSupply
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: TreasuryCapFields<ToPhantomTypeArgument<T>>
  ): TreasuryCap<ToPhantomTypeArgument<T>> {
    return new TreasuryCap(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(
    T: T
  ): Reified<TreasuryCap<ToPhantomTypeArgument<T>>> {
    return {
      typeName: TreasuryCap.$typeName,
      fullTypeName: composeSuiType(
        TreasuryCap.$typeName,
        ...[extractType(T)]
      ) as `0x2::coin::TreasuryCap<${ToTypeStr<ToPhantomTypeArgument<T>>}>`,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => TreasuryCap.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TreasuryCap.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TreasuryCap.fromBcs(T, data),
      bcs: TreasuryCap.bcs,
      fromJSONField: (field: any) => TreasuryCap.fromJSONField(T, field),
      fetch: async (client: SuiClient, id: string) => TreasuryCap.fetch(client, T, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TreasuryCap.reified
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): TreasuryCap<ToPhantomTypeArgument<T>> {
    return TreasuryCap.new(typeArg, {
      id: decodeFromFields(UID.reified(), fields.id),
      totalSupply: decodeFromFields(Supply.reified(typeArg), fields.total_supply),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): TreasuryCap<ToPhantomTypeArgument<T>> {
    if (!isTreasuryCap(item.type)) {
      throw new Error('not a TreasuryCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TreasuryCap.new(typeArg, {
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      totalSupply: decodeFromFieldsWithTypes(Supply.reified(typeArg), item.fields.total_supply),
    })
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): TreasuryCap<ToPhantomTypeArgument<T>> {
    return TreasuryCap.fromFields(typeArg, TreasuryCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      totalSupply: this.totalSupply.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): TreasuryCap<ToPhantomTypeArgument<T>> {
    return TreasuryCap.new(typeArg, {
      id: decodeFromJSONField(UID.reified(), field.id),
      totalSupply: decodeFromJSONField(Supply.reified(typeArg), field.totalSupply),
    })
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): TreasuryCap<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== TreasuryCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TreasuryCap.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TreasuryCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    content: SuiParsedData
  ): TreasuryCap<ToPhantomTypeArgument<T>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTreasuryCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TreasuryCap object`)
    }
    return TreasuryCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T extends ReifiedPhantomTypeArgument>(
    client: SuiClient,
    typeArg: T,
    id: string
  ): Promise<TreasuryCap<ToPhantomTypeArgument<T>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TreasuryCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTreasuryCap(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TreasuryCap object`)
    }
    return TreasuryCap.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
