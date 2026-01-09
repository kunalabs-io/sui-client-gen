import { getTypeOrigin } from '../../_envs'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
  ToTypeStr as ToPhantom,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
} from '../../_framework/util'
import { TreasuryCap } from '../../sui/coin/structs'
import { UID } from '../../sui/object/structs'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== EXAMPLE_COIN =============================== */

export function isEXAMPLE_COIN(type: string): boolean {
  type = compressSuiType(type)
  return (
    type ===
    `${getTypeOrigin('examples', 'example_coin::EXAMPLE_COIN')}::example_coin::EXAMPLE_COIN`
  )
}

export interface EXAMPLE_COINFields {
  dummyField: ToField<'bool'>
}

export type EXAMPLE_COINReified = Reified<EXAMPLE_COIN, EXAMPLE_COINFields>

export type EXAMPLE_COINJSONField = {
  dummyField: boolean
}

export type EXAMPLE_COINJSON = {
  $typeName: typeof EXAMPLE_COIN.$typeName
  $typeArgs: []
} & EXAMPLE_COINJSONField

export class EXAMPLE_COIN implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `${string}::example_coin::EXAMPLE_COIN` =
    `${getTypeOrigin('examples', 'example_coin::EXAMPLE_COIN')}::example_coin::EXAMPLE_COIN` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof EXAMPLE_COIN.$typeName = EXAMPLE_COIN.$typeName
  readonly $fullTypeName: `${string}::example_coin::EXAMPLE_COIN`
  readonly $typeArgs: []
  readonly $isPhantom: typeof EXAMPLE_COIN.$isPhantom = EXAMPLE_COIN.$isPhantom

  readonly dummyField: ToField<'bool'>

  private constructor(typeArgs: [], fields: EXAMPLE_COINFields) {
    this.$fullTypeName = composeSuiType(
      EXAMPLE_COIN.$typeName,
      ...typeArgs
    ) as `${string}::example_coin::EXAMPLE_COIN`
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
      ) as `${string}::example_coin::EXAMPLE_COIN`,
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
      fetch: async (client: SupportedSuiClient, id: string) => EXAMPLE_COIN.fetch(client, id),
      new: (fields: EXAMPLE_COINFields) => {
        return new EXAMPLE_COIN([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): EXAMPLE_COINReified {
    return EXAMPLE_COIN.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<EXAMPLE_COIN>> {
    return phantom(EXAMPLE_COIN.reified())
  }

  static get p(): PhantomReified<ToTypeStr<EXAMPLE_COIN>> {
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

  toJSONField(): EXAMPLE_COINJSONField {
    return {
      dummyField: this.dummyField,
    }
  }

  toJSON(): EXAMPLE_COINJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): EXAMPLE_COIN {
    return EXAMPLE_COIN.reified().new({
      dummyField: decodeFromJSONField('bool', field.dummyField),
    })
  }

  static fromJSON(json: Record<string, any>): EXAMPLE_COIN {
    if (json.$typeName !== EXAMPLE_COIN.$typeName) {
      throw new Error(
        `not a EXAMPLE_COIN json object: expected '${EXAMPLE_COIN.$typeName}' but got '${json.$typeName}'`
      )
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

      return EXAMPLE_COIN.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return EXAMPLE_COIN.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<EXAMPLE_COIN> {
    const res = await fetchObjectBcs(client, id)
    if (!isEXAMPLE_COIN(res.type)) {
      throw new Error(`object at id ${id} is not a EXAMPLE_COIN object`)
    }

    return EXAMPLE_COIN.fromBcs(res.bcsBytes)
  }
}

/* ============================== Faucet =============================== */

export function isFaucet(type: string): boolean {
  type = compressSuiType(type)
  return type === `${getTypeOrigin('examples', 'example_coin::Faucet')}::example_coin::Faucet`
}

export interface FaucetFields {
  id: ToField<UID>
  cap: ToField<TreasuryCap<ToPhantom<EXAMPLE_COIN>>>
}

export type FaucetReified = Reified<Faucet, FaucetFields>

export type FaucetJSONField = {
  id: string
  cap: ToJSON<TreasuryCap<ToPhantom<EXAMPLE_COIN>>>
}

export type FaucetJSON = {
  $typeName: typeof Faucet.$typeName
  $typeArgs: []
} & FaucetJSONField

export class Faucet implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `${string}::example_coin::Faucet` =
    `${getTypeOrigin('examples', 'example_coin::Faucet')}::example_coin::Faucet` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof Faucet.$typeName = Faucet.$typeName
  readonly $fullTypeName: `${string}::example_coin::Faucet`
  readonly $typeArgs: []
  readonly $isPhantom: typeof Faucet.$isPhantom = Faucet.$isPhantom

  readonly id: ToField<UID>
  readonly cap: ToField<TreasuryCap<ToPhantom<EXAMPLE_COIN>>>

  private constructor(typeArgs: [], fields: FaucetFields) {
    this.$fullTypeName = composeSuiType(
      Faucet.$typeName,
      ...typeArgs
    ) as `${string}::example_coin::Faucet`
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.cap = fields.cap
  }

  static reified(): FaucetReified {
    const reifiedBcs = Faucet.bcs
    return {
      typeName: Faucet.$typeName,
      fullTypeName: composeSuiType(Faucet.$typeName, ...[]) as `${string}::example_coin::Faucet`,
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
      fetch: async (client: SupportedSuiClient, id: string) => Faucet.fetch(client, id),
      new: (fields: FaucetFields) => {
        return new Faucet([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): FaucetReified {
    return Faucet.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<Faucet>> {
    return phantom(Faucet.reified())
  }

  static get p(): PhantomReified<ToTypeStr<Faucet>> {
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
      cap: decodeFromFields(TreasuryCap.reified(phantom(EXAMPLE_COIN.reified())), fields.cap),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Faucet {
    if (!isFaucet(item.type)) {
      throw new Error('not a Faucet type')
    }

    return Faucet.reified().new({
      id: decodeFromFieldsWithTypes(UID.reified(), item.fields.id),
      cap: decodeFromFieldsWithTypes(
        TreasuryCap.reified(phantom(EXAMPLE_COIN.reified())),
        item.fields.cap
      ),
    })
  }

  static fromBcs(data: Uint8Array): Faucet {
    return Faucet.fromFields(Faucet.bcs.parse(data))
  }

  toJSONField(): FaucetJSONField {
    return {
      id: this.id,
      cap: this.cap.toJSONField(),
    }
  }

  toJSON(): FaucetJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Faucet {
    return Faucet.reified().new({
      id: decodeFromJSONField(UID.reified(), field.id),
      cap: decodeFromJSONField(TreasuryCap.reified(phantom(EXAMPLE_COIN.reified())), field.cap),
    })
  }

  static fromJSON(json: Record<string, any>): Faucet {
    if (json.$typeName !== Faucet.$typeName) {
      throw new Error(
        `not a Faucet json object: expected '${Faucet.$typeName}' but got '${json.$typeName}'`
      )
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

      return Faucet.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return Faucet.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<Faucet> {
    const res = await fetchObjectBcs(client, id)
    if (!isFaucet(res.type)) {
      throw new Error(`object at id ${id} is not a Faucet object`)
    }

    return Faucet.fromBcs(res.bcsBytes)
  }
}
