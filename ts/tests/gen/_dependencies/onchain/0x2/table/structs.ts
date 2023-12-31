import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../../../_framework/util'
import { UID } from '../object/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== Table =============================== */

export function isTable(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::table::Table<')
}

export interface TableFields {
  id: string
  size: bigint
}

export class Table {
  static readonly $typeName = '0x2::table::Table'
  static readonly $numTypeParams = 2

  static get bcs() {
    return bcs.struct('Table', {
      id: UID.bcs,
      size: bcs.u64(),
    })
  }

  readonly $typeArgs: [Type, Type]

  readonly id: string
  readonly size: bigint

  constructor(typeArgs: [Type, Type], fields: TableFields) {
    this.$typeArgs = typeArgs

    this.id = fields.id
    this.size = fields.size
  }

  static fromFields(typeArgs: [Type, Type], fields: Record<string, any>): Table {
    return new Table(typeArgs, { id: UID.fromFields(fields.id).id, size: BigInt(fields.size) })
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): Table {
    if (!isTable(item.type)) {
      throw new Error('not a Table type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new Table([typeArgs[0], typeArgs[1]], {
      id: item.fields.id.id,
      size: BigInt(item.fields.size),
    })
  }

  static fromBcs(typeArgs: [Type, Type], data: Uint8Array): Table {
    return Table.fromFields(typeArgs, Table.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArgs: this.$typeArgs,
      id: this.id,
      size: this.size.toString(),
    }
  }

  static fromSuiParsedData(content: SuiParsedData) {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTable(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a Table object`)
    }
    return Table.fromFieldsWithTypes(content)
  }

  static async fetch(client: SuiClient, id: string): Promise<Table> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching Table object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTable(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a Table object`)
    }
    return Table.fromFieldsWithTypes(res.data.content)
  }
}
