import { FieldsWithTypes, Type, compressSuiType, parseTypeName } from '../../_framework/util'
import { Table } from '../table/structs'
import { bcs } from '@mysten/bcs'

/* ============================== TableVec =============================== */

export function isTableVec(type: Type): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::table_vec::TableVec<')
}

export interface TableVecFields {
  contents: Table
}

export class TableVec {
  static readonly $typeName = '0x2::table_vec::TableVec'
  static readonly $numTypeParams = 1

  static get bcs() {
    return bcs.struct('TableVec', {
      contents: Table.bcs,
    })
  }

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

  static fromBcs(typeArg: Type, data: Uint8Array): TableVec {
    return TableVec.fromFields(typeArg, TableVec.bcs.parse(data))
  }

  toJSON() {
    return {
      $typeArg: this.$typeArg,
      contents: this.contents.toJSON(),
    }
  }
}
