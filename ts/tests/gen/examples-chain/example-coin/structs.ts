import {
  Reified,
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { TreasuryCap } from '../../sui-chain/coin/structs'
import { UID } from '../../sui-chain/object/structs'
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface EXAMPLE_COINFields {
  dummyField: ToField<'bool'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class EXAMPLE_COIN {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::EXAMPLE_COIN'
  static readonly $numTypeParams = 0

  readonly $fullTypeName =
    null as unknown as '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::EXAMPLE_COIN'

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

  static reified(): Reified<EXAMPLE_COIN> {
    return {
      typeName: EXAMPLE_COIN.$typeName,
      fullTypeName: composeSuiType(
        EXAMPLE_COIN.$typeName,
        ...[]
      ) as '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::EXAMPLE_COIN',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => EXAMPLE_COIN.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => EXAMPLE_COIN.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => EXAMPLE_COIN.fromBcs(data),
      bcs: EXAMPLE_COIN.bcs,
      fromJSONField: (field: any) => EXAMPLE_COIN.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => EXAMPLE_COIN.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return EXAMPLE_COIN.reified()
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

  toJSONField() {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): EXAMPLE_COIN {
    return EXAMPLE_COIN.new(decodeFromJSONField('bool', field.dummyField))
  }

  static fromJSON(json: Record<string, any>): EXAMPLE_COIN {
    if (json.$typeName !== EXAMPLE_COIN.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return EXAMPLE_COIN.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): EXAMPLE_COIN {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isEXAMPLE_COIN(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a EXAMPLE_COIN object`)
    }
    return EXAMPLE_COIN.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<EXAMPLE_COIN> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching EXAMPLE_COIN object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isEXAMPLE_COIN(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a EXAMPLE_COIN object`)
    }
    return EXAMPLE_COIN.fromFieldsWithTypes(res.data.content)
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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface FaucetFields {
  id: ToField<UID>
  cap: ToField<TreasuryCap<ToPhantom<EXAMPLE_COIN>>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Faucet {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::Faucet'
  static readonly $numTypeParams = 0

  readonly $fullTypeName =
    null as unknown as '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::Faucet'

  readonly $typeName = Faucet.$typeName

  static get bcs() {
    return bcs.struct('Faucet', {
      id: UID.bcs,
      cap: TreasuryCap.bcs,
    })
  }

  readonly id: ToField<UID>
  readonly cap: ToField<TreasuryCap<ToPhantom<EXAMPLE_COIN>>>

  private constructor(fields: FaucetFields) {
    this.id = fields.id
    this.cap = fields.cap
  }

  static new(fields: FaucetFields): Faucet {
    return new Faucet(fields)
  }

  static reified(): Reified<Faucet> {
    return {
      typeName: Faucet.$typeName,
      fullTypeName: composeSuiType(
        Faucet.$typeName,
        ...[]
      ) as '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::example_coin::Faucet',
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Faucet.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Faucet.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Faucet.fromBcs(data),
      bcs: Faucet.bcs,
      fromJSONField: (field: any) => Faucet.fromJSONField(field),
      fetch: async (client: SuiClient, id: string) => Faucet.fetch(client, id),
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Faucet.reified()
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

  toJSONField() {
    return {
      id: this.id,
      cap: this.cap.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Faucet {
    return Faucet.new({
      id: decodeFromJSONField(UID.reified(), field.id),
      cap: decodeFromJSONField(TreasuryCap.reified(EXAMPLE_COIN.reified()), field.cap),
    })
  }

  static fromJSON(json: Record<string, any>): Faucet {
    if (json.$typeName !== Faucet.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Faucet.fromJSONField(json)
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
