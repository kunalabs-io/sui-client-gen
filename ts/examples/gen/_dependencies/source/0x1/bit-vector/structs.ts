import * as reified from '../../../../_framework/reified'
import {
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  fieldToJSON,
} from '../../../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== BitVector =============================== */

export function isBitVector(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x1::bit_vector::BitVector'
}

export interface BitVectorFields {
  length: ToField<'u64'>
  bitField: Array<ToField<'bool'>>
}

export class BitVector {
  static readonly $typeName = '0x1::bit_vector::BitVector'
  static readonly $numTypeParams = 0

  readonly $typeName = BitVector.$typeName

  static get bcs() {
    return bcs.struct('BitVector', {
      length: bcs.u64(),
      bit_field: bcs.vector(bcs.bool()),
    })
  }

  readonly length: ToField<'u64'>
  readonly bitField: Array<ToField<'bool'>>

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
      fromFields: (fields: Record<string, any>) => BitVector.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BitVector.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BitVector.fromBcs(data),
      bcs: BitVector.bcs,
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
      bitField: fieldToJSON(`vector<bool>`, this.bitField),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }
}
