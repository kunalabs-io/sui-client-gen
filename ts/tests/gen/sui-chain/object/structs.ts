import {
  ToField,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
} from '../../_framework/reified'
import { FieldsWithTypes, compressSuiType } from '../../_framework/util'
import { bcs, fromHEX, toHEX } from '@mysten/bcs'

/* ============================== ID =============================== */

export function isID(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::object::ID'
}

export interface IDFields {
  bytes: ToField<'address'>
}

export class ID {
  static readonly $typeName = '0x2::object::ID'
  static readonly $numTypeParams = 0

  readonly $typeName = ID.$typeName

  static get bcs() {
    return bcs.struct('ID', {
      bytes: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
    })
  }

  readonly bytes: ToField<'address'>

  private constructor(bytes: ToField<'address'>) {
    this.bytes = bytes
  }

  static new(bytes: ToField<'address'>): ID {
    return new ID(bytes)
  }

  static reified() {
    return {
      typeName: ID.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => ID.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => ID.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => ID.fromBcs(data),
      bcs: ID.bcs,
      fromJSONField: (field: any) => ID.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof ID.new>,
    }
  }

  static fromFields(fields: Record<string, any>): ID {
    return ID.new(decodeFromFields('address', fields.bytes))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ID {
    if (!isID(item.type)) {
      throw new Error('not a ID type')
    }

    return ID.new(decodeFromFieldsWithTypes('address', item.fields.bytes))
  }

  static fromBcs(data: Uint8Array): ID {
    return ID.fromFields(ID.bcs.parse(data))
  }

  toJSONField() {
    return {
      bytes: this.bytes,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): ID {
    return ID.new(decodeFromJSONField('address', field.bytes))
  }

  static fromJSON(json: Record<string, any>): ID {
    if (json.$typeName !== ID.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return ID.fromJSONField(json)
  }
}

/* ============================== UID =============================== */

export function isUID(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::object::UID'
}

export interface UIDFields {
  id: ToField<ID>
}

export class UID {
  static readonly $typeName = '0x2::object::UID'
  static readonly $numTypeParams = 0

  readonly $typeName = UID.$typeName

  static get bcs() {
    return bcs.struct('UID', {
      id: ID.bcs,
    })
  }

  readonly id: ToField<ID>

  private constructor(id: ToField<ID>) {
    this.id = id
  }

  static new(id: ToField<ID>): UID {
    return new UID(id)
  }

  static reified() {
    return {
      typeName: UID.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => UID.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => UID.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => UID.fromBcs(data),
      bcs: UID.bcs,
      fromJSONField: (field: any) => UID.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof UID.new>,
    }
  }

  static fromFields(fields: Record<string, any>): UID {
    return UID.new(decodeFromFields(ID.reified(), fields.id))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): UID {
    if (!isUID(item.type)) {
      throw new Error('not a UID type')
    }

    return UID.new(decodeFromFieldsWithTypes(ID.reified(), item.fields.id))
  }

  static fromBcs(data: Uint8Array): UID {
    return UID.fromFields(UID.bcs.parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): UID {
    return UID.new(decodeFromJSONField(ID.reified(), field.id))
  }

  static fromJSON(json: Record<string, any>): UID {
    if (json.$typeName !== UID.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return UID.fromJSONField(json)
  }
}
