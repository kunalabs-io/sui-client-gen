import { Encoding, bcsOnchain as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../_framework/util'

/* ============================== StructFromOtherModule =============================== */

bcs.registerStructType(
  '0x8b699fdce543505aeb290ee1b6b5d20fcaa8e8b1a5fc137a8b3facdfa2902209::other_module::StructFromOtherModule',
  {
    dummy_field: `bool`,
  }
)

export function isStructFromOtherModule(type: Type): boolean {
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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): StructFromOtherModule {
    return StructFromOtherModule.fromFields(
      bcs.de([StructFromOtherModule.$typeName], data, encoding)
    )
  }
}
