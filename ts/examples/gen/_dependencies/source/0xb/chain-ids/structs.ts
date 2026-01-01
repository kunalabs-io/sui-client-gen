import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  phantom,
} from '../../../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../../../_framework/util'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== BridgeRoute =============================== */

export function isBridgeRoute(type: string): boolean {
  type = compressSuiType(type)
  return type === `0xb::chain_ids::BridgeRoute`
}

export interface BridgeRouteFields {
  source: ToField<'u8'>
  destination: ToField<'u8'>
}

export type BridgeRouteReified = Reified<BridgeRoute, BridgeRouteFields>

export class BridgeRoute implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0xb::chain_ids::BridgeRoute`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = BridgeRoute.$typeName
  readonly $fullTypeName: `0xb::chain_ids::BridgeRoute`
  readonly $typeArgs: []
  readonly $isPhantom = BridgeRoute.$isPhantom

  readonly source: ToField<'u8'>
  readonly destination: ToField<'u8'>

  private constructor(typeArgs: [], fields: BridgeRouteFields) {
    this.$fullTypeName = composeSuiType(
      BridgeRoute.$typeName,
      ...typeArgs
    ) as `0xb::chain_ids::BridgeRoute`
    this.$typeArgs = typeArgs

    this.source = fields.source
    this.destination = fields.destination
  }

  static reified(): BridgeRouteReified {
    const reifiedBcs = BridgeRoute.bcs
    return {
      typeName: BridgeRoute.$typeName,
      fullTypeName: composeSuiType(BridgeRoute.$typeName, ...[]) as `0xb::chain_ids::BridgeRoute`,
      typeArgs: [] as [],
      isPhantom: BridgeRoute.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BridgeRoute.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BridgeRoute.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BridgeRoute.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BridgeRoute.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BridgeRoute.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => BridgeRoute.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => BridgeRoute.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => BridgeRoute.fetch(client, id),
      new: (fields: BridgeRouteFields) => {
        return new BridgeRoute([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return BridgeRoute.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BridgeRoute>> {
    return phantom(BridgeRoute.reified())
  }

  static get p() {
    return BridgeRoute.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BridgeRoute', {
      source: bcs.u8(),
      destination: bcs.u8(),
    })
  }

  private static cachedBcs: ReturnType<typeof BridgeRoute.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BridgeRoute.instantiateBcs> {
    if (!BridgeRoute.cachedBcs) {
      BridgeRoute.cachedBcs = BridgeRoute.instantiateBcs()
    }
    return BridgeRoute.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BridgeRoute {
    return BridgeRoute.reified().new({
      source: decodeFromFields('u8', fields.source),
      destination: decodeFromFields('u8', fields.destination),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BridgeRoute {
    if (!isBridgeRoute(item.type)) {
      throw new Error('not a BridgeRoute type')
    }

    return BridgeRoute.reified().new({
      source: decodeFromFieldsWithTypes('u8', item.fields.source),
      destination: decodeFromFieldsWithTypes('u8', item.fields.destination),
    })
  }

  static fromBcs(data: Uint8Array): BridgeRoute {
    return BridgeRoute.fromFields(BridgeRoute.bcs.parse(data))
  }

  toJSONField() {
    return {
      source: this.source,
      destination: this.destination,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BridgeRoute {
    return BridgeRoute.reified().new({
      source: decodeFromJSONField('u8', field.source),
      destination: decodeFromJSONField('u8', field.destination),
    })
  }

  static fromJSON(json: Record<string, any>): BridgeRoute {
    if (json.$typeName !== BridgeRoute.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return BridgeRoute.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BridgeRoute {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBridgeRoute(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BridgeRoute object`)
    }
    return BridgeRoute.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BridgeRoute {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBridgeRoute(data.bcs.type)) {
        throw new Error(`object at is not a BridgeRoute object`)
      }

      return BridgeRoute.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BridgeRoute.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<BridgeRoute> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching BridgeRoute object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBridgeRoute(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a BridgeRoute object`)
    }

    return BridgeRoute.fromSuiObjectData(res.data)
  }
}
