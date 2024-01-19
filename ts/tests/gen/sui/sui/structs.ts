import {
  ToField,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
} from '../../_framework/types'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== SUI =============================== */

export function isSUI(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::sui::SUI'
}

export interface SUIFields {
  dummyField: ToField<'bool'>
}

export class SUI {
  static readonly $typeName = '0x2::sui::SUI'
  static readonly $numTypeParams = 0

  readonly $typeName = SUI.$typeName

  static get bcs() {
    return bcs.struct('SUI', {
      dummy_field: bcs.bool(),
    })
  }

  readonly dummyField: ToField<'bool'>

  private constructor(dummyField: ToField<'bool'>) {
    this.dummyField = dummyField
  }

  static new(dummyField: ToField<'bool'>): SUI {
    return new SUI(dummyField)
  }

  static reified() {
    return {
      typeName: SUI.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => SUI.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => SUI.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => SUI.fromBcs(data),
      bcs: SUI.bcs,
      __class: null as unknown as ReturnType<typeof SUI.new>,
    }
  }

  static fromFields(fields: Record<string, any>): SUI {
    return SUI.new(decodeFromFieldsGenericOrSpecial('bool', fields.dummy_field))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): SUI {
    if (!isSUI(item.type)) {
      throw new Error('not a SUI type')
    }

    return SUI.new(decodeFromFieldsWithTypesGenericOrSpecial('bool', item.fields.dummy_field))
  }

  static fromBcs(data: Uint8Array): SUI {
    return SUI.fromFields(SUI.bcs.parse(data))
  }

  toJSON() {
    return {
      dummyField: this.dummyField,
    }
  }
}
