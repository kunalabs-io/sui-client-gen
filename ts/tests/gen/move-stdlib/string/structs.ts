import { FieldsWithTypes, Type, compressSuiType, genericToJSON } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== String =============================== */

export function isString(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x1::string::String'
}

export interface StringFields {
  bytes: Array<number>
}

export class String {
  static readonly $typeName = '0x1::string::String'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('String', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

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

  static fromBcs(data: Uint8Array): String {
    return String.fromFields(String.bcs.parse(data))
  }

  toJSON() {
    return {
      bytes: genericToJSON(`vector<u8>`, this.bytes),
    }
  }
}
