import * as reified from '../../_framework/reified'
import {
  PhantomReified,
  PhantomToTypeStr,
  PhantomTypeArgument,
  Reified,
  ToField,
  ToPhantomTypeArgument,
  assertFieldsWithTypesArgsMatch,
  assertReifiedTypeArgsMatch,
  decodeFromFields,
  decodeFromFieldsWithTypes,
  decodeFromJSONField,
  extractType,
} from '../../_framework/reified'
import { FieldsWithTypes, composeSuiType, compressSuiType } from '../../_framework/util'
import { Table } from '../table/structs'
import { bcs } from '@mysten/bcs'
import { SuiClient, SuiParsedData } from '@mysten/sui.js/client'

/* ============================== TableVec =============================== */

export function isTableVec(type: string): boolean {
  type = compressSuiType(type)
  return type.startsWith('0x2::table_vec::TableVec<')
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export interface TableVecFields<T0 extends PhantomTypeArgument> {
  contents: ToField<Table<'u64', T0>>
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class TableVec<T0 extends PhantomTypeArgument> {
  static readonly $typeName = '0x2::table_vec::TableVec'
  static readonly $numTypeParams = 1

  readonly $typeName = TableVec.$typeName

  readonly $fullTypeName: `0x2::table_vec::TableVec<${string}>`

  readonly $typeArg: string

  readonly contents: ToField<Table<'u64', T0>>

  private constructor(typeArg: string, fields: TableVecFields<T0>) {
    this.$fullTypeName = composeSuiType(
      TableVec.$typeName,
      typeArg
    ) as `0x2::table_vec::TableVec<${PhantomToTypeStr<T0>}>`

    this.$typeArg = typeArg

    this.contents = fields.contents
  }

  static reified<T0 extends PhantomReified<PhantomTypeArgument>>(
    T0: T0
  ): Reified<TableVec<ToPhantomTypeArgument<T0>>, TableVecFields<ToPhantomTypeArgument<T0>>> {
    return {
      typeName: TableVec.$typeName,
      fullTypeName: composeSuiType(
        TableVec.$typeName,
        ...[extractType(T0)]
      ) as `0x2::table_vec::TableVec<${PhantomToTypeStr<ToPhantomTypeArgument<T0>>}>`,
      typeArgs: [T0],
      fromFields: (fields: Record<string, any>) => TableVec.fromFields(T0, fields),
      fromFieldsWithTypes: (item: FieldsWithTypes) => TableVec.fromFieldsWithTypes(T0, item),
      fromBcs: (data: Uint8Array) => TableVec.fromBcs(T0, data),
      bcs: TableVec.bcs,
      fromJSONField: (field: any) => TableVec.fromJSONField(T0, field),
      fetch: async (client: SuiClient, id: string) => TableVec.fetch(client, T0, id),
      new: (fields: TableVecFields<ToPhantomTypeArgument<T0>>) => {
        return new TableVec(extractType(T0), fields)
      },
      kind: 'StructClassReified',
    }
  }

  static get r() {
    return TableVec.reified
  }

  static get bcs() {
    return bcs.struct('TableVec', {
      contents: Table.bcs,
    })
  }

  static fromFields<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    fields: Record<string, any>
  ): TableVec<ToPhantomTypeArgument<T0>> {
    return TableVec.reified(typeArg).new({
      contents: decodeFromFields(Table.reified(reified.phantom('u64'), typeArg), fields.contents),
    })
  }

  static fromFieldsWithTypes<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    item: FieldsWithTypes
  ): TableVec<ToPhantomTypeArgument<T0>> {
    if (!isTableVec(item.type)) {
      throw new Error('not a TableVec type')
    }
    assertFieldsWithTypesArgsMatch(item, [typeArg])

    return TableVec.reified(typeArg).new({
      contents: decodeFromFieldsWithTypes(
        Table.reified(reified.phantom('u64'), typeArg),
        item.fields.contents
      ),
    })
  }

  static fromBcs<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    data: Uint8Array
  ): TableVec<ToPhantomTypeArgument<T0>> {
    return TableVec.fromFields(typeArg, TableVec.bcs.parse(data))
  }

  toJSONField() {
    return {
      contents: this.contents.toJSONField(),
    }
  }

  toJSON() {
    return { $typeName: this.$typeName, $typeArg: this.$typeArg, ...this.toJSONField() }
  }

  static fromJSONField<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    field: any
  ): TableVec<ToPhantomTypeArgument<T0>> {
    return TableVec.reified(typeArg).new({
      contents: decodeFromJSONField(Table.reified(reified.phantom('u64'), typeArg), field.contents),
    })
  }

  static fromJSON<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    json: Record<string, any>
  ): TableVec<ToPhantomTypeArgument<T0>> {
    if (json.$typeName !== TableVec.$typeName) {
      throw new Error('not a WithTwoGenerics json object')
    }
    assertReifiedTypeArgsMatch(
      composeSuiType(TableVec.$typeName, extractType(typeArg)),
      [json.$typeArg],
      [typeArg]
    )

    return TableVec.fromJSONField(typeArg, json)
  }

  static fromSuiParsedData<T0 extends PhantomReified<PhantomTypeArgument>>(
    typeArg: T0,
    content: SuiParsedData
  ): TableVec<ToPhantomTypeArgument<T0>> {
    if (content.dataType !== 'moveObject') {
      throw new Error('not an object')
    }
    if (!isTableVec(content.type)) {
      throw new Error(`object at ${(content.fields as any).id} is not a TableVec object`)
    }
    return TableVec.fromFieldsWithTypes(typeArg, content)
  }

  static async fetch<T0 extends PhantomReified<PhantomTypeArgument>>(
    client: SuiClient,
    typeArg: T0,
    id: string
  ): Promise<TableVec<ToPhantomTypeArgument<T0>>> {
    const res = await client.getObject({ id, options: { showContent: true } })
    if (res.error) {
      throw new Error(`error fetching TableVec object at id ${id}: ${res.error.code}`)
    }
    if (res.data?.content?.dataType !== 'moveObject' || !isTableVec(res.data.content.type)) {
      throw new Error(`object at id ${id} is not a TableVec object`)
    }
    return TableVec.fromFieldsWithTypes(typeArg, res.data.content)
  }
}
