import { Encoding, bcsSource as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type, compressSuiType } from '../../../../_framework/util'

/* ============================== BitVector =============================== */

bcs.registerStructType('0x1::bit_vector::BitVector', {
  length: `u64`,
  bit_field: `vector<bool>`,
})

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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): BitVector {
    return BitVector.fromFields(bcs.de([BitVector.$typeName], data, encoding))
  }
}
