import { FieldsWithTypes, Type, compressSuiType } from '../../../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== BitVector =============================== */

export function isBitVector(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x1::bit_vector::BitVector'
}

export interface BitVectorFields {
  length: bigint
  bitField: Array<boolean>
}

export class BitVector {
  static readonly $typeName = '0x1::bit_vector::BitVector'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('BitVector', {
      length: bcs.u64(),
      bit_field: bcs.vector(bcs.bool()),
    })
  }

  readonly length: bigint
  readonly bitField: Array<boolean>

  constructor(fields: BitVectorFields) {
    this.length = fields.length
    this.bitField = fields.bitField
  }

  static fromFields(fields: Record<string, any>): BitVector {
    return new BitVector({
      length: BigInt(fields.length),
      bitField: fields.bit_field.map((item: any) => item),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BitVector {
    if (!isBitVector(item.type)) {
      throw new Error('not a BitVector type')
    }
    return new BitVector({
      length: BigInt(item.fields.length),
      bitField: item.fields.bit_field.map((item: any) => item),
    })
  }

  static fromBcs(data: Uint8Array): BitVector {
    return BitVector.fromFields(BitVector.bcs.parse(data))
  }
}
