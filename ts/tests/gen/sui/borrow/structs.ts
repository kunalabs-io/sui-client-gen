import { initLoaderIfNeeded } from '../../_framework/init-source'
import { structClassLoaderSource } from '../../_framework/loader'
import {
  FieldsWithTypes,
  Type,
  compressSuiType,
  genericToJSON,
  parseTypeName,
} from '../../_framework/util'
import { Option } from '../../move-stdlib/option/structs'
import { ID } from '../object/structs'
import { BcsType, bcs, fromHEX, toHEX } from '@mysten/bcs'

/* ============================== Borrow =============================== */

export function isBorrow(type: Type): boolean {
  type = compressSuiType(type)
  return type === '0x2::borrow::Borrow'
}

export interface BorrowFields {
  ref: string
  obj: string
}

export class Borrow {
  static readonly $typeName = '0x2::borrow::Borrow'
  static readonly $numTypeParams = 0

  static get bcs() {
    return bcs.struct('Borrow', {
      ref: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      obj: ID.bcs,
    })
  }

  readonly ref: string
  readonly obj: string

  constructor(fields: BorrowFields) {
    this.ref = fields.ref
    this.obj = fields.obj
  }

  static fromFields(fields: Record<string, any>): Borrow {
    return new Borrow({ ref: `0x${fields.ref}`, obj: ID.fromFields(fields.obj).bytes })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Borrow {
    if (!isBorrow(item.type)) {
      throw new Error('not a Borrow type')
    }
    return new Borrow({ ref: item.fields.ref, obj: item.fields.obj })
  }

  static fromBcs(data: Uint8Array): Borrow {
    return Borrow.fromFields(Borrow.bcs.parse(data))
  }

  toJSON() {
    return {
      ref: this.ref,
      obj: this.obj,
    }
  }
}

/* ============================== Referent =============================== */

export function isReferent(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::borrow::Referent<')
}

export interface ReferentFields<T> {
  id: string
  value: T | null
}

export class Referent<T> {
  static readonly $typeName = '0x2::borrow::Referent'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <T extends BcsType<any>>(T: T) =>
      bcs.struct(`Referent<${T.name}>`, {
        id: bcs.bytes(32).transform({
          input: (val: string) => fromHEX(val),
          output: (val: Uint8Array) => toHEX(val),
        }),
        value: Option.bcs(T),
      })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly value: T | null

  constructor(typeArg: Type, fields: ReferentFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.value = fields.value
  }

  static fromFields<T>(typeArg: Type, fields: Record<string, any>): Referent<T> {
    initLoaderIfNeeded()

    return new Referent(typeArg, {
      id: `0x${fields.id}`,
      value: Option.fromFields<T>(`${typeArg}`, fields.value).vec[0] || null,
    })
  }

  static fromFieldsWithTypes<T>(item: FieldsWithTypes): Referent<T> {
    initLoaderIfNeeded()

    if (!isReferent(item.type)) {
      throw new Error('not a Referent type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Referent(typeArgs[0], {
      id: item.fields.id,
      value:
        item.fields.value !== null
          ? Option.fromFieldsWithTypes<T>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item.fields.value] },
            }).vec[0]
          : null,
    })
  }

  static fromBcs<T>(typeArg: Type, data: Uint8Array): Referent<T> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return Referent.fromFields(
      typeArg,
      Referent.bcs(structClassLoaderSource.getBcsType(typeArgs[0])).parse(data)
    )
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      id: this.id,
      value: genericToJSON(`0x1::option::Option<${this.$typeArg}>`, this.value),
    }
  }
}
