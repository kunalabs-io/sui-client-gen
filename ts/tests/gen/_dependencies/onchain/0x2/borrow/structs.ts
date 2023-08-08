import { bcsOnchain as bcs } from '../../../../_framework/bcs'
import { initLoaderIfNeeded } from '../../../../_framework/init-onchain'
import { FieldsWithTypes, Type, parseTypeName } from '../../../../_framework/util'
import { Option } from '../../0x1/option/structs'
import { ID } from '../object/structs'
import { Encoding } from '@mysten/bcs'

/* ============================== Referent =============================== */

bcs.registerStructType('0x2::borrow::Referent<T0>', {
  id: `address`,
  value: `0x1::option::Option<T0>`,
})

export function isReferent(type: Type): boolean {
  return type.startsWith('0x2::borrow::Referent<')
}

export interface ReferentFields<T0> {
  id: string
  value: T0 | null
}

export class Referent<T0> {
  static readonly $typeName = '0x2::borrow::Referent'
  static readonly $numTypeParams = 1

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

  static fromBcs<T0>(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): Referent<T0> {
    return Referent.fromFields(typeArg, bcs.de([Referent.$typeName, typeArg], data, encoding))
  }
}

/* ============================== Borrow =============================== */

bcs.registerStructType('0x2::borrow::Borrow', {
  ref: `address`,
  obj: `0x2::object::ID`,
})

export function isBorrow(type: Type): boolean {
  return type === '0x2::borrow::Borrow'
}

export interface BorrowFields {
  ref: string
  obj: string
}

export class Borrow {
  static readonly $typeName = '0x2::borrow::Borrow'
  static readonly $numTypeParams = 0

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

  static fromBcs(data: Uint8Array | string, encoding?: Encoding): Borrow {
    return Borrow.fromFields(bcs.de([Borrow.$typeName], data, encoding))
  }
}
