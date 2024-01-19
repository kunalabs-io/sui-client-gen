import { ToField, decodeFromFields, decodeFromFieldsWithTypes } from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { TreasuryCap } from '../../sui/coin/structs'
import { UID } from '../../sui/object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== EXAMPLE_COIN =============================== */

export function isEXAMPLE_COIN(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::EXAMPLE_COIN'
  )
}

export interface EXAMPLE_COINFields {
  dummyField: ToField<'bool'>
}

export class EXAMPLE_COIN {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::EXAMPLE_COIN'
  static readonly $numTypeParams = 0

  readonly $typeName = EXAMPLE_COIN.$typeName

  static get bcs() {
    return bcs.struct('EXAMPLE_COIN', {
      dummy_field: bcs.bool(),
    })
  }

  readonly dummyField: ToField<'bool'>

  private constructor(dummyField: ToField<'bool'>) {
    this.dummyField = dummyField
  }

  static new(dummyField: ToField<'bool'>): EXAMPLE_COIN {
    return new EXAMPLE_COIN(dummyField)
  }

  static reified() {
    return {
      typeName: EXAMPLE_COIN.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => EXAMPLE_COIN.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => EXAMPLE_COIN.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => EXAMPLE_COIN.fromBcs(data),
      bcs: EXAMPLE_COIN.bcs,
      __class: null as unknown as ReturnType<typeof EXAMPLE_COIN.new>,
    }
  }

  static fromFields(fields: Record<string, any>): EXAMPLE_COIN {
    return EXAMPLE_COIN.new(decodeFromFields('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): EXAMPLE_COIN {
    if (!isEXAMPLE_COIN(item.type)) {
      throw new Error('not a EXAMPLE_COIN type')
    }

    return EXAMPLE_COIN.new(decodeFromFieldsWithTypes('bool', item.fields.dummy_field))
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

export function isFaucet(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::Faucet'
  )
}

export interface FaucetFields {
  id: ToField<UID>
  cap: ToField<TreasuryCap>
}

export class Faucet {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::Faucet'
  static readonly $numTypeParams = 0

  readonly $typeName = Faucet.$typeName

  static get bcs() {
    return bcs.struct('Faucet', {
      id: UID.bcs,
      cap: TreasuryCap.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly cap: ToField<TreasuryCap>

  private constructor(fields: FaucetFields) {
    this.id = fields.id
    this.cap = fields.cap
  }

  static new(fields: FaucetFields): Faucet {
    return new Faucet(fields)
  }

  static reified() {
    return {
      typeName: Faucet.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Faucet.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Faucet.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Faucet.fromBcs(data),
      bcs: Faucet.bcs,
      __class: null as unknown as ReturnType<typeof Faucet.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Faucet {
    return Faucet.new({
      id: decodeFromFields(UID.reified(), fields.id),
      cap: decodeFromFields(TreasuryCap.reified(EXAMPLE_COIN.reified()), fields.cap),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Faucet {
    if (!isFaucet(item.type)) {
      throw new Error('not a Faucet type')
    }

    return Faucet.new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      cap: decodeFromFieldsWithTypes(TreasuryCap.reified(EXAMPLE_COIN.reified()), item.fields.cap),
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

  static fromSuiParsedData(content: SuiParsedData): Faucet {
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
