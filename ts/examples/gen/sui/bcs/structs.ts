import * as reified from '../../_framework/reified'
import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { bcs } from '@mysten/sui/bcs'
import { SuiClient, SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromB64 } from '@mysten/sui/utils'

/* ============================== BCS =============================== */

export function isBCS(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::bcs::BCS`
}

export interface BCSFields {
  bytes: ToField<Vector<'u8'>>
}

export type BCSReified = Reified<BCS, BCSFields>

export class BCS implements StructClass {
  __StructClass = true as const

  static readonly $typeName = `0x2::bcs::BCS`
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName = BCS.$typeName
  readonly $fullTypeName: `0x2::bcs::BCS`
  readonly $typeArgs: []
  readonly $isPhantom = BCS.$isPhantom

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(typeArgs: [], fields: BCSFields) {
    this.$fullTypeName = composeSuiType(BCS.$typeName, ...typeArgs) as `0x2::bcs::BCS`
    this.$typeArgs = typeArgs

    this.bytes = fields.bytes
  }

  static reified(): BCSReified {
    const reifiedBcs = BCS.bcs
    return {
      typeName: BCS.$typeName,
      fullTypeName: composeSuiType(BCS.$typeName, ...[]) as `0x2::bcs::BCS`,
      typeArgs: [] as [],
      isPhantom: BCS.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BCS.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BCS.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BCS.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BCS.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BCS.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => BCS.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => BCS.fromSuiObjectData(content),
      fetch: async (client: SuiClient, id: string) => BCS.fetch(client, id),
      new: (fields: BCSFields) => {
        return new BCS([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return BCS.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BCS>> {
    return phantom(BCS.reified())
  }

  static get p() {
    return BCS.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BCS', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  private static cachedBcs: ReturnType<typeof BCS.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BCS.instantiateBcs> {
    if (!BCS.cachedBcs) {
      BCS.cachedBcs = BCS.instantiateBcs()
    }
    return BCS.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BCS {
    return BCS.reified().new({ bytes: decodeFromFields(reified.vector('u8'), fields.bytes) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BCS {
    if (!isBCS(item.type)) {
      throw new Error('not a BCS type')
    }

    return BCS.reified().new({
      bytes: decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.bytes),
    })
  }

  static fromBcs(data: Uint8Array): BCS {
    return BCS.fromFields(BCS.bcs.parse(data))
  }

  toJSONField() {
    return {
      bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bytes),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BCS {
    return BCS.reified().new({ bytes: decodeFromJSONField(reified.vector('u8'), field.bytes) })
  }

  static fromJSON(json: Record<string, any>): BCS {
    if (json.$typeName !== BCS.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return BCS.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BCS {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBCS(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BCS object`)
    }
    return BCS.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BCS {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBCS(data.bcs.type)) {
        throw new Error(`object at is not a BCS object`)
      }

      return BCS.fromBcs(fromB64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BCS.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SuiClient, id: string): Promise<BCS> {
    const res = await client.getObject({ id, options: { showBcs: true } })
    if (res.error) {
      throw new Error(`error fetching BCS object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.bcs?.dataType !== 'moveObject' || !isBCS(res.data.bcs.type)) {
      throw new Error(`object at id ${id} is not a BCS object`)
    }

    return BCS.fromSuiObjectData(res.data)
  }
}
