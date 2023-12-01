import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== FixedPoint32 =============================== */

export function isFixedPoint32(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x1::fixed_point32::FixedPoint32'
}

export interface FixedPoint32Fields {
  value: bigint
}

export class FixedPoint32 {
  static readonly $typeName = '0x1::fixed_point32::FixedPoint32'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('FixedPoint32', {
      value: bcs.u64(),
    })
  }

  readonly value: bigint

  constructor(value: bigint) {
    this.value = value
  }

  static fromFields(fields: Record<string, any>): FixedPoint32 {
    return new FixedPoint32(BigInt(fields.value))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): FixedPoint32 {
    if (!isFixedPoint32(item.type)) {
      throw new Error('not a FixedPoint32 type')
    }
    return new FixedPoint32(BigInt(item.fields.value))
  }

  static fromBcs(data: Uint8Array): FixedPoint32 {
    return FixedPoint32.fromFields(FixedPoint32.bcs.parse(data))
  }
}
