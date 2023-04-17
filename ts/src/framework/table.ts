import { JsonRpcProvider, ObjectId, SuiParsedData, normalizeSuiAddress } from '@mysten/sui.js'
import { Type, parseTypeName } from './type'
import { bcs } from './bcs'
import { BCS, Encoding } from '@mysten/bcs'
import { FieldsWithTypes } from './util'
import { UID } from './object'

/* =================================== Table ===================================== */

bcs.registerStructType(['0x2::table::Table', 'K', 'V'], {
  id: '0x2::object::UID',
  size: BCS.U64,
})

export function isTable(type: Type): boolean {
  return type.startsWith('0x2::table::Table<')
}

export interface TableFields {
  id: ObjectId
  size: bigint
}

export class Table {
  static readonly $typeName = '0x2::table::Table<K, V>'
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly id: ObjectId
  readonly size: bigint

  constructor(typeArgs: [Type, Type], fields: TableFields) {
    this.$typeArgs = typeArgs
    this.id = fields.id
    this.size = fields.size
  }

  static fromFields(typeArgs: [Type, Type], fields: Record<string, any>): Table {
    return new Table(typeArgs, {
      id: normalizeSuiAddress(UID.fromFields(fields.id).id.bytes),
      size: BigInt(fields.size),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Table {
    if (!isTable(item.type)) {
      throw new Error(`not a Table type`)
    }

    const { typeArgs } = parseTypeName(item.type)

    return new Table(typeArgs as [Type, Type], {
      id: item.fields.id.id,
      size: item.fields.size,
    })
  }

  static fromBcs(typeArgs: [Type, Type], data: Uint8Array | string, encoding?: Encoding) {
    return Table.fromFields(typeArgs, bcs.de(['0x2::table::Table', ...typeArgs], data, encoding))
  }

  static fromSuiParsedData(content: SuiParsedData): Table {
    if (content.dataType !== 'moveObject') {
      throw new Error(`not an object`)
    }
    if (!isTable(content.type)) {
      throw new Error(`object at "${content.fields.id}" is not a Table`)
    }
    return Table.fromFieldsWithTypes(content)
  }

  static async fetch(provider: JsonRpcProvider, id: ObjectId): Promise<Table> {
    const res = await provider.getObject({
      id,
      options: {
        showBcs: true,
      },
    })
    if (res.error) {
      throw new Error(`Error fetching Table object at ${id}: ${res.error.code}`)
    }
    if (res.data!.bcs!.dataType !== 'moveObject' || !isTable(res.data!.bcs!.type)) {
      throw new Error(`object at ${id} is not a Table`)
    }
    const typeArgs = parseTypeName(res.data!.bcs!.type).typeArgs as [Type, Type]

    return Table.fromBcs(typeArgs, (res as any).data!.bcs!.bcsBytes, 'base64')
  }
}
