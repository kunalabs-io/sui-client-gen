import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'
import { TreasuryCap } from '../../sui/coin/structs'
import { UID } from '../../sui/object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== EXAMPLE_COIN =============================== */

export function isEXAMPLE_COIN(type: Type): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::EXAMPLE_COIN'
  )
}

export interface EXAMPLE_COINFields {
  dummyField: boolean
}

export class EXAMPLE_COIN {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::EXAMPLE_COIN'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('EXAMPLE_COIN', {
      dummy_field: bcs.bool(),
    })
  }

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

  static fromBcs(data: Uint8Array): EXAMPLE_COIN {
    return EXAMPLE_COIN.fromFields(EXAMPLE_COIN.bcs.parse(data))
  }

  toJSON() {
    return {
      dummyField: this.dummyField,
    }
  }
}

/* ============================== Faucet =============================== */

export function isFaucet(type: Type): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::Faucet'
  )
}

export interface FaucetFields {
  id: string
  cap: TreasuryCap
}

export class Faucet {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::Faucet'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Faucet', {
      id: UID.bcs,
      cap: TreasuryCap.bcs,
    })
  }

  readonly id: string
  readonly cap: TreasuryCap

  constructor(fields: FaucetFields) {
    this.id = fields.id
    this.cap = fields.cap
  }

  static fromFields(fields: Record<string, any>): Faucet {
    return new Faucet({
      id: UID.fromFields(fields.id).id,
      cap: TreasuryCap.fromFields(
        `0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::EXAMPLE_COIN`,
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

  static fromBcs(data: Uint8Array): Faucet {
    return Faucet.fromFields(Faucet.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
      cap: this.cap.toJSON(),
    }
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isFaucet(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Faucet object`)
    }
    return Faucet.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Faucet> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Faucet object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isFaucet(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Faucet object`)
    }
    return Faucet.fromFieldsWithTypes(res.data.content)
  }
}
