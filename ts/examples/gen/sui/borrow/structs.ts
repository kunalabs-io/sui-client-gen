import { Option } from '../../_dependencies/source/0x1/option/structs'
import {
  ReifiedTypeArgument,
  ToField,
  ToTypeArgument,
  TypeArgument,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
  fieldToJSON,
  toBcs,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { ID } from '../object/structs'
import { BcsType, bcs, fromHEX, toHEX } from '@mysten/bcs'

/* ============================== Borrow =============================== */

export function isBorrow(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::borrow::Borrow'
}

export interface BorrowFields {
  ref: ToField<'address'>
  obj: ToField<ID>
}

export class Borrow {
  static readonly $typeName = '0x2::borrow::Borrow'
  static readonly $numTypeParams = 0

  readonly $typeName = Borrow.$typeName

  static get bcs() {
    return bcs.struct('Borrow', {
      ref: bcs.bytes(32).transform({
        input: (val: string) => fromHEX(val),
        output: (val: Uint8Array) => toHEX(val),
      }),
      obj: ID.bcs,
    })
  }

  readonly ref: ToField<'address'>
  readonly obj: ToField<ID>

  private constructor(fields: BorrowFields) {
    this.ref = fields.ref
    this.obj = fields.obj
  }

  static new(fields: BorrowFields): Borrow {
    return new Borrow(fields)
  }

  static reified() {
    return {
      typeName: Borrow.$typeName,
      typeArgs: [],
      fromFields: (fields: Record<string, any>) => Borrow.fromFields(fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Borrow.fromFieldsWithTypes(item),
      fromBcs: (data: Uint8Array) => Borrow.fromBcs(data),
      bcs: Borrow.bcs,
      fromJSONField: (field: any) => Borrow.fromJSONField(field),
      __class: null as unknown as ReturnType<typeof Borrow.new>,
    }
  }

  static fromFields(fields: Record<string, any>): Borrow {
    return Borrow.new({
      ref: decodeFromFields('address', fields.ref),
      obj: decodeFromFields(ID.reified(), fields.obj),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Borrow {
    if (!isBorrow(item.type)) {
      throw new Error('not a Borrow type')
    }

    return Borrow.new({
      ref: decodeFromFieldsWithTypes('address', item.fields.ref),
      obj: decodeFromFieldsWithTypes(ID.reified(), item.fields.obj),
    })
  }

  static fromBcs(data: Uint8Array): Borrow {
    return Borrow.fromFields(Borrow.bcs.parse(data))
  }

  toJSONField() {
    return {
      ref: this.ref,
      obj: this.obj,
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, ...this.toJSONField() }
  }

  static fromJSONField(field: any): Borrow {
    return Borrow.new({
      ref: decodeFromJSONField('address', field.ref),
      obj: decodeFromJSONField(ID.reified(), field.obj),
    })
  }

  static fromJSON(json: Record<string, any>): Borrow {
    if (json.$typeName !== Borrow.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }

    return Borrow.fromJSONField(json)
  }
}

/* ============================== Referent =============================== */

export function isReferent(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::borrow::Referent<')
}

export interface ReferentFields<T extends TypeArgument> {
  id: ToField<'address'>
  value: ToField<Option<T>>
}

export class Referent<T extends TypeArgument> {
  static readonly $typeName = '0x2::borrow::Referent'
  static readonly $numTypeParams = 1

  readonly $typeName = Referent.$typeName

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

  readonly $typeArg: string

  readonly id: ToField<'address'>
  readonly value: ToField<Option<T>>

  private constructor(typeArg: string, fields: ReferentFields<T>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.value = fields.value
  }

  static new<T extends ReifiedTypeArgument>(
    typeArg: T,
    fields: ReferentFields<ToTypeArgument<T>>
  ): Referent<ToTypeArgument<T>> {
    return new Referent(extractType(typeArg), fields)
  }

  static reified<T extends ReifiedTypeArgument>(T: T) {
    return {
      typeName: Referent.$typeName,
      typeArgs: [T],
      fromFields: (fields: Record<string, any>) => Referent.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Referent.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Referent.fromBcs(T, data),
      bcs: Referent.bcs(toBcs(T)),
      fromJSONField: (field: any) => Referent.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof Referent.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): Referent<ToTypeArgument<T>> {
    return Referent.new(typeArg, {
      id: decodeFromFields('address', fields.id),
      value: decodeFromFields(Option.reified(typeArg), fields.value),
    })
  }

  static fromFieldsWithTypes<T extends ReifiedTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): Referent<ToTypeArgument<T>> {
    if (!isReferent(item.type)) {
      throw new Error('not a Referent type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Referent.new(typeArg, {
      id: decodeFromFieldsWithTypes('address', item.fields.id),
      value: decodeFromFieldsWithTypes(Option.reified(typeArg), item.fields.value),
    })
  }

  static fromBcs<T extends ReifiedTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): Referent<ToTypeArgument<T>> {
    const typeArgs = [typeArg]

    return Referent.fromFields(typeArg, Referent.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      value: fieldToJSON<Option<T>>(`0x1::option::Option<${this.$typeArg}>`, this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T extends ReifiedTypeArgument>(
    typeArg: T,
    field: any
  ): Referent<ToTypeArgument<T>> {
    return Referent.new(typeArg, {
      id: decodeFromJSONField('address', field.id),
      value: decodeFromJSONField(Option.reified(typeArg), field.value),
    })
  }

  static fromJSON<T extends ReifiedTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): Referent<ToTypeArgument<T>> {
    if (json.$typeName !== Referent.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Referent.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Referent.fromJSONField(typeArg, json)
  }
}
