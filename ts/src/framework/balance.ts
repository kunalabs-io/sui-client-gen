import { StructTag } from '@mysten/sui.js'
import { tagToType, Type, typeToTag } from './type'
import { FieldsWithTypes } from './util'
import { BCS } from '@mysten/bcs'
import { bcs } from './bcs'

bcs.registerStructType(['0x2::balance::Balance', 'T'], {
  value: BCS.U64,
})

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

  static fromFieldsWithTypes(typeArg: Type, field: string): Balance {
    return new Balance(typeArg, BigInt(field))
  }
}

bcs.registerStructType(['0x2::balance::Supply', 'T'], {
  value: BCS.U64,
})

export class Supply {
  constructor(readonly typeArg: Type, readonly value: bigint) {}

  static fromFields(typeArg: Type, fields: Record<string, any>): Supply {
    return new Supply(typeArg, BigInt(fields.value))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Supply {
    if (!item.type.startsWith('0x2::balance::Supply<')) {
      throw new Error('error parsing Supply')
    }
    const type = typeToTag(item.type) as {
      struct: StructTag
    }
    return new Supply(tagToType(type.struct.typeParams[0]), BigInt(item.fields.value))
  }
}
