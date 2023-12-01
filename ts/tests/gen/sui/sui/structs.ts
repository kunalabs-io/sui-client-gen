import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== SUI =============================== */

export function isSUI(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::sui::SUI'
}

export interface SUIFields {
  dummyField: boolean
}

export class SUI {
  static readonly $typeName = '0x2::sui::SUI'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('SUI', {
      dummy_field: bcs.bool(),
    })
  }

  readonly dummyField: boolean

  constructor(dummyField: boolean) {
    this.dummyField = dummyField
  }

  static fromFields(fields: Record<string, any>): SUI {
    return new SUI(fields.dummy_field)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): SUI {
    if (!isSUI(item.type)) {
      throw new Error('not a SUI type')
    }
    return new SUI(item.fields.dummy_field)
  }

  static fromBcs(data: Uint8Array): SUI {
    return SUI.fromFields(SUI.bcs.parse(data))
  }
}
