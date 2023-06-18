import { bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type, parseTypeName } from '../../_framework/util'
import { Encoding } from '@mysten/bcs'

/* ============================== Balance =============================== */

bcs.registerStructType('0x2::balance::Balance<T>', {
  value: `u64`,
})

export function isBalance(type: Type): boolean {
  return type.startsWith('0x2::balance::Balance<')
}

export interface BalanceFields {
  value: bigint
}

export class Balance {
  static readonly $typeName = '0x2::balance::Balance'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly value: bigint

  constructor(typeArg: Type, value: bigint) {
    this.$typeArg = typeArg

    this.value = value
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): Balance {
    return new Balance(typeArg, BigInt(fields.value))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Balance {
    if (!isBalance(item.type)) {
      throw new Error('not a Balance type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Balance(typeArgs[0], BigInt(item.fields.value))
  }

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): Balance {
    return Balance.fromFields(typeArg, bcs.de([Balance.$typeName, typeArg], data, encoding))
  }
}

/* ============================== Supply =============================== */

bcs.registerStructType('0x2::balance::Supply<T>', {
  value: `u64`,
})

export function isSupply(type: Type): boolean {
  return type.startsWith('0x2::balance::Supply<')
}

export interface SupplyFields {
  value: bigint
}

export class Supply {
  static readonly $typeName = '0x2::balance::Supply'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly value: bigint

  constructor(typeArg: Type, value: bigint) {
    this.$typeArg = typeArg

    this.value = value
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): Supply {
    return new Supply(typeArg, BigInt(fields.value))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Supply {
    if (!isSupply(item.type)) {
      throw new Error('not a Supply type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Supply(typeArgs[0], BigInt(item.fields.value))
  }

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): Supply {
    return Supply.fromFields(typeArg, bcs.de([Supply.$typeName, typeArg], data, encoding))
  }
}
