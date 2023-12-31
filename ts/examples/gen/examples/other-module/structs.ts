import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== StructFromOtherModule =============================== */

export function isStructFromOtherModule(type: Type): boolean {
  type = compressSuiType(type)
  return (
    type ===
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::other_module::StructFromOtherModule'
  )
}

export interface StructFromOtherModuleFields {
  dummyField: boolean
}

export class StructFromOtherModule {
  static readonly $typeName =
    '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::other_module::StructFromOtherModule'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('StructFromOtherModule', {
      dummy_field: bcs.bool(),
    })
  }

  readonly dummyField: boolean

  constructor(dummyField: boolean) {
    this.dummyField = dummyField
  }

  static fromFields(fields: Record<string, any>): StructFromOtherModule {
    return new StructFromOtherModule(fields.dummy_field)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): StructFromOtherModule {
    if (!isStructFromOtherModule(item.type)) {
      throw new Error('not a StructFromOtherModule type')
    }
    return new StructFromOtherModule(item.fields.dummy_field)
  }

  static fromBcs(data: Uint8Array): StructFromOtherModule {
    return StructFromOtherModule.fromFields(StructFromOtherModule.bcs.parse(data))
  }

  toJSON() {
    return {
      dummyField: this.dummyField,
    }
  }
}
