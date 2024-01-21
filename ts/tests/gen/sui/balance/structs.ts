import {
  PhantomTypeArgument,
  ReifiedPhantomTypeArgument,
  ToField,
  ToPhantomTypeArgument,
  ToTypeArgument,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== Balance =============================== */

export function isBalance(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Balance<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface BalanceFields<T extends PhantomTypeArgument> {
  value: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Balance<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::balance::Balance'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::balance::Balance<${T}>`

  readonly $typeName = Balance.$typeName

  static get bcs() {
    return bcs.struct('Balance', {
      value: bcs.u64(),
    })
  }

  readonly $typeArg: string

  readonly value: ToField<'u64'>

  private constructor(typeArg: string, value: ToField<'u64'>) {
    this.$typeArg = typeArg

    this.value = value
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    value: ToField<'u64'>
  ): Balance<ToPhantomTypeArgument<T>> {
    return new Balance(extractType(typeArg), value)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: Balance.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        Balance.$typeName,
        ...[extractType(T)]
      ) as `0x2::balance::Balance<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => Balance.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Balance.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Balance.fromBcs(T, data),
      bcs: Balance.bcs,
      fromJSONField: (field: any) => Balance.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof Balance.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): Balance<ToPhantomTypeArgument<T>> {
    return Balance.new(typeArg, decodeFromFields('u64', fields.value))
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): Balance<ToPhantomTypeArgument<T>> {
    if (!isBalance(item.type)) {
      throw new Error('not a Balance type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Balance.new(typeArg, decodeFromFieldsWithTypes('u64', item.fields.value))
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): Balance<ToPhantomTypeArgument<T>> {
    return Balance.fromFields(typeArg, Balance.bcs.parse(data))
  }

  toJSONField() {
    return {
      value: this.value.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): Balance<ToPhantomTypeArgument<T>> {
    return Balance.new(typeArg, decodeFromJSONField('u64', field.value))
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): Balance<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Balance.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Balance.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Balance.fromJSONField(typeArg, json)
  }
}

/* ============================== Supply =============================== */

export function isSupply(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Supply<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface SupplyFields<T extends PhantomTypeArgument> {
  value: ToField<'u64'>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class Supply<T extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::balance::Supply'
  static readonly $numTypeParams = 1

  __reifiedFullTypeString = null as unknown as `0x2::balance::Supply<${T}>`

  readonly $typeName = Supply.$typeName

  static get bcs() {
    return bcs.struct('Supply', {
      value: bcs.u64(),
    })
  }

  readonly $typeArg: string

  readonly value: ToField<'u64'>

  private constructor(typeArg: string, value: ToField<'u64'>) {
    this.$typeArg = typeArg

    this.value = value
  }

  static new<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    value: ToField<'u64'>
  ): Supply<ToPhantomTypeArgument<T>> {
    return new Supply(extractType(typeArg), value)
  }

  static reified<T extends ReifiedPhantomTypeArgument>(T: T) {
    return {
      typeName: Supply.$typeName,
      typeArgs: [T],
      fullTypeName: composeSuiType(
        Supply.$typeName,
        ...[extractType(T)]
      ) as `0x2::balance::Supply<${ToPhantomTypeArgument<T>}>`,
      fromFields: (fields: Record<string, any>) => Supply.fromFields(T, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Supply.fromFieldsWithTypes(T, item),
      fromBcs: (data: Uint8Array) => Supply.fromBcs(T, data),
      bcs: Supply.bcs,
      fromJSONField: (field: any) => Supply.fromJSONField(T, field),
      __class: null as unknown as ReturnType<typeof Supply.new<ToTypeArgument<T>>>,
    }
  }

  static fromFields<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    fields: Record<string, any>
  ): Supply<ToPhantomTypeArgument<T>> {
    return Supply.new(typeArg, decodeFromFields('u64', fields.value))
  }

  static fromFieldsWithTypes<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    item: FieldsWithTypes
  ): Supply<ToPhantomTypeArgument<T>> {
    if (!isSupply(item.type)) {
      throw new Error('not a Supply type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Supply.new(typeArg, decodeFromFieldsWithTypes('u64', item.fields.value))
  }

  static fromBcs<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    data: Uint8Array
  ): Supply<ToPhantomTypeArgument<T>> {
    return Supply.fromFields(typeArg, Supply.bcs.parse(data))
  }

  toJSONField() {
    return {
      value: this.value.toString(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    field: any
  ): Supply<ToPhantomTypeArgument<T>> {
    return Supply.new(typeArg, decodeFromJSONField('u64', field.value))
  }

  static fromJSON<T extends ReifiedPhantomTypeArgument>(
    typeArg: T,
    json: Record<string, any>
  ): Supply<ToPhantomTypeArgument<T>> {
    if (json.$typeName !== Supply.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(Supply.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return Supply.fromJSONField(typeArg, json)
  }
}
