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
  fieldToJSON,
  phantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { String as String1 } from '../../move-stdlib-chain/ascii/structs'
import { Option } from '../../move-stdlib-chain/option/structs'
import { String } from '../../move-stdlib-chain/string/structs'
import { Balance, Supply } from '../balance/structs'
import { ID, UID } from '../object/structs'
import { Url } from '../url/structs'
import { bcs, fromB64 } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Coin =============================== */

export function isCoin(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::Coin<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CoinFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  balance: ToField<Balance<T0>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Coin<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::coin::Coin'
  static readonly $numTypeParams = 1

  readonly $typeName = Coin.$typeName

  readonly $fullTypeName: `0x2::coin::Coin<${string}>`

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly balance: ToField<Balance<T0>>

  private constructor(typeArg: string, fields: CoinFields<T0>) {
    this.$fullTypeName = composeSuiType(
      Coin.$typeName,
      typeArg
    ) as `0x2::coin::Coin<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): Reified<Coin<ToPhantomTypeArgument<T0>>, CoinFields<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: Coin.$typeName,
      fullTypeName: composeSuiType(
        Coin.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin::Coin<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Coin.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Coin.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Coin.fromBcs(T0, data),
      bcs: Coin.bcs,
      fromJSONField: (field: any) => Coin.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => Coin.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => Coin.fetch(client, T0, id),
      new: (fields: CoinFields<ToPhantomTypeArgument<T0>>) => {
        return new Coin(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Coin.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<Coin<ToPhantomTypeArgument<T0>>>> {
    return phantom(Coin.reified(T0))
  }
  static get p() {
    return Coin.phantom
  }

  static get bcs() {
    return bcs.struct('Coin', {
      id: UID.bcs,
      balance: Balance.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): Coin<ToPhantomTypeArgument<T0>> {
    return Coin.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      balance: decodeFromFields(Balance.reified(typeArg), fields.balance),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Coin<ToPhantomTypeArgument<T0>> {
    if (!isCoin(item.type)) {
      throw new Error('not a Coin type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Coin.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypes(Balance.reified(typeArg), item.fields.balance),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): Coin<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): Coin<ToPhantomTypeArgument<T0>> {
    return Coin.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      balance: decodeFromJSONField(Balance.reified(typeArg), field.balance),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): Coin<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): Coin<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoin(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Coin object`)
    }
    return Coin.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<Coin<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Coin object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCoin(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Coin object`)
    }
    return Coin.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== CoinMetadata =============================== */

export function isCoinMetadata(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::CoinMetadata<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CoinMetadataFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  decimals: ToField<'u8'>
  name: ToField<String>
  symbol: ToField<String1>
  description: ToField<String>
  iconUrl: ToField<Option<Url>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CoinMetadata<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::coin::CoinMetadata'
  static readonly $numTypeParams = 1

  readonly $typeName = CoinMetadata.$typeName

  readonly $fullTypeName: `0x2::coin::CoinMetadata<${string}>`

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly decimals: ToField<'u8'>
  readonly name: ToField<String>
  readonly symbol: ToField<String1>
  readonly description: ToField<String>
  readonly iconUrl: ToField<Option<Url>>

  private constructor(typeArg: string, fields: CoinMetadataFields<T0>) {
    this.$fullTypeName = composeSuiType(
      CoinMetadata.$typeName,
      typeArg
    ) as `0x2::coin::CoinMetadata<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.id = fields.id
    this.decimals = fields.decimals
    this.name = fields.name
    this.symbol = fields.symbol
    this.description = fields.description
    this.iconUrl = fields.iconUrl
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): Reified<
    CoinMetadata<ToPhantomTypeArgument<T0>>,
    CoinMetadataFields<ToPhantomTypeArgument<T0>>
  > {
    return {
      typeName: CoinMetadata.$typeName,
      fullTypeName: composeSuiType(
        CoinMetadata.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin::CoinMetadata<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => CoinMetadata.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CoinMetadata.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => CoinMetadata.fromBcs(T0, data),
      bcs: CoinMetadata.bcs,
      fromJSONField: (field: any) => CoinMetadata.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => CoinMetadata.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => CoinMetadata.fetch(client, T0, id),
      new: (fields: CoinMetadataFields<ToPhantomTypeArgument<T0>>) => {
        return new CoinMetadata(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CoinMetadata.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<CoinMetadata<ToPhantomTypeArgument<T0>>>> {
    return phantom(CoinMetadata.reified(T0))
  }
  static get p() {
    return CoinMetadata.phantom
  }

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

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    return CoinMetadata.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      decimals: decodeFromFields('u8', fields.decimals),
      name: decodeFromFields(String.reified(), fields.name),
      symbol: decodeFromFields(String1.reified(), fields.symbol),
      description: decodeFromFields(String.reified(), fields.description),
      iconUrl: decodeFromFields(Option.reified(Url.reified()), fields.icon_url),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    if (!isCoinMetadata(item.type)) {
      throw new Error('not a CoinMetadata type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CoinMetadata.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      decimals: decodeFromFieldsWithTypes('u8', item.fields.decimals),
      name: decodeFromFieldsWithTypes(String.reified(), item.fields.name),
      symbol: decodeFromFieldsWithTypes(String1.reified(), item.fields.symbol),
      description: decodeFromFieldsWithTypes(String.reified(), item.fields.description),
      iconUrl: decodeFromFieldsWithTypes(Option.reified(Url.reified()), item.fields.icon_url),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    return CoinMetadata.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      decimals: decodeFromJSONField('u8', field.decimals),
      name: decodeFromJSONField(String.reified(), field.name),
      symbol: decodeFromJSONField(String1.reified(), field.symbol),
      description: decodeFromJSONField(String.reified(), field.description),
      iconUrl: decodeFromJSONField(Option.reified(Url.reified()), field.iconUrl),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): CoinMetadata<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoinMetadata(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CoinMetadata object`)
    }
    return CoinMetadata.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<CoinMetadata<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching CoinMetadata object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCoinMetadata(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a CoinMetadata object`)
    }
    return CoinMetadata.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== RegulatedCoinMetadata =============================== */

export function isRegulatedCoinMetadata(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::RegulatedCoinMetadata<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface RegulatedCoinMetadataFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  coinMetadataObject: ToField<ID>
  denyCapObject: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class RegulatedCoinMetadata<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::coin::RegulatedCoinMetadata'
  static readonly $numTypeParams = 1

  readonly $typeName = RegulatedCoinMetadata.$typeName

  readonly $fullTypeName: `0x2::coin::RegulatedCoinMetadata<${string}>`

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly coinMetadataObject: ToField<ID>
  readonly denyCapObject: ToField<ID>

  private constructor(typeArg: string, fields: RegulatedCoinMetadataFields<T0>) {
    this.$fullTypeName = composeSuiType(
      RegulatedCoinMetadata.$typeName,
      typeArg
    ) as `0x2::coin::RegulatedCoinMetadata<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.id = fields.id
    this.coinMetadataObject = fields.coinMetadataObject
    this.denyCapObject = fields.denyCapObject
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): Reified<
    RegulatedCoinMetadata<ToPhantomTypeArgument<T0>>,
    RegulatedCoinMetadataFields<ToPhantomTypeArgument<T0>>
  > {
    return {
      typeName: RegulatedCoinMetadata.$typeName,
      fullTypeName: composeSuiType(
        RegulatedCoinMetadata.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin::RegulatedCoinMetadata<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => RegulatedCoinMetadata.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) =>
        RegulatedCoinMetadata.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => RegulatedCoinMetadata.fromBcs(T0, data),
      bcs: RegulatedCoinMetadata.bcs,
      fromJSONField: (field: any) => RegulatedCoinMetadata.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => RegulatedCoinMetadata.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => RegulatedCoinMetadata.fetch(client, T0, id),
      new: (fields: RegulatedCoinMetadataFields<ToPhantomTypeArgument<T0>>) => {
        return new RegulatedCoinMetadata(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return RegulatedCoinMetadata.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<RegulatedCoinMetadata<ToPhantomTypeArgument<T0>>>> {
    return phantom(RegulatedCoinMetadata.reified(T0))
  }
  static get p() {
    return RegulatedCoinMetadata.phantom
  }

  static get bcs() {
    return bcs.struct('RegulatedCoinMetadata', {
      id: UID.bcs,
      coin_metadata_object: ID.bcs,
      deny_cap_object: ID.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    return RegulatedCoinMetadata.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      coinMetadataObject: decodeFromFields(ID.reified(), fields.coin_metadata_object),
      denyCapObject: decodeFromFields(ID.reified(), fields.deny_cap_object),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    if (!isRegulatedCoinMetadata(item.type)) {
      throw new Error('not a RegulatedCoinMetadata type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return RegulatedCoinMetadata.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      coinMetadataObject: decodeFromFieldsWithTypes(ID.reified(), item.fields.coin_metadata_object),
      denyCapObject: decodeFromFieldsWithTypes(ID.reified(), item.fields.deny_cap_object),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    return RegulatedCoinMetadata.fromFields(typeArg, RegulatedCoinMetadata.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      coinMetadataObject: this.coinMetadataObject,
      denyCapObject: this.denyCapObject,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    return RegulatedCoinMetadata.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      coinMetadataObject: decodeFromJSONField(ID.reified(), field.coinMetadataObject),
      denyCapObject: decodeFromJSONField(ID.reified(), field.denyCapObject),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== RegulatedCoinMetadata.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(RegulatedCoinMetadata.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return RegulatedCoinMetadata.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): RegulatedCoinMetadata<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isRegulatedCoinMetadata(content.type)) {
      throw new Error(
        `object at ${(content.fields as any).id} is not a RegulatedCoinMetadata object`
      )
    }
    return RegulatedCoinMetadata.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<RegulatedCoinMetadata<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching RegulatedCoinMetadata object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isRegulatedCoinMetadata(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a RegulatedCoinMetadata object`)
    }
    return RegulatedCoinMetadata.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== TreasuryCap =============================== */

export function isTreasuryCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::TreasuryCap<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TreasuryCapFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
  totalSupply: ToField<Supply<T0>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TreasuryCap<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::coin::TreasuryCap'
  static readonly $numTypeParams = 1

  readonly $typeName = TreasuryCap.$typeName

  readonly $fullTypeName: `0x2::coin::TreasuryCap<${string}>`

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly totalSupply: ToField<Supply<T0>>

  private constructor(typeArg: string, fields: TreasuryCapFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TreasuryCap.$typeName,
      typeArg
    ) as `0x2::coin::TreasuryCap<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.id = fields.id
    this.totalSupply = fields.totalSupply
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): Reified<TreasuryCap<ToPhantomTypeArgument<T0>>, TreasuryCapFields<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: TreasuryCap.$typeName,
      fullTypeName: composeSuiType(
        TreasuryCap.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin::TreasuryCap<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TreasuryCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TreasuryCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TreasuryCap.fromBcs(T0, data),
      bcs: TreasuryCap.bcs,
      fromJSONField: (field: any) => TreasuryCap.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => TreasuryCap.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => TreasuryCap.fetch(client, T0, id),
      new: (fields: TreasuryCapFields<ToPhantomTypeArgument<T0>>) => {
        return new TreasuryCap(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TreasuryCap.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<TreasuryCap<ToPhantomTypeArgument<T0>>>> {
    return phantom(TreasuryCap.reified(T0))
  }
  static get p() {
    return TreasuryCap.phantom
  }

  static get bcs() {
    return bcs.struct('TreasuryCap', {
      id: UID.bcs,
      total_supply: Supply.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    return TreasuryCap.reified(typeArg).new({
      id: decodeFromFields(UID.reified(), fields.id),
      totalSupply: decodeFromFields(Supply.reified(typeArg), fields.total_supply),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    if (!isTreasuryCap(item.type)) {
      throw new Error('not a TreasuryCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TreasuryCap.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      totalSupply: decodeFromFieldsWithTypes(Supply.reified(typeArg), item.fields.total_supply),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    return TreasuryCap.reified(typeArg).new({
      id: decodeFromJSONField(UID.reified(), field.id),
      totalSupply: decodeFromJSONField(Supply.reified(typeArg), field.totalSupply),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): TreasuryCap<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTreasuryCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TreasuryCap object`)
    }
    return TreasuryCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TreasuryCap<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching TreasuryCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isTreasuryCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a TreasuryCap object`)
    }
    return TreasuryCap.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== DenyCap =============================== */

export function isDenyCap(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::DenyCap<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface DenyCapFields<T0 extends PhantomTypeArgument> {
  id: ToField<UID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class DenyCap<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::coin::DenyCap'
  static readonly $numTypeParams = 1

  readonly $typeName = DenyCap.$typeName

  readonly $fullTypeName: `0x2::coin::DenyCap<${string}>`

  readonly $typeArg: string

  readonly id: ToField<UID>

  private constructor(typeArg: string, fields: DenyCapFields<T0>) {
    this.$fullTypeName = composeSuiType(
      DenyCap.$typeName,
      typeArg
    ) as `0x2::coin::DenyCap<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.id = fields.id
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): Reified<DenyCap<ToPhantomTypeArgument<T0>>, DenyCapFields<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: DenyCap.$typeName,
      fullTypeName: composeSuiType(
        DenyCap.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin::DenyCap<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => DenyCap.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => DenyCap.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => DenyCap.fromBcs(T0, data),
      bcs: DenyCap.bcs,
      fromJSONField: (field: any) => DenyCap.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => DenyCap.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => DenyCap.fetch(client, T0, id),
      new: (fields: DenyCapFields<ToPhantomTypeArgument<T0>>) => {
        return new DenyCap(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return DenyCap.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<DenyCap<ToPhantomTypeArgument<T0>>>> {
    return phantom(DenyCap.reified(T0))
  }
  static get p() {
    return DenyCap.phantom
  }

  static get bcs() {
    return bcs.struct('DenyCap', {
      id: UID.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    return DenyCap.reified(typeArg).new({ id: decodeFromFields(UID.reified(), fields.id) })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    if (!isDenyCap(item.type)) {
      throw new Error('not a DenyCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return DenyCap.reified(typeArg).new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    return DenyCap.fromFields(typeArg, DenyCap.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    return DenyCap.reified(typeArg).new({ id: decodeFromJSONField(UID.reified(), field.id) })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== DenyCap.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(DenyCap.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return DenyCap.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): DenyCap<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isDenyCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a DenyCap object`)
    }
    return DenyCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<DenyCap<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching DenyCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isDenyCap(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a DenyCap object`)
    }
    return DenyCap.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}

/* ============================== CurrencyCreated =============================== */

export function isCurrencyCreated(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::CurrencyCreated<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CurrencyCreatedFields<T0 extends PhantomTypeArgument> {
  decimals: ToField<'u8'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class CurrencyCreated<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::coin::CurrencyCreated'
  static readonly $numTypeParams = 1

  readonly $typeName = CurrencyCreated.$typeName

  readonly $fullTypeName: `0x2::coin::CurrencyCreated<${string}>`

  readonly $typeArg: string

  readonly decimals: ToField<'u8'>

  private constructor(typeArg: string, fields: CurrencyCreatedFields<T0>) {
    this.$fullTypeName = composeSuiType(
      CurrencyCreated.$typeName,
      typeArg
    ) as `0x2::coin::CurrencyCreated<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.decimals = fields.decimals
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): Reified<
    CurrencyCreated<ToPhantomTypeArgument<T0>>,
    CurrencyCreatedFields<ToPhantomTypeArgument<T0>>
  > {
    return {
      typeName: CurrencyCreated.$typeName,
      fullTypeName: composeSuiType(
        CurrencyCreated.$typeName,
        ...[extractType(T0)]
      ) as `0x2::coin::CurrencyCreated<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => CurrencyCreated.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CurrencyCreated.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => CurrencyCreated.fromBcs(T0, data),
      bcs: CurrencyCreated.bcs,
      fromJSONField: (field: any) => CurrencyCreated.fromJSONField(T0, field),
      fromJSON: (json: Record<string, any>) => CurrencyCreated.fromJSON(T0, json),
      fetch: async (client: SuiClient, id: string) => CurrencyCreated.fetch(client, T0, id),
      new: (fields: CurrencyCreatedFields<ToPhantomTypeArgument<T0>>) => {
        return new CurrencyCreated(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return CurrencyCreated.reified
  }

  static phantom<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): PhantomReified<ToTypeStr<CurrencyCreated<ToPhantomTypeArgument<T0>>>> {
    return phantom(CurrencyCreated.reified(T0))
  }
  static get p() {
    return CurrencyCreated.phantom
  }

  static get bcs() {
    return bcs.struct('CurrencyCreated', {
      decimals: bcs.u8(),
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    return CurrencyCreated.reified(typeArg).new({
      decimals: decodeFromFields('u8', fields.decimals),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    if (!isCurrencyCreated(item.type)) {
      throw new Error('not a CurrencyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CurrencyCreated.reified(typeArg).new({
      decimals: decodeFromFieldsWithTypes('u8', item.fields.decimals),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
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

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    return CurrencyCreated.reified(typeArg).new({
      decimals: decodeFromJSONField('u8', field.decimals),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
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

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): CurrencyCreated<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCurrencyCreated(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CurrencyCreated object`)
    }
    return CurrencyCreated.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<CurrencyCreated<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching CurrencyCreated object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isCurrencyCreated(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a CurrencyCreated object`)
    }
    return CurrencyCreated.fromBcs(typeArg, fromB64(res.data.bcs.bcsBytes))
  }
}
