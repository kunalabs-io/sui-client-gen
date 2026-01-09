/**
 * This module implements BCS (de)serialization in Move.
 * Full specification can be found here: https://github.com/diem/bcs
 *
 * Short summary (for Move-supported types):
 *
 * - address - sequence of X bytes
 * - bool - byte with 0 or 1
 * - u8 - a single u8 byte
 * - u16 / u32 / u64 / u128 / u256 - LE bytes
 * - vector - ULEB128 length + LEN elements
 * - option - first byte bool: None (0) or Some (1), then value
 *
 * Usage example:
 * ```
 * /// This function reads u8 and u64 value from the input
 * /// and returns the rest of the bytes.
 * fun deserialize(bytes: vector<u8>): (u8, u64, vector<u8>) {
 * use sui::bcs::{Self, BCS};
 *
 * let prepared: BCS = bcs::new(bytes);
 * let (u8_value, u64_value) = (
 * prepared.peel_u8(),
 * prepared.peel_u64()
 * );
 *
 * // unpack bcs struct
 * let leftovers = prepared.into_remainder_bytes();
 *
 * (u8_value, u64_value, leftovers)
 * }
 * ```
 */

import {
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  vector,
} from '../../_framework/reified'
import {
  FieldsWithTypes,
  SupportedSuiClient,
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
} from '../../_framework/util'
import { Vector } from '../../_framework/vector'
import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'

/* ============================== BCS =============================== */

export function isBCS(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x2::bcs::BCS`
}

export interface BCSFields {
  bytes: ToField<Vector<'u8'>>
}

export type BCSReified = Reified<BCS, BCSFields>

export type BCSJSONField = {
  bytes: number[]
}

export type BCSJSON = {
  $typeName: typeof BCS.$typeName
  $typeArgs: []
} & BCSJSONField

/**
 * A helper struct that saves resources on operations. For better
 * vector performance, it stores reversed bytes of the BCS and
 * enables use of `vector::pop_back`.
 */
export class BCS implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x2::bcs::BCS` = `0x2::bcs::BCS` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof BCS.$typeName = BCS.$typeName
  readonly $fullTypeName: `0x2::bcs::BCS`
  readonly $typeArgs: []
  readonly $isPhantom: typeof BCS.$isPhantom = BCS.$isPhantom

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
      fetch: async (client: SupportedSuiClient, id: string) => BCS.fetch(client, id),
      new: (fields: BCSFields) => {
        return new BCS([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): BCSReified {
    return BCS.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BCS>> {
    return phantom(BCS.reified())
  }

  static get p(): PhantomReified<ToTypeStr<BCS>> {
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
    return BCS.reified().new({
      bytes: decodeFromFields(vector('u8'), fields.bytes),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BCS {
    if (!isBCS(item.type)) {
      throw new Error('not a BCS type')
    }

    return BCS.reified().new({
      bytes: decodeFromFieldsWithTypes(vector('u8'), item.fields.bytes),
    })
  }

  static fromBcs(data: Uint8Array): BCS {
    return BCS.fromFields(BCS.bcs.parse(data))
  }

  toJSONField(): BCSJSONField {
    return {
      bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bytes),
    }
  }

  toJSON(): BCSJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BCS {
    return BCS.reified().new({
      bytes: decodeFromJSONField(vector('u8'), field.bytes),
    })
  }

  static fromJSON(json: Record<string, any>): BCS {
    if (json.$typeName !== BCS.$typeName) {
      throw new Error(
        `not a BCS json object: expected '${BCS.$typeName}' but got '${json.$typeName}'`
      )
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

      return BCS.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BCS.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.'
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<BCS> {
    const res = await fetchObjectBcs(client, id)
    if (!isBCS(res.type)) {
      throw new Error(`object at id ${id} is not a BCS object`)
    }

    return BCS.fromBcs(res.bcsBytes)
  }
}
