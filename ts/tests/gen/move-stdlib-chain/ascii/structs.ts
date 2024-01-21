import * as reified from '../../_framework/reified'
import {
  ToField,
  Vector,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  fieldToJSON,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== String =============================== */

export function isString(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x1::ascii::String'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface StringFields {
  bytes: ToField<Vector<'u8'>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class String {
  static readonly $typeName = '0x1::ascii::String'
  static readonly $numTypeParams = 0

  __reifiedFullTypeString = null as unknown as '0x1::ascii::String'

  readonly $typeName = String.$typeName

  static get bcs() {
    return bcs.struct('String', {
      bytes: bcs.vector(bcs.u8()),
    })
  }

  readonly bytes: ToField<Vector<'u8'>>

  private constructor(bytes: ToField<Vector<'u8'>>) {
    this.bytes = bytes
  }

  static new(bytes: ToField<Vector<'u8'>>): String {
    return new String(bytes)
  }

  static reified() {
    return {
      typeName: String.$typeName,
      typeArgs: [],
      fullTypeName: composeSuiType(String.$typeName, ...[]) as '0x1::ascii::String',
      fromFields: (fields: Record<string, any>) => String.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => String.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => String.fromBcs(data),
      bcs: String.bcs,
      fromJSONField: (field: any) => String.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof String.new>,
    }
  }

  static fromFields(fields: Record<string, any>): String {
    return String.new(decodeFromFields(reified.vector('u8'), fields.bytes))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): String {
    if (!isString(item.type)) {
      throw new Error('not a String type')
    }

    return String.new(decodeFromFieldsWithTypes(reified.vector('u8'), item.fields.bytes))
  }

  static fromBcs(data: Uint8Array): String {
    return String.fromFields(String.bcs.parse(data))
  }

  toJSONField() {
    return {
      bytes: fieldToJSON<Vector<'u8'>>(`vector<u8>`, this.bytes),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): String {
    return String.new(decodeFromJSONField(reified.vector('u8'), field.bytes))
  }

  static fromJSON(json: Record<string, any>): String {
    if (json.$typeName !== String.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return String.fromJSONField(json)
  }
}

/* ============================== Char =============================== */

export function isChar(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x1::ascii::Char'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface CharFields {
  byte: ToField<'u8'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Char {
  static readonly $typeName = '0x1::ascii::Char'
  static readonly $numTypeParams = 0

  __reifiedFullTypeString = null as unknown as '0x1::ascii::Char'

  readonly $typeName = Char.$typeName

  static get bcs() {
    return bcs.struct('Char', {
      byte: bcs.u8(),
    })
  }

  readonly byte: ToField<'u8'>

  private constructor(byte_: ToField<'u8'>) {
    this.byte = byte_
  }

  static new(byte_: ToField<'u8'>): Char {
    return new Char(byte_)
  }

  static reified() {
    return {
      typeName: Char.$typeName,
      typeArgs: [],
      fullTypeName: composeSuiType(Char.$typeName, ...[]) as '0x1::ascii::Char',
      fromFields: (fields: Record<string, any>) => Char.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Char.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Char.fromBcs(data),
      bcs: Char.bcs,
      fromJSONField: (field: any) => Char.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof Char.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Char {
    return Char.new(decodeFromFields('u8', fields.byte))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Char {
    if (!isChar(item.type)) {
      throw new Error('not a Char type')
    }

    return Char.new(decodeFromFieldsWithTypes('u8', item.fields.byte))
  }

  static fromBcs(data: Uint8Array): Char {
    return Char.fromFields(Char.bcs.parse(data))
  }

  toJSONField() {
    return {
      byte: this.byte,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Char {
    return Char.new(decodeFromJSONField('u8', field.byte))
  }

  static fromJSON(json: Record<string, any>): Char {
    if (json.$typeName !== Char.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Char.fromJSONField(json)
  }
}
