import { String as String1 } from '../../_dependencies/source/0x1/ascii/structs'
import { Option } from '../../_dependencies/source/0x1/option/structs'
import { String } from '../../_dependencies/source/0x1/string/structs'
import {
  ReifiedTypeArgument,
  ToField,
  assertFieldsWithTypesArgsMatch,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  extractType,
} from '../../_framework/types'
import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../_framework/util'
import { Balance, Supply } from '../balance/structs'
import { UID } from '../object/structs'
import { Url } from '../url/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Coin =============================== */

export function isCoin(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::Coin<')
}

export interface CoinFields {
  id: ToField<UID>
  balance: ToField<Balance>
}

export class Coin {
  static readonly $typeName = '0x2::coin::Coin'
  static readonly $numTypeParams = 1

  readonly $typeName = Coin.$typeName

  static get bcs() {
    return bcs.struct('Coin', {
      id: UID.bcs,
      balance: Balance.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly balance: ToField<Balance>

  private constructor(typeArg: string, fields: CoinFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
  }

  static new(typeArg: ReifiedTypeArgument, fields: CoinFields): Coin {
    return new Coin(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: Coin.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => Coin.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Coin.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Coin.fromBcs(T, data),
      bcs: Coin.bcs,
      __class: null as unknown as ReturnType<typeof Coin.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): Coin {
    return Coin.new(typeArg, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      balance: decodeFromFieldsGenericOrSpecial(Balance.reified(typeArg), fields.balance),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): Coin {
    if (!isCoin(item.type)) {
      throw new Error('not a Coin type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Coin.new(typeArg, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      balance: decodeFromFieldsWithTypesGenericOrSpecial(
        Balance.reified(typeArg),
        item.fields.balance
      ),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): Coin {
    return Coin.fromFields(typeArg, Coin.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      balance: this.balance.toJSON(),
    }
  }

  static fromSuiParsedData(typeArg: ReifiedTypeArgument, content: SuiParsedData): Coin {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoin(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Coin object`)
    }
    return Coin.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch(client: SuiClient, typeArg: ReifiedTypeArgument, id: string): Promise<Coin> {
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

export function isCoinMetadata(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::CoinMetadata<')
}

export interface CoinMetadataFields {
  id: ToField<UID>
  decimals: ToField<'u8'>
  name: ToField<String>
  symbol: ToField<String1>
  description: ToField<String>
  iconUrl: ToField<Option<Url>>
}

export class CoinMetadata {
  static readonly $typeName = '0x2::coin::CoinMetadata'
  static readonly $numTypeParams = 1

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

  private constructor(typeArg: string, fields: CoinMetadataFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.decimals = fields.decimals
    this.name = fields.name
    this.symbol = fields.symbol
    this.description = fields.description
    this.iconUrl = fields.iconUrl
  }

  static new(typeArg: ReifiedTypeArgument, fields: CoinMetadataFields): CoinMetadata {
    return new CoinMetadata(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: CoinMetadata.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => CoinMetadata.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CoinMetadata.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => CoinMetadata.fromBcs(T, data),
      bcs: CoinMetadata.bcs,
      __class: null as unknown as ReturnType<typeof CoinMetadata.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): CoinMetadata {
    return CoinMetadata.new(typeArg, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      decimals: decodeFromFieldsGenericOrSpecial('u8', fields.decimals),
      name: decodeFromFieldsGenericOrSpecial(String.reified(), fields.name),
      symbol: decodeFromFieldsGenericOrSpecial(String1.reified(), fields.symbol),
      description: decodeFromFieldsGenericOrSpecial(String.reified(), fields.description),
      iconUrl: decodeFromFieldsGenericOrSpecial(Option.reified(Url.reified()), fields.icon_url),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): CoinMetadata {
    if (!isCoinMetadata(item.type)) {
      throw new Error('not a CoinMetadata type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CoinMetadata.new(typeArg, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      decimals: decodeFromFieldsWithTypesGenericOrSpecial('u8', item.fields.decimals),
      name: decodeFromFieldsWithTypesGenericOrSpecial(String.reified(), item.fields.name),
      symbol: decodeFromFieldsWithTypesGenericOrSpecial(String1.reified(), item.fields.symbol),
      description: decodeFromFieldsWithTypesGenericOrSpecial(
        String.reified(),
        item.fields.description
      ),
      iconUrl: decodeFromFieldsWithTypesGenericOrSpecial(
        Option.reified(Url.reified()),
        item.fields.icon_url
      ),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): CoinMetadata {
    return CoinMetadata.fromFields(typeArg, CoinMetadata.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      decimals: this.decimals,
      name: this.name,
      symbol: this.symbol,
      description: this.description,
      iconUrl: genericToJSON(`0x1::option::Option<0x2::url::Url>`, this.iconUrl),
    }
  }

  static fromSuiParsedData(typeArg: ReifiedTypeArgument, content: SuiParsedData): CoinMetadata {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoinMetadata(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CoinMetadata object`)
    }
    return CoinMetadata.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch(
    client: SuiClient,
    typeArg: ReifiedTypeArgument,
    id: string
  ): Promise<CoinMetadata> {
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

export function isCurrencyCreated(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::CurrencyCreated<')
}

export interface CurrencyCreatedFields {
  decimals: ToField<'u8'>
}

export class CurrencyCreated {
  static readonly $typeName = '0x2::coin::CurrencyCreated'
  static readonly $numTypeParams = 1

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

  static new(typeArg: ReifiedTypeArgument, decimals: ToField<'u8'>): CurrencyCreated {
    return new CurrencyCreated(extractType(typeArg), decimals)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: CurrencyCreated.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => CurrencyCreated.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => CurrencyCreated.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => CurrencyCreated.fromBcs(T, data),
      bcs: CurrencyCreated.bcs,
      __class: null as unknown as ReturnType<typeof CurrencyCreated.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): CurrencyCreated {
    return CurrencyCreated.new(typeArg, decodeFromFieldsGenericOrSpecial('u8', fields.decimals))
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): CurrencyCreated {
    if (!isCurrencyCreated(item.type)) {
      throw new Error('not a CurrencyCreated type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return CurrencyCreated.new(
      typeArg,
      decodeFromFieldsWithTypesGenericOrSpecial('u8', item.fields.decimals)
    )
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): CurrencyCreated {
    return CurrencyCreated.fromFields(typeArg, CurrencyCreated.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      decimals: this.decimals,
    }
  }
}

/* ============================== TreasuryCap =============================== */

export function isTreasuryCap(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::TreasuryCap<')
}

export interface TreasuryCapFields {
  id: ToField<UID>
  totalSupply: ToField<Supply>
}

export class TreasuryCap {
  static readonly $typeName = '0x2::coin::TreasuryCap'
  static readonly $numTypeParams = 1

  readonly $typeName = TreasuryCap.$typeName

  static get bcs() {
    return bcs.struct('TreasuryCap', {
      id: UID.bcs,
      total_supply: Supply.bcs,
    })
  }

  readonly $typeArg: string

  readonly id: ToField<UID>
  readonly totalSupply: ToField<Supply>

  private constructor(typeArg: string, fields: TreasuryCapFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.totalSupply = fields.totalSupply
  }

  static new(typeArg: ReifiedTypeArgument, fields: TreasuryCapFields): TreasuryCap {
    return new TreasuryCap(extractType(typeArg), fields)
  }

  static reified(T: ReifiedTypeArgument) {
    return {
      typeName: TreasuryCap.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => TreasuryCap.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TreasuryCap.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => TreasuryCap.fromBcs(T, data),
      bcs: TreasuryCap.bcs,
      __class: null as unknown as ReturnType<typeof TreasuryCap.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): TreasuryCap {
    return TreasuryCap.new(typeArg, {
      id: decodeFromFieldsGenericOrSpecial(UID.reified(), fields.id),
      totalSupply: decodeFromFieldsGenericOrSpecial(Supply.reified(typeArg), fields.total_supply),
    })
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): TreasuryCap {
    if (!isTreasuryCap(item.type)) {
      throw new Error('not a TreasuryCap type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TreasuryCap.new(typeArg, {
      id: decodeFromFieldsWithTypesGenericOrSpecial(UID.reified(), item.fields.id),
      totalSupply: decodeFromFieldsWithTypesGenericOrSpecial(
        Supply.reified(typeArg),
        item.fields.total_supply
      ),
    })
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): TreasuryCap {
    return TreasuryCap.fromFields(typeArg, TreasuryCap.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      totalSupply: this.totalSupply.toJSON(),
    }
  }

  static fromSuiParsedData(typeArg: ReifiedTypeArgument, content: SuiParsedData): TreasuryCap {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTreasuryCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TreasuryCap object`)
    }
    return TreasuryCap.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch(
    client: SuiClient,
    typeArg: ReifiedTypeArgument,
    id: string
  ): Promise<TreasuryCap> {
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
