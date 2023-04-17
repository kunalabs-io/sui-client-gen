import { JsonRpcProvider, ObjectId, SuiParsedData, bcs } from '@mysten/sui.js'
import { TreasuryCap } from 'framework/coin'
import { PACKAGE_ID } from '..'
import { FieldsWithTypes } from 'framework/util'
import { Encoding } from '@mysten/bcs'

/* =================================== Faucet ==================================== */

bcs.registerStructType(`${PACKAGE_ID}::example_coin::Faucet`, {
  id: '0x2::object::UID',
  cap: '0x2::coin::TreasuryCap<${PACKAGE_ID}::example_coin::EXAMPLE_COIN>',
})

export function isFaucet(type: string): boolean {
  return type === `${PACKAGE_ID}::example_coin::Faucet`
}

export interface FaucetFields {
  id: ObjectId
  cap: TreasuryCap
}

export class Faucet {
  static readonly $typeName = `${PACKAGE_ID}::example_coin::Faucet`
  static readonly $numTypeParams = 0

  readonly id: ObjectId
  readonly cap: TreasuryCap

  constructor(fields: FaucetFields) {
    this.id = fields.id
    this.cap = fields.cap
  }

  static fromFields(fields: Record<string, any>): Faucet {
    return new Faucet({
      id: fields.id.id,
      cap: TreasuryCap.fromFields(`${PACKAGE_ID}::example_coin::EXAMPLE_COIN`, fields.cap),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Faucet {
    if (!isFaucet(item.type)) {
      throw new Error(`not a Faucet type`)
    }
    return new Faucet({
      id: item.fields.id.id,
      cap: TreasuryCap.fromFieldsWithTypes(item.fields.cap),
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Faucet {
    return Faucet.fromFields(bcs.de(`${PACKAGE_ID}::example_coin::Faucet`, data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData): Faucet {
    if (content.dataType !== 'moveObject') {
      throw new Error(`not an object`)
    }
    if (!isFaucet(content.type)) {
      throw new Error(`object at "${content.fields.id}" is not a Faucet`)
    }
    return Faucet.fromFieldsWithTypes(content)
  }

  static async fetch(provider: JsonRpcProvider, id: ObjectId): Promise<Faucet> {
    const res = await provider.getObject({
      id,
      options: {
        showContent: true,
      },
    })
    if (res.error) {
      throw new Error(`error fetching Faucet object at id ${id}: ${res.error}`)
    }
    return Faucet.fromSuiParsedData(res.data!.content!)
  }
}
