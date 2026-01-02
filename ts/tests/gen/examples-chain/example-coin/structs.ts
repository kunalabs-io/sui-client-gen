import * as reified from '../../_framework/reified'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  ToTypeStr as ToPhantom,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  composeSuiType,
  compressSuiType,
  parseTypeName,
} from '../../_framework/util'
import { PKG_V1 } from '../index'
import { TreasuryCap } from '../../sui-chain/coin/structs'
import { UID } from '../../sui-chain/object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== EXAMPLE_COIN =============================== */

export function isEXAMPLE_COIN(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V1}::example_coin::EXAMPLE_COIN`
}

export interface EXAMPLE_COINFields {
  dummyField: ToField<'bool'>
}

export type EXAMPLE_COINReified = Reified<EXAMPLE_COIN, EXAMPLE_COINFields>

export class EXAMPLE_COIN implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V1}::example_coin::EXAMPLE_COIN`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = EXAMPLE_COIN.$typeName
  readonly $fullTypeName: `${typeof PKG_V1}::example_coin::EXAMPLE_COIN`
  readonly $typeArgs: []
  readonly $isPhantom = EXAMPLE_COIN.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: EXAMPLE_COINFields) {
    this.$fullTypeName = composeSuiType(
      EXAMPLE_COIN.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V1}::example_coin::EXAMPLE_COIN`
    this.$typeArgs = typeArgs

    this.dummyField = fields.dummyField
  }

  static reified(): EXAMPLE_COINReified {
    const reifiedBcs = EXAMPLE_COIN.bcs
    return {
      typeName: EXAMPLE_COIN.$typeName,
      fullTypeName: composeSuiType(
        EXAMPLE_COIN.$typeName,
        ...[]
      ) as `${typeof PKG_V1}::example_coin::EXAMPLE_COIN`,
      typeArgs: [] as [],
      isPhantom: EXAMPLE_COIN.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => EXAMPLE_COIN.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => EXAMPLE_COIN.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => EXAMPLE_COIN.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => EXAMPLE_COIN.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => EXAMPLE_COIN.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => EXAMPLE_COIN.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => EXAMPLE_COIN.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => EXAMPLE_COIN.fetch(client, id),
      new: (fields: EXAMPLE_COINFields) => {
        return new EXAMPLE_COIN([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return EXAMPLE_COIN.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<EXAMPLE_COIN>> {
    return phantom(EXAMPLE_COIN.reified())
  }

  static get p() {
    return EXAMPLE_COIN.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('EXAMPLE_COIN', {
      dummy_field: bcs.bool(),
    })
  }

  private static cachedBcs: ReturnType<typeof EXAMPLE_COIN.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof EXAMPLE_COIN.instantiateBcs> {
    if (!EXAMPLE_COIN.cachedBcs) {
      EXAMPLE_COIN.cachedBcs = EXAMPLE_COIN.instantiateBcs()
    }
    return EXAMPLE_COIN.cachedBcs
  }

  static fromFields(fields: Record<string, any>): EXAMPLE_COIN {
    return EXAMPLE_COIN.reified().new({
      dummyField: decodeFromFields('bool', fields.dummy_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): EXAMPLE_COIN {
    if (!isEXAMPLE_COIN(item.type)) {
      throw new Error('not a EXAMPLE_COIN type')
    }

    return EXAMPLE_COIN.reified().new({
      dummyField: decodeFromFieldsWithTypes('bool', item.fields.dummy_field),
    })
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): EXAMPLE_COIN {
    return EXAMPLE_COIN.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
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

  static fromSuiObjectData(data: SuiObjectData): EXAMPLE_COIN {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isEXAMPLE_COIN(data.bcs.type)) {
        throw new Error(`object at is not a EXAMPLE_COIN object`)
      }

      return EXAMPLE_COIN.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return EXAMPLE_COIN.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<EXAMPLE_COIN> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching EXAMPLE_COIN object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isEXAMPLE_COIN(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a EXAMPLE_COIN object`)
    }

    return EXAMPLE_COIN.fromSuiObjectData(res.data)
  }
}

/* ============================== Faucet =============================== */

export function isFaucet(type: string): boolean {
  type = compressSuiType(type)
  return type === `${PKG_V1}::example_coin::Faucet`
}

export interface FaucetFields {
  id: ToField<UID>
  cap: ToField<TreasuryCap<ToPhantom<EXAMPLE_COIN>>>
}

export type FaucetReified = Reified<Faucet, FaucetFields>

export class Faucet implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `${PKG_V1}::example_coin::Faucet`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = Faucet.$typeName
  readonly $fullTypeName: `${typeof PKG_V1}::example_coin::Faucet`
  readonly $typeArgs: []
  readonly $isPhantom = Faucet.$isPhantom

  readonly id: ToField<UID>
  readonly cap: ToField<TreasuryCap<ToPhantom<EXAMPLE_COIN>>>

  private constructor(typeArgs: [], fields: FaucetFields) {
    this.$fullTypeName = composeSuiType(
      Faucet.$typeName,
      ...typeArgs
    ) as `${typeof PKG_V1}::example_coin::Faucet`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.cap = fields.cap
  }

  static reified(): FaucetReified {
    const reifiedBcs = Faucet.bcs
    return {
      typeName: Faucet.$typeName,
      fullTypeName: composeSuiType(
        Faucet.$typeName,
        ...[]
      ) as `${typeof PKG_V1}::example_coin::Faucet`,
      typeArgs: [] as [],
      isPhantom: Faucet.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => Faucet.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Faucet.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Faucet.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => Faucet.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => Faucet.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => Faucet.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => Faucet.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => Faucet.fetch(client, id),
      new: (fields: FaucetFields) => {
        return new Faucet([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return Faucet.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Faucet>> {
    return phantom(Faucet.reified())
  }

  static get p() {
    return Faucet.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('Faucet', {
      id: UID.bcs,
      cap: TreasuryCap.bcs,
    })
  }

  private static cachedBcs: ReturnType<typeof Faucet.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof Faucet.instantiateBcs> {
    if (!Faucet.cachedBcs) {
      Faucet.cachedBcs = Faucet.instantiateBcs()
    }
    return Faucet.cachedBcs
  }

  static fromFields(fields: Record<string, any>): Faucet {
    return Faucet.reified().new({
      id: decodeFromFields(UID.reified(), fields.id),
      cap: decodeFromFields(
        TreasuryCap.reified(reified.phantom(EXAMPLE_COIN.reified())),
        fields.cap
      ),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Faucet {
    if (!isFaucet(item.type)) {
      throw new Error('not a Faucet type')
    }

    return Faucet.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      cap: decodeFromFieldsWithTypes(
        TreasuryCap.reified(reified.phantom(EXAMPLE_COIN.reified())),
        item.fields.cap
      ),
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
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Faucet {
    return Faucet.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      cap: decodeFromJSONField(
        TreasuryCap.reified(reified.phantom(EXAMPLE_COIN.reified())),
        field.cap
      ),
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

  static fromSuiObjectData(data: SuiObjectData): Faucet {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isFaucet(data.bcs.type)) {
        throw new Error(`object at is not a Faucet object`)
      }

      return Faucet.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Faucet.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<Faucet> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching Faucet object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isFaucet(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a Faucet object`)
    }

    return Faucet.fromSuiObjectData(res.data)
  }
}
