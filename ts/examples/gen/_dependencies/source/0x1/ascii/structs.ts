import { Encoding, bcsSource as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type } from '../../../../_framework/util'

/* ============================== Char =============================== */

bcs.registerStructType('0x1::ascii::Char', {
  byte: `u8`,
})

export function isChar(type: Type): boolean {
  return type === '0x1::ascii::Char'
}

export interface CharFields {
  byte: number
}

export class Char {
  static readonly $typeName = '0x1::ascii::Char'
  static readonly $numTypeParams = 0

  readonly byte: number

  constructor(byte: number) {
    this.byte = byte
  }

  static fromFields(fields: Record<string, any>): Char {
    return new Char(fields.byte)
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Char {
    if (!isChar(item.type)) {
      throw new Error('not a Char type')
    }
    return new Char(item.fields.byte)
  }

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Char {
    return Char.fromFields(bcs.de([Char.$typeName], data, encoding))
  }
}

/* ============================== String =============================== */

bcs.registerStructType('0x1::ascii::String', {
  bytes: `vector<u8>`,
})

export function isString(type: Type): boolean {
  return type === '0x1::ascii::String'
}

export interface StringFields {
  bytes: Array<number>
}

export class String {
  static readonly $typeName = '0x1::ascii::String'
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
