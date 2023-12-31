import { FieldsWithTypes, Type, compressSuiType } from '../../../../_framework/util'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'

/* ============================== ID =============================== */

export function isID(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::object::ID'
}

export interface IDFields {
  bytes: string
}

export class ID {
  static readonly $typeName = '0x2::object::ID'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('ID', {
      bytes: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
    })
  }

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
    return new ID(item.fields.bytes)
  }

  static fromBcs(data: Uint8Array): ID {
    return ID.fromFields(ID.bcs.parse(data))
  }

  toJSON() {
    return {
      bytes: this.bytes,
    }
  }
}

/* ============================== UID =============================== */

export function isUID(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::object::UID'
}

export interface UIDFields {
  id: string
}

export class UID {
  static readonly $typeName = '0x2::object::UID'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('UID', {
      id: ID.bcs,
    })
  }

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

  static fromBcs(data: Uint8Array): UID {
    return UID.fromFields(UID.bcs.parse(data))
  }

  toJSON() {
    return {
      id: this.id,
    }
  }
}
