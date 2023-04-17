import { JsonRpcProvider, ObjectId, SuiParsedData } from '@mysten/sui.js'
import { Balance, Supply } from './balance'
import { Type, parseTypeName } from './type'
import { bcs } from './bcs'
import { UID } from './object'
import { FieldsWithTypes } from './util'
import { Encoding } from '@mysten/bcs'

/* ================================= TreasuryCap ================================= */

bcs.registerStructType(['0x2::coin::TreasuryCap', 'T'], {
  id: '0x2::object::UID',
  totalSupply: '0x2::balance::Supply<T>',
})

export function isTreasuryCap(type: Type): boolean {
  return type === '0x2::coin::TreasuryCap'
}

export interface TreasuryCapFields {
  id: ObjectId
  totalSupply: Supply
}

export class TreasuryCap {
  static readonly $typeName = '0x2::coin::TreasuryCap'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly id: ObjectId
  readonly totalSupply: Supply

  constructor(typeArg: Type, fields: TreasuryCapFields) {
    this.$typeArg = typeArg
    this.id = fields.id
    this.totalSupply = fields.totalSupply
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): TreasuryCap {
    return new TreasuryCap(typeArg, {
      id: UID.fromFields(fields.id).id.bytes,
      totalSupply: Supply.fromFields(typeArg, fields.total_supply),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TreasuryCap {
    if (!isTreasuryCap(item.type)) {
      throw new Error(`not a TreasuryCap type`)
    }

    const { typeArgs } = parseTypeName(item.type)

    return new TreasuryCap(typeArgs[0], {
      id: item.fields.id.id,
      totalSupply: Supply.fromFieldsWithTypes(item.fields.total_supply),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): TreasuryCap {
    return TreasuryCap.fromFields(typeArg, bcs.de('0x2::coin::TreasuryCap', data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData): TreasuryCap {
    if (content.dataType !== 'moveObject') {
      throw new Error(`not an object`)
    }
    if (!isTreasuryCap(content.type)) {
      throw new Error(`object at "${content.fields.id}" is not a TreasuryCap`)
    }
    return TreasuryCap.fromFieldsWithTypes(content)
  }

  static async fetch(provider: JsonRpcProvider, id: ObjectId): Promise<TreasuryCap> {
    const res = await provider.getObject({
      id,
      options: {
        showBcs: true,
      },
    })
    if (res.error) {
      throw new Error(`error fetching TreasuryCap object at id ${id}: ${res.error}`)
    }
    const { typeArgs } = parseTypeName(res.data!.type!)

    return TreasuryCap.fromBcs(typeArgs[0], res.data!.bcs!.bcsBytes, 'base64')
  }
}

/* ==================================== Coin ===================================== */

bcs.registerStructType(['0x2::coin::Coin', 'T'], {
  id: '0x2::object::UID',
  balance: '0x2::balance::Balance<T>',
})

export function isCoin(type: Type) {
  return type.startsWith('0x2::coin::Coin<')
}

export interface CoinFields {
  id: ObjectId
  balance: Balance
}

export class Coin {
  static readonly $typeName = '0x2::coin::Coin'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly id: ObjectId
  readonly balance: Balance

  constructor(typeArg: Type, fields: CoinFields) {
    this.$typeArg = typeArg
    this.id = fields.id
    this.balance = fields.balance
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): Coin {
    return new Coin(typeArg, {
      id: UID.fromFields(fields.id).id.bytes,
      balance: Balance.fromFields(typeArg, fields.balance),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Coin {
    if (!isCoin(item.type)) {
      throw new Error(`not a Coin type`)
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Coin(typeArgs[0], {
      id: item.fields.id,
      balance: Balance.fromFieldsWithTypes(typeArgs[0], item.fields.balance),
    })
  }

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): Coin {
    return Coin.fromFields(typeArg, bcs.de(['0x2::coin::Coin', typeArg], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error(`not an object`)
    }
    if (!isCoin(content.type)) {
      throw new Error(`object at "${content.fields.id}" is not a Coin`)
    }
    return Coin.fromFieldsWithTypes(content)
  }

  static async fetch(provider: JsonRpcProvider, id: ObjectId): Promise<Coin> {
    const res = await provider.getObject({
      id,
      options: {
        showBcs: true,
      },
    })
    if (res.error) {
      throw new Error(`error fetching Coin object at id "${id}": ${res.error.tag}`)
    }
    if (res.data!.bcs!.dataType !== 'moveObject' || !isCoin(res.data!.bcs!.type)) {
      throw new Error(`object at id "${id}" is not a Coin`)
    }
    const { typeArgs } = parseTypeName(res.data!.bcs!.type)

    return Coin.fromBcs(typeArgs[0], res.data!.bcs!.bcsBytes, 'base64')
  }
}
