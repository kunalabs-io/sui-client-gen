import { BCS, TypeName as BcsTypeName, Encoding } from '@mysten/bcs'
import { ObjectId, normalizeSuiAddress } from '@mysten/sui.js'
import { Type } from './type'
import { bcs } from './bcs'
import { FieldsWithTypes } from './util'

/* ===================================== ID ===================================== */

export const ID_BCS_TYPE_NAME: BcsTypeName = '0x2::object::ID'

bcs.registerStructType(ID_BCS_TYPE_NAME, {
  bytes: BCS.ADDRESS,
})

export function isID(type: Type): boolean {
  return type === '0x2::object::ID'
}

export interface IDFields {
  bytes: ObjectId
}

export class ID {
  static readonly $typeName = '0x2::object::ID'
  static readonly $numTypeParams = 0

  readonly bytes: ObjectId

  constructor(fields: IDFields) {
    this.bytes = fields.bytes
  }

  static fromFields(fields: Record<string, any>) {
    return new ID({
      bytes: normalizeSuiAddress(fields.bytes), // we normalize because this field is of `address` type
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ID {
    /* special casing in the rpc response means that the type field is not present */
    /*
    if (!isID(item.type)) {
      throw new Error(`not an ID type`)
    }

    return new ID({
      bytes: item.fields.bytes,
    })
    */
    return new ID({
      bytes: item as any,
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): ID {
    return ID.fromFields(bcs.de(ID_BCS_TYPE_NAME, data, encoding))
  }
}

export const UID_BCS_TYPE_NAME: BcsTypeName = '0x2::object::UID'

bcs.registerStructType(UID_BCS_TYPE_NAME, {
  id: '0x2::object::ID',
})

export function isUID(type: Type): boolean {
  return type === '0x2::object::UID'
}

export interface UIDFields {
  id: ID
}

/* ===================================== UID ===================================== */

export class UID {
  static readonly $typeName = '0x2::object::UID'
  static readonly $numTypeParams = 0

  readonly id: ID

  constructor(fields: UIDFields) {
    this.id = fields.id
  }

  static fromFields(fields: Record<string, any>) {
    return new UID({
      id: ID.fromFields(fields.id),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UID {
    /* special casing in the rpc response means that the type field is not present */
    /*
    if (!isUID(item.type)) {
      throw new Error(`not a UID type`)
    }

    return new UID({
      id: ID.fromFieldsWithTypes(item.fields.id),
    })
    */

    return new UID({
      id: ID.fromFieldsWithTypes((item as any).id),
    })
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding) {
    const dec = bcs.de(UID_BCS_TYPE_NAME, data, encoding)
    return new UID({
      id: ID.fromBcs(dec.id),
    })
  }
}
