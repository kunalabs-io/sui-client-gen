import { Encoding, bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'
import { UID } from '../object/structs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== ObjectTable =============================== */

bcs.registerStructType('0x2::object_table::ObjectTable<K, V>', {
  id: `0x2::object::UID`,
  size: `u64`,
})

export function isObjectTable(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::object_table::ObjectTable<')
}

export interface ObjectTableFields {
  id: string
  size: bigint
}

export class ObjectTable {
  static readonly $typeName = '0x2::object_table::ObjectTable'
  static readonly $numTypeParams = 2

  readonly $typeArgs: [Type, Type]

  readonly id: string
  readonly size: bigint

  constructor(typeArgs: [Type, Type], fields: ObjectTableFields) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static fromFields(typeArgs: [Type, Type], fields: Record<string, any>): ObjectTable {
    return new ObjectTable(typeArgs, {
      id: UID.fromFields(fields.id).id,
      size: BigInt(fields.size),
    })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): ObjectTable {
    if (!isObjectTable(item.type)) {
      throw new Error('not a ObjectTable type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new ObjectTable([typeArgs[0], typeArgs[1]], {
      id: item.fields.id.id,
      size: BigInt(item.fields.size),
    })
  }

  static fromBcs(
    typeArgs: [Type, Type],
    data: Uint8Array | string,
    encoding?: Encoding
  ): ObjectTable {
    return ObjectTable.fromFields(
      typeArgs,
      bcs.de([ObjectTable.$typeName, ...typeArgs], data, encoding)
    )
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isObjectTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a ObjectTable object`)
    }
    return ObjectTable.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<ObjectTable> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching ObjectTable object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isObjectTable(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a ObjectTable object`)
    }
    return ObjectTable.fromFieldsWithTypes(res.data.content)
  }
}
