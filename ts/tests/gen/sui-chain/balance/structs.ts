import {
  ReifiedTypeArgument,
  ToField,
  assertFieldsWithTypesArgsMatch,
  decodeFromFieldsGenericOrSpecial,
  decodeFromFieldsWithTypesGenericOrSpecial,
  extractType,
} from '../../_framework/types'
import { FieldsWithTypes, Type, compressSuiType } from '../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== Supply =============================== */

export function isSupply(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Supply<')
}

export interface SupplyFields {
  value: ToField<'u64'>
}

export class Supply {
  static readonly $typeName = '0x2::balance::Supply'
  static readonly $numTypeParams = 1

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

  static new(typeArg: ReifiedTypeArgument, value: ToField<'u64'>): Supply {
    return new Supply(extractType(typeArg), value)
  }

  static reified(T0: ReifiedTypeArgument) {
    return {
      typeName: Supply.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Supply.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Supply.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Supply.fromBcs(T0, data),
      bcs: Supply.bcs,
      __class: null as unknown as ReturnType<typeof Supply.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): Supply {
    return Supply.new(typeArg, decodeFromFieldsGenericOrSpecial('u64', fields.value))
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): Supply {
    if (!isSupply(item.type)) {
      throw new Error('not a Supply type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Supply.new(typeArg, decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.value))
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): Supply {
    return Supply.fromFields(typeArg, Supply.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      value: this.value.toString(),
    }
  }
}

/* ============================== Balance =============================== */

export function isBalance(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Balance<')
}

export interface BalanceFields {
  value: ToField<'u64'>
}

export class Balance {
  static readonly $typeName = '0x2::balance::Balance'
  static readonly $numTypeParams = 1

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

  static new(typeArg: ReifiedTypeArgument, value: ToField<'u64'>): Balance {
    return new Balance(extractType(typeArg), value)
  }

  static reified(T0: ReifiedTypeArgument) {
    return {
      typeName: Balance.$typeName,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => Balance.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => Balance.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => Balance.fromBcs(T0, data),
      bcs: Balance.bcs,
      __class: null as unknown as ReturnType<typeof Balance.new>,
    }
  }

  static fromFields(typeArg: ReifiedTypeArgument, fields: Record<string, any>): Balance {
    return Balance.new(typeArg, decodeFromFieldsGenericOrSpecial('u64', fields.value))
  }

  static fromFieldsWithTypes(typeArg: ReifiedTypeArgument, item: FieldsWithTypes): Balance {
    if (!isBalance(item.type)) {
      throw new Error('not a Balance type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return Balance.new(typeArg, decodeFromFieldsWithTypesGenericOrSpecial('u64', item.fields.value))
  }

  static fromBcs(typeArg: ReifiedTypeArgument, data: Uint8Array): Balance {
    return Balance.fromFields(typeArg, Balance.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      value: this.value.toString(),
    }
  }
}
