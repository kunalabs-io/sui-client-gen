import { Encoding, bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'
import { String as String1 } from '../../move-stdlib/ascii/structs'
import { Option } from '../../move-stdlib/option/structs'
import { String } from '../../move-stdlib/string/structs'
import { Balance, Supply } from '../balance/structs'
import { UID } from '../object/structs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Coin =============================== */

bcs.registerStructType('0x2::coin::Coin<T>', {
  id: `0x2::object::UID`,
  balance: `0x2::balance::Balance<T>`,
})

export function isCoin(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::Coin<')
}

export interface CoinFields {
  id: string
  balance: Balance
}

export class Coin {
  static readonly $typeName = '0x2::coin::Coin'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly id: string
  readonly balance: Balance

  constructor(typeArg: Type, fields: CoinFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.balance = fields.balance
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): Coin {
    return new Coin(typeArg, {
      id: UID.fromFields(fields.id).id,
      balance: Balance.fromFields(`${typeArg}`, fields.balance),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Coin {
    if (!isCoin(item.type)) {
      throw new Error('not a Coin type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Coin(typeArgs[0], {
      id: item.fields.id.id,
      balance: new Balance(`${typeArgs[0]}`, BigInt(item.fields.balance)),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): Coin {
    return Coin.fromFields(typeArg, bcs.de([Coin.$typeName, typeArg], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoin(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Coin object`)
    }
    return Coin.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Coin> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Coin object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isCoin(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Coin object`)
    }
    return Coin.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== CoinMetadata =============================== */

bcs.registerStructType('0x2::coin::CoinMetadata<T>', {
  id: `0x2::object::UID`,
  decimals: `u8`,
  name: `0x1::string::String`,
  symbol: `0x1::ascii::String`,
  description: `0x1::string::String`,
  icon_url: `0x1::option::Option<0x2::url::Url>`,
})

export function isCoinMetadata(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::CoinMetadata<')
}

export interface CoinMetadataFields {
  id: string
  decimals: number
  name: string
  symbol: string
  description: string
  iconUrl: string | null
}

export class CoinMetadata {
  static readonly $typeName = '0x2::coin::CoinMetadata'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly id: string
  readonly decimals: number
  readonly name: string
  readonly symbol: string
  readonly description: string
  readonly iconUrl: string | null

  constructor(typeArg: Type, fields: CoinMetadataFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.decimals = fields.decimals
    this.name = fields.name
    this.symbol = fields.symbol
    this.description = fields.description
    this.iconUrl = fields.iconUrl
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): CoinMetadata {
    return new CoinMetadata(typeArg, {
      id: UID.fromFields(fields.id).id,
      decimals: fields.decimals,
      name: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.name).bytes))
        .toString(),
      symbol: new TextDecoder()
        .decode(Uint8Array.from(String1.fromFields(fields.symbol).bytes))
        .toString(),
      description: new TextDecoder()
        .decode(Uint8Array.from(String.fromFields(fields.description).bytes))
        .toString(),
      iconUrl: Option.fromFields<string>(`0x2::url::Url`, fields.icon_url).vec[0] || null,
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): CoinMetadata {
    if (!isCoinMetadata(item.type)) {
      throw new Error('not a CoinMetadata type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new CoinMetadata(typeArgs[0], {
      id: item.fields.id.id,
      decimals: item.fields.decimals,
      name: item.fields.name,
      symbol: item.fields.symbol,
      description: item.fields.description,
      iconUrl:
        item.fields.icon_url !== null
          ? Option.fromFieldsWithTypes<string>({
              type: '0x1::option::Option<' + `0x2::url::Url` + '>',
              fields: { vec: [item.fields.icon_url] },
            }).vec[0]
          : null,
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): CoinMetadata {
    return CoinMetadata.fromFields(
      typeArg,
      bcs.de([CoinMetadata.$typeName, typeArg], data, encoding)
    )
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isCoinMetadata(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a CoinMetadata object`)
    }
    return CoinMetadata.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<CoinMetadata> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching CoinMetadata object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isCoinMetadata(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a CoinMetadata object`)
    }
    return CoinMetadata.fromFieldsWithTypes(res.data.content)
  }
}

/* ============================== CurrencyCreated =============================== */

bcs.registerStructType('0x2::coin::CurrencyCreated<T>', {
  decimals: `u8`,
})

export function isCurrencyCreated(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::CurrencyCreated<')
}

export interface CurrencyCreatedFields {
  decimals: number
}

export class CurrencyCreated {
  static readonly $typeName = '0x2::coin::CurrencyCreated'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly decimals: number

  constructor(typeArg: Type, decimals: number) {
    this.$typeArg = typeArg

    this.decimals = decimals
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): CurrencyCreated {
    return new CurrencyCreated(typeArg, fields.decimals)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): CurrencyCreated {
    if (!isCurrencyCreated(item.type)) {
      throw new Error('not a CurrencyCreated type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new CurrencyCreated(typeArgs[0], item.fields.decimals)
  }

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): CurrencyCreated {
    return CurrencyCreated.fromFields(
      typeArg,
      bcs.de([CurrencyCreated.$typeName, typeArg], data, encoding)
    )
  }
}

/* ============================== TreasuryCap =============================== */

bcs.registerStructType('0x2::coin::TreasuryCap<T>', {
  id: `0x2::object::UID`,
  total_supply: `0x2::balance::Supply<T>`,
})

export function isTreasuryCap(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::coin::TreasuryCap<')
}

export interface TreasuryCapFields {
  id: string
  totalSupply: Supply
}

export class TreasuryCap {
  static readonly $typeName = '0x2::coin::TreasuryCap'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly id: string
  readonly totalSupply: Supply

  constructor(typeArg: Type, fields: TreasuryCapFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.totalSupply = fields.totalSupply
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): TreasuryCap {
    return new TreasuryCap(typeArg, {
      id: UID.fromFields(fields.id).id,
      totalSupply: Supply.fromFields(`${typeArg}`, fields.total_supply),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TreasuryCap {
    if (!isTreasuryCap(item.type)) {
      throw new Error('not a TreasuryCap type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new TreasuryCap(typeArgs[0], {
      id: item.fields.id.id,
      totalSupply: Supply.fromFieldsWithTypes(item.fields.total_supply),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): TreasuryCap {
    return TreasuryCap.fromFields(typeArg, bcs.de([TreasuryCap.$typeName, typeArg], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTreasuryCap(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TreasuryCap object`)
    }
    return TreasuryCap.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<TreasuryCap> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TreasuryCap object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTreasuryCap(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TreasuryCap object`)
    }
    return TreasuryCap.fromFieldsWithTypes(res.data.content)
  }
}
