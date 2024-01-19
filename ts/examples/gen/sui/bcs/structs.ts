import * as reified from '../../_framework/reified'
import {
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== BCS =============================== */

export function isBCS(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::bcs::BCS'
}

export interface BCSFields {
  bytes: Array<ToField<'u8'>>
}

export class BCS {
  static readonly $typeName = '0x2::bcs::BCS'
  static readonly $numTypeParams = 0

  readonly $typeName = BCS.$typeName

  static get bcs() {
    return bcs.struct('BCS', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly bytes: Array<ToField<'u8'>>

  private constructor(bytes: Array<ToField<'u8'>>) {
    this.bytes = bytes
  }

  static new(bytes: Array<ToField<'u8'>>): BCS {
    return new BCS(bytes)
  }

  static reified() {
    return {
      typeName: BCS.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => BCS.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => BCS.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => BCS.fromBcs(data),
      bcs: BCS.bcs,
      fromJSONField: (field: any) => BCS.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof BCS.new>,
    }
  }

  static fromFields(fields: Record<string, any>): BCS {
    return BCS.new(decodeFromFields(reified.vector('u8'), fields.bytes))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): BCS {
    if (!isBCS(item.type)) {
      throw new Error('not a BCS type')
    }

    return BCS.new(decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.bytes))
  }

  static fromBcs(data: Uint8Array): BCS {
    return BCS.fromFields(BCS.bcs.parse(data))
  }

  toJSONField() {
    return {
      bytes: fieldToJSON<Array<'u8'>>(`vector<u8>`, this.bytes),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): BCS {
    return BCS.new(decodeFromJSONField(reified.vector('u8'), field.bytes))
  }

  static fromJSON(json: Record<string, any>): BCS {
    if (json.$typeName !== BCS.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return BCS.fromJSONField(json)
  }
}
