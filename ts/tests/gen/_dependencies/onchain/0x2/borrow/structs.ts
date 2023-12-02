import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { structClassLoaderOnchain } from '../../../../_framework/loader'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../../../_framework/util'
import { Option } from '../../0x1/option/structs'
import { ID } from '../object/structs'
import { BcsType, bcs, fromHEX, toHEX } from '@mysten/bcs'

/* ============================== Referent =============================== */

export function isReferent(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::borrow::Referent<')
}

export interface ReferentFields<T0> {
  id: string
  value: T0 | null
}

export class Referent<T0> {
  static readonly $typeName = '0x2::borrow::Referent'
  static readonly $numTypeParams = 1

  static get bcs() {
    return <T0 extends BcsType<any>>(T0: T0) =>
      bcs.struct(`Referent<${T0.name}>`, {
        id: bcs.bytes(32).transform({
          input: (val: string) => fromHEX(val),
          output: (val: Uint8Array) => toHEX(val),
        }),
        value: Option.bcs(T0),
      })
  }

  readonly $typeArg: Type

  readonly id: string
  readonly value: T0 | null

  constructor(typeArg: Type, fields: ReferentFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.value = fields.value
  }

  static fromFields<T0>(typeArg: Type, fields: Record<string, any>): Referent<T0> {
    initLoaderIfNeeded()

    return new Referent(typeArg, {
      id: `0x${fields.id}`,
      value: Option.fromFields<T0>(`${typeArg}`, fields.value).vec[0] || null,
    })
  }

  static fromFieldsWithTypes<T0>(item: FieldsWithTypes): Referent<T0> {
    initLoaderIfNeeded()

    if (!isReferent(item.type)) {
      throw new Error('not a Referent type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Referent(typeArgs[0], {
      id: `0x${item.fields.id}`,
      value:
        item.fields.value !== null
          ? Option.fromFieldsWithTypes<T0>({
              type: '0x1::option::Option<' + `${typeArgs[0]}` + '>',
              fields: { vec: [item.fields.value] },
            }).vec[0]
          : null,
    })
  }

  static fromBcs<T0>(typeArg: Type, data: Uint8Array): Referent<T0> {
    initLoaderIfNeeded()

    const typeArgs = [typeArg]

    return Referent.fromFields(
      typeArg,
      Referent.bcs(structClassLoaderOnchain.getBcsType(typeArgs[0])).parse(data)
    )
  }
}

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
    return new Borrow({ ref: `0x${item.fields.ref}`, obj: item.fields.obj })
  }

  static fromBcs(data: Uint8Array): Borrow {
    return Borrow.fromFields(Borrow.bcs.parse(data))
  }
}
