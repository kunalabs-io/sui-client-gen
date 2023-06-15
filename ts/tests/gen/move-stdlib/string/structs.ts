import { bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../_framework/util'
import { Encoding } from '@mysten/bcs'

/* ============================== String =============================== */

bcs.registerStructType('0x1::string::String', {
  bytes: `vector<u8>`,
})

export function isString(type: Type): boolean {
  return type === '0x1::string::String'
}

export interface StringFields {
  bytes: Array<number>
}

export class String {
  static readonly $typeName = '0x1::string::String'
  static readonly $numTypeParams = 0

  readonly bytes: Array<number>

  constructor(bytes: Array<number>) {
    this.bytes = bytes
  }

  static fromFields(fields: Record<string, any>): String {
    return new String(fields.bytes.map((item: any) => item))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): String {
    if (!isString(item.type)) {
      throw new Error('not a String type')
    }
    return new String(item.fields.bytes.map((item: any) => item))
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): String {
    return String.fromFields(bcs.de([String.$typeName], data, encoding))
  }
}
