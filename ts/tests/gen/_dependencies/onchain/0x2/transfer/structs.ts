import { Encoding, bcsOnchain as bcs } from '../../../../_framework/bcs'
import { FieldsWithTypes, Type, parseTypeName } from '../../../../_framework/util'
import { ID } from '../object/structs'

/* ============================== Receiving =============================== */

bcs.registerStructType('0x2::transfer::Receiving<T0>', {
  id: `0x2::object::ID`,
  version: `u64`,
})

export function isReceiving(type: Type): boolean {
  return type.startsWith('0x2::transfer::Receiving<')
}

export interface ReceivingFields {
  id: string
  version: bigint
}

export class Receiving {
  static readonly $typeName = '0x2::transfer::Receiving'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly id: string
  readonly version: bigint

  constructor(typeArg: Type, fields: ReceivingFields) {
    this.$typeArg = typeArg

    this.id = fields.id
    this.version = fields.version
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): Receiving {
    return new Receiving(typeArg, {
      id: ID.fromFields(fields.id).bytes,
      version: BigInt(fields.version),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Receiving {
    if (!isReceiving(item.type)) {
      throw new Error('not a Receiving type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Receiving(typeArgs[0], { id: item.fields.id, version: BigInt(item.fields.version) })
  }

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): Receiving {
    return Receiving.fromFields(typeArg, bcs.de([Receiving.$typeName, typeArg], data, encoding))
  }
}
