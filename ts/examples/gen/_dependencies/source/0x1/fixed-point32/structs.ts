import {
  ToField,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
} from '../../../../_framework/types'
import { FieldsWithTypes, Type, compressSuiType } from '../../../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== FixedPoint32 =============================== */

export function isFixedPoint32(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x1::fixed_point32::FixedPoint32'
}

export interface FixedPoint32Fields {
  value: ToField<'u64'>
}

export class FixedPoint32 {
  static readonly $typeName = '0x1::fixed_point32::FixedPoint32'
  static readonly $numTypeParams = 0

  readonly $typeName = FixedPoint32.$typeName

  static get bcs() {
    return bcs.struct('FixedPoint32', {
      value: bcs.u64(),
    })
  }

  readonly value: ToField<'u64'>

  private constructor(value: ToField<'u64'>) {
    this.value = value
  }

  static new(value: ToField<'u64'>): FixedPoint32 {
    return new FixedPoint32(value)
  }

  static reified() {
    return {
      typeName: FixedPoint32.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => FixedPoint32.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => FixedPoint32.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => FixedPoint32.fromBcs(data),
      bcs: FixedPoint32.bcs,
      __class: null as unknown as ReturnType<typeof FixedPoint32.new>,
    }
  }

  static fromFields(fields: Record<string, any>): FixedPoint32 {
    return FixedPoint32.new(decodeFromFieldsGenericOrSpecial('u64', fields.value))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): FixedPoint32 {
    if (!isFixedPoint32(item.type)) {
      throw new Error('not a FixedPoint32 type')
    }

    return FixedPoint32.new(decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.value))
  }

  static fromBcs(data: Uint8Array): FixedPoint32 {
    return FixedPoint32.fromFields(FixedPoint32.bcs.parse(data))
  }

  toJSON() {
    return {
      value: this.value.toString(),
    }
  }
}
