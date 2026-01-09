import { bcs } from '@mysten/sui/bcs'
import { SuiObjectData, SuiParsedData } from '@mysten/sui/client'
import { fromBase64 } from '@mysten/sui/utils'
import {
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
  phantom,
  PhantomReified,
  Reified,
  StructClass,
  ToField,
  ToJSON,
  ToTypeStr,
  vector,
} from '../../../_framework/reified'
import {
  composeSuiType,
  compressSuiType,
  fetchObjectBcs,
  FieldsWithTypes,
  SupportedSuiClient,
} from '../../../_framework/util'
import { Vector } from '../../../_framework/vector'

/* ============================== BitVector =============================== */

export function isBitVector(type: string): boolean {
  type = compressSuiType(type)
  return type === `0x1::bit_vector::BitVector`
}

export interface BitVectorFields {
  length: ToField<'u64'>
  bitField: ToField<Vector<'bool'>>
}

export type BitVectorReified = Reified<BitVector, BitVectorFields>

export type BitVectorJSONField = {
  length: string
  bitField: boolean[]
}

export type BitVectorJSON = {
  $typeName: typeof BitVector.$typeName
  $typeArgs: []
} & BitVectorJSONField

export class BitVector implements StructClass {
  __StructClass = true as const

  static readonly $typeName: `0x1::bit_vector::BitVector` = `0x1::bit_vector::BitVector` as const
  static readonly $numTypeParams = 0
  static readonly $isPhantom = [] as const

  readonly $typeName: typeof BitVector.$typeName = BitVector.$typeName
  readonly $fullTypeName: `0x1::bit_vector::BitVector`
  readonly $typeArgs: []
  readonly $isPhantom: typeof BitVector.$isPhantom = BitVector.$isPhantom

  readonly length: ToField<'u64'>
  readonly bitField: ToField<Vector<'bool'>>

  private constructor(typeArgs: [], fields: BitVectorFields) {
    this.$fullTypeName = composeSuiType(
      BitVector.$typeName,
      ...typeArgs,
    ) as `0x1::bit_vector::BitVector`
    this.$typeArgs = typeArgs

    this.length = fields.length
    this.bitField = fields.bitField
  }

  static reified(): BitVectorReified {
    const reifiedBcs = BitVector.bcs
    return {
      typeName: BitVector.$typeName,
      fullTypeName: composeSuiType(
        BitVector.$typeName,
        ...[],
      ) as `0x1::bit_vector::BitVector`,
      typeArgs: [] as [],
      isPhantom: BitVector.$isPhantom,
      reifiedTypeArgs: [],
      fromFields: (fields: Record<string, any>) => BitVector.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BitVector.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BitVector.fromFields(reifiedBcs.parse(data)),
      bcs: reifiedBcs,
      fromJSONField: (field: any) => BitVector.fromJSONField(field),
      fromJSON: (json: Record<string, any>) => BitVector.fromJSON(json),
      fromSuiParsedData: (content: SuiParsedData) => BitVector.fromSuiParsedData(content),
      fromSuiObjectData: (content: SuiObjectData) => BitVector.fromSuiObjectData(content),
      fetch: async (client: SupportedSuiClient, id: string) => BitVector.fetch(client, id),
      new: (fields: BitVectorFields) => {
        return new BitVector([], fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r(): BitVectorReified {
    return BitVector.reified()
  }

  static phantom(): PhantomReified<ToTypeStr<BitVector>> {
    return phantom(BitVector.reified())
  }

  static get p(): PhantomReified<ToTypeStr<BitVector>> {
    return BitVector.phantom()
  }

  private static instantiateBcs() {
    return bcs.struct('BitVector', {
      length: bcs.u64(),
      bit_field: bcs.vector(bcs.bool()),
    })
  }

  private static cachedBcs: ReturnType<typeof BitVector.instantiateBcs> | null = null

  static get bcs(): ReturnType<typeof BitVector.instantiateBcs> {
    if (!BitVector.cachedBcs) {
      BitVector.cachedBcs = BitVector.instantiateBcs()
    }
    return BitVector.cachedBcs
  }

  static fromFields(fields: Record<string, any>): BitVector {
    return BitVector.reified().new({
      length: decodeFromFields('u64', fields.length),
      bitField: decodeFromFields(vector('bool'), fields.bit_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BitVector {
    if (!isBitVector(item.type)) {
      throw new Error('not a BitVector type')
    }

    return BitVector.reified().new({
      length: decodeFromFieldsWithTypes('u64', item.fields.length),
      bitField: decodeFromFieldsWithTypes(vector('bool'), item.fields.bit_field),
    })
  }

  static fromBcs(data: Uint8Array): BitVector {
    return BitVector.fromFields(BitVector.bcs.parse(data))
  }

  toJSONField(): BitVectorJSONField {
    return {
      length: this.length.toString(),
      bitField: fieldToJSON<Vector<'bool'>>(`vector<bool>`, this.bitField),
    }
  }

  toJSON(): BitVectorJSON {
    return { $typeName: this.$typeName, $typeArgs: this.$typeArgs, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BitVector {
    return BitVector.reified().new({
      length: decodeFromJSONField('u64', field.length),
      bitField: decodeFromJSONField(vector('bool'), field.bitField),
    })
  }

  static fromJSON(json: Record<string, any>): BitVector {
    if (json.$typeName !== BitVector.$typeName) {
      throw new Error(
        `not a BitVector json object: expected '${BitVector.$typeName}' but got '${json.$typeName}'`,
      )
    }

    return BitVector.fromJSONField(json)
  }

  static fromSuiParsedData(content: SuiParsedData): BitVector {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isBitVector(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a BitVector object`)
    }
    return BitVector.fromFieldsWithTypes(content)
  }

  static fromSuiObjectData(data: SuiObjectData): BitVector {
    if (data.bcs) {
      if (data.bcs.dataType !== 'moveObject' || !isBitVector(data.bcs.type)) {
        throw new Error(`object at is not a BitVector object`)
      }

      return BitVector.fromBcs(fromBase64(data.bcs.bcsBytes))
    }
    if (data.content) {
      return BitVector.fromSuiParsedData(data.content)
    }
    throw new Error(
      'Both `bcs` and `content` fields are missing from the data. Include `showBcs` or `showContent` in the request.',
    )
  }

  static async fetch(client: SupportedSuiClient, id: string): Promise<BitVector> {
    const res = await fetchObjectBcs(client, id)
    if (!isBitVector(res.type)) {
      throw new Error(`object at id ${id} is not a BitVector object`)
    }

    return BitVector.fromBcs(res.bcsBytes)
  }
}
