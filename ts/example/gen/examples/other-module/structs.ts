import { bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../_framework/util'
import { Encoding } from '@mysten/bcs'

/* ============================== StructFromOtherModule =============================== */

bcs.registerStructType(
  '0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::other_module::StructFromOtherModule',
  {
    dummy_field: `bool`,
  }
)

export function isStructFromOtherModule(type: Type): boolean {
  return (
    type ===
    '0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::other_module::StructFromOtherModule'
  )
}

export interface StructFromOtherModuleFields {
  dummyField: boolean
}

export class StructFromOtherModule {
  static readonly $typeName =
    '0x2991435bfa6230ddf9bf1ac5e2abffb293692f9de47d008cb4cc6ff06f5a2e88::other_module::StructFromOtherModule'
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
