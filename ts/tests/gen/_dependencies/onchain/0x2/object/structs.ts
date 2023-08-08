import { bcsOnchain as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../../../_framework/util'
import { Encoding } from '@mysten/bcs'

/* ============================== ID =============================== */

bcs.registerStructType('0x2::object::ID', {
  bytes: `address`,
})

export function isID(type: Type): boolean {
  return type === '0x2::object::ID'
}

export interface IDFields {
  bytes: string
}

export class ID {
  static readonly $typeName = '0x2::object::ID'
  static readonly $numTypeParams = 0

  readonly bytes: string

  constructor(bytes: string) {
    this.bytes = bytes
  }

  static fromFields(fields: Record<string, any>): ID {
    return new ID(`0x${fields.bytes}`)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ID {
    if (!isID(item.type)) {
      throw new Error('not a ID type')
    }
    return new ID(`0x${item.fields.bytes}`)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): ID {
    return ID.fromFields(bcs.de([ID.$typeName], data, encoding))
  }
}

/* ============================== UID =============================== */

bcs.registerStructType('0x2::object::UID', {
  id: `0x2::object::ID`,
})

export function isUID(type: Type): boolean {
  return type === '0x2::object::UID'
}

export interface UIDFields {
  id: string
}

export class UID {
  static readonly $typeName = '0x2::object::UID'
  static readonly $numTypeParams = 0

  readonly id: string

  constructor(id: string) {
    this.id = id
  }

  static fromFields(fields: Record<string, any>): UID {
    return new UID(ID.fromFields(fields.id).bytes)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UID {
    if (!isUID(item.type)) {
      throw new Error('not a UID type')
    }
    return new UID(item.fields.id)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): UID {
    return UID.fromFields(bcs.de([UID.$typeName], data, encoding))
  }
}
