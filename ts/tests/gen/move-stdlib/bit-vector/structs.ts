import * as reified from '../../_framework/reified'
import {
  ToField,
  Vector,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== BitVector =============================== */

export function isBitVector(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x1::bit_vector::BitVector'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BitVectorFields {
  length: ToField<'u64'>
  bitField: ToField<Vector<'bool'>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BitVector {
  static readonly $typeName = '0x1::bit_vector::BitVector'
  static readonly $numTypeParams = 0

  __reifiedFullTypeString = null as unknown as '0x1::bit_vector::BitVector'

  readonly $typeName = BitVector.$typeName

  static get bcs() {
    return bcs.struct('BitVector', {
      length: bcs.u64(),
      bit_field: bcs.vector(bcs.bool()),
    })
  }

  readonly length: ToField<'u64'>
  readonly bitField: ToField<Vector<'bool'>>

  private constructor(fields: BitVectorFields) {
    this.length = fields.length
    this.bitField = fields.bitField
  }

  static new(fields: BitVectorFields): BitVector {
    return new BitVector(fields)
  }

  static reified() {
    return {
      typeName: BitVector.$typeName,
      typeArgs: [],
      fullTypeName: composeSuiType(BitVector.$typeName, ...[]) as '0x1::bit_vector::BitVector',
      fromFields: (fields: Record<string, any>) => BitVector.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BitVector.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BitVector.fromBcs(data),
      bcs: BitVector.bcs,
      fromJSONField: (field: any) => BitVector.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof BitVector.new>,
    }
  }

  static fromFields(fields: Record<string, any>): BitVector {
    return BitVector.new({
      length: decodeFromFields('u64', fields.length),
      bitField: decodeFromFields(reified.vector('bool'), fields.bit_field),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BitVector {
    if (!isBitVector(item.type)) {
      throw new Error('not a BitVector type')
    }

    return BitVector.new({
      length: decodeFromFieldsWithTypes('u64', item.fields.length),
      bitField: decodeFromFieldsWithTypes(reified.vector('bool'), item.fields.bit_field),
    })
  }

  static fromBcs(data: Uint8Array): BitVector {
    return BitVector.fromFields(BitVector.bcs.parse(data))
  }

  toJSONField() {
    return {
      length: this.length.toString(),
      bitField: fieldToJSON<Vector<'bool'>>(`vector<bool>`, this.bitField),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BitVector {
    return BitVector.new({
      length: decodeFromJSONField('u64', field.length),
      bitField: decodeFromJSONField(reified.vector('bool'), field.bitField),
    })
  }

  static fromJSON(json: Record<string, any>): BitVector {
    if (json.$typeName !== BitVector.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return BitVector.fromJSONField(json)
  }
}
