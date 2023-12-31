import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../../../_framework/util'
import { bcs } from '@mysten/bcs'

/* ============================== Supply =============================== */

export function isSupply(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::balance::Supply<')
}

export interface SupplyFields {
  value: bigint
}

export class Supply {
  static readonly $typeName = '0x2::balance::Supply'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('Supply', {
      value: bcs.u64(),
    })
  }

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

  static fromBcs(typeArg: Type, data: Uint8Array): Supply {
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
  value: bigint
}

export class Balance {
  static readonly $typeName = '0x2::balance::Balance'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('Balance', {
      value: bcs.u64(),
    })
  }

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

  static fromBcs(typeArg: Type, data: Uint8Array): Balance {
    return Balance.fromFields(typeArg, Balance.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      value: this.value.toString(),
    }
  }
}
