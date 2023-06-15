import { bcsOnchain as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../../../_framework/util'
import { Encoding } from '@mysten/bcs'

/* ============================== BCS =============================== */

bcs.registerStructType('0x2::bcs::BCS', {
  bytes: `vector<u8>`,
})

export function isBCS(type: Type): boolean {
  return type === '0x2::bcs::BCS'
}

export interface BCSFields {
  bytes: Array<number>
}

export class BCS {
  static readonly $typeName = '0x2::bcs::BCS'
  static readonly $numTypeParams = 0

  readonly bytes: Array<number>

  constructor(bytes: Array<number>) {
    this.bytes = bytes
  }

  static fromFields(fields: Record<string, any>): BCS {
    return new BCS(fields.bytes.map((item: any) => item))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BCS {
    if (!isBCS(item.type)) {
      throw new Error('not a BCS type')
    }
    return new BCS(item.fields.bytes.map((item: any) => item))
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): BCS {
    return BCS.fromFields(bcs.de([BCS.$typeName], data, encoding))
  }
}
