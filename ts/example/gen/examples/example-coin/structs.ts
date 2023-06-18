import { bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../_framework/util'
import { TreasuryCap } from '../../sui/coin/structs'
import { UID } from '../../sui/object/structs'
import { Encoding } from '@mysten/bcs'
import { JsonRpcProvider, ObjectId, SuiParsedData } from '@mysten/sui.js'

/* ============================== EXAMPLE_COIN =============================== */

bcs.registerStructType(
  '0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::example_coin::EXAMPLE_COIN',
  {
    dummy_field: `bool`,
  }
)

export function isEXAMPLE_COIN(type: Type): boolean {
  return (
    type ===
    '0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::example_coin::EXAMPLE_COIN'
  )
}

export interface EXAMPLE_COINFields {
  dummyField: boolean
}

export class EXAMPLE_COIN {
  static readonly $typeName =
    '0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::example_coin::EXAMPLE_COIN'
  static readonly $numTypeParams = 0

  readonly dummyField: boolean

  constructor(dummyField: boolean) {
    this.dummyField = dummyField
  }

  static fromFields(fields: Record<string, any>): EXAMPLE_COIN {
    return new EXAMPLE_COIN(fields.dummy_field)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): EXAMPLE_COIN {
    if (!isEXAMPLE_COIN(item.type)) {
      throw new Error('not a EXAMPLE_COIN type')
    }
    return new EXAMPLE_COIN(item.fields.dummy_field)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): EXAMPLE_COIN {
    return EXAMPLE_COIN.fromFields(bcs.de([EXAMPLE_COIN.$typeName], data, encoding))
  }
}

/* ============================== Faucet =============================== */

bcs.registerStructType(
  '0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::example_coin::Faucet',
  {
    id: `0x2::object::UID`,
    cap: `0x2::coin::TreasuryCap<0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::example_coin::EXAMPLE_COIN>`,
  }
)

export function isFaucet(type: Type): boolean {
  return (
    type ===
    '0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::example_coin::Faucet'
  )
}

export interface FaucetFields {
  id: ObjectId
  cap: TreasuryCap
}

export class Faucet {
  static readonly $typeName =
    '0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::example_coin::Faucet'
  static readonly $numTypeParams = 0

  readonly id: ObjectId
  readonly cap: TreasuryCap

  constructor(fields: FaucetFields) {
    this.id = fields.id
    this.cap = fields.cap
  }

  static fromFields(fields: Record<string, any>): Faucet {
    return new Faucet({
      id: UID.fromFields(fields.id).id,
      cap: TreasuryCap.fromFields(
        `0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::example_coin::EXAMPLE_COIN`,
        fields.cap
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Faucet {
    if (!isFaucet(item.type)) {
      throw new Error('not a Faucet type')
    }
    return new Faucet({
      id: item.fields.id.id,
      cap: TreasuryCap.fromFieldsWithTypes(item.fields.cap),
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Faucet {
    return Faucet.fromFields(bcs.de([Faucet.$typeName], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isFaucet(content.type)) {
      throw new Error(`object at ${content.fields.id} is not a Faucet object`)
    }
    return Faucet.fromFieldsWithTypes(content)
  }

  static async fetch(provider: JsonRpcProvider, id: ObjectId): Promise<Faucet> {
    const res = await provider.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Faucet object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isFaucet(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Faucet object`)
    }
    return Faucet.fromFieldsWithTypes(res.data.content)
  }
}
