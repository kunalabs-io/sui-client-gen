import {
  ReifiedTypeArgument,
  ToField,
  ToPhantomTypeArgument,
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
  ToTypeStr as ToPhantom,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { Option } from '../../move-stdlib-chain/option/structs'
import { ID } from '../object/structs'
import { BcsType, bcs, fromHEX, toHEX } from '@mysten/bcs'

/* ============================== Referent =============================== */

export function isReferent(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::borrow::Referent<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface ReferentFields<T0 extends TypeArgument> {
  id: ToField<'address'>
  value: ToField<Option<T0>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Referent<T0 extends TypeArgument> {
  static readonly $typeName = '0x2::borrow::Referent'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::borrow::Referent<${ToPhantom<T0>}>`

  readonly $typeName = Referent.$typeName

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

  readonly $typeArg: string

  readonly id: ToField<'address'>
  readonly value: ToField<Option<T0>>

  private constructor(typeArg: string, fields: ReferentFields<T0>) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.value = fields.value
  }

  static new<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: ReferentFields<ToTypeArgument<T0>>
  ): Referent<ToTypeArgument<T0>> {
    return new Referent(extractType(typeArg), fields)
  }

  static reified<T0 extends ReifiedTypeArgument>(T0: T0) {
    return {
      typeName: Referent.$typeName,
      typeArgs: [T0],
      fullTypeName: composeSuiType(
        Referent.$typeName,
        ...[extractType(T0)]
      ) as `0x2::borrow::Referent<${ToPhantomTypeArgument<T0>}>`,
      fromFields: (fields: Record<string, any>) => Referent.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Referent.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Referent.fromBcs(T0, data),
      bcs: Referent.bcs(toBcs(T0)),
      fromJSONField: (field: any) => Referent.fromJSONField(T0, field),
      __class: null as unknown as ReturnType<typeof Referent.new<ToTypeArgument<T0>>>,
    }
  }

  static fromFields<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    fields: Record<string, any>
  ): Referent<ToTypeArgument<T0>> {
    return Referent.new(typeArg, {
      id: decodeFromFields('address', fields.id),
      value: decodeFromFields(Option.reified(typeArg), fields.value),
    })
  }

  static fromFieldsWithTypes<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    item: FieldsWithTypes
  ): Referent<ToTypeArgument<T0>> {
    if (!isReferent(item.type)) {
      throw new Error('not a Referent type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Referent.new(typeArg, {
      id: decodeFromFieldsWithTypes('address', item.fields.id),
      value: decodeFromFieldsWithTypes(Option.reified(typeArg), item.fields.value),
    })
  }

  static fromBcs<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    data: Uint8Array
  ): Referent<ToTypeArgument<T0>> {
    const typeArgs = [typeArg]

    return Referent.fromFields(typeArg, Referent.bcs(toBcs(typeArgs[0])).parse(data))
  }

  toJSONField() {
    return {
      id: this.id,
      value: fieldToJSON<Option<T0>>(`0x1::option::Option<${this.$typeArg}>`, this.value),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    field: any
  ): Referent<ToTypeArgument<T0>> {
    return Referent.new(typeArg, {
      id: decodeFromJSONField('address', field.id),
      value: decodeFromJSONField(Option.reified(typeArg), field.value),
    })
  }

  static fromJSON<T0 extends ReifiedTypeArgument>(
    typeArg: T0,
    json: Record<string, any>
  ): Referent<ToTypeArgument<T0>> {
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

/* ============================== Borrow =============================== */

export function isBorrow(type: string): boolean {
  type = compressSuiType(type)
  return type === '0x2::borrow::Borrow'
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BorrowFields {
  ref: ToField<'address'>
  obj: ToField<ID>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Borrow {
  static readonly $typeName = '0x2::borrow::Borrow'
  static readonly $numTypeParams = 0

  __reifiedFullTypeString = null as unknown as '0x2::borrow::Borrow'

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
      fullTypeName: composeSuiType(Borrow.$typeName, ...[]) as '0x2::borrow::Borrow',
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
