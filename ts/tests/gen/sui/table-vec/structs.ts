import { Encoding, bcsSource as bcs } from '../../_framework/bcs'
import { FieldsWithTypes, Type, parseTypeName } from '../../_framework/util'
import { Table } from '../table/structs'

/* ============================== TableVec =============================== */

bcs.registerStructType('0x2::table_vec::TableVec<Element>', {
  contents: `0x2::table::Table<u64, Element>`,
})

export function isTableVec(type: Type): boolean {
  return type.startsWith('0x2::table_vec::TableVec<')
}

export interface TableVecFields {
  contents: Table
}

export class TableVec {
  static readonly $typeName = '0x2::table_vec::TableVec'
  static readonly $numTypeParams = 1

  readonly $typeArg: Type

  readonly contents: Table

  constructor(typeArg: Type, contents: Table) {
    this.$typeArg = typeArg

    this.contents = contents
  }

  static fromFields(typeArg: Type, fields: Record<string, any>): TableVec {
    return new TableVec(typeArg, Table.fromFields([`u64`, `${typeArg}`], fields.contents))
  }

  static fromFieldsWithTypes(item: FieldsWithTypes): TableVec {
    if (!isTableVec(item.type)) {
      throw new Error('not a TableVec type')
    }
    const { typeArgs } = parseTypeName(item.type)

    return new TableVec(typeArgs[0], Table.fromFieldsWithTypes(item.fields.contents))
  }

  static fromBcs(typeArg: Type, data: Uint8Array | string, encoding?: Encoding): TableVec {
    return TableVec.fromFields(typeArg, bcs.de([TableVec.$typeName, typeArg], data, encoding))
  }
}
